import { useState, useRef, useEffect } from "react";
import UserMenu from "../components/UserMenu";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import { useProduct } from "../../hooks/useProductos";
import { useParams } from "react-router-dom";
import { useMetaMask } from "../../hooks/useMetaMask";

type Message = {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  type?: "oferta" | "texto" | "sistema";
  monto?: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hola, me interesa tu producto. ¿Podemos negociar el precio?",
    time: "14:10",
    sent: true,
    type: "texto",
  },
  {
    id: 2,
    text: "¡Claro! Estoy abierto a ofertas razonables.",
    time: "14:12",
    sent: false,
    type: "texto",
  },
];

export default function OfertaPage({
  isLoggedIn,
  onLogin,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
}) {
  const { id } = useParams()
  const { queryProductById } = useProduct(id)
  const { isConnected, connectWallet } = useMetaMask();
  const findProducto = queryProductById.data
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [ofertaMonto, setOfertaMonto] = useState("");
  const [tab, setTab] = useState<"chat" | "oferta">("chat");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [ofertaEnviada, setOfertaEnviada] = useState(false);
  const [ofertaAceptada, setOfertaAceptada] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputText.trim(), time, sent: true, type: "texto" },
    ]);
    setInputText("");
  };

  const ensureCanTransact = async () => {
    if (!isLoggedIn) {
      onLogin();
      return false;
    }

    if (!isConnected) {
      try {
        await connectWallet();
      } catch {
        return false;
      }
    }

    return true;
  };

  const openOfferTab = async () => {
    if (await ensureCanTransact()) setTab("oferta");
  };

  const sendOferta = async () => {
    if (!(await ensureCanTransact())) return;
    if (!ofertaMonto || isNaN(Number(ofertaMonto))) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `Oferta enviada: ${ofertaMonto} AVAX`,
        time,
        sent: true,
        type: "oferta",
        monto: ofertaMonto,
      },
    ]);
    setOfertaEnviada(true);
    setTab("chat");
    setOfertaMonto("");
  };

  const aceptarOferta = () => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "¡Oferta aceptada! Podemos proceder con la transacción.",
        time,
        sent: false,
        type: "sistema",
      },
    ]);
    setOfertaAceptada(true);
  };

    if (queryProductById.isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-brand-dark">
      <p className="text-gray-500 text-sm">Cargando producto...</p>
    </div>
  )

  if (!findProducto) return (
    <div className="flex-1 flex items-center justify-center bg-brand-dark">
      <p className="text-gray-500 text-sm">Producto no encontrado.</p>
    </div>
  )

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-brand-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Volver al explorador</span>
          </button>
          <span className="text-white/10">|</span>
          <span className="text-xs text-gray-500">Pedido #{findProducto.nro_pedido}</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-purple ring-2 ring-brand-dark" />
            </button>
            <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          </div>
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setShieldOpen(!shieldOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />
          </div>
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} />
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo — Producto */}
        <aside className="w-80 flex-shrink-0 flex flex-col border-r border-white/5 overflow-y-auto no-scrollbar p-5 space-y-5">
          {/* Imagen */}
          <div className="aspect-square rounded-2xl bg-brand-sidebar overflow-hidden flex items-center justify-center p-6 border border-white/5">
            <img
              src={findProducto.image_url || "https://placehold.co/400x400/1e1e24/6b7280?text=Sin+imagen"}
              alt={findProducto.name}
              className="object-contain w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x400/1e1e24/6b7280?text=Sin+imagen";
              }}
            />
          </div>

          {/* Info producto */}
          <div>
            <h2 className="text-base font-bold text-white leading-tight mb-1">{findProducto.name}</h2>
            <p className="text-[11px] text-gray-500 leading-relaxed">Pedido #{findProducto.nro_pedido}</p>
          </div>

          {/* Precio */}
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Precio publicado</p>
            <p className="text-2xl font-bold text-brand-purple">
              {findProducto.price} <span className="text-base">AVAX</span>
            </p>
          </div>

          {/* Vendedor */}
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 space-y-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Vendedor</p>
            <div className="flex items-center space-x-3">
              <img
                src="https://i.pravatar.cc/100"
                alt={findProducto.seller}
                className="w-10 h-10 rounded-full border border-brand-purple/30"
              />
              <div>
                <span className="text-sm font-bold text-white">{findProducto.seller}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Publicado el {new Date(findProducto.create).toLocaleDateString("es-AR")}</p>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Protección AvaSafe</p>
            {[
              "Escrow descentralizado en blockchain",
              "Mensajes con cifrado de extremo a extremo",
              "Disputa automática si hay inconvenientes",
            ].map((item) => (
              <div key={item} className="flex items-start space-x-2">
                <svg className="w-3.5 h-3.5 text-brand-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                </svg>
                <span className="text-[10px] text-gray-400 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </aside>
        {/* Panel central — Chat + Oferta */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center space-x-1 px-6 pt-5 pb-3 border-b border-white/5">
            <button
              onClick={() => setTab("chat")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "chat"
                ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30"
                : "text-gray-400 hover:text-white border border-transparent"
                }`}
            >
              Chat con vendedor
            </button>
            <button
              onClick={openOfferTab}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "oferta"
                ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30"
                : "text-gray-400 hover:text-white border border-transparent"
                }`}
            >
              Hacer oferta
            </button>
          </div>

          {tab === "chat" && (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-3">
                <div className="flex justify-center mb-2">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar/50 rounded-full border border-white/5">
                    <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span className="text-[9px] text-gray-500">Mensajes cifrados de extremo a extremo.</span>
                  </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                    {msg.type === "oferta" ? (
                      <div
                        className={`max-w-[70%] rounded-2xl border px-4 py-3 space-y-2 ${msg.sent
                          ? "bg-brand-purple/10 border-brand-purple/30 rounded-br-md"
                          : "bg-brand-sidebar border-white/10 rounded-bl-md"
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Oferta privada</span>
                        </div>
                        <p className="text-xl font-bold text-brand-purple">{msg.monto} <span className="text-sm">AVAX</span></p>
                        {!msg.sent && !ofertaAceptada && (
                          <div className="flex space-x-2 pt-1">
                            <button
                              onClick={aceptarOferta}
                              className="flex-1 py-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-[11px] font-bold rounded-lg transition-all"
                            >
                              Aceptar
                            </button>
                            <button className="flex-1 py-1.5 border border-white/10 text-gray-400 hover:text-white text-[11px] font-bold rounded-lg transition-all">
                              Rechazar
                            </button>
                          </div>
                        )}
                        <div className={`flex mt-0.5 ${msg.sent ? "justify-end" : "justify-start"}`}>
                          <span className="text-[8px] text-gray-600 px-1">{msg.time}</span>
                        </div>
                      </div>
                    ) : msg.type === "sistema" ? (
                      <div className="w-full flex justify-center">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/20 border border-green-500/20 rounded-full">
                          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                          </svg>
                          <span className="text-[11px] text-green-400 font-semibold">{msg.text}</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-[70%]`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.sent
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
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input chat */}
              <div className="px-6 py-4 border-t border-white/5">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={openOfferTab}
                    className="p-2.5 bg-brand-sidebar border border-white/10 hover:border-brand-purple/40 rounded-xl text-gray-400 hover:text-brand-purple transition-all"
                    title="Hacer oferta"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-4 py-2.5 bg-brand-sidebar border border-white/5 text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2.5 bg-brand-purple hover:bg-brand-purple-hover rounded-xl text-white transition-all shadow-lg shadow-brand-purple/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "oferta" && (
            <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-6">
              <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">Hacer oferta privada</h3>
                  <p className="text-xs text-gray-500">
                    El vendedor recibirá tu oferta de forma privada. Solo él puede verla.
                  </p>
                </div>

                {/* Precio referencia */}
                <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Precio publicado</span>
                  <span className="text-base font-bold text-white">{findProducto.price} AVAX</span>
                </div>

                {/* Input oferta */}
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                    Tu oferta en AVAX
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={ofertaMonto}
                      onChange={(e) => setOfertaMonto(e.target.value)}
                      className="w-full px-4 py-3.5 bg-brand-sidebar border border-white/10 text-xl font-bold text-white rounded-2xl focus:ring-1 focus:ring-brand-purple outline-none placeholder-gray-700 pr-20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-purple">
                      AVAX
                    </span>
                  </div>

                  {/* Sugerencias rápidas */}
                  <div className="flex space-x-2">
                    {["-10%", "-15%", "-20%"].map((pct) => {
                      const factor = 1 + parseInt(pct) / 100;
                      const sugerido = (parseFloat(findProducto.price) * factor).toFixed(2);
                      return (
                        <button
                          key={pct}
                          onClick={() => setOfertaMonto(sugerido)}
                          className="flex-1 py-1.5 text-[10px] font-semibold text-gray-400 hover:text-brand-purple bg-brand-sidebar border border-white/5 hover:border-brand-purple/30 rounded-xl transition-all"
                        >
                          {pct} · {sugerido}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Condiciones opcionales */}
                <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                    Condiciones adicionales (opcional)
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Ej: Pago inmediato, recojo en mano, etc."
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple outline-none resize-none"
                  />
                </div>

                {/* Aviso escrow */}
                <div className="flex items-start space-x-3 px-4 py-3 bg-brand-purple/5 border border-brand-purple/15 rounded-2xl">
                  <svg className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Si el vendedor acepta tu oferta, los fondos quedarán bloqueados en el contrato de escrow de AvaSafe hasta que ambas partes confirmen la transacción.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setTab("chat")}
                    className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white text-sm font-bold rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={sendOferta}
                    disabled={!ofertaMonto || isNaN(Number(ofertaMonto))}
                    className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-purple/20"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
                    </svg>
                    <span>Enviar oferta privada</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel derecho — Estado y acciones */}
        <aside className="w-64 flex-shrink-0 flex flex-col border-l border-white/5 p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Estado de la negociación */}
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 space-y-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Estado</p>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${ofertaAceptada ? "bg-green-500" : ofertaEnviada ? "bg-yellow-400" : "bg-gray-600"
                  }`}
              />
              <span className={`text-xs font-semibold ${ofertaAceptada ? "text-green-400" : ofertaEnviada ? "text-yellow-400" : "text-gray-400"}`}>
                {ofertaAceptada ? "Oferta aceptada" : ofertaEnviada ? "Oferta pendiente" : "En negociación"}
              </span>
            </div>
          </div>

          {/* Botón compra directa */}
          {!ofertaAceptada && (
            <button
              onClick={ensureCanTransact}
              className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Comprar a {findProducto.price} AVAX</span>
            </button>
          )}

          {ofertaAceptada && (
            <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Confirmar y pagar en escrow</span>
            </button>
          )}

          {/* Reportar */}
          <button className="w-full py-2.5 border border-white/5 text-gray-500 hover:text-red-400 hover:border-red-500/20 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Reportar vendedor</span>
          </button>

          {/* Info escrow */}
          <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 space-y-2">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="text-[10px] text-white font-bold">Escrow AvaSafe</p>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed">
              Los fondos se liberan al vendedor solo cuando confirmes la recepción del producto.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
