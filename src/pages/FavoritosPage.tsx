import { useState, useEffect, useRef } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";

type Product = {
  id: number;
  badge?: string;
  name: string;
  description: string;
  seller: string;
  rating: string;
  reviews: number;
  time: string;
  price: string;
  usd: string;
  image: string;
};

const favorites: Product[] = [
  {
    id: 1,
    badge: "Nuevo",
    name: 'MacBook Pro 16" M3 Max',
    description: "64GB RAM - 2TB SSD",
    seller: "TechSeller",
    rating: "4.9",
    reviews: 128,
    time: "Hoy",
    price: "2.85 AVAX",
    usd: "$2,184.25 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABOYQ0Ho6iHKTUbl2XWdSt3biQb6FN27ZWN9OGa6mMK7dv15Zl93muCEz-5ZX9NO1Cfh5ZveLEBfZmYSSq2Y1ugZCY8cdh2Oy-dW0hKuVQdELQ99tMLiCdiittxp4P0njek5vLG2LvBhk9an6CNCjzB_OXtUWWt5V1tPILBVi__bAAOBueWu1v3oH8LVTRin-DyRMckQn-VHOe6swU2QnbzkgPhnVJ3i8f0h1a2dXsWXrg2h5XrPtkcjfSDT8hatxsNcr_E78_g0Iq",
  },
  {
    id: 2,
    badge: "Popular",
    name: "Iphone 16 Pro Max",
    description: "8GB RAM - 1TB SSD",
    seller: "LuxTime",
    rating: "5.0",
    reviews: 89,
    time: "Ayer",
    price: "9.57 AVAX",
    usd: "$7,469.25 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Bksx3KtVTnSUfL7L2ATzAExSa8RAMYtFcXnEOWnpFGBOycBnEDloiFXbj2S9FLvfVHiWzHqYJdkVvnUxGDEN0eZrJOW6psFuxuqBXnuyjRC_1LvFl6DWY79IbL_I1xSX20aeqCEuDJn94R5Ltk4zUVjPo1eJEE_CVfOhtpB9k7hUqu3YGrYIzO-tS3FbBrDH4SEx9obSZFfPkrue0XcZSeHJZgwcZ95DU9s0okjX1-W0guuuE-59cdbRb6Pxvs23xRz9mrCXAm9",
  },
  {
    id: 3,
    badge: "Oferta",
    name: "Rolex Daytona",
    description: "Oystersteel - Black Dial",
    seller: "CryptoGear",
    rating: "4.8",
    reviews: 76,
    time: "2d",
    price: "1.25 AVAX",
    usd: "$957.75 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHCQA5bEVdqGEZVCh2ZF5aW-J8af47d4ZtDUYElK4XzQr9ST8ygaCiInCgD7wu524H70YSW7uLS5PzNxycQ15USYLzp4WBFA1SqCfXOr5bHI3_28Rv-pfKGFA5zat4lw3AkuV-NMcX4ufaIMTe0xhU6OubH7ytQf8qaSOPDgxrOv6Mr_qD6Ytv_IYxu-u1KL_gcM7fif-YbXBsfRxvr_sLrzlPn0X-KGPgzk_vaXhC9M0m_70ca97ZkNTl9BLhAaKf9C0szisJpKJg",
  },
  {
    id: 4,
    name: "Ipad Pro 11",
    description: "64GB RAM - 1TB SSD",
    seller: "SwissWatch",
    rating: "4.9",
    reviews: 56,
    time: "3d",
    price: "18.50 AVAX",
    usd: "$14,209.50 USD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCHKKB8ofzt9xC2APBHpxOTwL5mo2YQdi2uBoNgCIMh5dUgVBH1h5JCHyW1MKHs0JxJn30qHQ4um5bAIc3sKfzxfThrevrktXCzWI7W7gAfziDYxM7RJJfLz1CiLNCkghaGkZ2AmKWUra9WT8ayLB8Cwd2_uyRlJC07ryj6zRFa_DLTgakD1UctCW8WlHiFrLQpmjj9rsKVXFWxPcxj6dLdGD3OtODdvHS9RZkRQT9IP7IyzzNo9ee533ZUHGksOZk-6PKichQuZD",
  },
];

export default function FavoritosPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [estadoOpen, setEstadoOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const estadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (estadoRef.current && !estadoRef.current.contains(e.target as Node)) {
        setEstadoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex-1 flex items-center space-x-4 max-w-3xl">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar en favoritos..."
              className="block w-full pl-10 pr-3 py-2 bg-brand-sidebar border-none text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center space-x-2 px-4 py-2 bg-brand-sidebar rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Filtros</span>
            </button>
            {filtersOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-brand-sidebar border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Filtros</h3>
                  <button className="text-[11px] text-brand-purple hover:underline">Limpiar todo</button>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Condición</span>
                  <div className="flex gap-2 flex-wrap">
                    {["Nuevo", "Usado", "Reacondicionado"].map((c) => (
                      <button key={c} className="text-[10px] px-3 py-1.5 bg-brand-dark text-gray-400 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-colors">{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <NotificationDropdown
            isOpen={notificationsOpen}
            onToggle={() => setNotificationsOpen(!notificationsOpen)}
          />

          <ShieldDropdown
            isOpen={shieldOpen}
            onToggle={() => setShieldOpen(!shieldOpen)}
          />

          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} />
        </div>
      </header>

      <section className="px-8 py-10">
        <h1 className="text-4xl font-bold max-w-2xl leading-tight">
          Tus productos <span className="text-brand-purple">favoritos</span> en un entorno <span className="text-brand-purple">seguro</span> y <span className="text-brand-purple">descentralizado.</span>
        </h1>
        <p className="text-sm text-gray-500 mt-3">Guarda tus productos preferidos y accede a ellos rápidamente.</p>
      </section>

      <section className="px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Mis Favoritos</h2>
          <span className="text-[10px] text-gray-500 bg-brand-sidebar px-3 py-1.5 rounded-lg">{favorites.length} productos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <article
              key={product.id}
              className="bg-brand-sidebar rounded-[2rem] p-5 flex flex-col border border-white/5 relative group hover:border-brand-purple/40 transition-all"
            >
              <button className="absolute top-6 left-6 p-2 bg-brand-dark/40 rounded-full text-brand-purple transition-colors z-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>

              {product.badge && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-brand-purple rounded-md shadow-lg shadow-brand-purple/20">
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="aspect-square rounded-2xl bg-brand-dark overflow-hidden mb-4 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <img
                  src="https://i.pravatar.cc/50"
                  alt={product.seller}
                  className="w-6 h-6 rounded-full border border-brand-purple/30"
                />
                <span className="text-xs font-medium text-gray-200">{product.seller}</span>
                <svg className="w-3.5 h-3.5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                </svg>
              </div>

              <div className="flex items-center space-x-1 text-[10px] text-gray-500 mb-2">
                <div className="flex items-center text-brand-purple">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-bold">{product.rating}</span>
                  <span className="text-gray-500 ml-0.5">({product.reviews})</span>
                </div>
                <span>•</span>
                <span>{product.time}</span>
              </div>

              <h3 className="text-sm font-bold text-white mb-0.5">{product.name}</h3>
              <p className="text-[10px] text-gray-500 mb-4">{product.description}</p>

              <div className="mt-auto">
                <div className="flex flex-col mb-4">
                  <span className="text-lg font-bold text-brand-purple">{product.price}</span>
                  <span className="text-[10px] text-gray-500">≈ {product.usd}</span>
                </div>

                <button className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all">
                  <span>Hacer oferta privada</span>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 py-4 px-6 mt-4 border-t border-violet-500/10 bg-[#1e1e24]/30 rounded-xl grid grid-cols-4 gap-4 items-center justify-items-center">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">12,458+</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Usuarios Activos</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">3,245+</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Productos Listados</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">8,932+</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Transacciones</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-brand-purple/10 rounded-lg text-brand-purple">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">99.9%</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Transacciones Seguras</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold leading-tight">Lista Inteligente</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Recibe notificaciones cuando el precio de tus favoritos baje.</p>
              <button className="text-[9px] text-brand-purple hover:underline">Configurar alertas →</button>
            </div>

            <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold leading-tight">Verificación de Productos</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Productos autenticados y verificados por la comunidad.</p>
              <button className="text-[9px] text-brand-purple hover:underline">Ver más →</button>
            </div>

            <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold leading-tight">Soporte 24/7</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Estamos disponibles para ayudarte en cualquier momento.</p>
              <button className="text-[9px] text-brand-purple hover:underline">Conectar Soporte →</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
