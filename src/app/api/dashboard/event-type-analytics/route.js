// app/api/dashboard/event-type-analytics/route.js

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

        // Build where clause for events
        const eventWhereClause = {};

        // Event type filtering
        if (eventType) {
            eventWhereClause.eventType = eventType;
        }

        // Build where clause for registrations (date filtering)
        const registrationWhereClause = {};

        if (startDate || endDate) {
            registrationWhereClause.registeredAt = {};
            if (startDate) registrationWhereClause.registeredAt.gte = new Date(startDate);
            if (endDate) registrationWhereClause.registeredAt.lte = new Date(endDate);
        } else {
            // Default to current month for registrations
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

        // Aggregate data by event type
        const eventTypeMap = {};

        events.forEach(event => {
            // Only include events that have registrations matching our filters
            if (event.registrations.length === 0) return;

            const type = event.eventType;

            if (!eventTypeMap[type]) {
                eventTypeMap[type] = {
                    eventType: type,
                    registrationCount: 0,
                    revenue: 0,
                    eventCount: 0
                };
            }

            eventTypeMap[type].registrationCount += event.registrations.length;
            eventTypeMap[type].revenue += parseFloat(event.price) * event.registrations.length;
            eventTypeMap[type].eventCount += 1;
        });

        // Convert to array and sort by registration count
        const result = Object.values(eventTypeMap).sort(
            (a, b) => b.registrationCount - a.registrationCount
        );

        return NextResponse.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            debug: {
                totalEventsChecked: events.length,
                eventsWithRegistrations: events.filter(e => e.registrations.length > 0).length,
                filters: { startDate, endDate, eventType, department }
            }
        });

    } catch (error) {
        console.error('Event Type Analytics Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch event type analytics',
                message: error.message
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}