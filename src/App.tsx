import { useState } from "react";
import Nav from "./components/Nav";
import ExplorerPage from "./pages/ExplorerPage";
import OffersPage from "./pages/OffersPage";
import ComprasPage from "./pages/ComprasPage";
import MensajesPage from "./pages/MensajesPage";
import FavoritosPage from "./pages/FavoritosPage";
import DisputasPage from "./pages/DisputasPage";
import ReputacionPage from "./pages/ReputacionPage";
import SoportePage from "./pages/SoportePage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [page, setPage] = useState("explorer");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "auth": return <AuthPage />;
      case "explorer": return <ExplorerPage />;
      case "offers": return <OffersPage />;
      case "compras": return <ComprasPage />;
      case "mensajes": return <MensajesPage />;
      case "favoritos": return <FavoritosPage />;
      case "disputas": return <DisputasPage />;
      case "reputacion": return <ReputacionPage />;
      case "soporte": return <SoportePage />;
      case "configuracion": return <ConfiguracionPage />;
      default: return <ExplorerPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-white">
      <Nav
        activePage={page}
        onNavigate={setPage}
        isLoggedIn={isLoggedIn}
        onLogin={() => setPage("auth")}
      />
      {renderPage()}
    </div>
  );
}