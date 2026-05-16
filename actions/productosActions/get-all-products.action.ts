import { productosAPI } from "../../api/productos.api"



export const getAllProductsAction=async()=>{
    const {data}=await productosAPI.get("/")
    return data
}