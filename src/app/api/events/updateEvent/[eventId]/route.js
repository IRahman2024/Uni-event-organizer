import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { success } from "zod";

//nr
export async function PATCH(request, { params }) {

    try {
        const eventId = params.eventId;

        const { status } = await request.json();

        // console.log('eventId: ', eventId, 'status: ', status);

        prisma.$connect();

        const response = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                status: status
            }
        })

        prisma.$disconnect();
        revalidateTag('events');

        return NextResponse.json({
            success: true,
            message: "Patch request received",
            // response: response
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error
        })

    }
}

export async function PUT(request, { params }) {
    try {
        // 1. Await dynamic params (Next.js 15+)
        const { eventId } = await params;

        // 2. Parse body
        const body = await request.json();

        console.log(body);


        const {
            eventTitle,
            description,
            location,
            eventType,
            capacity,
            price,
            eventDate,
            eventDeadline,
            eventImage,
            fields = [],
        } = body;

        // 3. Transform data (same as your create logic)
        const transformedData = {
            eventTitle,
            description,
            location,
            eventType,
            capacity: parseInt(capacity, 10),
            price: new Prisma.Decimal(price), // Decimal from string
            eventDate: new Date(eventDate),
            eventDeadline: new Date(eventDeadline),
            eventImage: eventImage || null,

            formFields: {
                deleteMany: { eventId }, // Delete all old fields for this event
                create: fields.map((field) => ({
                    // Generate new CUID automatically
                    fieldName: field.fieldName,
                    label: field.label,
                    fieldType: field.fieldType,
                    isRequired: field.isRequired,
                    options: field.options || null,
                })),
            },
        };

        // 4. Update event with nested upserts
        const event = await prisma.event.update({
            where: { id: eventId },
            data: transformedData,
            include: {
                formFields: true,
            },
        });

        prisma.$disconnect();
        revalidateTag('events');

        // 5. Success
        return NextResponse.json({
            message: 'Event updated successfully',
            data: event,
        });

    } catch (error) {
        console.error('Update error:', error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(
            { error: 'Failed to update event', details: error.message },
            { status: 500 }
        );
    }
}