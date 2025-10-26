import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

/** @type {PrismaClient} */ // this is for IDE autocompletion
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'], // Add logging to debug
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}