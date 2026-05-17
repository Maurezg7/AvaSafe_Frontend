import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AuthPage from "./AuthPage";

export default function LoginPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#0d0d11] flex flex-col justify-center items-center px-4">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 px-3 py-2 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{t.auth.backToHome}</span>
      </button>
      <div className="absolute top-6 right-6">
        <LanguageSwitcher compact />
      </div>
      <AuthPage onAuthSuccess={onAuthSuccess} />
      <p className="text-[10px] text-gray-600 mt-6">{t.auth.footer}</p>
    </div>
  );
}
