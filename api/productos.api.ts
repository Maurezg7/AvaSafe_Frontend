import axios from 'axios';

const API_URL=import.meta.env.VITE_API_URL
console.log(import.meta.env.VITE_API_URL) // ¿Imprime la URL o undefined?
console.log(import.meta.env)

export const productosAPI=axios.create({
    baseURL:`${API_URL}/productos`
})

productosAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("avasafe_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
