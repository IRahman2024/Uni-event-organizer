export const runtime = 'nodejs';

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { success } from "zod";
import { fa } from "zod/v4/locales";

export async function GET(request, { params }) {
    try {
        const { email } = await params;

        // console.log('params: ', params);
        console.log('student Id: ', email);

        // prisma.$connect();

        const student = await prisma.student.findUnique({
            where: {
                email: email
            }
        });

        // prisma.$disconnect();

        return NextResponse.json({
            success: true,
            message: "Get request received",
            data: student
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error
        })
    }

}

export async function PATCH(request, { params }) {
    try {
        const { email } = await params;

        const body = await request.json();

        const { name, batch, department, studentId, profileImage } = body;

        // console.log('name: ', name);

        const data = {
            name,
            batch: parseInt(batch),
            department
        };

        // ➜  only add image if we actually got a non-empty string
        if (typeof profileImage === 'string' && profileImage.trim() !== '') {
            data.image = profileImage.trim();
        }

        const updateData = { ...data };
        const createData = { ...data, email, studentId };

        // console.log('data on server: ', data);


        // prisma.$connect();

        const updatedStudent = await prisma.student.upsert({
            where: {
                email: email
            },
            update: updateData,
            create: createData
        })

        prisma.$disconnect();

        return NextResponse.json({
            success: true,
            message: "Patch request received",
            response: updatedStudent
        })
    } catch (error) {
        console.log('error at student patch: ', error);
        return NextResponse.json({
            success: false,
            error: error
        })
    }
}