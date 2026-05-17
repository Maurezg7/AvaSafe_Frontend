import { useState } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

const encryptedMethods = [
  {
    name: "eAVAX (Avalanche Encrypted)",
    icon: "eavax",
    id: "0xAva...9f3e",
  },
  {
    name: "eUSDC (Encrypted)",
    icon: "eusdc",
    id: "0xUSDC...4b1d",
  },
  {
    name: "eWETH (Encrypted)",
    icon: "eweth",
    id: "0xWETH...c7a2",
  },
];

const sidebarCards = [
  {
    title: "Escrow Cifrado (eERC)",
    icon: "escrow",
    desc: "Los fondos de tus ofertas se depositan de forma segura en un contrato inteligente de Avalanche, manteniendo el monto oculto para terceros.",
    link: "Ver contrato de Escrow →",
  },
  {
    title: "Verificación de Usuarios",
    icon: "shield",
    desc: "Perfiles verificados para garantizar confianza en cada operación con privacidad de identidad.",
    link: "Ver más →",
  },
  {
    title: "Soporte 24/7",
    icon: "support",
    desc: "Nuestro equipo está disponible para ayudarte en cualquier momento con temas de cifrado y privacidad.",
    link: "Contactar soporte →",
  },
];

const footerMetrics = [
  { value: "12,458+", label: "Transacciones Privadas", icon: "users" },
  { value: "3,245+", label: "Ofertas Cifradas", icon: "offers" },
  { value: "100%", label: "Metadata Encriptada", icon: "encrypted" },
  { value: "Avalanche", label: "Red: Avalanche Mainnet", icon: "network" },
];

export default function Configuracion({
  isLoggedIn,
  onLogin,
  onLogout,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const { t } = useLanguage();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-end px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-6">
          <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />
          <LanguageSwitcher compact />
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </header>

      <section className="px-8 pt-8">
        <h1 className="text-4xl font-bold text-white mb-2">{t.configuracion.title}</h1>
        <p className="text-sm text-gray-400 mb-6">Administra tus preferencias y la seguridad de tu cuenta.</p>
      </section>

      <section className="px-8 pb-8 overflow-x-auto">
        <div className="flex items-center space-x-6 border-b border-white/5">
          {["Cuenta", "Seguridad", "Notificaciones", "Privacidad", "Métodos de pago", "API", "Preferencias"].map((tab) => (
            <button
              key={tab}
              className={`pb-3 text-xs font-semibold transition-all relative ${
                tab === "Cuenta"
                  ? "text-brand-purple"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {tab === "Cuenta" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="px-8 pb-8 overflow-visible">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
          <div className="xl:col-span-2 space-y-6 min-w-0">
            <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Información de la cuenta</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Tus datos personales y configuración de perfil.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6 p-4 bg-brand-dark rounded-2xl">
                <img src="https://i.pravatar.cc/100" alt="" className="w-14 h-14 rounded-full border-2 border-brand-purple/50" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-white">AvaTrader</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-brand-purple/20 text-brand-purple rounded font-semibold">Verificado</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-400">Cuenta activa</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Nombre de usuario", value: "AvaTrader" },
                  { label: "Correo electrónico", value: "avatrader@avasafe.com" },
                  { label: "País de residencia", value: "España" },
                  { label: "Idioma", value: "Español (ES)" },
                ].map((field) => (
                  <div key={field.label} className="p-4 bg-brand-dark rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider">{field.label}</span>
                      <p className="text-sm font-semibold text-white mt-0.5">{field.value}</p>
                    </div>
                    <button className="text-[9px] text-brand-purple hover:underline flex-shrink-0">Editar</button>
                  </div>
                ))}
                <div className="col-span-2 p-4 bg-brand-dark rounded-xl flex items-center justify-between border border-brand-purple/10">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">Llave Pública de Cifrado (Registrar.sol)</span>
                    <p className="text-sm font-mono text-brand-purple mt-0.5 truncate">0x03fe2b1c7a9d8e4f5a6b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b</p>
                  </div>
                  <button className="text-[9px] text-brand-purple hover:underline flex-shrink-0 ml-3 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>Copiar</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Cambiar contraseña</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Contraseña actual", "Nueva contraseña", "Confirmar contraseña"].map((field) => (
                  <div key={field}>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">{field}</span>
                    <div className="mt-1 px-4 py-2.5 bg-brand-dark border border-white/5 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-gray-400">••••••••</span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                ))}
                <div className="flex items-end">
                  <button className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-semibold transition-all">Actualizar contraseña</button>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 w-full max-w-sm flex flex-col gap-4 items-stretch">
            <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Verificación de identidad</h3>
              <div className="bg-brand-purple/10 rounded-2xl p-4 border border-brand-purple/20 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-bold text-white">Cuenta verificada</span>
                  <span className="text-[8px] px-1.5 py-0.5 bg-brand-purple/20 text-brand-purple rounded font-semibold">Nivel 2</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">Disfruta de límites más altos y mayor confianza en tus transacciones cifradas.</p>
              </div>
              <button className="text-[10px] text-brand-purple hover:underline">Gestionar verificación →</button>
            </div>

            <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Métodos de pago</h3>
              <div className="space-y-3">
                {encryptedMethods.map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">{method.name}</span>
                        <p className="text-[9px] text-gray-500">{method.id}</p>
                      </div>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 bg-green-500/15 text-green-400 rounded-full font-semibold">Conectado</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 flex items-center space-x-1.5 text-[10px] text-brand-purple hover:underline">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Vincular Token Encrypted ERC-20</span>
              </button>
            </div>

            <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
              <div className="mb-4">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Balance de Billetera</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-2xl font-bold text-white">$34,900.00</span>
                    <p className="text-[8px] text-yellow-400/80 mt-0.5 flex items-center space-x-1">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <span>Monto privado (Oculto para observadores externos)</span>
                    </p>
                  </div>
                  <svg className="w-8 h-8 text-brand-purple/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <button className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center space-x-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Descifrar Balance</span>
              </button>
            </div>

            {sidebarCards.map((card) => (
              <div key={card.title} className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                    {card.icon === "escrow" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                    {card.icon === "shield" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                    {card.icon === "support" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{card.title}</h4>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-2">{card.desc}</p>
                <button className="text-[9px] text-brand-purple hover:underline">{card.link}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-auto px-8 py-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[9px]">
          <div className="flex items-center space-x-4">
            {footerMetrics.map((metric, i) => (
              <div key={metric.label}>
                {i > 0 && <span className="text-gray-600 mr-4">|</span>}
                <div className="flex items-center space-x-1.5">
                  <svg className={`w-3 h-3 ${i === 3 ? "text-green-500" : "text-brand-purple"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {i === 0 && <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                    {i === 1 && <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                    {i === 2 && <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                    {i === 3 && <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                  </svg>
                  <span className="text-gray-500">{metric.value}</span>
                  <span className="text-gray-600">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
