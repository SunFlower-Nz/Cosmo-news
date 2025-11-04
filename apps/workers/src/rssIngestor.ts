import { createRequire } from "module";
import { PrismaClient } from "@prisma/client";

const _require = createRequire(import.meta.url);
const RSSParser = _require("rss-parser");

const prisma = new PrismaClient();
const parser = new RSSParser();

export async function ingestRSS() {
  const sources = await prisma.source.findMany({
    where: { enabled: true },
  });

  console.log(`📡 Checking ${sources.length} sources...`);
  let totalNew = 0;

  for (const source of sources) {
    console.log(`🛰️ Fetching from ${source.name}...`);

    try {
      const feed = await parser.parseURL(source.baseUrl);
      let newArticles = 0;

      for (const item of feed.items.slice(0, 20)) {
        if (!item.link) continue;

        const existing = await prisma.article.findUnique({
          where: { url: item.link },
        });
        
        if (existing) continue;

        await prisma.article.create({
          data: {
            title: item.title || "Untitled",
            description: item.contentSnippet || "",
            contentText: item.content || "",
            url: item.link,
            imageUrl: item.enclosure?.url || "",
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
            country: source.country,
            language: source.language,
            score: 0,
            source: { connect: { id: source.id } },
          },
        });
        
        newArticles++;
        totalNew++;
      }

      console.log(`✅ ${source.name}: ${newArticles} new articles`);
    } catch (err) {
      console.error(`❌ Error fetching ${source.name}:`, err);
    }
  }

  console.log(`🎉 Total: ${totalNew} new articles added!`);
}