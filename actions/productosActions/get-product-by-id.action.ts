import { productosAPI } from "../../api/productos.api";
import type { ProductoInterface } from "../../src/interfaces/producto.interface";

export const getProductById = async (product_id?: string): Promise<ProductoInterface> => {
  const { data } = await productosAPI.get<ProductoInterface>(`/${product_id}`);
  return data;
};