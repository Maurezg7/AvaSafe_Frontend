import apiClient from "../../api/client";

export type OrderState = "escrow" | "proceso" | "cancelado" | "completado";

export interface CreateOrdenDto {
  buyer: string;
  seller: string;
  nro_pedido: string;
  state?: OrderState;
  tradeId?: string;
  fundTxHash?: string;
  escrowTxHash?: string;
  amountAvax?: number;
}

export interface UpdateOrdeneDto {
  buyer?: string;
  seller?: string;
  nro_pedido?: string;
  state?: OrderState;
  tradeId?: string;
  fundTxHash?: string;
  escrowTxHash?: string;
  amountAvax?: number;
}

export interface Orden {
  id_order: string;
  buyer: string;
  seller: string;
  date_order: string;
  nro_pedido: string;
  state: OrderState;
  tradeId?: string;
  fundTxHash?: string;
  escrowTxHash?: string;
  amountAvax?: number;
}

export const ordenesService = {
  create: (data: CreateOrdenDto) => apiClient.post<Orden>("/ordenes", data),
  findAll: () => apiClient.get<Orden[]>("/ordenes"),
  /** El backend expone GET /ordenes; filtramos por comprador en el cliente. */
  findByBuyer: async (address: string) => {
    const res = await apiClient.get<Orden[]>("/ordenes");
    const normalized = address.toLowerCase();
    return {
      ...res,
      data: res.data.filter((o) => o.buyer.toLowerCase() === normalized),
    };
  },
  findBySeller: async (address: string) => {
    const res = await apiClient.get<Orden[]>("/ordenes");
    const normalized = address.toLowerCase();
    return {
      ...res,
      data: res.data.filter((o) => o.seller.toLowerCase() === normalized),
    };
  },
  findOne: (id: string) => apiClient.get<Orden>(`/ordenes/${id}`),
  update: (id: string, data: UpdateOrdeneDto) =>
    apiClient.patch<Orden>(`/ordenes/${id}`, data),
  remove: (id: string) => apiClient.delete(`/ordenes/${id}`),
};
