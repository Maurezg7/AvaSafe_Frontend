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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const onLogin = () => navigate("/login");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<ExplorerPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="ofertas" element={<OffersPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="compras" element={<ComprasPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="mensajes" element={<MensajesPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="favoritos" element={<FavoritosPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="disputas" element={<DisputasPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="reputacion" element={<ReputacionPage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="soporte" element={<SoportePage isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
        <Route path="configuracion" element={<Configuracion isLoggedIn={isLoggedIn} onLogin={onLogin} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
