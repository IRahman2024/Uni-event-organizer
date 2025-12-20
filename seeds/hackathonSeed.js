import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Raw hackathon events
 */
const rawEvents = [
    {
        eventTitle: "Solvio Ai Hackathon 2026",
        description: "24-hour hackathon to solve real-world problems.",
        location: "Sheba HQ, Jashore IT park ,Jeshore",
        eventType: "hackathon",
        capacity: 250,
        price: 600.0,
        eventDate: "2026-04-10T08:00:00.000Z",
        eventDeadline: "2026-03-30T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUTTOd5SYfMSBs6m8vUrtyjkg9I4VOCJi5Tw7h",
        audience: 230,
        status: "upcoming",
    },
    {
        eventTitle: "University Hackathon 2K26",
        description: "Intra-university hackathon for students.",
        location: "Sylhet Engineering College, Sylhet",
        eventType: "hackathon",
        capacity: 180,
        price: 400.0,
        eventDate: "2026-05-02T09:00:00.000Z",
        eventDeadline: "2026-04-25T23:59:59.000Z",
        eventImage:
            "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUAXFhfNyy31ckAJMohm7CF0ZDuBvSWbgq4a2l",
        audience: 165,
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
        fieldName: "department",
        label: "Department",
        fieldType: "option",
        isRequired: true,
        options: "CSE,EEE,ME,CE,ETE",
    },
];

/**
 * Hackathon-specific fields
 */
function getEventSpecificFields() {
    return [
        {
            fieldName: "teamName",
            label: "Team Name",
            fieldType: "text",
            isRequired: true,
        },
        {
            fieldName: "teamSize",
            label: "Team Size",
            fieldType: "number",
            isRequired: true,
        },
        {
            fieldName: "problemDomain",
            label: "Problem Domain",
            fieldType: "option",
            isRequired: true,
            options: "AI,Web,Mobile,IoT,FinTech,HealthTech",
        },
        {
            fieldName: "githubRepo",
            label: "GitHub Repository (if available)",
            fieldType: "text",
            isRequired: false,
        },
    ];
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
                ...getEventSpecificFields(),
            ],
        },
    };
}

/**
 * Seed runner
 */
async function main() {
    console.log("🌱 Seeding hackathon events...\n");

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

    console.log("\n🌱 Hackathon seeding complete.");
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
