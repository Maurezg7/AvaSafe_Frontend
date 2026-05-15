import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex-1 flex items-center justify-center bg-brand-dark overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md px-8 py-10">
        {mode === "login" ? (
          <LoginView onSwitch={() => setMode("register")} />
        ) : (
          <RegisterView onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}

function LoginView({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold tracking-tight">AvaSafe</span>
            <span className="text-xs text-brand-purple -mt-1 font-semibold">Market</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Bienvenido de nuevo</h1>
        <p className="text-sm text-gray-500 mt-2">Accede a tu panel de control descentralizado</p>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Correo electrónico o Usuario</span>
          <input
            type="text"
            placeholder="tu@email.com"
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Contraseña</span>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none pr-10"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="text-[10px] text-gray-500 hover:text-brand-purple transition-colors">Olvidé mi contraseña</button>
        </div>

        <button className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-sm font-bold transition-all">
          Iniciar Sesión
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-[10px] text-gray-500 bg-brand-dark">O continuar con tu billetera</span>
        </div>
      </div>

      <button className="w-full py-3 bg-brand-sidebar border border-white/5 hover:border-brand-purple/40 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-3">
        <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
        <span>Conectar Billetera Web3</span>
      </button>

      <p className="text-[9px] text-gray-600 text-center">Asegúrate de estar conectado a la red Avalanche</p>

      <div className="text-center">
        <span className="text-[11px] text-gray-500">¿No tienes una cuenta? </span>
        <button onClick={onSwitch} className="text-[11px] text-brand-purple hover:underline font-semibold">Regístrate aquí</button>
      </div>
    </div>
  );
}

function RegisterView({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold tracking-tight">AvaSafe</span>
            <span className="text-xs text-brand-purple -mt-1 font-semibold">Market</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Crea tu cuenta segura</h1>
        <p className="text-sm text-gray-500 mt-2">Únete a la plataforma P2P descentralizada en Avalanche</p>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Nombre de Usuario</span>
          <input
            type="text"
            placeholder="AvaTrader"
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Correo Electrónico</span>
          <input
            type="email"
            placeholder="tu@email.com"
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Contraseña</span>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none pr-10"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
          {/* Password strength indicator placeholder */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="h-0.5 w-full rounded-full bg-white/5" />
            <div className="h-0.5 w-1/2 rounded-full bg-yellow-500/50" />
            <div className="h-0.5 w-1/4 rounded-full bg-brand-purple/50" />
          </div>
          <span className="text-[9px] text-gray-500 mt-1">Fuerza: Media</span>
        </div>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-white/5 bg-brand-sidebar text-brand-purple focus:ring-brand-purple" />
          <span className="text-[10px] text-gray-500 leading-relaxed">
            Acepto los términos de servicio y las políticas de contratos inteligentes de AvaSafe
          </span>
        </label>

        <button className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-sm font-bold transition-all">
          Crear Cuenta
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-[10px] text-gray-500 bg-brand-dark">O registrarse con tu billetera</span>
        </div>
      </div>

      <button className="w-full py-3 bg-brand-sidebar border border-white/5 hover:border-brand-purple/40 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-3 group">
        <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
        <span>Registrarse con Billetera Web3</span>
      </button>
      <p className="text-[9px] text-gray-600 text-center -mt-2">Tu wallet actuará como tu identidad principal sin contraseñas</p>

      <div className="text-center">
        <span className="text-[11px] text-gray-500">¿Ya tienes cuenta? </span>
        <button onClick={onSwitch} className="text-[11px] text-brand-purple hover:underline font-semibold">Inicia sesión aquí</button>
      </div>
    </div>
  );
}
