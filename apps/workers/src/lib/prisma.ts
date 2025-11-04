import { PrismaClient } from "@prisma/client";

// Força o uso da DATABASE_URL do .env
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL not found in environment variables");
}

console.log(`🔌 Connecting to: ${databaseUrl.replace(/:([^:@]+)@/, ':****@')}`);

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
