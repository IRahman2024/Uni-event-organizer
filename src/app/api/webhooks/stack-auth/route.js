// app/api/webhooks/stack-auth/route.js
import { Webhook } from "svix";
import prisma from '@/lib/prisma';

export async function POST(request) {
    console.log('========================================');
    console.log('🔔 WEBHOOK HIT - Stack Auth webhook received');
    console.log('========================================');

    try {
        // Get the webhook payload
        const payload = await request.text();
        console.log('📦 Payload length:', payload.length);

        const headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature"),
        };

        console.log('📋 Headers received:', {
            'svix-id': headers['svix-id'],
            'svix-timestamp': headers['svix-timestamp'],
            'has-signature': !!headers['svix-signature']
        });

        console.log('🔐 Webhook secret exists:', !!process.env.STACK_WEBHOOK_SECRET);

        // Verify the webhook signature
        const wh = new Webhook(process.env.STACK_WEBHOOK_SECRET);
        let event;

        try {
            console.log('🔍 Starting signature verification...');
            event = wh.verify(payload, headers);
            console.log('✅ Signature verification PASSED');
        } catch (err) {
            console.error('❌ Webhook verification FAILED:', err.message);
            console.error('Full error:', err);
            return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the verified payload
        const parsedPayload = JSON.parse(payload);
        const { type, data } = parsedPayload;

        console.log('📨 Event type:', type);
        console.log('👤 User data:', JSON.stringify(data, null, 2));

        // Handle user.created event
        if (type === 'user.created') {
            console.log('✅ This is a user.created event');

            const email = data.primary_email;
            // const name = data.display_name || email.split('@')[0];

            console.log(`📧 Email to send to: ${email}`);
            // console.log(`👤 Name to use: ${name}`);

            // Send welcome email
            console.log('🚀 About to call sendWelcomeEmail function...');

            sendWelcomeEmail(email)
                .then(() => {
                    console.log('✅ sendWelcomeEmail promise resolved');
                })
                .catch(error => {
                    console.error('❌ sendWelcomeEmail promise rejected:', error.message);
                    console.error('Full error:', error);
                });

            console.log('📤 Email function called (async)');
        } else {
            console.log('⚠️ Not a user.created event, skipping email');
        }

        console.log('✅ Returning success response to Stack Auth');
        return Response.json({
            received: true,
            type,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        console.error('❌ FATAL ERROR in webhook handler:', error.message);
        console.error('Stack trace:', error.stack);
        return Response.json({
            error: 'Webhook processing failed',
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email) {
    console.log('========================================');
    console.log('📬 sendWelcomeEmail function started');
    console.log('========================================');

    try {
        // Use absolute URL with your Vercel domain
        const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afterclass-kappa.vercel.app';
        const fullUrl = `${apiUrl}/api/send?type=new`;

        console.log(`🌐 API URL: ${fullUrl}`);
        console.log(`📧 Email: ${email}`);
        console.log(`👤 Name: ${name}`);

        const requestBody = { email };
        console.log('📦 Request body:', JSON.stringify(requestBody));

        console.log('🚀 Making fetch request...');

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📥 Fetch completed');
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API returned error:', errorText);
            throw new Error(`Email API failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ API Response:', JSON.stringify(result));
        console.log(`✅ Welcome email sent successfully to ${email}`);

        return result;
    } catch (error) {
        console.error('❌ ERROR in sendWelcomeEmail:', error.message);
        console.error('Full error:', error);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}