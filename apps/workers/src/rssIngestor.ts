import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const parser = new Parser();

export async function ingestRSS() {
  const sources = await prisma.source.findMany({
    where: { enabled: true },
  });

  for (const source of sources) {
    console.log(`🛰️ Fetching from ${source.name}...`);

    try {
      const feed = await parser.parseURL(source.baseUrl);
      for (const item of feed.items.slice(0, 20)) {
        const existing = await prisma.article.findFirst({
          where: { url: item.link || "" },
        });
        if (existing) continue;

        await prisma.article.create({
          data: {
            title: item.title || "Untitled",
            description: item.contentSnippet || "",
            contentText: item.content || "",
            url: item.link || "",
            imageUrl: item.enclosure?.url || "",
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
            country: source.country,
            language: source.language,
            score: 0,
            source: { connect: { id: source.id } },
          },
        });
      }

      console.log(`✅ ${source.name} updated!`);
    } catch (err) {
      console.error(`❌ Error fetching ${source.name}:`, err);
    }
  }

  await prisma.$disconnect();
}