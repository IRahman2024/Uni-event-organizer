// src/lib/mailHelper.js
import EventRegistrationEmail from '@/components/Emails/EventRegistrationEmail';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

export async function RegistrationEmailHelper(name, email, eventTitle, eventType, location, eventDate, eventImage, ticketImage, cancelLink) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AfterClassEmail, // your gmail
            pass: process.env.AfterClassGooglePass, // app password (not regular password)
        },
    });

    console.log('name in email file: ', name);
    console.log('email in email file: ', email);
    

    const RegistrationEmail = await render(
        EventRegistrationEmail({ name: name, eventTitle: eventTitle, eventType: eventType, location: location, eventDate: eventDate, eventImage: eventImage, ticketImage: ticketImage, cancelLink: cancelLink })
    );

    await transporter.sendMail({
        from: process.env.AfterClassEmail,
        to: email,
        subject: `You’re in! 🎫 Your pass for ${eventTitle}`,
        html: RegistrationEmail,
    });

}