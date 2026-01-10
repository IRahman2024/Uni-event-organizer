export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
import { RegistrationEmailHelper } from "@/lib/RegistrationEmailHelper";
import next from "next";
import { NextResponse } from "next/server";

export async function GET(request) {
    // console.log(request);
    const query = new URL(request.url).searchParams;
    const studentId = query.get('studentId');
    const eventId = query.get('eventId');
    const eventsAll = query.get('eventsAll');

    // console.log('studentId: ', studentId);
    console.log('eventsAll: ', eventsAll);

    // await prisma.$connect();

    if (studentId && eventsAll == 'true') {
        console.log('hit on first elif');

        const response = await prisma.registration.findMany({
            where: {
                studentId: studentId
            },
            include: {
                event: true
            }
        });
        return NextResponse.json(response);
    }

    else if (studentId && eventId && !eventsAll) {
        console.log('hit on second elif');
        const response = await prisma.registration.findUnique({
            where: { // <--- You were missing this wrapper
                studentId_eventId: {
                    studentId: studentId,
                    eventId: eventId,
                },
            },
        });

        if (response?.id) {
            return NextResponse.json({ hasRegistered: true });
        }
        return NextResponse.json({ hasRegistered: false });
    }

    else if (studentId && !eventId && !eventsAll) {
        console.log('hit on 3rd elif');
        const response = await prisma.registration.findMany({
            where: { studentId: studentId }
        }
        );
        return NextResponse.json({
            message: "Registration endpoint is working",
            data: response
        });
    }

    const response = await prisma.registration.findMany();
    return NextResponse.json({
        // message: "Registration endpoint is working",
        data: response
    });
}

export async function POST(request) {
    try {
        const { formResponses, eventId, studentId, userVerification } = await request.json();

        // console.log("from server: ", formResponses);
        console.log("eventId: ", eventId);
        // console.log("studentId: ", studentId);
        // console.log("user verification: ", userVerification);


        // 1. Verify user status
        if (userVerification.status !== 'active') {
            return Response.json(
                { error: 'Account is banned or inactive' },
                { status: 403 }
            );
        }

        // await prisma.$connect();

        const student = await prisma.student.findUnique({
            where: { studentId: studentId }
        });       

        if (!student) {
            return Response.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        // 2. Check for duplicate registration
        const existingRegistration = await prisma.registration.findFirst({
            where: {
                eventId: eventId,
                studentId: studentId
            }
        });

        if (existingRegistration) {
            return Response.json(
                { error: 'Already registered for this event' },
                { status: 409 }
            );
        }

        // 3. Create registration with form responses
        const registration = await prisma.registration.create({
            data: {
                eventId: eventId,
                studentId: studentId,
                formData: formResponses // Store everything as JSON
            }
        });

        const increment = await prisma.event.update({
            where: { id: eventId },
            data: {
                audience: {
                    increment: 1
                }
            }
        })

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        // console.log('eventData: ', event);
        // console.log('event: ', event.eventTitle);
        // console.log('event: ', event.location);
        // console.log('event: ', event.eventType);
        // console.log('eventDate: ', event.eventDate);
        // console.log('eventImage: ', event.eventImage);

        const eventTitle = event.eventTitle;
        const location = event.location;
        const eventType = event.eventType;
        const eventImage = event.eventImage;
        const name = student.name;
        const email = student.email;

        const eventDate = event.eventDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })

        console.log('sending email for registration.');
        

        await RegistrationEmailHelper( name, email, eventTitle, eventType, location, eventDate, eventImage )


        // 4. Return success response
        return Response.json({
            success: true,
            // registrationId: registration.id,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        // await prisma.$disconnect();
        return Response.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    const query = new URL(request.url).searchParams;
    const studentId = query.get('studentId');
    const id = query.get('registrationId');

    // console.log('delete request of: ');
    console.log('studentId: ', studentId);
    console.log('id: ', id);
    // console.log('query: ', query);

    const deleteUser = await prisma.registration.delete({
        where: {
            id: id,
        },
    })

    return NextResponse.json({
        message: "Delete endpoint hit",
        data: deleteUser,
        code: 202
    });
}