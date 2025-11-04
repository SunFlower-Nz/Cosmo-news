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
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const source of sources) {
    console.log(`🛰️ Fetching from ${source.name}...`);

    try {
      const feed = await parser.parseURL(source.baseUrl);
      let newArticles = 0;
      let skippedArticles = 0;

      // Processa até 20 artigos mais recentes
      for (const item of feed.items.slice(0, 20)) {
        // Valida se tem link
        if (!item.link) {
          console.log(`⚠️ Skipping article without link from ${source.name}`);
          continue;
        }

        try {
          // Verifica se o artigo já existe no banco pelo URL
          const existing = await prisma.article.findUnique({
            where: { url: item.link },
          });
          
          if (existing) {
            console.log(`ℹ️ Article already exists: ${item.title?.substring(0, 50)}...`);
            skippedArticles++;
            totalSkipped++;
            continue;
          }

          // Cria novo artigo se não existir
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
          
          console.log(`✨ New article added: ${item.title?.substring(0, 50)}...`);
          newArticles++;
          totalNew++;
        } catch (itemErr) {
          console.error(`❌ Error processing article "${item.title}":`, itemErr);
          totalErrors++;
        }
      }

      console.log(`✅ ${source.name}: ${newArticles} new, ${skippedArticles} skipped`);
    } catch (err) {
      console.error(`❌ Error fetching ${source.name}:`, err);
      totalErrors++;
    }
  }

  console.log(`\n🎉 Ingestion Summary:`);
  console.log(`   ✨ New articles: ${totalNew}`);
  console.log(`   ℹ️ Skipped (already exist): ${totalSkipped}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  
  return { totalNew, totalSkipped, totalErrors };
}