// app/api/webhooks/stack-auth/route.js
import { Webhook } from "svix";
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        // Get the webhook payload
        const payload = await request.text();
        const headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature"),
        };

        // Verify the webhook signature
        const wh = new Webhook(process.env.STACK_WEBHOOK_SECRET);
        let event;

        try {
            event = wh.verify(payload, headers);
        } catch (err) {
            console.error('Webhook verification failed:', err);
            return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the verified payload
        const { type, data } = JSON.parse(payload);

        // Handle user.created event
        if (type === 'user.created') {
            console.log('New user created:', data);

            // Send welcome email (don't await to avoid blocking)
            sendWelcomeEmail(data.primary_email)
                .catch(error => console.error('Failed to send welcome email:', error));

        }

        return Response.json({ received: true, type });

    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({
            error: 'Webhook processing failed',
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email) {
    try {
        const response = await fetch(`/api/send?type=new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error(`Email API failed: ${response.statusText}`);
        }

        console.log(`Welcome email sent to ${email}`);
        return await response.json();
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
}