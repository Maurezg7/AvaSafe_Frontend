import { useState } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";

export default function ReputacionPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-end px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-purple ring-2 ring-brand-dark" />
            </button>
            <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          </div>
          <div className="relative">
            <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShieldOpen(!shieldOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />
          </div>
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} />
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <section className="px-8 py-10 pb-6 mb-8">
            <h1 className="text-4xl font-bold leading-tight">Reputación</h1>
            <p className="text-sm text-gray-500 mt-2">Monitorea tu nivel de confianza, calificaciones y comportamiento dentro de la plataforma.</p>
          </section>

          <section className="px-8 pb-8">
            <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5 flex items-center gap-8">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="264" strokeDashoffset="15.84" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">4.8</span>
                  </div>
                </div>
                <span className="mt-3 text-[9px] px-2 py-1 rounded-full font-semibold bg-green-500/15 text-green-400">Excelente Reputación</span>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-violet-500 fill-violet-500" : "text-gray-600 fill-gray-600"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="w-px h-32 bg-white/5" />

              <div className="flex-1 grid grid-cols-2 gap-6">
                {[
                  { label: "Transacciones Exitosas", value: "142" },
                  { label: "Disputas a Favor", value: "12" },
                  { label: "Disputas en Contra", value: "1" },
                  { label: "Tiempo de Respuesta", value: "~15 min" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-8 pb-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Cumplimiento</span>
                  <span className="text-[10px] font-bold text-green-400">98%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "98%" }} />
                </div>
                <p className="text-[9px] text-gray-500 mt-2">Contratos completados sin incidentes</p>
              </div>

              <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">Verificación KYC</span>
                </div>
                <p className="text-[9px] text-gray-500">Nivel 2 - Identidad verificada y vinculada a billetera Web3</p>
              </div>

              <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">Antigüedad</span>
                </div>
                <p className="text-[9px] text-gray-500">Miembro activo desde hace 14 meses</p>
              </div>
            </div>
          </section>

          <section className="px-8 pb-8">
            <h3 className="text-sm font-bold text-white mb-4">Historial de Valoraciones</h3>
            <div className="space-y-3">
              {[
                { name: "0x71C...3a9", stars: 5, text: "Excelente vendedor, liberación de fondos muy rápida y producto en perfecto estado.", time: "Hace 2 días" },
                { name: "User_482", stars: 4, text: "Buen comprador, comunicación clara y pago inmediato.", time: "Hace 5 días" },
                { name: "0x3F2...7b1", stars: 5, text: "Todo perfecto, transacción segura y rápida. Muy recomendado.", time: "Hace 1 semana" },
              ].map((review, i) => (
                <div key={i} className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 flex items-start space-x-4">
                  <img src={`https://i.pravatar.cc/40?u=review${i}`} alt="" className="w-9 h-9 rounded-full border border-brand-purple/30 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{review.name}</span>
                      <span className="text-[9px] text-gray-500">{review.time}</span>
                    </div>
                    <div className="flex items-center space-x-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`w-3 h-3 ${s <= review.stars ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="w-72 flex-shrink-0 p-6 pl-0 space-y-4">
          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">¿Cómo mejorar tu Reputación?</h4>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                "Completa transacciones a tiempo",
                "Resuelve disputas de manera justa",
                "Mantén tu perfil verificado",
              ].map((tip) => (
                <li key={tip} className="flex items-start space-x-2 text-[9px] text-gray-500">
                  <svg className="w-3 h-3 text-brand-purple mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-semibold transition-all">
              Ver Reglas del Sistema
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
              Los usuarios verificados tienen mayor peso en las valoraciones y generan más confianza en la comunidad.
            </p>
            <button className="w-full py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-semibold transition-all flex items-center justify-center space-x-1.5">
              <span>Ver Más</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
