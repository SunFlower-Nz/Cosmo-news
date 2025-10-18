import cron from "node-cron";
import { ingestRSS } from "./rssIngestor";

console.log("🚀 Cosmo Worker started");
console.log("🔄 Running every 5 minutes...");

cron.schedule("*/5 * * * *", async () => {
  console.log("🕒 Running RSS ingestion...");
  await ingestRSS();
});