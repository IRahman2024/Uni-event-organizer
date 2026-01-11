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

        const { name, batch, department, studentId, profileImage, stackUserId } = body;

        // console.log('name: ', name);
        console.log('stackUserId: ', stackUserId);
        console.log('profileImage: ', profileImage);

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

        // 1. UPDATE STACK AUTH USER PROFILE (if stackUserId is provided)
        if (stackUserId && name && profileImage) {
            try {
                const stackResponse = await fetch(`https://api.stack-auth.com/api/v1/users/${stackUserId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-stack-access-type': 'server',
                        'x-stack-project-id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
                        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
                    },
                    body: JSON.stringify({
                        display_name: name,
                        profile_image_url: profileImage.trim()
                    })
                });

                if (!stackResponse.ok) {
                    const errorText = await stackResponse.text();
                    console.error('Stack Auth update failed:', errorText);
                    // Continue with database update even if Stack Auth fails
                }
            } catch (stackError) {
                console.error('Error updating Stack Auth:', stackError);
                // Continue with database update even if Stack Auth fails
            }
        }

        // prisma.$disconnect();

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