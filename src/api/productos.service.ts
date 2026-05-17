import apiClient from "../../api/client";
import type { ProductoInterface } from "../interfaces/producto.interface";

export type Producto = ProductoInterface;

export interface CreateProductoPayload {
  name: string;
  price: number;
  image_url?: string;
}

export const productosService = {
  findAll: () => apiClient.get<Producto[]>("/productos"),
  findByUser: (userAddress: string) =>
    apiClient.get<Producto[]>(`/productos/user/${userAddress}`),
  findOne: (id_product: string) =>
    apiClient.get<Producto>(`/productos/${id_product}`),
  create: (payload: CreateProductoPayload) =>
    apiClient.post<Producto>("/productos", payload),
  update: (id_product: string, ownerAddress: string, payload: Partial<CreateProductoPayload>) =>
    apiClient.patch<Producto>(`/productos/${id_product}/${ownerAddress}`, payload),
  remove: (id_product: string, ownerAddress: string) =>
    apiClient.delete(`/productos/${id_product}/${ownerAddress}`),
};
