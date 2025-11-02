import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET() {
    try {
        await prisma.$connect();

        const events = await prisma.event.findMany({
            include: {
                formFields: true
            }
        })

        await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: events,
            message: "All Events fetched successfully"
        });
    } catch (error) {
        await prisma.$disconnect();
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