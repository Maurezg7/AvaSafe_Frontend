import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ordenesService, type Orden } from "../api/ordenes.service";
import { getBuyerAddress } from "../lib/session";
import { useEscrow } from "../../hooks/useEscrow";

export default function EscrowPage({
  isLoggedIn,
  onLogin,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const { t } = useLanguage();
  const buyerAddress = getBuyerAddress();
  const { confirmDelivery } = useEscrow();
  const [escrows, setEscrows] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const loadEscrows = async () => {
    if (!buyerAddress) { setLoading(false); return; }
    try {
      const res = await ordenesService.findByBuyer(buyerAddress);
      setEscrows(res.data.filter((o) => o.state === "escrow"));
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadEscrows(); }, [buyerAddress]);

  const handleConfirm = async (orden: Orden) => {
    if (!orden.tradeId) return;
    setConfirmingId(orden.id_order);
    try {
      await confirmDelivery(Number(orden.tradeId));
      await ordenesService.update(orden.id_order, { state: "completado" });
      setEscrows((prev) => prev.filter((o) => o.id_order !== orden.id_order));
    } catch { /* ignore */ }
    setConfirmingId(null);
  };

  if (!isLoggedIn) {
    return (
      <main className="flex-1 flex items-center justify-center bg-brand-dark">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Inicia sesión para ver tus pagos pendientes</p>
          <button onClick={onLogin} className="px-6 py-2 bg-brand-purple rounded-xl text-white text-sm font-bold">
            Iniciar Sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <div className="px-8 py-10 pb-6">
        <h1 className="text-4xl font-bold leading-tight">
          Pagos en <span className="text-brand-purple">Escrow</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">Confirma la recepción para liberar los fondos al vendedor.</p>
      </div>

      <section className="px-8 pb-10 flex-1 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-8 h-8 animate-spin text-brand-purple mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">{t.common.loading}</p>
          </div>
        ) : escrows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-lg font-medium">No hay pagos pendientes</p>
            <p className="text-sm text-gray-600 mt-1">Los pagos en escrow aparecerán aquí.</p>
          </div>
        ) : (
          escrows.map((orden) => (
            <div
              key={orden.id_order}
              className="bg-brand-sidebar rounded-[1.5rem] p-5 border border-white/5 hover:border-brand-purple/30 transition-all flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">
                  {orden.nro_pedido || `Orden #${orden.id_order.slice(0, 8)}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vendedor: <span className="font-mono text-gray-400">{orden.seller.slice(0, 6)}...{orden.seller.slice(-4)}</span>
                </p>
                {orden.amountAvax && (
                  <p className="text-lg font-bold text-brand-purple mt-1">
                    {orden.amountAvax} <span className="text-sm">AVAX</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/15 text-blue-400">
                  En Escrow
                </span>
                <button
                  onClick={() => handleConfirm(orden)}
                  disabled={confirmingId === orden.id_order}
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg"
                >
                  {confirmingId === orden.id_order ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <span>Confirmar recepción</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
