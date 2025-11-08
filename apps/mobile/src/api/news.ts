import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API || "http://localhost:8080",
});

export const getNews = async () => {
  const { data } = await api.get("/v1/feed", {
    params: { page: 1, limit: 10 }
  });
  // Backend retorna { data: Article[], pagination: {...} }
  return data?.data ?? [];
};
