import { useState } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

type Message = {
  id: number;
  text: string;
  time: string;
  sent: boolean;
};

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  verified: boolean;
  online: boolean;
  preview: string;
  timestamp: string;
  unread: number;
  messages: Message[];
  product: {
    name: string;
    price: string;
    image: string;
  };
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "TechSeller",
    avatar: "https://i.pravatar.cc/100?u=techseller",
    verified: true,
    online: true,
    preview: "Sí, el envío está incluido en el precio.",
    timestamp: "12:45",
    unread: 2,
    product: {
      name: 'MacBook Pro 16" M3 Max',
      price: "2.85 AVAX",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABOYQ0Ho6iHKTUbl2XWdSt3biQb6FN27ZWN9OGa6mMK7dv15Zl93muCEz-5ZX9NO1Cfh5ZveLEBfZmYSSq2Y1ugZCY8cdh2Oy-dW0hKuVQdELQ99tMLiCdiittxp4P0njek5vLG2LvBhk9an6CNCjzB_OXtUWWt5V1tPILBVi__bAAOBueWu1v3oH8LVTRin-DyRMckQn-VHOe6swU2QnbzkgPhnVJ3i8f0h1a2dXsWXrg2h5XrPtkcjfSDT8hatxsNcr_E78_g0Iq",
    },
    messages: [
      { id: 1, text: "Hola, me interesa la MacBook Pro. ¿Sigue disponible?", time: "12:30", sent: true },
      { id: 2, text: "Sí, todavía está disponible. La tengo sellada.", time: "12:35", sent: false },
      { id: 3, text: "Perfecto. ¿El precio es negociable?", time: "12:38", sent: true },
      { id: 4, text: "Podemos hablar del precio, ¿cuánto ofreces?", time: "12:40", sent: false },
      { id: 5, text: "2.50 AVAX me parece justo.", time: "12:42", sent: true },
      { id: 6, text: "Sí, el envío está incluido en el precio.", time: "12:45", sent: false },
    ],
  },
  {
    id: 2,
    name: "LuxTime",
    avatar: "https://i.pravatar.cc/100?u=luxtime",
    verified: true,
    online: false,
    preview: "Te envié las fotos del producto.",
    timestamp: "Ayer",
    unread: 0,
    product: {
      name: "Rolex Daytona",
      price: "1.25 AVAX",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHCQA5bEVdqGEZVCh2ZF5aW-J8af47d4ZtDUYElK4XzQr9ST8ygaCiInCgD7wu524H70YSW7uLS5PzNxycQ15USYLzp4WBFA1SqCfXOr5bHI3_28Rv-pfKGFA5zat4lw3AkuV-NMcX4ufaIMTe0xhU6OubH7ytQf8qaSOPDgxrOv6Mr_qD6Ytv_IYxu-u1KL_gcM7fif-YbXBsfRxvr_sLrzlPn0X-KGPgzk_vaXhC9M0m_70ca97ZkNTl9BLhAaKf9C0szisJpKJg",
    },
    messages: [
      { id: 1, text: "Hola, ¿el Rolex sigue disponible?", time: "10:15", sent: true },
      { id: 2, text: "Sí, lo tengo en venta todavía.", time: "10:20", sent: false },
    ],
  },
  {
    id: 3,
    name: "CryptoGear",
    avatar: "https://i.pravatar.cc/100?u=cryptogear",
    verified: false,
    online: true,
    preview: "Claro, podemos coordinar la entrega.",
    timestamp: "Mar 12",
    unread: 1,
    product: {
      name: "Ipad Pro 11",
      price: "18.50 AVAX",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCHKKB8ofzt9xC2APBHpxOTwL5mo2YQdi2uBoNgCIMh5dUgVBH1h5JCHyW1MKHs0JxJn30qHQ4um5bAIc3sKfzxfThrevrktXCzWI7W7gAfziDYxM7RJJfLz1CiLNCkghaGkZ2AmKWUra9WT8ayLB8Cwd2_uyRlJC07ryj6zRFa_DLTgakD1UctCW8WlHiFrLQpmjj9rsKVXFWxPcxj6dLdGD3OtODdvHS9RZkRQT9IP7IyzzNo9ee533ZUHGksOZk-6PKichQuZD",
    },
    messages: [
      { id: 1, text: "Quiero comprar el iPad. ¿Aceptas USDC?", time: "14:00", sent: true },
      { id: 2, text: "Sí, acepto USDC también.", time: "14:05", sent: false },
    ],
  },
];

