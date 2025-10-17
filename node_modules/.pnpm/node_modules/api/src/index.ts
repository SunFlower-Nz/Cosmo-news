import Fastify from "fastify";
import { prisma } from "./lib/prisma";

const app = Fastify({ logger: true });

// rota de teste da conexão com o banco
app.get("/db-check", async () => {
  const sources = await prisma.source.findMany();
  return {
    message: "Database connected successfully!",
    sourcesCount: sources.length,
  };
});

// rota padrão de status
app.get("/health", async () => {
  return { status: "ok", time: new Date().toISOString() };
});

const start = async () => {
  try {
    await app.listen({ port: 8080, host: "0.0.0.0" });
    console.log("🚀 Cosmo API running at http://localhost:8080");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();