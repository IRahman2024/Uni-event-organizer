// src/lib/mailHelper.js
import EventRegistrationEmail from '@/components/Emails/EventRegistrationEmail';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

export async function RegistrationEmailHelper(name, email, eventTitle, eventType, location, eventDate, eventImage, ticketImage, cancelLink) {
    try {
        console.log('📧 Starting email send process...');
        console.log('Email config check:', {
            hasEmail: !!process.env.AfterClassEmail,
            hasPassword: !!process.env.AfterClassGooglePass,
            emailPreview: process.env.AfterClassEmail?.slice(0, 3) + '***'
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AfterClassEmail,
                pass: process.env.AfterClassGooglePass,
            },
        });

        console.log('name in email file:', name);
        console.log('email in email file:', email);

        // Verify transporter configuration
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        const RegistrationEmail = await render(
            EventRegistrationEmail({
                name,
                eventTitle,
                eventType,
                location,
                eventDate,
                eventImage,
                ticketImage,
                cancelLink
            })
        );

        console.log('📤 Sending email...');

        const info = await transporter.sendMail({
            from: process.env.AfterClassEmail,
            to: email,
            subject: `You're in! 🎫 Your pass for ${eventTitle}`,
            html: RegistrationEmail,
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ ERROR sending registration email:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error command:', error.command);
        console.error('Full error:', error);

        throw error; // Re-throw so caller knows it failed
    }
}