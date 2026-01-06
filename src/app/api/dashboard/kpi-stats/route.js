// app/api/dashboard/kpi-stats/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const eventType = searchParams.get('eventType');
        const department = searchParams.get('department');

        // Build where clause for registrations
        const registrationWhereClause = {};

        // Date filtering on registrations
        if (startDate || endDate) {
            registrationWhereClause.registeredAt = {};
            if (startDate) registrationWhereClause.registeredAt.gte = new Date(startDate);
            if (endDate) registrationWhereClause.registeredAt.lte = new Date(endDate);
        } else {
            // Default to current month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            registrationWhereClause.registeredAt = { gte: startOfMonth };
        }

        // Department filtering
        if (department) {
            registrationWhereClause.student = {
                department: department
            };
        }

        // Build where clause for events
        const eventWhereClause = {};
        if (eventType) {
            eventWhereClause.eventType = eventType;
        }

        // Get all events with filtered registrations
        const events = await prisma.event.findMany({
            where: eventWhereClause,
            include: {
                registrations: {
                    where: registrationWhereClause,
                    include: {
                        student: {
                            select: {
                                department: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate metrics
        let totalEvents = 0;
        let totalRegistrations = 0;
        let totalRevenue = 0;
        let totalCapacity = 0;
        let eventsWithRegistrations = 0;

        events.forEach(event => {
            const regCount = event.registrations.length;

            if (regCount > 0) {
                totalEvents++;
                totalRegistrations += regCount;
                totalRevenue += parseFloat(event.price) * regCount;
                totalCapacity += event.capacity;
                eventsWithRegistrations++;
            }
        });

        // Calculate average fill rate
        const avgFillRate = eventsWithRegistrations > 0
            ? ((totalRegistrations / totalCapacity) * 100).toFixed(1)
            : 0;

        // Calculate previous period for trends (simple: compare to previous month)
        const prevPeriodStart = startDate
            ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() - 1))
            : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

        const prevPeriodEnd = endDate
            ? new Date(new Date(endDate).setMonth(new Date(endDate).getMonth() - 1))
            : new Date(new Date().getFullYear(), new Date().getMonth(), 0);

        const prevRegistrationWhereClause = {
            ...registrationWhereClause,
            registeredAt: {
                gte: prevPeriodStart,
                lte: prevPeriodEnd
            }
        };

        const prevRegistrations = await prisma.registration.count({
            where: prevRegistrationWhereClause
        });

        // Calculate trends
        const registrationTrend = prevRegistrations > 0
            ? (((totalRegistrations - prevRegistrations) / prevRegistrations) * 100).toFixed(1)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalEvents,
                totalRegistrations,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                avgFillRate: parseFloat(avgFillRate),
                trends: {
                    registrations: parseFloat(registrationTrend)
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('KPI Stats Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch KPI stats',
                message: error.message
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}