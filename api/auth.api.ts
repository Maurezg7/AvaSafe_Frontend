import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const authAPI = axios.create({
  baseURL: `${API_URL}/usuarios`,
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("avasafe_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
