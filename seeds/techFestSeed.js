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

// --- Tech Fest Events Seed Data ---
const rawSeedData = [
    // 💾 CSE Day 2026
    {
        eventData: [{
            eventTitle: "CSE Day 2026",
            description: "Annual CSE Day featuring tech events, contests, and cultural programs.",
            location: "Sylhet Engineering College",
            eventType: "tech fest",
            capacity: "600",
            price: "300.00",
            eventDate: "2026-03-22T10:00:00.000Z",
            eventDeadline: "2026-03-15T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUi5B166VyDfEUc7IO6H843FtrkMWKP9RbAQLN",
            audience: "560",
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
                options: "Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Software Engineering, Information Technology"
            },
            // Event-specific fields for CSE Day
            {
                fieldName: "participationCategory",
                label: "Participation Category",
                fieldType: "options",
                isRequired: true,
                options: "Programming Contest, Project Showcase, Gaming Tournament, Cultural Program, Workshop Attendee, General Visitor"
            },
            {
                fieldName: "teamSize",
                label: "Team Size (if participating in team event)",
                fieldType: "number",
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
                fieldName: "tshirtSize",
                label: "T-Shirt Size",
                fieldType: "options",
                isRequired: true,
                options: "S, M, L, XL, XXL"
            }
        ]
    },

    // 💾 CSE Day Tech Fest
    {
        eventData: [{
            eventTitle: "CSE Day Tech Fest",
            description: "Technology-focused fest organized by CSE department.",
            location: "Sylhet Engineering College, Sylhet",
            eventType: "tech fest",
            capacity: "500",
            price: "250.00",
            eventDate: "2026-03-23T10:00:00.000Z",
            eventDeadline: "2026-03-16T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMU1aCGzSNRxwD9aqiYMKOTcAVSheWZd156P4nC",
            audience: "470",
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
                options: "Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Software Engineering, Information Technology"
            },
            // Event-specific fields for Tech Fest
            {
                fieldName: "techEventInterest",
                label: "Tech Event Interest",
                fieldType: "options",
                isRequired: true,
                options: "Hackathon, AI/ML Workshop, IoT Demo, Robotics Competition, Web Development Contest, Tech Talk Sessions"
            },
            {
                fieldName: "programmingLanguage",
                label: "Primary Programming Language",
                fieldType: "options",
                isRequired: false,
                options: "Python, JavaScript, Java, C++, C, PHP, Others"
            },
            {
                fieldName: "email",
                label: "Email Address",
                fieldType: "email",
                isRequired: true,
                options: null
            },
            {
                fieldName: "experienceLevel",
                label: "Technical Experience Level",
                fieldType: "options",
                isRequired: true,
                options: "Beginner, Intermediate, Advanced, Expert"
            }
        ]
    },

    // 💾 EEE Day 2026
    {
        eventData: [{
            eventTitle: "EEE Day 2026",
            description: "Department of EEE annual tech fest and celebration.",
            location: "Sylhet Engineering College",
            eventType: "tech fest",
            capacity: "550",
            price: "300.00",
            eventDate: "2026-04-05T10:00:00.000Z",
            eventDeadline: "2026-03-28T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUt5t4adAsjnyvbrzYVL0DpoQNMBd6GITh8lam",
            audience: "520",
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
                options: "Electrical & Electronic Engineering, Computer Science, Mechanical Engineering, Civil Engineering, Electronics Engineering"
            },
            // Event-specific fields for EEE Day
            {
                fieldName: "eeeEventType",
                label: "EEE Event Participation",
                fieldType: "options",
                isRequired: true,
                options: "Circuit Design Contest, PCB Design Competition, Power Systems Workshop, Electronics Project Showcase, Robotics Competition, General Attendee"
            },
            {
                fieldName: "projectTitle",
                label: "Project Title (if showcasing)",
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
                fieldName: "tshirtSize",
                label: "T-Shirt Size",
                fieldType: "options",
                isRequired: true,
                options: "S, M, L, XL, XXL"
            }
        ]
    }
];

const seed = async () => {
    console.log('🌱 Starting database seed for Tech Fest Events...\n');

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
            console.log(`   📝 Form fields: ${event.formFields.length}`);
            console.log('');

        } catch (error) {
            console.error(`❌ Error seeding event: ${rawData.eventData[0].eventTitle}`);
            console.error(error);
            console.log('');
        }
    }

    console.log(`\n🎉 Database seed finished! Created ${rawSeedData.length} tech fest event(s).`);
}

seed()
    .catch((e) => {
        console.error('Fatal error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });