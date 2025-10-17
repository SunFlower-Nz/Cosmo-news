import { PrismaClient } from "@prisma/client";

function getDatabaseUrl() {
  // O Prisma falha com a porta 6543, então forçamos a leitura manual
  const url = process.env.DATABASE_URL!;
  // substitui "6543" por "5432" apenas para o parser não quebrar
  return url.replace(":6543", ":5432");
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  log: ["query", "info", "warn", "error"],
});
