import { useState, useEffect, useRef } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";

type Purchase = {
  id: number;
  name: string;
  description: string;
  seller: string;
  rating: string;
  reviews: number;
  time: string;
  price: string;
  usd: string;
  image: string;
  status: "En Proceso" | "En Escrow" | "Completada" | "Cancelada";
  progress: number;
};

const purchases: Purchase[] = [
  {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    description: "64GB RAM - 2TB SSD",
    seller: "TechSeller",
    rating: "4.9",
    reviews: 128,
    time: "Comprado hoy",
    price: "2.85 AVAX",
    usd: "$2,184.25 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABOYQ0Ho6iHKTUbl2XWdSt3biQb6FN27ZWN9OGa6mMK7dv15Zl93muCEz-5ZX9NO1Cfh5ZveLEBfZmYSSq2Y1ugZCY8cdh2Oy-dW0hKuVQdELQ99tMLiCdiittxp4P0njek5vLG2LvBhk9an6CNCjzB_OXtUWWt5V1tPILBVi__bAAOBueWu1v3oH8LVTRin-DyRMckQn-VHOe6swU2QnbzkgPhnVJ3i8f0h1a2dXsWXrg2h5XrPtkcjfSDT8hatxsNcr_E78_g0Iq",
    status: "En Escrow",
    progress: 60,
  },
  {
    id: 2,
    name: "Iphone 16 Pro Max",
    description: "8GB RAM - 1TB SSD",
    seller: "LuxTime",
    rating: "5.0",
    reviews: 89,
    time: "Comprado ayer",
    price: "9.57 AVAX",
    usd: "$7,469.25 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Bksx3KtVTnSUfL7L2ATzAExSa8RAMYtFcXnEOWnpFGBOycBnEDloiFXbj2S9FLvfVHiWzHqYJdkVvnUxGDEN0eZrJOW6psFuxuqBXnuyjRC_1LvFl6DWY79IbL_I1xSX20aeqCEuDJn94R5Ltk4zUVjPo1eJEE_CVfOhtpB9k7hUqu3YGrYIzO-tS3FbBrDH4SEx9obSZFfPkrue0XcZSeHJZgwcZ95DU9s0okjX1-W0guuuE-59cdbRb6Pxvs23xRz9mrCXAm9",
    status: "Completada",
    progress: 100,
  },
  {
    id: 3,
    name: "Rolex Daytona",
    description: "Oystersteel - Black Dial",
    seller: "CryptoGear",
    rating: "4.8",
    reviews: 76,
    time: "Comprado hace 2d",
    price: "1.25 AVAX",
    usd: "$957.75 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHCQA5bEVdqGEZVCh2ZF5aW-J8af47d4ZtDUYElK4XzQr9ST8ygaCiInCgD7wu524H70YSW7uLS5PzNxycQ15USYLzp4WBFA1SqCfXOr5bHI3_28Rv-pfKGFA5zat4lw3AkuV-NMcX4ufaIMTe0xhU6OubH7ytQf8qaSOPDgxrOv6Mr_qD6Ytv_IYxu-u1KL_gcM7fif-YbXBsfRxvr_sLrzlPn0X-KGPgzk_vaXhC9M0m_70ca97ZkNTl9BLhAaKf9C0szisJpKJg",
    status: "En Proceso",
    progress: 25,
  },
  {
    id: 4,
    name: "Ipad Pro 11",
    description: "64GB RAM - 1TB SSD",
    seller: "SwissWatch",
    rating: "4.9",
    reviews: 56,
    time: "Comprado hace 3d",
    price: "18.50 AVAX",
    usd: "$14,209.50 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCHKKB8ofzt9xC2APBHpxOTwL5mo2YQdi2uBoNgCIMh5dUgVBH1h5JCHyW1MKHs0JxJn30qHQ4um5bAIc3sKfzxfThrevrktXCzWI7W7gAfziDYxM7RJJfLz1CiLNCkghaGkZ2AmKWUra9WT8ayLB8Cwd2_uyRlJC07ryj6zRFa_DLTgakD1UctCW8WlHiFrLQpmjj9rsKVXFWxPcxj6dLdGD3OtODdvHS9RZkRQT9IP7IyzzNo9ee533ZUHGksOZk-6PKichQuZD",
    status: "Cancelada",
    progress: 10,
  },
];

