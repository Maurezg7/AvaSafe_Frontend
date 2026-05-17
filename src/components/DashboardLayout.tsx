import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Nav from "./Nav";

const pageToPath: Record<string, string> = {
  explorer: "/",
  vender: "/vender",
  offers: "/ofertas",
  compras: "/compras",
  mensajes: "/mensajes",
  favoritos: "/favoritos",
  disputas: "/disputas",
  reputacion: "/reputacion",
  soporte: "/soporte",
  configuracion: "/configuracion",
};

const pathToPage: Record<string, string> = {
  "/": "explorer",
  "/vender": "vender",
  "/ofertas": "offers",
  "/compras": "compras",
  "/mensajes": "mensajes",
  "/favoritos": "favoritos",
  "/disputas": "disputas",
  "/reputacion": "reputacion",
  "/soporte": "soporte",
  "/configuracion": "configuracion",
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = pathToPage[location.pathname] || "explorer";
  const handleNavigate = (page: string) => {
    navigate(pageToPath[page] || "/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-white">
      <Nav activePage={activePage} onNavigate={handleNavigate} />
      <Outlet />
    </div>
  );
}
