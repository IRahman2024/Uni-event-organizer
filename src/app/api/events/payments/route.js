import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
import SSLCommerzPayment from 'sslcommerz-lts';
import { cuid, success } from "zod";

// sslzcommerce
const store_id = process.env.StoreID;
const store_passwd = process.env.StorePassword;
const is_live = false;

export async function POST(request) {
    try {
        const { registrationId } = await request.json();

        console.log("payment api hit");
        // console.log("registrationId: ", registrationId);

        const { event, student } = await prisma.registration.findUnique({
            where: {
                id: registrationId
            },
            include: {
                event: true,
                student: true
            }
        })

        // console.log('student info: ', student);
        // console.log('event info: ', event);

        const studentId = student.studentId;
        const amount = event.price;


        const paymentEntry = await prisma.payment.create({
            data: {
                studentId: studentId,
                eventId: event.id,
                amount: amount,
                status: 'pending',
                registrationId: registrationId
            }
        })

        // console.log("paymentEntry: ", paymentEntry);


        const paymentData = {
            store_id: store_id,
            store_passwd: store_passwd,
            is_live: is_live,
            total_amount: amount,
            currency: 'BDT',
            tran_id: paymentEntry.id, // use unique tran_id for each api call
            success_url: `http://afterclass-kappa.vercel.app/api/events/payments/success?paymentId=${paymentEntry.id}`,
            fail_url: `http://afterclass-kappa.vercel.app/api/events/payments/cancel?paymentId=${paymentEntry.id}`,
            cancel_url: `http://afterclass-kappa.vercel.app/api/events/payments/cancel?paymentId=${paymentEntry.id}`,
            ipn_url: 'http://afterclass-kappa.vercel.app/ipn',
            shipping_method: 'Email',
            product_name: 'Event Registration Fee',
            product_category: event.eventType,
            product_profile: 'non-physical-goods',
            cus_add1: 'Dhaka',
            cus_name: student.name,
            cus_email: student.email,
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcommerzUrl = is_live
            ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

        // Make request using axios
        const response = await axios.post(
            sslcommerzUrl,
            new URLSearchParams(paymentData).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        const apiResponse = response.data;


        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json({
                success: true,
                gatewayUrl: apiResponse.GatewayPageURL,
                tran_id: paymentData.tran_id
            });

        } else {
            console.error('SSLCommerz error:', apiResponse);
            return NextResponse.json(
                { error: 'Payment initialization failed', details: apiResponse },
                { status: 400 }
            );
        }


        return NextResponse.json({
            // success: true,
            message: "Payment api hit",
            // eventData: event,
            // studentData: student,
            // paymentData: paymentData
        })

    } catch (error) {
        console.log('error from payment api: ', error);
        NextResponse.json({
            success: false,
            message: error
        })
    }
}