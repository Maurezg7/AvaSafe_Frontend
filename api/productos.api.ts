import apiClient from "./client";

export const productosAPI = {
  get: <T>(url: string) => apiClient.get<T>(`/productos${url}`),
  post: <T>(url: string, body?: unknown) => apiClient.post<T>(`/productos${url}`, body),
  patch: <T>(url: string, body?: unknown) => apiClient.patch<T>(`/productos${url}`, body),
  delete: <T>(url: string) => apiClient.delete<T>(`/productos${url}`),
};
