import cron from "node-cron";
import { ingestRSS } from "./rssIngestor.js";

console.log("🚀 Cosmo Worker started");
console.log("🔄 Running initial ingestion...");

// Executa imediatamente ao iniciar
(async () => {
  await ingestRSS();
  console.log("🔄 Scheduled to run every 5 minutes...");
  
  // Agenda para rodar a cada 5 minutos
  cron.schedule("*/5 * * * *", async () => {
    console.log("🕒 Running RSS ingestion...");
    await ingestRSS();
  });
})();