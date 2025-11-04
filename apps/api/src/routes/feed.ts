import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function feedRoutes(app: FastifyInstance) {
  // GET /v1/feed - Lista artigos do feed
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

  // POST /v1/feed/refresh - Força atualização do feed
  app.post("/v1/feed/refresh", async (req, reply) => {
    try {
      const sources = await prisma.source.findMany({
        where: { enabled: true },
      });

      if (sources.length === 0) {
        return reply.status(404).send({
          error: "No active sources found"
        });
      }

      return reply.send({
        message: "Feed refresh endpoint available",
        sources: sources.length,
        note: "The worker service handles automatic feed updates every 5 minutes. To force an update, restart the worker service."
      });
      
    } catch (error) {
      return reply.status(500).send({
        error: "Failed to check feed status",
        message: String(error)
      });
    }
  });

  // GET /v1/feed/stats - Estatísticas do feed
  app.get("/v1/feed/stats", async (req, reply) => {
    try {
      const [totalArticles, totalSources, recentArticles] = await Promise.all([
        prisma.article.count(),
        prisma.source.count({ where: { enabled: true } }),
        prisma.article.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
            }
          }
        })
      ]);

      const sourceStats = await prisma.source.findMany({
        where: { enabled: true },
        select: {
          id: true,
          name: true,
          _count: {
            select: { articles: true }
          }
        }
      });

      return reply.send({
        totalArticles,
        totalSources,
        recentArticles,
        sourceStats: sourceStats.map(s => ({
          name: s.name,
          articles: s._count.articles
        }))
      });
    } catch (error) {
      return reply.status(500).send({
        error: "Failed to get feed stats",
        message: String(error)
      });
    }
  });
}