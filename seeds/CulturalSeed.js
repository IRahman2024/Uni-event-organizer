import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Raw event data
 */
const rawEvents = [
    {
        eventTitle: "EEE Department BBQ Night",
        description: "BBQ night organized by the Department of EEE for students and faculty.",
        location: "Sylhet Engineering College",
        eventType: "cultural",
        capacity: 300,
        price: 800.0,
        eventDate: "2026-02-18T19:00:00.000Z",
        eventDeadline: "2026-02-10T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUEs91Pukpd53yMob1frULxtwPCkZ7AYcsvKmH",
        audience: 280,
        status: "upcoming",
    },
    {
        eventTitle: "Holi Festival Celebration",
        description: "Colorful Holi celebration with music, fun activities, and student participation.",
        location: "Sylhet Engineering College",
        eventType: "cultural",
        capacity: 400,
        price: 200.0,
        eventDate: "2026-03-14T16:00:00.000Z",
        eventDeadline: "2026-03-10T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUFXN60x69W9gRXyrGxwLKplmYb17nJav6dH5s",
        audience: 370,
        status: "upcoming",
    },
    {
        eventTitle: "CSE Department BBQ Night",
        description: "BBQ night organized by the Department of CSE for students.",
        location: "Sylhet Engineering College",
        eventType: "cultural",
        capacity: 280,
        price: 750.0,
        eventDate: "2026-02-25T19:00:00.000Z",
        eventDeadline: "2026-02-18T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMU3bixYEcorIzp0mtAgXj2dVHxJebDL8i6sQyO",
        audience: 260,
        status: "upcoming",
    },
    {
        eventTitle: "Annual Cultural Night",
        description: "Annual cultural program featuring music, dance, and drama performances.",
        location: "Sylhet Engineering College",
        eventType: "cultural",
        capacity: 700,
        price: 300.0,
        eventDate: "2026-03-05T18:00:00.000Z",
        eventDeadline: "2026-02-25T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUpytZrHD3am4V5WlUqouzxBbGQn9dRTOLjt7Y",
        audience: 650,
        status: "upcoming",
    },
];

/**
 * Common fields for all events
 */
const baseFormFields = [
    {
        fieldName: "fullName",
        label: "Full Name",
        fieldType: "text",
        isRequired: true,
    },
    {
        fieldName: "studentId",
        label: "Student ID",
        fieldType: "text",
        isRequired: true,
    },
    {
        fieldName: "email",
        label: "Email Address",
        fieldType: "email",
        isRequired: true,
    },
    {
        fieldName: "session",
        label: "Session",
        fieldType: "text",
        isRequired: true,
    },
    {
        fieldName: "department",
        label: "Department",
        fieldType: "option",
        isRequired: true,
        options: "CSE,EEE,ME,CE,ETE",
    },
];

/**
 * Event-specific fields (STRICT option rule)
 */
function getEventSpecificFields(eventTitle) {
    if (eventTitle.includes("BBQ")) {
        return [
            {
                fieldName: "foodPreference",
                label: "Food Preference",
                fieldType: "option",
                isRequired: true,
                options: "Chicken,Beef,Veg",
            },
            {
                fieldName: "guestCount",
                label: "Number of Guests",
                fieldType: "number",
                isRequired: false,
            },
        ];
    }

    if (eventTitle.includes("Holi")) {
        return [
            {
                fieldName: "colorConsent",
                label: "Okay with colors?",
                fieldType: "option",
                isRequired: true,
                options: "Yes,No",
            },
            {
                fieldName: "tshirtSize",
                label: "T-Shirt Size",
                fieldType: "option",
                isRequired: false,
                options: "XS,S,M,L,XL,XXL",
            },
        ];
    }

    if (eventTitle.includes("Cultural")) {
        return [
            {
                fieldName: "participationType",
                label: "Participation Type",
                fieldType: "option",
                isRequired: true,
                options: "Audience,Performer,Volunteer",
            },
            {
                fieldName: "performanceName",
                label: "Performance Name (if any)",
                fieldType: "text",
                isRequired: false,
            },
        ];
    }

    return [];
}

/**
 * Transform function
 */
function transformSeedData(event) {
    return {
        eventTitle: event.eventTitle,
        description: event.description,
        location: event.location,
        eventType: event.eventType,
        capacity: parseInt(event.capacity),
        price: new Prisma.Decimal(parseFloat(event.price)),
        eventDate: new Date(event.eventDate),
        eventDeadline: new Date(event.eventDeadline),
        eventImage: event.eventImage,
        audience: event.audience ? parseInt(event.audience) : null,
        status: event.status,
        formFields: {
            create: [
                ...baseFormFields,
                ...getEventSpecificFields(event.eventTitle),
            ],
        },
    };
}

/**
 * Seed runner
 */
async function main() {
    console.log("🌱 Seeding events with strict option-only rules...\n");

    for (const event of rawEvents) {
        try {
            const data = transformSeedData(event);

            const createdEvent = await prisma.event.create({
                data,
                include: { formFields: true },
            });

            console.log(
                `✅ ${createdEvent.eventTitle} → ${createdEvent.formFields.length} fields created`
            );
        } catch (error) {
            console.error(
                `❌ Failed to seed event: ${event.eventTitle}`,
                error.message
            );
        }
    }

    console.log("\n🌱 Seeding complete.");
}

main()
    .catch((error) => {
        console.error("🔥 Fatal seed error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
