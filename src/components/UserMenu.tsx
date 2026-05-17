import { useState, useRef, useEffect } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";
import { useLanguage } from "../context/LanguageContext";

export default function UserMenu({
  isLoggedIn,
  onLogin,
  onLogout = () => {},
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout?: () => void;
}) {
  const { t } = useLanguage();
  const { address, isConnected, isConnecting, connectWallet } = useMetaMask();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-3">
        {!isConnected && (
          <button
            type="button"
            onClick={() => connectWallet().catch(() => undefined)}
            className="px-3 py-2 bg-brand-purple/15 border border-brand-purple/30 text-brand-purple rounded-xl text-xs font-bold hover:bg-brand-purple/25 transition-all"
          >
            {isConnecting ? t.userMenu.connecting : t.userMenu.connectWallet}
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-3 px-3 py-1.5 bg-brand-sidebar rounded-full border border-white/5 hover:bg-brand-sidebar/80 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-purple to-brand-accent flex items-center justify-center text-[10px] font-bold text-white">
              {address ? address.slice(2, 4).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold">{address ? address.slice(0, 6) + "..." + address.slice(-4) : t.userMenu.user}</span>
              <span className={`text-[9px] px-1 rounded ${isConnected ? "bg-brand-purple/20 text-brand-purple" : "bg-yellow-500/15 text-yellow-400"}`}>
                {isConnected ? "Online" : t.userMenu.walletPending}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-brand-sidebar border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-gray-500 font-mono truncate">{address || t.userMenu.user}</p>
              </div>

              <div className="py-1">
                <button type="button" className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>{t.userMenu.profile}</span>
                </button>
                <button type="button" className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>{t.userMenu.settings}</span>
                </button>
              </div>

              <div className="border-t border-white/5 py-1">
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>{t.userMenu.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onLogin}
      className="flex items-center space-x-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-purple/20"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      <span>{t.userMenu.signIn}</span>
    </button>
  );
}
