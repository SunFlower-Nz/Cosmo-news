import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function feedRoutes(app: FastifyInstance) {
  app.get("/v1/feed", async (req, reply) => {
    const { search, category, limit = "20", page = "1" } = req.query as {
      search?: string;
      category?: string;
      limit?: string;
      page?: string;
    };

    const take = Math.min(parseInt(limit) || 20, 100); // máximo 100 itens
    const skip = (parseInt(page) - 1) * take;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }

    const [feed, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take,
        skip,
        include: {
          source: {
            select: {
              id: true,
              name: true,
              country: true,
              language: true
            }
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  slug: true,
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.article.count({ where })
    ]);

    return reply.send({
      data: feed,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  });
}