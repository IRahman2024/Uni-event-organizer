import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(request) {
    prisma.$connect();

    const students = await prisma.student.findMany([]);

    prisma.$disconnect();
    return NextResponse.json({
        success: true,
        data: students
    })
}

export async function PATCH(request) {

    try {
        const params = new URL(request.url);
        const id = params.searchParams.get('id');

        const data = await request.json();
        const status = data.stat;

        // console.log('id: ', id);
        console.log('stat: ', status);

        prisma.$connect();

        const res = await prisma.student.update({
            where: {
                id: id
            },
            data: {
                status: status
            }
        })
        prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: res
        })
    } catch (error) {
        console.log("error while student status patch: ", error);
        return NextResponse.json({
            success: false,
            error: error
        })

    }
}