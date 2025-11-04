import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function sourcesRoutes(app: FastifyInstance) {
  // GET /v1/sources - Lista todas as fontes RSS
  app.get("/v1/sources", async (req, reply) => {
    const { enabled } = req.query as {
      enabled?: string;
    };

    const where: any = {};

    if (enabled !== undefined) {
      where.enabled = enabled === "true";
    }

    const sources = await prisma.source.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        country: true,
        language: true,
        baseUrl: true,
        type: true,
        enabled: true,
        _count: {
          select: { articles: true }
        }
      }
    });

    return reply.send({
      data: sources.map(s => ({
        id: s.id,
        name: s.name,
        country: s.country,
        language: s.language,
        baseUrl: s.baseUrl,
        type: s.type,
        enabled: s.enabled,
        articlesCount: s._count.articles
      })),
      total: sources.length
    });
  });

  // GET /v1/sources/:id - Busca uma fonte específica
  app.get("/v1/sources/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const source = await prisma.source.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!source) {
      return reply.status(404).send({
        error: "Source not found"
      });
    }

    return reply.send({
      data: {
        id: source.id,
        name: source.name,
        country: source.country,
        language: source.language,
        baseUrl: source.baseUrl,
        type: source.type,
        enabled: source.enabled,
        articlesCount: source._count.articles
      }
    });
  });

  // POST /v1/sources - Adiciona uma nova fonte RSS
  app.post("/v1/sources", async (req, reply) => {
    const { name, country, language, baseUrl, type = "rss", enabled = true } = req.body as {
      name: string;
      country: string;
      language: string;
      baseUrl: string;
      type?: string;
      enabled?: boolean;
    };

    // Validações básicas
    if (!name || !country || !language || !baseUrl) {
      return reply.status(400).send({
        error: "Missing required fields: name, country, language, baseUrl"
      });
    }

    // Verifica se a URL já existe
    const existing = await prisma.source.findUnique({
      where: { baseUrl }
    });

    if (existing) {
      return reply.status(409).send({
        error: "A source with this baseUrl already exists",
        existingSource: {
          id: existing.id,
          name: existing.name
        }
      });
    }

    try {
      const newSource = await prisma.source.create({
        data: {
          name,
          country,
          language,
          baseUrl,
          type,
          enabled
        }
      });

      return reply.status(201).send({
        message: "Source created successfully",
        data: newSource
      });
    } catch (error) {
      return reply.status(500).send({
        error: "Failed to create source",
        message: String(error)
      });
    }
  });

  // PATCH /v1/sources/:id - Atualiza uma fonte (ex: habilitar/desabilitar)
  app.patch("/v1/sources/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const { name, country, language, baseUrl, enabled } = req.body as {
      name?: string;
      country?: string;
      language?: string;
      baseUrl?: string;
      enabled?: boolean;
    };

    const source = await prisma.source.findUnique({
      where: { id }
    });

    if (!source) {
      return reply.status(404).send({
        error: "Source not found"
      });
    }

    // Se tentou mudar a baseUrl, verifica se não conflita
    if (baseUrl && baseUrl !== source.baseUrl) {
      const existing = await prisma.source.findUnique({
        where: { baseUrl }
      });

      if (existing) {
        return reply.status(409).send({
          error: "Another source with this baseUrl already exists"
        });
      }
    }

    try {
      const updated = await prisma.source.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(country && { country }),
          ...(language && { language }),
          ...(baseUrl && { baseUrl }),
          ...(enabled !== undefined && { enabled })
        }
      });

      return reply.send({
        message: "Source updated successfully",
        data: updated
      });
    } catch (error) {
      return reply.status(500).send({
        error: "Failed to update source",
        message: String(error)
      });
    }
  });

  // DELETE /v1/sources/:id - Remove uma fonte (cuidado: remove artigos também se houver CASCADE)
  app.delete("/v1/sources/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const source = await prisma.source.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!source) {
      return reply.status(404).send({
        error: "Source not found"
      });
    }

    // Aviso se há artigos associados
    if (source._count.articles > 0) {
      return reply.status(400).send({
        error: "Cannot delete source with existing articles",
        articlesCount: source._count.articles,
        hint: "Set enabled=false instead or delete articles first"
      });
    }

    try {
      await prisma.source.delete({
        where: { id }
      });

      return reply.send({
        message: "Source deleted successfully"
      });
    } catch (error) {
      return reply.status(500).send({
        error: "Failed to delete source",
        message: String(error)
      });
    }
  });
}
