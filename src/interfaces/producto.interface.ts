export interface ProductoInterface {
  id_product: string;
  name: string;
  seller: string;
  nro_pedido?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  location?: string;
  price: number;
  create: Date;
  image_url?: string;
}
