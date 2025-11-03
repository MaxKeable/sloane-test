import { PrismaClient } from "@prisma/client";

// Use console.log here since this file is loaded before logger is initialized
console.log("Initializing Prisma Client...");

const prisma = new PrismaClient({
  log: [
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
    { level: "query", emit: "event" },
  ],
});

// Log Prisma events - these will be set up but actual logging happens after logger is initialized
prisma.$on("error", (e: any) => {
  // Logger might not be available yet, use console
  console.error("Prisma error:", e);
});

prisma.$on("warn", (e: any) => {
  console.warn("Prisma warning:", e);
});

prisma.$on("info", (e: any) => {
  console.log("Prisma info:", e);
});

prisma.$on("query", (e: any) => {
  // Only log queries in development
  if (process.env.NODE_ENV === "development") {
    console.log(`Prisma query: ${e.query} (${e.duration}ms)`);
  }
});

console.log("✓ Prisma Client created");

export default prisma;
