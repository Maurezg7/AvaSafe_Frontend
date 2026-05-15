export default function ConfiguracionPage() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold">Configuración</h1>
          <p className="text-[10px] text-gray-500">Administra tus preferencias y la seguridad de tu cuenta.</p>
        </div>

        <div className="flex items-center space-x-6">
          <button className="relative text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-purple ring-2 ring-brand-dark" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button className="flex items-center space-x-3 px-3 py-1.5 bg-brand-sidebar rounded-full border border-white/5 hover:bg-brand-sidebar/80 transition-all">
            <img src="https://i.pravatar.cc/100" alt="Avatar" className="w-7 h-7 rounded-full border border-brand-purple/50" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold">AvaTrader</span>
              <span className="text-[9px] px-1 bg-brand-purple/20 text-brand-purple rounded">Verificado</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <section className="px-8 py-10 pb-6">
            <h1 className="text-4xl font-bold leading-tight">Configuración</h1>
            <p className="text-sm text-gray-500 mt-2">Administra tus preferencias y la seguridad de tu cuenta.</p>
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

          <section className="px-8 pb-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
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
                      { label: "Correo electrónico", value: "avatrader@avasa fe.com" },
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

              <div className="space-y-6">
                <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-4">Verificación de identidad</h3>
                  <div className="bg-brand-purple/10 rounded-2xl p-4 border border-brand-purple/20 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-white">Cuenta verificada</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-brand-purple/20 text-brand-purple rounded font-semibold">Nivel 2</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">Disfruta de límites más altos y mayor confianza en tus transacciones.</p>
                  </div>
                  <button className="text-[10px] text-brand-purple hover:underline">Gestionar verificación →</button>
                </div>

                <div className="bg-brand-sidebar rounded-[1.5rem] p-6 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-4">Métodos de pago</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Bank Transfer", icon: "bank", id: "•••• 4823" },
                      { name: "PayPal", icon: "paypal", id: "avatrader@paypal.com" },
                      { name: "USDT", icon: "crypto", id: "0x71C...3a9" },
                    ].map((method) => (
                      <div key={method.name} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                            {method.icon === "bank" && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M3 6l9-4 9 4M3 10l9 4 9-4M3 14l9 4 9-4M3 18l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            )}
                            {method.icon === "paypal" && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            )}
                            {method.icon === "crypto" && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            )}
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
                </div>
              </div>
            </div>
          </section>

          <section className="mt-auto px-8 py-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span className="text-gray-500">12,458+</span>
                  <span className="text-gray-600">Usuarios Activos</span>
                </div>
                <span className="text-gray-600">|</span>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span className="text-gray-500">3,245+</span>
                  <span className="text-gray-600">Productos Listados</span>
                </div>
                <span className="text-gray-600">|</span>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span className="text-gray-500">8,932+</span>
                  <span className="text-gray-600">Transacciones</span>
                </div>
                <span className="text-gray-600">|</span>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span className="text-gray-500">99.9%</span>
                  <span className="text-gray-600">Transacciones Seguras</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-72 flex-shrink-0 p-6 pl-0 space-y-4">
          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5">
            <div className="mb-4">
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Balance de Billetera</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold text-white">$34,900.00</span>
                <svg className="w-8 h-8 text-brand-purple/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <button className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-[10px] font-bold transition-all">
              Desbloquear Balance
            </button>
          </div>

          <div className="bg-brand-sidebar rounded-2xl p-5 border border-white/5 group hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-tight">Transacciones Descentralizadas</h4>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">Todas las transacciones están protegidas por contratos inteligentes.</p>
            <button className="text-[9px] text-brand-purple hover:underline">Cómo funciona →</button>
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
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">Perfiles verificados para garantizar confianza en cada operación.</p>
            <button className="text-[9px] text-brand-purple hover:underline">Ver más →</button>
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
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
            <button className="text-[9px] text-brand-purple hover:underline">Contactar soporte →</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
