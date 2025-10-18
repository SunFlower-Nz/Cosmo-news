import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const feedRoutes: FastifyPluginAsync = async (app) => {
  app.get("/v1/feed", async (request, reply) => {
    try {
      const { page = 1, pageSize = 10, country, category } = request.query as {
        page?: number;
        pageSize?: number;
        country?: string;
        category?: string;
      };

      const skip = (Number(page) - 1) * Number(pageSize);

      const where: any = {};

      if (country) where.country = country.toUpperCase();

      if (category) {
        where.categories = {
          some: {
            category: { slug: category.toLowerCase() },
          },
        };
      }

      const articles = await prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: Number(pageSize),
        include: {
          source: { select: { name: true, country: true } },
        },
      });

      return reply.send(articles);
    } catch (error) {
      console.error("❌ Error fetching feed:", error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
};