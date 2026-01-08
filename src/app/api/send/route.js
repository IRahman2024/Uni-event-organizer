import WelcomeEmail from '@/components/Emails/WelcomeEmail';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { NextResponse } from 'next/server';
import EventRegistrationEmail from '@/components/Emails/EventRegistrationEmail';

// for new user welcome email
// fetch('/api/send?type=new', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ name: 'Ifti', email: 'user@example.com' })
// })


// after event registration
// http://localhost:3000/api/send?type=event
// {
//   "name": "Student",
//   "email":"kibej24900@eubonus.com",
//   "eventTitle": "Amazing Event",
//   "eventType": "Party",
//   "location": "Campus Venue",
//   "eventDate": "January 15, 2026 at 8:00 PM",
//   "eventImage": "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUYJlaZshuLdgqZbyfBY7mM0Opo1a5wQxl6nR3",
//   "ticketImage": "https://fzenbrc.stripocdn.email/content/guids/CABINET_efd73275a118af81169236f0a96cdd3cc573fa6b6e179a5c04a4f0f55ee77db7/images/event_ticket.jpg",
//   "cancelLink": "http://localhost:3000/"
// }


export async function POST(request) {
    const query = new URL(request.url).searchParams;
    const { name, email, eventTitle, eventType, location, eventDate, eventImage, ticketImage, cancelLink } = await request.json();
    const type = query.get('type');
    // const email = query.get('email');

    // console.log('hit');
    // console.log('name: ', name);
    console.log('email: ', email);
    // console.log('type: ', type);
    // console.log(name, eventTitle, eventType, location, eventDate, eventImage, ticketImage, cancelLink);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AfterClassEmail, // your gmail
            pass: process.env.AfterClassGooglePass, // app password (not regular password)
        },
    });

    const welcomeEmail = await render(
        WelcomeEmail()
    );
    const RegistrationEmail = await render(
        EventRegistrationEmail({ name: name, eventTitle: eventTitle, eventType: eventType, location: location, eventDate: eventDate, eventImage: eventImage, ticketImage: ticketImage, cancelLink: cancelLink })
    );

    try {

        if (!type) {
            return NextResponse.json(
                { success: false, error: 'Email type not specified' },
                { status: 400 }
            );
        }

        if (type == 'new') {
            await transporter.sendMail({
                from: process.env.AfterClassEmail,
                to: email,
                subject: 'One last step... 🔓 Activate your AfterClass account',
                html: welcomeEmail,
            });
        }

        if (type == 'event') {
            await transporter.sendMail({
                from: process.env.AfterClassEmail,
                to: email,
                subject: `You’re in! 🎫 Your pass for ${eventTitle}`,
                html: RegistrationEmail,
            });
        }

        return Response.json({ success: true });

    } catch (error) {
        console.error("Nodemailer Error:", error);
        // Return a cleaner error message to debug
        return NextResponse.json({
            error: error.message,
            code: error.code,
            command: error.command
        }, { status: 500 });
    }
}