import { useLanguage } from "../context/LanguageContext";

export function PlatformStatsStrip() {
  const { t } = useLanguage();
  const stats = [
    { value: "12,458+", label: t.common.activeUsers },
    { value: "3,245+", label: t.common.listedProducts },
    { value: "8,932+", label: t.common.transactions },
    { value: "99.9%", label: t.common.secureTransactions },
  ];

  return (
    <div className="py-4 px-6 mt-4 border-t border-violet-500/10 bg-[#1e1e24]/30 rounded-xl grid grid-cols-4 gap-4 items-center justify-items-center">
      {stats.map((m) => (
        <div key={m.label} className="flex items-center space-x-3">
          <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{m.value}</span>
            <span className="text-[9px] text-gray-500 uppercase font-semibold">{m.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SidebarInfoCards({
  variant = "default",
}: {
  variant?: "default" | "compras" | "favoritos" | "offers";
}) {
  const { t } = useLanguage();

  const cards =
    variant === "compras"
      ? [
          { title: t.common.decentralizedTx, body: t.compras.escrowSidebar, cta: t.common.howItWorks },
          { title: t.common.userVerification, body: t.compras.verificationSidebar, cta: t.common.seeMore },
          { title: t.common.support247, body: t.common.support247Body, cta: t.common.connectSupport },
        ]
      : variant === "favoritos"
        ? [
            { title: t.favoritos.smartList, body: t.favoritos.subtitle, cta: t.common.howItWorks },
            { title: t.favoritos.productVerification, body: t.common.userVerificationBody, cta: t.common.seeMore },
            { title: t.common.support247, body: t.common.support247Body, cta: t.common.connectSupport },
          ]
        : variant === "offers"
          ? [
              { title: t.offers.quickOffers, body: t.common.decentralizedTxBody, cta: t.common.howItWorks },
              { title: t.offers.secureNegotiation, body: t.common.userVerificationBody, cta: t.common.seeMore },
              { title: t.common.support247, body: t.common.support247Body, cta: t.common.connectSupport },
            ]
          : [
              { title: t.common.decentralizedTx, body: t.common.decentralizedTxBody, cta: t.common.howItWorks },
              { title: t.common.userVerification, body: t.common.userVerificationBody, cta: t.common.seeMore },
              { title: t.common.support247, body: t.common.support247Body, cta: t.common.connectSupport },
            ];

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
          <h4 className="text-xs font-bold leading-tight mb-3">{card.title}</h4>
          <p className="text-[10px] text-gray-500 mb-2">{card.body}</p>
          <button type="button" className="text-[9px] text-brand-purple hover:underline">
            {card.cta} →
          </button>
        </div>
      ))}
    </div>
  );
}
