// app/api/dashboard/events-performance/route.js

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
        const sortBy = searchParams.get('sortBy') || 'eventDate'; // eventDate, registrations, revenue, fillRate
        const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc or desc

        // Build where clause for registrations
        const registrationWhereClause = {};

        // Date filtering on registrations
        if (startDate || endDate) {
            registrationWhereClause.registeredAt = {};
            if (startDate) registrationWhereClause.registeredAt.gte = new Date(startDate);
            if (endDate) registrationWhereClause.registeredAt.lte = new Date(endDate);
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

        // Transform and calculate metrics
        const eventsData = events
            .map(event => {
                const registrationCount = event.registrations.length;
                const revenue = parseFloat(event.price) * registrationCount;
                const fillRate = event.capacity > 0
                    ? ((registrationCount / event.capacity) * 100).toFixed(1)
                    : 0;

                return {
                    id: event.id,
                    eventTitle: event.eventTitle,
                    eventType: event.eventType,
                    location: event.location,
                    eventDate: event.eventDate,
                    eventDeadline: event.eventDeadline,
                    capacity: event.capacity,
                    price: parseFloat(event.price),
                    registrations: registrationCount,
                    revenue: parseFloat(revenue.toFixed(2)),
                    fillRate: parseFloat(fillRate),
                    status: event.status || 'active',
                    // Format dates for display
                    displayDate: new Date(event.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }),
                    displayDeadline: new Date(event.eventDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                };
            })
            .filter(event => event.registrations > 0); // Only include events with registrations

        // Sort data
        const sortedData = eventsData.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'registrations':
                    comparison = a.registrations - b.registrations;
                    break;
                case 'revenue':
                    comparison = a.revenue - b.revenue;
                    break;
                case 'fillRate':
                    comparison = a.fillRate - b.fillRate;
                    break;
                case 'eventDate':
                default:
                    comparison = new Date(a.eventDate) - new Date(b.eventDate);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        // Calculate summary
        const summary = {
            totalEvents: sortedData.length,
            totalRegistrations: sortedData.reduce((sum, e) => sum + e.registrations, 0),
            totalRevenue: sortedData.reduce((sum, e) => sum + e.revenue, 0),
            avgFillRate: sortedData.length > 0
                ? (sortedData.reduce((sum, e) => sum + e.fillRate, 0) / sortedData.length).toFixed(1)
                : 0
        };

        return NextResponse.json({
            success: true,
            data: sortedData,
            summary,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Events Performance Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch events performance',
                message: error.message
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}