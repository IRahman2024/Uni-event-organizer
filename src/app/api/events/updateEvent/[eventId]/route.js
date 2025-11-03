import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { success } from "zod";

//nr
export async function PATCH(request, { params }) {

    try {
        const url = new URL(request.url);
        const eventId = url.pathname.split('/').pop();

        const { status } = await request.json();

        console.log('eventId: ', eventId, 'status: ', status);

        prisma.$connect();

        const response = await prisma.event.update({
            where:{
                id: eventId
            },
            data: {
                status: status
            }
        })

        prisma.$disconnect();

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