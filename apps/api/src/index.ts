import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { PrismaClient } from "@prisma/client";

import { feedRoutes } from "./routes/feed"; // 👈 importa o novo endpoint

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// 🛡️ middlewares
await app.register(cors, { origin: "*" });
await app.register(helmet);

// 🩺 rota básica de health check
app.get("/health", async () => {
  return { status: "ok", time: new Date().toISOString() };
});

// 🧠 rota para verificar conexão com o banco
app.get("/db-check", async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "connected" };
  } catch (err) {
    return { status: "error", message: String(err) };
  }
});

// 📰 registra o módulo de rotas de feed
app.register(feedRoutes);

// 🚀 inicia o servidor
const start = async () => {
  try {
    await app.listen({ port: 8080, host: "0.0.0.0" });
    console.log("✅ Server running at http://localhost:8080");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();