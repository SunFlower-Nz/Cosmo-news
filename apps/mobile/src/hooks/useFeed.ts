import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      console.log("🔍 Chamando API...");
      const { data } = await api.get("/v1/feed");
      console.log("✅ Recebido:", data.length, "notícias");
      return data;
    },
  });
};