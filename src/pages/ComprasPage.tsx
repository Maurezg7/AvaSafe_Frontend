import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";
import { ordenesService, type Orden } from "../api/ordenes.service";
import { getBuyerAddress } from "../lib/session";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useEscrow } from "../../hooks/useEscrow";
import { getProductById } from "../../actions/productosActions/get-product-by-id.action";

type Purchase = {
  id_order: string;
  tradeId?: string;
  productId?: string;
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

const statusMap: Record<string, Purchase["status"]> = {
  proceso: "En Proceso",
  escrow: "En Escrow",
  completado: "Completada",
  cancelado: "Cancelada",
};

const progressMap: Record<string, number> = {
  proceso: 25,
  escrow: 60,
  completado: 100,
  cancelado: 10,
};

const statusColors: Record<string, string> = {
  "En Proceso": "text-purple-400 bg-purple-500/15",
  "En Escrow": "text-blue-400 bg-blue-500/15",
  Completada: "text-green-400 bg-green-500/15",
  Cancelada: "text-brand-purple bg-brand-purple/15",
};

type Tab = "Todas" | "En Proceso" | "En Escrow" | "Completadas" | "Canceladas";

export default function ComprasPage({
  isLoggedIn,
  onLogin,
  onLogout,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const buyerAddress = getBuyerAddress();
  const { confirmDelivery } = useEscrow();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [estadoOpen, setEstadoOpen] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const estadoRef = useRef<HTMLDivElement>(null);

  const handleConfirmDelivery = async (purchase: Purchase) => {
    if (!purchase.tradeId) return;
    setConfirmingId(purchase.id_order);
    try {
      await confirmDelivery(Number(purchase.tradeId));
      await ordenesService.update(purchase.id_order, { state: "completado" });
      setPurchases((prev) =>
        prev.map((p) =>
          p.id_order === purchase.id_order
            ? { ...p, status: "Completada", progress: 100 }
            : p
        )
      );
    } catch {
      // error handled by hook
    } finally {
      setConfirmingId(null);
    }
  };

  const loadPurchases = async () => {
    if (!buyerAddress) {
      setLoading(false);
      return;
    }
    try {
      const res = await ordenesService.findByBuyer(buyerAddress);
      const mapped = await Promise.all(
        res.data.map(async (o: Orden) => {
          const match = o.nro_pedido?.match(/PED(?:IDO)?-([\da-f-]+?)-\d+$/);
          const productId = match?.[1];
          let productName = o.nro_pedido || `Orden #${o.id_order.slice(0, 8)}`;
          let productImage = "";
          if (productId) {
            try {
              const prod = await getProductById(productId);
              if (prod) {
                productName = prod.name;
                productImage = prod.image_url || "";
              }
            } catch {}
          }
          return {
            id_order: o.id_order,
            tradeId: o.tradeId,
            productId,
            name: productName,
            description: `${o.amountAvax ? o.amountAvax + " AVAX" : ""}`,
            seller: o.seller,
            rating: "0.0",
            reviews: 0,
            time: new Date(o.date_order).toLocaleDateString(),
            price: o.amountAvax ? `${o.amountAvax} AVAX` : "—",
            usd: "",
            image: productImage,
            status: statusMap[o.state] || "En Proceso",
            progress: progressMap[o.state] || 25,
          };
        })
      );
      setPurchases(mapped);
    } catch (err) {
      setFetchError((err as Error)?.message || t.compras.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [buyerAddress, t.compras.loadError]);

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
              placeholder={t.compras.searchPlaceholder}
              className="block w-full pl-10 pr-3 py-2 bg-brand-sidebar border-none text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="relative" ref={estadoRef}>
            <button onClick={() => setEstadoOpen(!estadoOpen)} className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>{t.common.filters}</span>
            </button>
            {estadoOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-brand-sidebar border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{t.common.filters}</h3>
                  <button type="button" className="text-[11px] text-brand-purple hover:underline">{t.common.clearAll}</button>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">{t.common.status}</span>
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
          <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

          <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />

      <LanguageSwitcher compact /><UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <section className="px-8 py-10 pb-6">
            <h1 className="text-4xl font-bold leading-tight">
              {t.compras.title} <span className="text-brand-purple">{t.compras.titleHighlight}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {t.compras.subtitle}
            </p>
          </section>

          <section className="px-8 pb-8">
            <div className="flex items-center space-x-2">
              {([t.common.all, t.compras.inProcess, t.compras.inEscrow, t.compras.completed, t.compras.cancelled] as Tab[]).map((tab) => (
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg className="w-8 h-8 animate-spin text-brand-purple mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm">{t.common.loading}</p>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg className="w-12 h-12 mb-4 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <p className="text-sm">{fetchError}</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <p className="text-lg font-medium">{t.compras.noPurchases}</p>
              </div>
            ) : purchases.map((purchase) => (
              <div
                key={purchase.id_order}
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
                  {purchase.status === "En Escrow" && (
                    <button
                      onClick={() => handleConfirmDelivery(purchase)}
                      disabled={confirmingId === purchase.id_order}
                      className="mt-1 px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg text-[10px] font-semibold transition-all flex items-center space-x-1"
                    >
                      {confirmingId === purchase.id_order ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Confirmando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          <span>Confirmar recepción</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => purchase.productId && navigate(`/ofertas/${purchase.productId}`)}
                    className="mt-1 px-4 py-1.5 border border-brand-purple/30 text-brand-purple rounded-lg text-[10px] font-semibold hover:bg-brand-purple/10 transition-all"
                  >
                    {t.common.viewDetails}
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
