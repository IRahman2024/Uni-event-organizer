// app/api/webhooks/stack-auth/route.js
import { Webhook } from "svix";
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        console.log('🔔 Webhook received from Stack Auth');

        // Get the webhook payload
        const payload = await request.text();
        const headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature"),
        };

        console.log('📦 Verifying webhook signature...');

        // Verify the webhook signature
        const wh = new Webhook(process.env.STACK_WEBHOOK_SECRET);
        let event;

        try {
            event = wh.verify(payload, headers);
        } catch (err) {
            console.error('❌ Webhook verification failed:', err);
            return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }

        console.log('✅ Webhook signature verified');

        // Parse the verified payload
        const { type, data } = JSON.parse(payload);

        // Handle user.created event
        if (type === 'user.created') {
            console.log('👤 New user created:', data.primary_email);

            const email = data.primary_email;
            // const name = data.display_name || email.split('@')[0];

            console.log(`📧 Sending welcome email to: ${email}`);

            // Send welcome email (don't await to avoid blocking)
            sendWelcomeEmail(email)
                .catch(error => console.error('❌ Failed to send welcome email:', error));

        }

        return Response.json({
            received: true,
            type,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return Response.json({
            error: 'Webhook processing failed',
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email) {
    try {
        // Use absolute URL with your Vercel domain
        const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afterclass-kappa.vercel.app';

        console.log(`🌐 Calling email API: ${apiUrl}/api/send?type=new`);

        const response = await fetch(`${apiUrl}/api/send?type=new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email API failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Welcome email sent successfully to ${email}`);
        return result;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        throw error;
    }
}