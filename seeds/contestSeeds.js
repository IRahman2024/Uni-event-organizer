import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Raw contest events
 */
const rawEvents = [
  {
    eventTitle: "Oxford Compsoc Competitive Programming Contest",
    description: "Competitive programming contest for university students across Bangladesh.",
    location: "Sylhet Engineering College",
    eventType: "contest and competitions",
    capacity: 200,
    price: 300.0,
    eventDate: "2026-02-12T09:00:00.000Z",
    eventDeadline: "2026-02-05T23:59:59.000Z",
    eventImage:
      "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMULaC7ljQ0JfViGowgeR2qlhNpZySH3QOPCUKT",
    audience: 190,
    status: "upcoming",
  },
  {
    eventTitle: "Inter University Competitive Programming Contest",
    description:
      "Algorithmic problem solving contest focusing on data structures and logic building.",
    location: "Sec ACM Lab ,SEC, Sylhet",
    eventType: "contest and competitions",
    capacity: 180,
    price: 300.0,
    eventDate: "2026-02-18T10:00:00.000Z",
    eventDeadline: "2026-02-10T23:59:59.000Z",
    eventImage:
      "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUY5PwywhuLdgqZbyfBY7mM0Opo1a5wQxl6nR3",
    audience: 170,
    status: "upcoming",
  },
  {
    eventTitle: "University Programming Contest",
    description: "Intra-university programming contest for CSE students.",
    location: "CUET, Chittagong",
    eventType: "contest and competitions",
    capacity: 160,
    price: 250.0,
    eventDate: "2026-03-05T09:00:00.000Z",
    eventDeadline: "2026-02-25T23:59:59.000Z",
    eventImage:
      "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUVjQJCxPTxwU5vJReags0DPuYZSHO2r8AqL1F",
    audience: 150,
    status: "upcoming",
  },
  {
    eventTitle: "Idea Presentation Competition By Sec Carrer Club",
    description: "Students present innovative startup and project ideas.",
    location: "Sylhet Engineering College, Dhaka",
    eventType: "contest and competitions",
    capacity: 120,
    price: 250.0,
    eventDate: "2026-03-12T10:00:00.000Z",
    eventDeadline: "2026-03-02T23:59:59.000Z",
    eventImage:
      "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUWqf2bCIMpcoRLFSVXbZyBveQJm1DrUgEIzxa",
    audience: 110,
    status: "upcoming",
  },
  {
    eventTitle: "Intra Campus Line Follower Robot Competition",
    description: "Autonomous robot competition following a predefined track.",
    location: "Sylhet Engineering College, Sylhet",
    eventType: "contest and competitions",
    capacity: 150,
    price: 500.0,
    eventDate: "2026-03-20T10:00:00.000Z",
    eventDeadline: "2026-03-10T23:59:59.000Z",
    eventImage:
      "https://1xdb815ool.ufs.sh/f/OoZvBo1YtVMUiDnGU6VyDfEUc7IO6H843FtrkMWKP9RbAQLN",
    audience: 140,
    status: "upcoming",
  },
];

/**
 * Base fields (same for all events)
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
 * Contest-specific fields
 */
function getEventSpecificFields(eventTitle) {
  if (eventTitle.includes("Programming")) {
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
    ];
  }

  if (eventTitle.includes("Idea")) {
    return [
      {
        fieldName: "ideaCategory",
        label: "Idea Category",
        fieldType: "option",
        isRequired: true,
        options: "Tech,Education,Health,Environment,Business",
      },
      {
        fieldName: "teamMembers",
        label: "Number of Team Members",
        fieldType: "number",
        isRequired: false,
      },
    ];
  }

  if (eventTitle.includes("Robot")) {
    return [
      {
        fieldName: "robotType",
        label: "Robot Type",
        fieldType: "option",
        isRequired: true,
        options: "LineFollower,AdvancedLineFollower",
      },
      {
        fieldName: "controllerUsed",
        label: "Controller Used",
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
  console.log("🌱 Seeding contest & competition events...\n");

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
        `❌ Failed for event: ${event.eventTitle}`,
        error.message
      );
    }
  }

  console.log("\n🌱 Contest seeding complete.");
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
