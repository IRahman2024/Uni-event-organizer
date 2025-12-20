// npm run seed
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const transformSeedData = (rawData) => {
    const eventData = rawData.eventData[0];

    return {
        // Event data
        eventTitle: eventData.eventTitle,
        description: eventData.description,
        location: eventData.location,
        eventType: eventData.eventType,
        capacity: parseInt(eventData.capacity),
        price: parseFloat(eventData.price),
        eventDate: new Date(eventData.eventDate),
        eventDeadline: new Date(eventData.eventDeadline),
        eventImage: eventData.eventImage || null,
        audience: eventData.audience ? parseInt(eventData.audience) : null,
        status: eventData.status || null,

        // Nested create for formFields
        formFields: {
            create: rawData.fields.map((field) => ({
                fieldName: field.fieldName,
                label: field.label,
                fieldType: field.fieldType,
                isRequired: field.isRequired,
                options: field.options || null,
            }))
        }
    };
};

// --- Winter Donation Program Seed Data ---
const rawSeedData = [
    // 💾 Winter Clothes Donation Program
    {
        eventData: [{
            eventTitle: "Winter Clothes Donation Program",
            description: "Donation drive to distribute winter clothes among underprivileged people.",
            location: "SEC,Sylhet City",
            eventType: "others",
            capacity: "300",
            price: "0.00",
            eventDate: "2026-01-10T09:00:00.000Z",
            eventDeadline: "2026-01-08T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUSKwzpd5nT6NjiSfKACc0X5Mt14soGbzqxaER",
            audience: "280",
            status: "upcoming"
        }],
        fields: [
            // Basic Information
            {
                fieldName: "fullName",
                label: "Full Name",
                fieldType: "text",
                isRequired: true,
                options: null
            },
            {
                fieldName: "studentId",
                label: "Student ID",
                fieldType: "text",
                isRequired: true,
                options: null
            },
            {
                fieldName: "session",
                label: "Session",
                fieldType: "text",
                isRequired: true,
                options: null
            },
            {
                fieldName: "department",
                label: "Department",
                fieldType: "options",
                isRequired: true,
                options: "Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Software Engineering, Information Technology, Electronics Engineering"
            },
            // Event-specific fields for donation program
            {
                fieldName: "volunteerRole",
                label: "Volunteer Role Preference",
                fieldType: "options",
                isRequired: true,
                options: "Distribution Volunteer, Collection Volunteer, Coordination Team, Transportation Support, Registration Desk"
            },
            {
                fieldName: "availableHours",
                label: "Available Hours for Volunteering",
                fieldType: "number",
                isRequired: true,
                options: null
            },
            {
                fieldName: "contactNumber",
                label: "Contact Number",
                fieldType: "text",
                isRequired: true,
                options: null
            },
            {
                fieldName: "previousExperience",
                label: "Previous Volunteer Experience (Optional)",
                fieldType: "text",
                isRequired: false,
                options: null
            }
        ]
    }
];

const seed = async () => {
    console.log('🌱 Starting database seed for Winter Donation Program...\n');

    for (const rawData of rawSeedData) {
        try {
            // 1. Transform the raw data
            const dataToCreate = transformSeedData(rawData);

            // 2. Use prisma.event.create for nested writes
            const event = await prisma.event.create({
                data: dataToCreate,
                include: {
                    formFields: true
                }
            });

            console.log(`✅ Created event: ${event.eventTitle}`);
            console.log(`   📍 Location: ${event.location}`);
            console.log(`   📅 Date: ${event.eventDate.toLocaleDateString()}`);
            console.log(`   💰 Price: ${event.price === 0 ? 'FREE' : `৳${event.price}`}`);
            console.log(`   📝 Form fields: ${event.formFields.length}`);
            console.log('');

        } catch (error) {
            console.error(`❌ Error seeding event: ${rawData.eventData[0].eventTitle}`);
            console.error(error);
            console.log('');
        }
    }

    console.log(`\n🎉 Database seed finished! Created ${rawSeedData.length} event(s).`);
}

seed()
    .catch((e) => {
        console.error('Fatal error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });