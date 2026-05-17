import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AuthPage from "./AuthPage";

export default function RegisterPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen w-full bg-[#0d0d11] flex flex-col justify-center items-center px-4">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher compact />
      </div>
      <AuthPage onAuthSuccess={onAuthSuccess} />
      <p className="text-[10px] text-gray-600 mt-6">{t.auth.footer}</p>
    </div>
  );
}
