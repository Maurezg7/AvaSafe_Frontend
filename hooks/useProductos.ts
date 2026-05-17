import { useQuery } from "@tanstack/react-query"
import { getAllProductsAction } from "../actions/productosActions/get-all-products.action"
import type { ProductoInterface } from '../src/interfaces/producto.interface';
import { getProductById } from '../actions/productosActions/get-product-by-id.action';


export const useProduct=(product_id?:string)=>{
    const queryProductos=useQuery<ProductoInterface[]>({
        queryKey:["productos"],
        queryFn:getAllProductsAction,
        retry:false,
        staleTime:1000*60*60
    })

    const queryProductById=useQuery<ProductoInterface>({
        queryKey:["producto",product_id],
        queryFn:()=>getProductById(product_id),
        enabled: !!product_id, // ✅ no ejecuta la query si product_id es undefined


    })
    return{
        queryProductos,
        queryProductById
    }
}