import axios from "axios";
import type { FormEvent } from "react";
import { useState } from "react";
import { loginAction } from "../../actions/authActions/login.action";
import { registerAction } from "../../actions/authActions/register.action";
import { useMetaMask } from "../../hooks/useMetaMask";
import type { AuthResponse } from "../interfaces/auth.interface";
import { persistSession } from "../lib/session";

type AuthMode = "login" | "register";

export default function AuthPage({
  initialMode = "login",
  onAuthSuccess,
}: {
  initialMode?: AuthMode;
  onAuthSuccess: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <div className="w-full max-w-md px-8 py-10">
      {mode === "login" ? (
        <LoginView onSwitch={() => setMode("register")} onAuthSuccess={onAuthSuccess} />
      ) : (
        <RegisterView onSwitch={() => setMode("login")} onAuthSuccess={onAuthSuccess} />
      )}
    </div>
  );
}

function getAuthError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;
    if (Array.isArray(message)) return message.join(". ");
    if (typeof message === "string") return message;
  }

  return "No se pudo completar la solicitud. Intenta nuevamente.";
}

function saveSession(data: AuthResponse) {
  const token = data.token || data.access_token;
  if (!token) return;
  persistSession({
    token,
    username: data.user?.username ?? data.usuario ?? data.username,
    email: data.user?.email ?? data.email,
    address: data.user?.address ?? data.address,
  });
}

function LoginView({
  onSwitch,
  onAuthSuccess,
}: {
  onSwitch: () => void;
  onAuthSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await loginAction({ email: email.trim(), password });
      saveSession(data);
      onAuthSuccess();
    } catch (err) {
      setError(getAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <AuthHeader title="Bienvenido de nuevo" subtitle="Accede a tu panel de control descentralizado" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Correo electronico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <PasswordInput
          label="Contrasena"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          value={password}
          onChange={setPassword}
        />

        <div className="flex justify-end">
          <button type="button" className="text-[10px] text-gray-500 hover:text-brand-purple transition-colors">
            Olvide mi contrasena
          </button>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all"
        >
          {isSubmitting ? "Iniciando..." : "Iniciar Sesion"}
        </button>
      </form>

      <WalletDivider text="O continuar con tu billetera" />
      <WalletButton text="Conectar Billetera Web3" />
      <p className="text-[9px] text-gray-600 text-center">Asegurate de estar conectado a la red Avalanche</p>

      <div className="text-center">
        <span className="text-[11px] text-gray-500">No tienes una cuenta? </span>
        <button onClick={onSwitch} className="text-[11px] text-brand-purple hover:underline font-semibold">
          Registrate aqui
        </button>
      </div>
    </div>
  );
}

function RegisterView({
  onSwitch,
  onAuthSuccess,
}: {
  onSwitch: () => void;
  onAuthSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, connectWallet, isConnecting } = useMetaMask();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!address.trim() || !username.trim() || !email.trim() || !password) {
      setError("Conecta MetaMask y completa todos los campos para crear tu cuenta.");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los terminos para continuar.");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerAction({
        address: address.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      const loginData = await loginAction({ email: email.trim(), password });
      saveSession(loginData);
      onAuthSuccess();
    } catch (err) {
      setError(getAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <AuthHeader title="Crea tu cuenta segura" subtitle="Unete a la plataforma P2P descentralizada en Avalanche" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="button"
          onClick={() => connectWallet().catch((err) => setError(err instanceof Error ? err.message : "No se pudo conectar MetaMask."))}
          className="w-full px-4 py-3 bg-brand-sidebar border border-white/5 hover:border-brand-purple/40 rounded-xl text-sm text-gray-200 transition-all flex items-center justify-between"
        >
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
            {address ? "Wallet conectada" : "Conectar MetaMask"}
          </span>
          <span className="text-xs text-brand-purple font-semibold">
            {isConnecting ? "Conectando..." : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Conectar"}
          </span>
        </button>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Nombre de usuario</label>
          <input
            type="text"
            placeholder="AvaTrader"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Correo electronico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
          />
        </div>

        <div>
          <PasswordInput
            label="Contrasena"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            value={password}
            onChange={setPassword}
          />
          <div className="flex items-center space-x-1 mt-2">
            <div className="h-0.5 w-full rounded-full bg-white/5" />
            <div className="h-0.5 w-1/2 rounded-full bg-yellow-500/50" />
            <div className="h-0.5 w-1/4 rounded-full bg-brand-purple/50" />
          </div>
          <span className="text-[9px] text-gray-500 mt-1">Minimo 6 caracteres</span>
        </div>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/5 bg-brand-sidebar text-brand-purple focus:ring-brand-purple"
          />
          <span className="text-[10px] text-gray-500 leading-relaxed">
            Acepto los terminos de servicio y las politicas de contratos inteligentes de AvaSafe
          </span>
        </label>

        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all"
        >
          {isSubmitting ? "Creando..." : "Crear Cuenta"}
        </button>
      </form>

      <WalletDivider text="O registrarse con tu billetera" />
      <WalletButton text="Registrarse con Billetera Web3" />
      <p className="text-[9px] text-gray-600 text-center -mt-2">Tu wallet actuara como tu identidad principal sin contrasenas</p>

      <div className="text-center">
        <span className="text-[11px] text-gray-500">Ya tienes cuenta? </span>
        <button onClick={onSwitch} className="text-[11px] text-brand-purple hover:underline font-semibold">
          Inicia sesion aqui
        </button>
      </div>
    </div>
  );
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <img src="/AvaSafe_Logo.png" alt="AvaSafe" className="w-10 h-10 object-contain" />
        <div className="flex flex-col items-start">
          <span className="text-2xl font-bold tracking-tight">AvaSafe</span>
          <span className="text-xs text-brand-purple -mt-1 font-semibold">Market</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}

function PasswordInput({
  label,
  showPassword,
  setShowPassword,
  value,
  onChange,
}: {
  label: string;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</label>
      <div className="relative mt-1">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full px-4 py-3 bg-brand-sidebar border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-brand-purple transition-all outline-none pr-10"
        />
        <button
          type="button"
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
  );
}

function WalletDivider({ text }: { text: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/5" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-[10px] text-gray-500 bg-brand-dark">{text}</span>
      </div>
    </div>
  );
}

function WalletButton({ text }: { text: string }) {
  return (
    <button className="w-full py-3 bg-brand-sidebar border border-white/5 hover:border-brand-purple/40 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-3">
      <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      <span>{text}</span>
    </button>
  );
}
