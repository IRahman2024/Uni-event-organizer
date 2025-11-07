import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuration
const DEPARTMENTS = ["CSE", "EEE", "CE"];
const BATCHES = [15, 14, 16, 17]; // 2015, 2014, 2016, 2017
const STATUSES = ["active", "banned"];

// Realistic first & last names
const firstNames = [
  "Ayesha", "Fatima", "Rahim", "Karim", "Nabila", "Tanjim", "Sadia", "Rafi", "Zara", "Imran",
  "Nusrat", "Fahad", "Tanjila", "Arif", "Sumaiya", "Oishee", "Rashed", "Maliha", "Shadman", "Tasmia",
  "Rifat", "Nafisa", "Eshan", "Labiba", "Fardin", "Anika", "Zawad", "Sanjida", "Rayyan", "Mariam"
];

const lastNames = [
  "Rahman", "Khan", "Chowdhury", "Hossain", "Ahmed", "Islam", "Uddin", "Akter", "Hasan", "Begum",
  "Sarkar", "Mahmud", "Alam", "Karim", "Rahim", "Ferdous", "Siddique", "Haque", "Mia", "Jahan"
];

// Generate student ID: 2021331531 format
const generateStudentId = (batch) => {
  const yearPrefix = `202${batch.toString().padStart(2, "0")}`; // e.g., 202115
  const seq = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
  return `${yearPrefix}${seq}`;
};

// Random status: 80% active, 20% banned
const getRandomStatus = () => {
  return Math.random() < 0.8 ? "active" : "banned";
};

const generateStudents = () => {
  const students = [];
  const usedEmails = new Set();
  const usedStudentIds = new Set();

  while (students.length < 30) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const batch = BATCHES[Math.floor(Math.random() * BATCHES.length)];
    const status = getRandomStatus();

    // Unique studentId
    let studentId;
    do {
      studentId = generateStudentId(batch);
    } while (usedStudentIds.has(studentId));
    usedStudentIds.add(studentId);

    // Unique email
    let email;
    do {
      const suffix = Math.floor(Math.random() * 100);
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@student.example.edu.bd`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    students.push({
      name: fullName,
      email,
      batch,
      department: dept,
      studentId,
      status, // New field
      image: null,
    });
  }

  return students;
};

const seed = async () => {
  console.log("Starting to seed 30 students with status (active/banned)...");

  const students = generateStudents();

  let createdCount = 0;
  let bannedCount = 0;

  for (const student of students) {
    try {
      const created = await prisma.student.create({
        data: student,
      });
      console.log(`Created: ${created.name} (${created.studentId}) [${created.status.toUpperCase()}]`);
      createdCount++;
      if (created.status === "banned") bannedCount++;
    } catch (error) {
      if (error.code === "P2002") {
        console.warn(`Skipped duplicate: ${student.email} or ${student.studentId}`);
      } else {
        console.error(`Failed: ${student.name}`, error.message);
      }
    }
  }

  console.log(`Student seeding complete! Created: ${createdCount} | Banned: ${bannedCount}`);
};

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });