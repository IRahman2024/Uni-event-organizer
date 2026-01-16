import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentId = formData.get('tran_id');

        const successPayment = await prisma.payment.update({
            where: {
                id: paymentId
            },
            data: {
                status: 'paid',
                registration: {
                    update: {
                        status: 'paid'
                    }
                }
            }
        })

        return NextResponse.redirect(new URL('/dashboard/student/my-events', request.url), 303);

    } catch (error) {
        console.log('error at payment success api: ', error);
        return NextResponse.json({
            success: false,
            message: error
        })
    }
}