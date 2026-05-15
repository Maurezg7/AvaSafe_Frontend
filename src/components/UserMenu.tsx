// TODO: Integrar hook useAccount de Wagmi para detectar wallet conectada
// import { useAccount, useDisconnect } from "wagmi";

export default function UserMenu({
  isLoggedIn,
  onLogin,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
}) {
  if (isLoggedIn) {
    return (
      <button className="flex items-center space-x-3 px-3 py-1.5 bg-brand-sidebar rounded-full border border-white/5 hover:bg-brand-sidebar/80 transition-all">
        <img src="https://i.pravatar.cc/100" alt="Avatar" className="w-7 h-7 rounded-full border border-brand-purple/50" />
        <div className="flex flex-col items-start leading-tight">
          {/* TODO: Reemplazar con useAccount().address truncado */}
          <span className="text-xs font-semibold">AvaTrader</span>
          <span className="text-[9px] px-1 bg-brand-purple/20 text-brand-purple rounded">Verificado</span>
        </div>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="flex items-center space-x-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-purple/20"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      <span>Iniciar Sesión</span>
    </button>
  );
}
