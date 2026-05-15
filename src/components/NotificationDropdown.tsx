import { useEffect, useRef } from "react";

type Notification = {
  title: string;
  desc: string;
  time: string;
};

const notifications: Notification[] = [
  { title: "Nueva oferta recibida", desc: "Recibiste una oferta por MacBook Pro 16\"", time: "Hace 5 min" },
  { title: "Pago liberado", desc: "El pago por iPhone 16 Pro Max ha sido liberado", time: "Hace 2 horas" },
  { title: "Disputa actualizada", desc: "La disputa #DSP-2024 tiene un nuevo mensaje", time: "Hace 1 día" },
  { title: "Verificación completada", desc: "Tu cuenta ha sido verificada Nivel 2", time: "Hace 3 días" },
];

export default function NotificationDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-[360px] bg-brand-sidebar border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Notificaciones</h3>
        <button className="text-[10px] text-brand-purple hover:underline">Marcar todas leídas</button>
      </div>
      {notifications.map((n, i) => (
        <div
          key={i}
          className="flex items-start space-x-3 px-3 py-2.5 bg-brand-dark rounded-xl border border-white/5 hover:border-brand-purple/20 transition-all cursor-pointer group"
        >
          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-brand-purple" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white group-hover:text-brand-purple transition-colors">{n.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{n.desc}</p>
          </div>
          <span className="text-[9px] text-gray-600 flex-shrink-0">{n.time}</span>
        </div>
      ))}
      <button className="w-full text-center text-[10px] text-brand-purple hover:underline py-1">Ver todas las notificaciones</button>
    </div>
  );
}
