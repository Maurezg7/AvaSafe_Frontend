import { useState } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";

type Dispute = {
  id: number;
  status: "En disputa" | "En revisión" | "Resuelta" | "Cerrada";
  contractId: string;
  buyer: string;
  seller: string;
  amount: string;
  date: string;
  productImage: string;
  productName: string;
  price: string;
  usd: string;
  reason: string;
  progress: number;
  users: string[];
};

const disputes: Dispute[] = [
  {
    id: 1,
    status: "En disputa",
    contractId: "AV-2024-001",
    buyer: "AvaTrader",
    seller: "TechSeller",
    amount: "2.85 AVAX",
    date: "12/05/2024",
    productImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuABOYQ0Ho6iHKTUbl2XWdSt3biQb6FN27ZWN9OGa6mMK7dv15Zl93muCEz-5ZX9NO1Cfh5ZveLEBfZmYSSq2Y1ugZCY8cdh2Oy-dW0hKuVQdELQ99tMLiCdiittxp4P0njek5vLG2LvBhk9an6CNCjzB_OXtUWWt5V1tPILBVi__bAAOBueWu1v3oH8LVTRin-DyRMckQn-VHOe6swU2QnbzkgPhnVJ3i8f0h1a2dXsWXrg2h5XrPtkcjfSDT8hatxsNcr_E78_g0Iq",
    productName: 'MacBook Pro 16" M3 Max',
    price: "2.55 AVAX",
    usd: "$1,957.75 USD",
    reason: "Incumplimiento de contrato",
    progress: 3,
    users: ["https://i.pravatar.cc/100?u=avatrader", "https://i.pravatar.cc/100?u=techseller"],
  },
  {
    id: 2,
    status: "En revisión",
    contractId: "AV-2024-002",
    buyer: "CryptoGear",
    seller: "LuxTime",
    amount: "9.57 AVAX",
    date: "10/05/2024",
    productImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Bksx3KtVTnSUfL7L2ATzAExSa8RAMYtFcXnEOWnpFGBOycBnEDloiFXbj2S9FLvfVHiWzHqYJdkVvnUxGDEN0eZrJOW6psFuxuqBXnuyjRC_1LvFl6DWY79IbL_I1xSX20aeqCEuDJn94R5Ltk4zUVjPo1eJEE_CVfOhtpB9k7hUqu3YGrYIzO-tS3FbBrDH4SEx9obSZFfPkrue0XcZSeHJZgwcZ95DU9s0okjX1-W0guuuE-59cdbRb6Pxvs23xRz9mrCXAm9",
    productName: "iPhone 16 Pro Max",
    price: "0.53 AVAX",
    usd: "$410.25 USD",
    reason: "Producto diferente al descrito",
    progress: 1,
    users: ["https://i.pravatar.cc/100?u=cryptogear", "https://i.pravatar.cc/100?u=luxtime"],
  },
];

const statusStyles: Record<string, string> = {
  "En disputa": "bg-green-500/15 text-green-400",
  "En revisión": "bg-orange-500/15 text-orange-400",
  Resuelta: "bg-blue-500/15 text-blue-400",
  Cerrada: "bg-gray-500/15 text-gray-400",
};

export default function DisputasPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);

  function onLogout(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-end px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-6">
          <NotificationDropdown isOpen={notificationsOpen} onToggle={() => setNotificationsOpen(!notificationsOpen)} />

          <ShieldDropdown isOpen={shieldOpen} onToggle={() => setShieldOpen(!shieldOpen)} />

          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <section className="px-8 pt-8">
            <h1 className="text-4xl font-bold text-white mb-2">Disputas</h1>
            <p className="text-sm text-gray-400 mb-6">Gestiona y da seguimiento a tus disputas abiertas y resueltas.</p>

            <div className="flex items-center space-x-2 mt-6">
              {(["Abiertas (2)", "En Revisión", "Resueltas", "Cerradas"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    tab === "Abiertas (2)"
                      ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20"
                      : "bg-brand-sidebar text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar rounded-xl text-xs text-gray-400 hover:text-white transition-all ml-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Filtros</span>
              </button>
            </div>
          </section>

          <section className="px-8 pb-6 flex-1 space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5 hover:border-brand-purple/30 transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className={`text-[9px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${statusStyles[dispute.status]}`}>
                    {dispute.status}
                  </span>
                </div>

                <div className="flex items-start gap-6">
                  <div className="space-y-2 flex-shrink-0">
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">ID: </span>{dispute.contractId}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">Comprador: </span>{dispute.buyer}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">Vendedor: </span>{dispute.seller}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">Monto: </span>{dispute.amount}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">Fecha: </span>{dispute.date}
                    </div>
                  </div>

                  <div className="w-px h-24 bg-white/5 flex-shrink-0" />

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-brand-dark overflow-hidden flex items-center justify-center p-2">
                      <img src={dispute.productImage} alt={dispute.productName} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block max-w-[90px] truncate">{dispute.productName}</span>
                      <span className="text-sm font-bold text-brand-purple block mt-1">{dispute.price}</span>
                      <span className="text-[9px] text-gray-500">≈ {dispute.usd}</span>
                    </div>
                  </div>

                  <div className="w-px h-24 bg-white/5 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Motivo</span>
                    <p className="text-xs text-white mt-1 mb-3">{dispute.reason}</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors ${
                            dispute.progress >= step
                              ? "bg-brand-purple text-white"
                              : "bg-white/5 text-gray-600"
                          }`}>
                            {step}
                          </div>
                          {step < 3 && (
                            <div className={`w-6 h-[2px] transition-colors ${
                              dispute.progress > step ? "bg-brand-purple" : "bg-white/5"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <div className="flex -space-x-2">
                      {dispute.users.map((u, i) => (
                        <img key={i} src={u} className="w-8 h-8 rounded-full border-2 border-brand-sidebar" />
                      ))}
                    </div>
                    <button className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-semibold transition-all">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="px-8 pb-8">
            <div className="flex items-center justify-center space-x-2">
              <button className="px-3 py-1.5 bg-brand-sidebar rounded-lg text-[10px] text-gray-400 hover:text-white transition-all">Anterior</button>
              <button className="w-8 h-8 rounded-full bg-brand-purple text-white text-[10px] font-bold flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-full bg-brand-sidebar text-gray-400 text-[10px] hover:text-white transition-all flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-full bg-brand-sidebar text-gray-400 text-[10px] hover:text-white transition-all flex items-center justify-center">3</button>
              <button className="w-8 h-8 rounded-full bg-brand-sidebar text-gray-400 text-[10px] hover:text-white transition-all flex items-center justify-center">4</button>
              <button className="px-3 py-1.5 bg-brand-sidebar rounded-lg text-[10px] text-gray-400 hover:text-white transition-all">Siguiente</button>
            </div>
          </section>
        </div>

        <aside className="w-72 flex-shrink-0 p-6 pl-0 space-y-4">
          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">Transacciones Descentralizadas</h4>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
              Cada disputa se resuelve mediante contratos inteligentes auditados, garantizando transparencia total en el proceso.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Saber Más
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">Verificación de Usuarios</h4>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
              Todos los usuarios involucrados en disputas pasan por un proceso de validación de identidad y reputación.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Ver Más
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
