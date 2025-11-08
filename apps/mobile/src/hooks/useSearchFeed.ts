import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useSearchFeed = (search?: string, category?: string) => {
  return useQuery({
    queryKey: ["search", search ?? "", category ?? ""],
    queryFn: async () => {
      const params: Record<string, string | number> = { page: 1, limit: 50 };
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await api.get("/v1/feed", { params });
      // backend returns { data: Article[], pagination: {...} }
      return data.data ?? [];
    },
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });
};
