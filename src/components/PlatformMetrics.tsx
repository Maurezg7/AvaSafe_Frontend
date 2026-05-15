const metrics = [
  {
    value: "12,458+",
    label: "Usuarios Activos",
    path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    value: "3,245+",
    label: "Productos Listados",
    path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5",
  },
  {
    value: "8,932+",
    label: "Transacciones",
    path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    value: "99.9%",
    label: "Transacciones Seguras",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

export default function PlatformMetrics() {
  return (
    <div className="py-4 px-6 mt-4 border-t border-violet-500/10 bg-[#1e1e24]/30 rounded-2xl grid grid-cols-4 gap-4 items-center justify-items-center">
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center space-x-3">
          <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d={m.path} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
