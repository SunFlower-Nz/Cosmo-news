import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      console.log("🔍 Chamando API...");
      // Removendo query parameters ou ajustando para o formato correto
      const { data } = await api.get("/v1/feed");
      console.log("✅ Recebido:", data?.length || 0, "notícias");
      return data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};