export default function MensajesPage({ isLoggedIn, onLogin, onLogout }: { isLoggedIn: boolean; onLogin: () => void; onLogout: () => void }) {
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
        <h1 className="text-4xl font-bold text-white mb-2">{t.mensajes.title}</h1>
        <p className="text-sm text-gray-400 mb-6">Comunícate de forma segura y encriptada con otros compradores y vendedores.</p>
      </section>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 flex-shrink-0 flex flex-col border-r border-white/5">
          <div className="p-4 pb-2">
            <div className="relative flex-1 group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                className="block w-full pl-9 pr-3 py-2 bg-brand-sidebar border-none text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
              />
            </div>
          </div>

          <div className="px-4 pb-3 flex items-center space-x-2">
            {(["Todas", "En Proceso", "{t.mensajes.archived}"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  tab === "Todas"
                    ? "bg-brand-purple/15 text-brand-purple"
                    : "bg-brand-sidebar text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5 px-3 pb-4">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start space-x-3 ${
                  conv.id === 1
                    ? "bg-brand-purple/10 border border-brand-purple/20"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-11 h-11 rounded-full border border-brand-purple/30"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-brand-dark" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white">{conv.name}</span>
                      {conv.verified && (
                        <svg className="w-3 h-3 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] text-gray-500">{conv.timestamp}</span>
                      {conv.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-brand-purple text-white text-[8px] font-bold flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{conv.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={conversations[0].avatar}
                alt={conversations[0].name}
                className="w-10 h-10 rounded-full border border-brand-purple/30"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-bold text-white">{conversations[0].name}</span>
                  {conversations[0].verified && (
                    <svg className="w-3.5 h-3.5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[9px] text-green-400">En línea</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-3 py-1.5 bg-brand-sidebar rounded-xl border border-white/5">
                <img
                  src={conversations[0].product.image}
                  alt={conversations[0].product.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-white leading-tight truncate max-w-[120px]">{conversations[0].product.name}</span>
                  <span className="text-[9px] text-brand-purple font-bold">{conversations[0].product.price}</span>
                </div>
                <button className="text-[9px] px-2 py-1 border border-brand-purple/30 text-brand-purple rounded-lg hover:bg-brand-purple/10 transition-all">
                  Ver detalles
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar/50 rounded-full border border-white/5">
                <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span className="text-[9px] text-gray-500">Los mensajes están protegidos con cifrado de extremo a extremo.</span>
              </div>
            </div>

            {conversations[0].messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.sent ? "order-1" : "order-1"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sent
                        ? "bg-brand-purple text-white rounded-br-md"
                        : "bg-brand-sidebar text-gray-200 border border-white/5 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex mt-0.5 ${msg.sent ? "justify-end" : "justify-start"}`}>
                    <span className="text-[8px] text-gray-600 px-1">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-white/5">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 bg-brand-sidebar border border-white/5 text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
              />
              <button className="p-2.5 bg-brand-purple hover:bg-brand-purple-hover rounded-xl text-white transition-all shadow-lg shadow-brand-purple/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <aside className="w-64 flex-shrink-0 p-4 space-y-4 border-l border-white/5">
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-[11px] font-bold leading-tight">Transacciones Descentralizadas</h4>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed mb-2">Cada mensaje y transacción está protegido por la blockchain.</p>
            <button className="text-[8px] text-brand-purple hover:underline">Cómo funciona →</button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-[11px] font-bold leading-tight">Verificación de Usuarios</h4>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed mb-2">Todos los usuarios están verificados con identidad on-chain.</p>
            <button className="text-[8px] text-brand-purple hover:underline">Ver más →</button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-[11px] font-bold leading-tight">Soporte 24/7</h4>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed mb-2">Estamos aquí para ayudarte en cualquier momento.</p>
            <button className="text-[8px] text-brand-purple hover:underline">Conectar Soporte →</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
