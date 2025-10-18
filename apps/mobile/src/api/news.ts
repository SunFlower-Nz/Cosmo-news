import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
});

export const getNews = async () => {
  const { data } = await api.get("/v1/feed?page=1&pageSize=10");
  return data;
};
