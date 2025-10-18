import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: "general", name: "General" },
    { slug: "technology", name: "Technology" },
    { slug: "sports", name: "Sports" },
    { slug: "health", name: "Health" },
    { slug: "science", name: "Science" },
    { slug: "entertainment", name: "Entertainment" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const sources = [
    {
      name: "BBC News",
      country: "GB",
      language: "en",
      baseUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      type: "rss",
    },
    {
      name: "G1",
      country: "BR",
      language: "pt",
      baseUrl: "https://g1.globo.com/rss/g1/",
      type: "rss",
    },
  ];

  for (const source of sources) {
    await prisma.source.upsert({
      where: { baseUrl: source.baseUrl },
      update: {},
      create: source,
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
