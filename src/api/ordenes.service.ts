import api from "./axios";

export type OrderState = "escrow" | "proceso" | "cancelado" | "completado";

export interface CreateOrdenDto {
  buyer: string;
  seller: string;
  nro_pedido: string;
  state?: OrderState;
}

export interface UpdateOrdeneDto {
  buyer?: string;
  seller?: string;
  nro_pedido?: string;
  state?: OrderState;
}

export interface Orden {
  id_order: string;
  buyer: string;
  seller: string;
  date_order: string;
  nro_pedido: string;
  state: OrderState;
  amountAvax?: number;
}

export const ordenesService = {
  create: (data: CreateOrdenDto) => api.post<Orden>("/ordenes", data),
  findAll: () => api.get<Orden[]>("/ordenes"),
  findByBuyer: (address: string) => api.get<Orden[]>(`/ordenes/buyer/${address}`),
  findBySeller: (address: string) => api.get<Orden[]>(`/ordenes/seller/${address}`),
  findOne: (id: string) => api.get<Orden>(`/ordenes/${id}`),
  update: (id: string, data: UpdateOrdeneDto) =>
    api.patch<Orden>(`/ordenes/${id}`, data),
  remove: (id: string) => api.delete(`/ordenes/${id}`),
};
