import { useEffect, useRef } from "react";

export default function ShieldDropdown({
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
      className="absolute right-0 mt-3 w-80 bg-[#1e1e24] border border-violet-500/20 rounded-2xl p-4 shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="text-sm font-bold text-white">Seguridad de la Cuenta</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Protegido</span>
      </div>
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-300 mb-1">Verificación de Identidad</p>
        <p className="text-xs text-green-400 mb-1">✓ Nivel 2 - Verificado</p>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Tu billetera está vinculada a una identidad verificada en la red Avalanche. Tienes acceso completo a ofertas con Escrow Cifrado.
        </p>
      </div>
      <div className="border-t border-white/5 mb-3" />
      <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
        Contratos de fianza eERC validados. Metadata cifrada de extremo a extremo activa.
      </p>
      <button className="w-full text-center text-xs text-brand-purple hover:text-white font-semibold transition-colors">
        Gestionar Seguridad →
      </button>
    </div>
  );
}
