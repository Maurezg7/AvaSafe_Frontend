export interface ProductoInterface {
    id_product: string;
    name:       string;
    seller:     string;
    nro_pedido: string;
    price:      string;
    create:     Date;
    image_url?:  string;
}
