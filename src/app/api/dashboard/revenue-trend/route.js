// app/api/dashboard/revenue-trend/route.js

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
        const interval = searchParams.get('interval') || 'daily'; // 'daily' or 'weekly'

        // Build where clause for registrations
        const registrationWhereClause = {};

        // Date filtering on registrations
        let queryStartDate, queryEndDate;
        if (startDate || endDate) {
            registrationWhereClause.registeredAt = {};
            if (startDate) {
                queryStartDate = new Date(startDate);
                registrationWhereClause.registeredAt.gte = queryStartDate;
            }
            if (endDate) {
                queryEndDate = new Date(endDate);
                registrationWhereClause.registeredAt.lte = queryEndDate;
            }
        } else {
            // Default to current month
            const now = new Date();
            queryStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
            queryEndDate = now;
            registrationWhereClause.registeredAt = {
                gte: queryStartDate,
                lte: queryEndDate
            };
        }

        // Event type filtering
        if (eventType) {
            registrationWhereClause.event = {
                eventType: eventType
            };
        }

        // Department filtering
        if (department) {
            registrationWhereClause.student = {
                department: department
            };
        }

        // Get all registrations with event info
        const registrations = await prisma.registration.findMany({
            where: registrationWhereClause,
            include: {
                event: {
                    select: {
                        price: true,
                        eventType: true
                    }
                },
                student: {
                    select: {
                        department: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'asc'
            }
        });

        // Group by date based on interval
        const revenueMap = {};

        registrations.forEach(reg => {
            const date = new Date(reg.registeredAt);
            let key;

            if (interval === 'weekly') {
                // Get week start (Sunday)
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else {
                // Daily
                key = date.toISOString().split('T')[0];
            }

            if (!revenueMap[key]) {
                revenueMap[key] = {
                    date: key,
                    revenue: 0,
                    registrations: 0
                };
            }

            revenueMap[key].revenue += parseFloat(reg.event.price);
            revenueMap[key].registrations += 1;
        });

        // Convert to array and sort by date
        const result = Object.values(revenueMap).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        // Format dates for display
        const formattedResult = result.map(item => ({
            ...item,
            revenue: parseFloat(item.revenue.toFixed(2)),
            displayDate: new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(interval === 'weekly' ? { year: 'numeric' } : {})
            })
        }));

        // Calculate total revenue
        const totalRevenue = formattedResult.reduce((sum, item) => sum + item.revenue, 0);

        return NextResponse.json({
            success: true,
            data: formattedResult,
            summary: {
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                totalRegistrations: registrations.length,
                dataPoints: formattedResult.length,
                interval
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Revenue Trend Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch revenue trend',
                message: error.message
            },
            { status: 500 }
        );
    }
}