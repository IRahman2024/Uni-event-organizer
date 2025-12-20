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

// --- Conference Events Seed Data ---
const rawSeedData = [
    // 💾 Genesis AI & Innovation Conference
    {
        eventData: [{
            eventTitle: "Genesis AI & Innovation Conference",
            description: "A national conference focusing on AI, machine learning, and future technologies.",
            location: "International Convention City Bashundhara, Dhaka",
            eventType: "conference",
            capacity: "800",
            price: "1500.00",
            eventDate: "2026-02-15T10:00:00.000Z",
            eventDeadline: "2026-02-05T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMU1Q4Qt4NRxwD9aqiYMKOTcAVSheWZd156P4nC",
            audience: "760",
            status: "upcoming"
        }],
        fields: [
            {
                fieldName: "aiResearchArea",
                label: "AI Research Area of Interest",
                fieldType: "select",
                isRequired: true,
                options: "Natural Language Processing, Computer Vision, Machine Learning, Deep Learning, Robotics, Neural Networks"
            }
        ]
    },

    // 💾 Annual Engineering Conference 2026
    {
        eventData: [{
            eventTitle: "Annual Engineering Conference 2026",
            description: "Active Environmental Technology conference for the ultimate solution of power ,water & industrial work.",
            location: "BUET Auditorium, Dhaka",
            eventType: "conference",
            capacity: "600",
            price: "1200.00",
            eventDate: "2026-03-10T09:30:00.000Z",
            eventDeadline: "2026-02-28T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMU7yMcnV1t5mgowECqS0lvDbxJYyfHs4kzcUtO",
            audience: "580",
            status: "upcoming"
        }],
        fields: [
            {
                fieldName: "engineeringDiscipline",
                label: "Engineering Discipline",
                fieldType: "select",
                isRequired: true,
                options: "Environmental Engineering, Power Engineering, Water Resources Engineering, Industrial Engineering, Civil Engineering, Mechanical Engineering"
            }
        ]
    },

    // 💾 Tech Innovation Conference
    {
        eventData: [{
            eventTitle: "Tech Innovation Conference",
            description: "Conference highlighting modern tech innovation and research.",
            location: "Sylhet Engineering College, Dhaka",
            eventType: "conference",
            capacity: "700",
            price: "1800.00",
            eventDate: "2026-04-05T10:00:00.000Z",
            eventDeadline: "2026-03-25T23:59:59.000Z",
            eventImage: "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUJ4J2DESoTVesAxl67r0BDgGU4Wn15jv3SQZH",
            audience: "650",
            status: "upcoming"
        }],
        fields: [
            {
                fieldName: "innovationCategory",
                label: "Technology Innovation Category",
                fieldType: "select",
                isRequired: true,
                options: "Software Development, Hardware Innovation, IoT Solutions, Blockchain Technology, Cloud Computing, Cybersecurity"
            }
        ]
    }
];

const seed = async () => {
    console.log('🌱 Starting database seed...\n');

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
            console.log(`   📝 Form fields: ${event.formFields.length}`);
            console.log('');

        } catch (error) {
            console.error(`❌ Error seeding event: ${rawData.eventData[0].eventTitle}`);
            console.error(error);
            console.log('');
        }
    }

    console.log(`\n🎉 Database seed finished! Created ${rawSeedData.length} conference events.`);
}

seed()
    .catch((e) => {
        console.error('Fatal error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });