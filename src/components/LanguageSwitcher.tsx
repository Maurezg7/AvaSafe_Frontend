import { useLanguage } from "../context/LanguageContext";
import type { Locale } from "../i18n/translations";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLanguage();

  const btn = (lang: Locale) => (
    <button
      key={lang}
      type="button"
      onClick={() => setLocale(lang)}
      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
        locale === lang
          ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      }`}
      aria-pressed={locale === lang}
      aria-label={lang === "es" ? "Español" : "English"}
    >
      {t.lang[lang]}
    </button>
  );

  if (compact) {
    return <div className="flex items-center gap-1">{btn("es")}{btn("en")}</div>;
  }

  return (
    <div className="px-4 pb-3">
      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
        {t.lang.label}
      </p>
      <div className="flex items-center gap-1 p-1 bg-brand-dark rounded-xl border border-white/5">
        {btn("es")}
        {btn("en")}
      </div>
    </div>
  );
}
