export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req) {
    try {

        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('eventId');

        if (eventId) {
            // await prisma.$connect();

            const events = await prisma.event.findUnique({
                where: {
                    id: eventId
                },
                include: {
                    formFields: true
                }
            })

            // await prisma.$disconnect();

            return NextResponse.json({
                success: true,
                data: events,
                message: "All Events fetched successfully"
            });
        }

        // return NextResponse.json({
        //     success: true,
        //     data: `got eventId: ${eventId}`
        // })

        // await prisma.$connect();

        const events = await prisma.event.findMany({
            include: {
                formFields: true
            }
        })

        // await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: events,
            message: "All Events fetched successfully"
        });
    } catch (error) {
        // await prisma.$disconnect();
        console.error("Error fetching events:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching datasets",
                details: error.message
            },
            { status: 500 }
        );
    }
}