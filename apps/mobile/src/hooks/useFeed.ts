import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      console.log("🔍 Chamando API...");
      const { data } = await api.get("/v1/feed", {
        params: { page: 1, limit: 20 }
      });
      // Backend retorna { data: Article[], pagination: {...} }
      console.log("✅ Recebido:", data?.data?.length || 0, "notícias");
      return data?.data ?? [];
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};