const statusColors: Record<string, string> = {
  "En Proceso": "text-purple-400 bg-purple-500/15",
  "En Escrow": "text-blue-400 bg-blue-500/15",
  Completada: "text-green-400 bg-green-500/15",
  Cancelada: "text-brand-purple bg-brand-purple/15",
};

const progressColors: Record<string, string> = {
  "En Proceso": "bg-purple-500",
  "En Escrow": "bg-blue-500",
  Completada: "bg-green-500",
  Cancelada: "bg-brand-purple",
};

type Tab = "Todas" | "En Proceso" | "En Escrow" | "Completadas" | "Canceladas";

export default function ComprasPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [estadoOpen, setEstadoOpen] = useState(false);
  const estadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (estadoRef.current && !estadoRef.current.contains(e.target as Node)) {
        setEstadoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex-1 flex items-center space-x-4 max-w-3xl">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar en mis compras..."
              className="block w-full pl-10 pr-3 py-2 bg-brand-sidebar border-none text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="relative" ref={estadoRef}>
            <button onClick={() => setEstadoOpen(!estadoOpen)} className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Filtros</span>
            </button>
            {estadoOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-brand-sidebar border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Filtros</h3>
                  <button className="text-[11px] text-brand-purple hover:underline">Limpiar todo</button>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Estado</span>
                  <div className="flex gap-2">
                    {["En Proceso", "En Escrow", "Completada", "Cancelada"].map((s) => (
                      <button key={s} className="text-[10px] px-3 py-1.5 bg-brand-dark text-gray-400 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <NotificationDropdown notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} />

          <ShieldDropdown shieldOpen={shieldOpen} setShieldOpen={setShieldOpen} />

          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} />
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <section className="px-8 py-10 pb-6">
            <h1 className="text-4xl font-bold leading-tight">
              Mis <span className="text-brand-purple">Compras</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Historial y seguimiento de todas tus transacciones en la plataforma.
            </p>
          </section>

          <section className="px-8 pb-8">
            <div className="flex items-center space-x-2">
              {(["Todas", "En Proceso", "En Escrow", "Completadas", "Canceladas"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    tab === "Todas"
                      ? "bg-brand-purple/15 text-brand-purple shadow-lg shadow-brand-purple/10"
                      : "bg-brand-sidebar text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="px-8 pb-10 flex-1 space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-brand-sidebar rounded-[1.5rem] p-5 border border-white/5 hover:border-brand-purple/30 transition-all flex items-center gap-6 group"
              >
                <div className="w-24 h-24 rounded-xl bg-brand-dark overflow-hidden flex items-center justify-center p-3 flex-shrink-0">
                  <img
                    src={purchase.image}
                    alt={purchase.name}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-bold text-white truncate">{purchase.name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${statusColors[purchase.status]}`}>
                      {purchase.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">{purchase.description}</p>

                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src="https://i.pravatar.cc/50"
                      alt={purchase.seller}
                      className="w-5 h-5 rounded-full border border-brand-purple/30"
                    />
                    <span className="text-[10px] font-medium text-gray-300">{purchase.seller}</span>
                    <svg className="w-3 h-3 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                    </svg>
                    <span className="text-[9px] text-gray-500">{purchase.time}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center space-x-1">
                        {["Pago", "Escrow", "Envío", "Recibido"].map((step, i) => {
                          const filled = purchase.progress >= (i + 1) * 25;
                          return (
                            <div key={step} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors ${
                                filled
                                  ? "bg-brand-purple text-white"
                                  : "bg-white/5 text-gray-600"
                              }`}>
                                {i + 1}
                              </div>
                              {i < 3 && (
                                <div className={`w-6 h-[2px] transition-colors ${
                                  purchase.progress > (i + 1) * 25 ? "bg-brand-purple" : "bg-white/5"
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-base font-bold text-brand-purple">{purchase.price}</span>
                  <span className="text-[9px] text-gray-500">≈ {purchase.usd}</span>
                  <button className="mt-1 px-4 py-1.5 border border-brand-purple/30 text-brand-purple rounded-lg text-[10px] font-semibold hover:bg-brand-purple/10 transition-all">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
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
            <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
              Cada compra está protegida por contratos inteligentes. El escrow libera los fondos solo cuando ambas partes confirman.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Cómo funciona
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
            <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
              Todos los vendedores están verificados con prueba de identidad y reputación on-chain.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Ver más
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">Soporte 24/7</h4>
            </div>
            <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
              Nuestro equipo de soporte está disponible en todo momento para resolver cualquier incidencia.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Conectar Soporte
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
