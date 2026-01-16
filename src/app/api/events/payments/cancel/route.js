import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentId = formData.get('tran_id');

        const payment = await prisma.payment.delete({
            where: {
                id: paymentId
            }
        })

        return NextResponse.redirect(new URL('/dashboard/student/my-events', request.url), 303);

    } catch (error) {
        console.log('error at payment failed api: ', error);
        return NextResponse.json({
            success: false,
            message: error
        })
    }
}