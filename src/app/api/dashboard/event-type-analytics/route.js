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

        // Define all event types to ensure they all appear in the chart (when no filter)
        const ALL_EVENT_TYPES = [
            "conference",
            "workshop",
            "meetup",
            "contests and competition",
            "hackathon",
            "tech fests",
            "cultural",
            "others"
        ];

        // Initialize event types - only pre-populate all types when no eventType filter is applied
        const eventTypeMap = {};
        if (!eventType) {
            // No filter: show all event types (including those with zero registrations)
            ALL_EVENT_TYPES.forEach(type => {
                eventTypeMap[type] = {
                    eventType: type,
                    registrationCount: 0,
                    revenue: 0,
                    eventCount: 0
                };
            });
        }

        // Aggregate data by event type
        events.forEach(event => {
            const type = event.eventType;

            // Only count if there are registrations matching our filters
            if (event.registrations.length === 0) return;

            // If the event type exists in our predefined list, update it
            // Otherwise create a new entry (for any custom types)
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