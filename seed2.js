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

// --- Workshop Events Seed Data ---
const rawSeedData = [
    // 💾 Industrial Automation Workshop
    {
        eventData: [{
            eventTitle: "Industrial Automation Workshop",
            description: "Hands-on workshop on factory Automation ,Maintainance & Management.",
            location: "Sylhet Engineering College",
            eventType: "workshop",
            capacity: "120",
            price: "500.00",
            eventDate: "2026-01-20T09:00:00.000Z",
            eventDeadline: "2026-01-15T23:59:59.000Z",
            eventImage: "Workshop_factory1.jpeg",
            audience: "110",
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
                options: "Electrical & Electronic Engineering, Mechanical Engineering, Industrial Engineering, Computer Science, Mechatronics Engineering"
            },
            // Event-specific fields for Industrial Automation
            {
                fieldName: "automationInterest",
                label: "Area of Interest in Automation",
                fieldType: "options",
                isRequired: true,
                options: "PLC Programming, SCADA Systems, Industrial Robotics, Process Control, Factory Management, Predictive Maintenance"
            },
            {
                fieldName: "experienceLevel",
                label: "Experience Level with Automation",
                fieldType: "options",
                isRequired: true,
                options: "No Experience, Basic Knowledge, Intermediate, Advanced"
            },
            {
                fieldName: "email",
                label: "Email Address",
                fieldType: "email",
                isRequired: true,
                options: null
            },
            {
                fieldName: "bringLaptop",
                label: "Will you bring your own laptop?",
                fieldType: "options",
                isRequired: true,
                options: "Yes, No"
            },
            {
                fieldName: "specificQuestions",
                label: "Any specific topics you want to learn? (Optional)",
                fieldType: "text",
                isRequired: false,
                options: null
            }
        ]
    },

    // 💾 Line Follower Robot (LFR) Workshop
    {
        eventData: [{
            eventTitle: "Line Follower Robot (LFR) Workshop",
            description: "Practical workshop on designing and building line follower robots using Arduino.",
            location: "Sylhet Engineering College Robotics Lab",
            eventType: "workshop",
            capacity: "80",
            price: "100.00",
            eventDate: "2026-02-08T10:00:00.000Z",
            eventDeadline: "2026-02-02T23:59:59.000Z",
            eventImage: "LFR_Competition_contest1.jpeg",
            audience: "75",
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
                options: "Computer Science, Electrical & Electronic Engineering, Mechanical Engineering, Mechatronics Engineering, Robotics Engineering"
            },
            // Event-specific fields for LFR Workshop
            {
                fieldName: "arduinoExperience",
                label: "Arduino Programming Experience",
                fieldType: "options",
                isRequired: true,
                options: "Never Used, Beginner, Intermediate, Advanced"
            },
            {
                fieldName: "participationType",
                label: "Participation Type",
                fieldType: "options",
                isRequired: true,
                options: "Individual, Team of 2, Team of 3"
            },
            {
                fieldName: "teamMemberNames",
                label: "Team Member Names (if team)",
                fieldType: "text",
                isRequired: false,
                options: null
            },
            {
                fieldName: "email",
                label: "Email Address",
                fieldType: "email",
                isRequired: true,
                options: null
            },
            {
                fieldName: "ownComponents",
                label: "Do you have your own Arduino/sensors?",
                fieldType: "options",
                isRequired: true,
                options: "Yes - Complete Kit, Yes - Partial Kit, No - Need Everything"
            },
            {
                fieldName: "previousRoboticsProject",
                label: "Previous Robotics Project (Optional)",
                fieldType: "text",
                isRequired: false,
                options: null
            }
        ]
    }
];

const seed = async () => {
    console.log('🌱 Starting database seed for Workshop Events...\n');

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
            console.log(`   💰 Price: ৳${event.price}`);
            console.log(`   👥 Capacity: ${event.capacity}`);
            console.log(`   📝 Form fields: ${event.formFields.length}`);
            console.log('');

        } catch (error) {
            console.error(`❌ Error seeding event: ${rawData.eventData[0].eventTitle}`);
            console.error(error);
            console.log('');
        }
    }

    console.log(`\n🎉 Database seed finished! Created ${rawSeedData.length} workshop event(s).`);
}

seed()
    .catch((e) => {
        console.error('Fatal error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });