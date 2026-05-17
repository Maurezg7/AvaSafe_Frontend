import { useState } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";

export default function SoportePage({ isLoggedIn, onLogin, onLogout }: { isLoggedIn: boolean; onLogin: () => void; onLogout: () => void }) {
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
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <section className="px-8 pt-8">
            <h1 className="text-4xl font-bold text-white mb-2">Soporte</h1>
            <p className="text-sm text-gray-400 mb-6">Encuentra respuestas, guías y contacto directo con nuestro equipo.</p>
          </section>

          <section className="px-8 pb-8">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Busca una pregunta, tema o palabra clave..."
                className="block w-full pl-12 pr-4 py-3 bg-brand-sidebar border-none text-sm rounded-2xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
              />
            </div>
          </section>

          <section className="px-8 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Temas populares</h2>
              <button className="text-[10px] text-brand-purple hover:underline">Ver todos los temas →</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "shield", title: "Seguridad y Fianza", desc: "Protección de transacciones con escrow descentralizado y cifrado.", color: "text-brand-purple bg-brand-purple/20" },
                { icon: "cart", title: "Cómo comprar", desc: "Guía rápida para compradores: busca, oferta y recibe tu producto.", color: "text-blue-400 bg-blue-500/20" },
                { icon: "tag", title: "Cómo vender", desc: "Guía rápida para vendedores: lista, gestiona ofertas y envía.", color: "text-brand-purple bg-brand-purple/20" },
                { icon: "wallet", title: "Pagos y Wallet", desc: "Información sobre depósitos, retiros y gestión de fondos.", color: "text-brand-purple bg-brand-purple/20" },
              ].map((t) => (
                <div key={t.title} className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 hover:border-brand-purple/30 transition-all group cursor-pointer">
                  <div className={`w-9 h-9 rounded-xl ${t.color} flex items-center justify-center mb-3`}>
                    {t.icon === "shield" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                    {t.icon === "cart" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                    {t.icon === "tag" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                    {t.icon === "wallet" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{t.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="px-8 pb-8">
            <h2 className="text-lg font-bold text-white mb-5">Centro de ayuda</h2>
            <div className="space-y-2">
              {[
                "¿Qué es AvaSafe Market?",
                "¿Cómo funciona el sistema descentralizado?",
                "Verificación de Identidad",
              ].map((faq) => (
                <div key={faq} className="bg-brand-sidebar rounded-2xl px-5 py-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-purple/30 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="text-sm text-white">{faq}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-auto px-8 py-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px]">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">12.5k+</span>
                <span className="text-gray-600">Usuarios activos</span>
              </div>
              <span className="text-gray-600">|</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">2.1M+</span>
                <span className="text-gray-600">Volúmen transaccionado</span>
              </div>
              <span className="text-gray-600">|</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">0.05s</span>
                <span className="text-gray-600">Tiempo de respuesta</span>
              </div>
              <span className="text-gray-600">|</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-400 font-semibold">Red Operativa</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-72 flex-shrink-0 p-6 pl-0 space-y-4">
          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-[9px] text-brand-purple font-semibold uppercase tracking-wider">Acción urgente</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-4">Tienes una transacción en estado crítico. Revisa los detalles del contrato.</p>
            <button className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-90">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Solucionar Problema</span>
            </button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
            <h4 className="text-xs font-bold text-white mb-1">¿Necesitas más ayuda?</h4>
            <p className="text-[9px] text-gray-500 mb-4">Selecciona una opción de contacto.</p>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-brand-dark rounded-xl hover:border-brand-purple/30 transition-all border border-transparent">
                <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[10px] font-semibold text-white">Iniciar chat en vivo</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 bg-green-500/15 text-green-400 rounded-full font-semibold">24/7</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 bg-brand-dark rounded-xl hover:border-brand-purple/30 transition-all border border-transparent">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 5a2 2 0 012 2m0 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2m8 0a2 2 0 00-2-2H9a2 2 0 00-2 2m8 0V3M9 5V3m0 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-white">Crear Ticket</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 bg-brand-dark rounded-xl hover:border-brand-purple/30 transition-all border border-transparent">
                <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-white">Guías y tutoriales</span>
              </button>
            </div>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">Transacciones Descentralizadas</h4>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
              Todas las transacciones están protegidas por contratos inteligentes auditados y escrow descentralizado.
            </p>
            <button className="text-[9px] text-brand-purple hover:underline flex items-center">
              Saber Más
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
