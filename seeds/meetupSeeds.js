import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Raw meetup events
 */
const rawEvents = [
    {
        eventTitle: "Career Guidance Meetup -Talk With CST Club",
        description: "Meetup focusing on career planning With Cyber security.",
        location: "SEC, Sylhet",
        eventType: "meetup",
        capacity: 150,
        price: 0.0,
        eventDate: "2026-01-25T15:00:00.000Z",
        eventDeadline: "2026-01-22T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUixdmB4VyDfEUc7IO6H843FtrkMWKP9RbAQLN",
        audience: 140,
        status: "upcoming",
    },
    {
        eventTitle: "Bangladesh Army After Bsc",
        description:
            "Awareness session about Bangladesh Army career opportunities, Session with Captain Jamil.",
        location: "Sylhet Cantonment",
        eventType: "meetup",
        capacity: 200,
        price: 0.0,
        eventDate: "2026-02-02T10:00:00.000Z",
        eventDeadline: "2026-01-30T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUPqmewx7cE6g0etpMzBA3Q5DIS2Zvw7GJHFdL",
        audience: 180,
        status: "upcoming",
    },
];

/**
 * Base fields (shared everywhere)
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
        fieldName: "department",
        label: "Department",
        fieldType: "option",
        isRequired: true,
        options: "CSE,EEE,ME,CE,ETE",
    },
];

/**
 * Meetup-specific fields
 */
function getEventSpecificFields(eventTitle) {
    if (eventTitle.includes("Career")) {
        return [
            {
                fieldName: "careerInterest",
                label: "Career Interest Area",
                fieldType: "option",
                isRequired: true,
                options: "CyberSecurity,WebDevelopment,AI,Networking,General",
            },
            {
                fieldName: "currentLevel",
                label: "Current Study Level",
                fieldType: "option",
                isRequired: false,
                options: "1stYear,2ndYear,3rdYear,4thYear,Graduate",
            },
        ];
    }

    if (eventTitle.includes("Army")) {
        return [
            {
                fieldName: "interestType",
                label: "Interested In",
                fieldType: "option",
                isRequired: true,
                options: "Army,Navy,AirForce",
            },
            {
                fieldName: "physicalPreparedness",
                label: "Physical Preparedness Level",
                fieldType: "option",
                isRequired: false,
                options: "Beginner,Intermediate,Advanced",
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
    console.log("🌱 Seeding meetup events...\n");

    for (const event of rawEvents) {
        try {
            const data = transformSeedData(event);

            const created = await prisma.event.create({
                data,
                include: { formFields: true },
            });

            console.log(
                `✅ ${created.eventTitle} → ${created.formFields.length} fields created`
            );
        } catch (error) {
            console.error(
                `❌ Failed to seed event: ${event.eventTitle}`,
                error.message
            );
        }
    }

    console.log("\n🌱 Meetup seeding complete.");
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
