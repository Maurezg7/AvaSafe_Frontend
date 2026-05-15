const defaultCards = [
  {
    icon: "settings",
    title: "Transacciones Descentralizadas",
    desc: "Sin intermediarios. Tu dinero y tus datos siempre están bajo control.",
    action: "Cómo funciona →",
    path: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
  },
  {
    icon: "shield",
    title: "Verificación de Usuarios",
    desc: "Perfiles verificados para garantizar confianza en cada operación.",
    action: "Ver más →",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    icon: "support",
    title: "Soporte 24/7",
    desc: "Nuestro equipo está disponible para ayudarte en cualquier momento.",
    action: "Conectar Soporte →",
    path: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
  },
];

type SidebarCard = {
  icon: string;
  title: string;
  desc: string;
  action: string;
  path: string;
};

export default function SidebarCards({ cards = defaultCards }: { cards?: SidebarCard[] }) {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={card.path} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <h4 className="text-xs font-bold leading-tight">{card.title}</h4>
          </div>
          <p className="text-[10px] text-gray-500 mb-2">{card.desc}</p>
          <button className="text-[9px] text-brand-purple hover:underline">{card.action}</button>
        </div>
      ))}
    </div>
  );
}
