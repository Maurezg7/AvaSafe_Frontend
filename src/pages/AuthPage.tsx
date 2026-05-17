import { useWalletAuth } from "../../hooks/useWalletAuth";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  return (
    <div className="w-full max-w-md px-8 py-10">
      <WalletConnectView onAuthSuccess={onAuthSuccess} />
    </div>
  );
}

function WalletConnectView({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const { t } = useLanguage();
  const { isAuthenticating, error, connectAndAuth } = useWalletAuth();

  const handleConnect = async () => {
    try {
      await connectAndAuth();
      onAuthSuccess();
    } catch {
      // error is set in the hook
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img src="/AvaSafe_Logo.png" alt="AvaSafe" className="w-10 h-10 object-contain" />
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold tracking-tight">AvaSafe</span>
            <span className="text-xs text-brand-purple -mt-1 font-semibold">{t.brand.market}</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">{t.auth.connectTitle}</h1>
        <p className="text-sm text-gray-500 mt-2">{t.auth.connectSubtitle}</p>
      </div>

      <button
        type="button"
        onClick={handleConnect}
        disabled={isAuthenticating}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-purple/30 via-brand-purple/20 to-brand-accent/30 p-[1px] transition-all hover:from-brand-purple/50 hover:via-brand-purple/30 hover:to-brand-accent/50 disabled:opacity-50"
      >
        <div className="relative flex items-center justify-center space-x-4 px-6 py-4 rounded-xl bg-brand-dark/90 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-accent flex items-center justify-center shadow-lg shadow-brand-purple/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-bold text-white">
              {isAuthenticating ? t.auth.signingMessage : t.auth.connectWallet}
            </span>
            <span className="text-[10px] text-gray-500">
              {isAuthenticating ? t.auth.confirmingWallet : t.auth.avalancheHint}
            </span>
          </div>
          {isAuthenticating && (
            <svg className="w-5 h-5 text-brand-purple animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {!isAuthenticating && (
            <svg className="w-5 h-5 text-brand-purple group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </div>
      </button>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
          {error}
        </p>
      )}

      <p className="text-[9px] text-gray-600 text-center">{t.auth.noPassword}</p>
    </div>
  );
}
