import { prisma } from "@/lib/prisma";
import { FormField } from "@/shadcn-components/ui/form";
import { create } from "domain";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        // await prisma.$connect();
        console.log("✅ Database connected successfully");

        const data = await request.json();

        // console.log("Received data:", data);

        const eventData = data.eventData[0];

        const transformedData = {
            // id: eventData.id,
            eventTitle: eventData.eventTitle,
            description: eventData.description,
            location: eventData.location,
            eventType: eventData.eventType,
            capacity: parseInt(eventData.capacity),
            price: parseInt(eventData.price),
            eventDate: new Date(eventData.eventDate),
            eventDeadline: new Date(eventData.eventDeadline),
            eventImage: eventData.eventImage || null,

            formFields: {
                create: data.fields.map((field) => ({
                    // id: field.id,
                    fieldName: field.fieldName,
                    label: field.label,
                    fieldType: field.fieldType,
                    isRequired: field.isRequired,
                    options: field.options || null,
                }))
            }
        }

        // console.log('Transformed Data: ', transformedData);

        const event = await prisma.event.create({
            data: transformedData,
            include: {
                formFields: true // Include created form fields in response
            }
        });

        // console.log(event);

        // await prisma.$disconnect();
        revalidateTag('events');
        return NextResponse.json({
            success: true,
            message: "Event and fields created successfully via nested create",
            data: event
        });

    } catch (error) {
        console.error("Error creating event:", error);
        // await prisma.$disconnect();
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create event",
                details: error.message
            },
            { status: 500 }
        );
    }

}