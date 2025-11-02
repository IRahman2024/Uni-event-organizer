import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    try {
        prisma.$connect();
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId').split(',');

        const response = await prisma.event.deleteMany({
            where: {
                id: {
                    in: eventId
                }
            }
        })

        prisma.$disconnect();

        // const eventId = searchParams.get('eventId');
        console.log('response: ', response);

        return NextResponse.json({
            success: true,
            message: "Deleted successfully",
            details: response
        },
            { status: 200 })

    } catch (error) {
        // prisma.$disconnect();
        console.log('error detected in api: ', error);
        return NextResponse.json({
            success: false,
            message: "Failed data",
            details: error.message
        },
            { status: 500 })
    }
}