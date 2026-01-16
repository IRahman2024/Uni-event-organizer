// app/api/dashboard/events/[eventId]/registrations/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const { eventId } = await params;

        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                formFields: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        // Get all registrations for this event
        const registrations = await prisma.registration.findMany({
            where: { eventId },
            include: {
                student: {
                    select: {
                        studentId: true,
                        name: true,
                        email: true,
                        department: true,
                        batch: true,
                        image: true
                    }
                },
                payment: true
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        // Format the data
        const formattedRegistrations = registrations.map(reg => ({
            id: reg.id,
            student: reg.student,
            formData: reg.formData,
            payment: reg.payment,
            registeredAt: reg.registeredAt,
            displayRegisteredAt: new Date(reg.registeredAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        // Calculate metrics using event.audience for accurate totals
        const audienceCount = event.audience || 0;
        const registrationListCount = registrations.length; // Actual DB registrations for table display
        const totalRegistrations = audienceCount; // Use audience field for metrics
        const fillRate = event.capacity > 0
            ? ((audienceCount / event.capacity) * 100).toFixed(1)
            : 0;
        const totalRevenue = parseFloat(event.price) * audienceCount;

        // Department breakdown
        const departmentBreakdown = registrations.reduce((acc, reg) => {
            const dept = reg.student.department;
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                event: {
                    id: event.id,
                    eventTitle: event.eventTitle,
                    description: event.description,
                    location: event.location,
                    eventType: event.eventType,
                    capacity: event.capacity,
                    price: parseFloat(event.price),
                    eventDate: event.eventDate,
                    eventDeadline: event.eventDeadline,
                    eventImage: event.eventImage,
                    status: event.status,
                    displayDate: new Date(event.eventDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    displayDeadline: new Date(event.eventDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                },
                formFields: event.formFields,
                registrations: formattedRegistrations,
                metrics: {
                    totalRegistrations,
                    registrationListCount,
                    fillRate: parseFloat(fillRate),
                    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                    availableSpots: event.capacity - audienceCount,
                    departmentBreakdown
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Event Details Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch event details',
                message: error.message
            },
            { status: 500 }
        );
    }
}