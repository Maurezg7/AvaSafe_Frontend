import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ExplorerPage from "./pages/ExplorerPage";
import OffersPage from "./pages/OffersPage";
import ComprasPage from "./pages/ComprasPage";
import MensajesPage from "./pages/MensajesPage";
import FavoritosPage from "./pages/FavoritosPage";
import DisputasPage from "./pages/DisputasPage";
import ReputacionPage from "./pages/ReputacionPage";
import SoportePage from "./pages/SoportePage";
import Configuracion from "./pages/ConfiguracionPage";
import VenderPage from "./pages/VenderPage";
import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OfertaPage from "./pages/OfertaPage";
import { clearSession } from "./lib/session";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("avasafe_token")));
  const navigate = useNavigate();

  const onLogin = () => navigate("/login");

  const onLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const onAuthSuccess = () => {
    setIsLoggedIn(true);
    navigate("/");
  };

  const routeProps = { isLoggedIn, onLogin, onLogout };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onAuthSuccess={onAuthSuccess} />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<ExplorerPage {...routeProps} />} />
        <Route path="vender" element={<VenderPage {...routeProps} />} />
        <Route path="oferta/:id" element={<OfertaPage {...routeProps} />} />
        <Route path="ofertas/:id" element={<OfertaPage {...routeProps} />} />
        <Route path="ofertas" element={<OffersPage {...routeProps} />} />
        <Route path="compras" element={<ComprasPage {...routeProps} />} />
        <Route path="mensajes" element={<MensajesPage {...routeProps} />} />
        <Route path="favoritos" element={<FavoritosPage {...routeProps} />} />
        <Route path="disputas" element={<DisputasPage {...routeProps} />} />
        <Route path="reputacion" element={<ReputacionPage {...routeProps} />} />
        <Route path="soporte" element={<SoportePage {...routeProps} />} />
        <Route path="configuracion" element={<Configuracion {...routeProps} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
