import { productosAPI } from "../../api/productos.api"

export const getProductById=async(product_id?:string)=>{
    const {data}=await productosAPI.get(`/${product_id}`)
    return data
}