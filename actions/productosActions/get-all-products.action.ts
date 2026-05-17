import { productosAPI } from "../../api/productos.api";
import type { ProductoInterface } from "../../src/interfaces/producto.interface";

export const getAllProductsAction = async (): Promise<ProductoInterface[]> => {
  const { data } = await productosAPI.get<ProductoInterface[]>("/");
  return data;
};