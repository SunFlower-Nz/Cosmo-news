import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.102:8080", // 👈 mesmo IP que funcionou no navegador
});