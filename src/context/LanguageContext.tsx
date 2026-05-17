import { createContext, useContext, type ReactNode } from "react";

const defaultTranslations = {
  vender: {
    title: "Vender productos",
    subtitle: "Publica tus artículos en el marketplace descentralizado",
    general: "General",
    notSpecified: "No especificado",
    now: "Ahora",
  },
  explorer: {
    makePrivateOffer: "Hacer oferta privada",
    noResults: "No hay productos",
    noResultsHint: "Vuelve más tarde o ajusta los filtros",
  },
};

type Translations = typeof defaultTranslations;

const LanguageContext = createContext<Translations>(defaultTranslations);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={defaultTranslations}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const t = useContext(LanguageContext);
  return { t };
}
