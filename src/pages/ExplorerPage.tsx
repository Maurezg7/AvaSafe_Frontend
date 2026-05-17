import axios from "axios";
import { useState, useEffect, useRef } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useProduct } from "../../hooks/useProductos";
import type { ProductoInterface } from "../interfaces/producto.interface";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "../../hooks/useMetaMask";
import { ordenesService } from "../api/ordenes.service";
import { getBuyerAddress } from "../lib/session";

type Filters = {
  category: string;
  subcategory: string;
  condition: string[];
  priceMin: string;
  priceMax: string;
  location: string;
  sellerType: string[];
  minRating: number;
};

const categories = [
  {
    name: "Electrónica",
    subcategories: ["Computadoras y Laptops", "Celulares y Smartphones", "Tablets y Accesorios", "Audio y Equipos de Sonido", "Cámaras y Fotografía", "Videojuegos y Consolas"],
  },
  {
    name: "Moda",
    subcategories: ["Ropa y Accesorios", "Relojes y Joyería", "Zapatos", "Bolsos y Carteras"],
  },
  {
    name: "Hogar y Muebles",
    subcategories: ["Electrodomésticos", "Muebles", "Decoración", "Jardín y Herramientas"],
  },
  {
    name: "Deportes y Fitness",
    subcategories: ["Equipamiento Deportivo", "Ropa Deportiva", "Suplementos", "Ciclismo"],
  },
  {
    name: "Vehículos",
    subcategories: ["Autos", "Motos", "Bicicletas", "Accesorios para Vehículos"],
  },
  {
    name: "Salud y Belleza",
    subcategories: ["Cuidado Personal", "Maquillaje", "Perfumes y Fragancias", "Suplementos Alimenticios"],
  },
  {
    name: "Juguetes y Hobbies",
    subcategories: ["Juguetes", "Coleccionables", "Instrumentos Musicales", "Arte y Manualidades"],
  },
  {
    name: "Libros y Música",
    subcategories: ["Libros Físicos", "E-books", "Música", "Películas y Series"],
  },
];

export default function ExplorerPage({
  isLoggedIn,
  onLogin,
  onLogout,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const { t, tr } = useLanguage();
  const navigate = useNavigate();
  const { address, isConnected, connectWallet } = useMetaMask();
  const { queryProductos } = useProduct();
  const data = queryProductos.data ?? [];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    subcategory: "",
    condition: [],
    priceMin: "",
    priceMax: "",
    location: "",
    sellerType: [],
    minRating: 0,
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    precio: false,
    condicion: false,
    ubicacion: false,
    vendedor: false,
    rating: false,
  });
  const [shieldOpen, setShieldOpen] = useState(false);
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const resolveBuyerAddress = async (): Promise<string | null> => {
    const fromSession = getBuyerAddress();
    if (fromSession) return fromSession;
    if (address) return address;
    try {
      return await connectWallet();
    } catch {
      return null;
    }
  };

  const handleBuy = async (product: ProductoInterface) => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    let buyer: string | null = null;
    try {
      setBuyingProductId(product.id_product);
      buyer = await resolveBuyerAddress();
      if (!buyer) {
        alert(t.explorer.connectWallet);
        return;
      }

      const amount = typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price));

      await ordenesService.create({
        buyer,
        seller: product.seller,
        nro_pedido: product.nro_pedido || `PED-${product.id_product.slice(0, 8)}-${Date.now()}`,
        state: "proceso",
        ...(Number.isFinite(amount) && amount > 0 ? { amountAvax: amount } : {}),
      });

      navigate("/compras");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        const text = Array.isArray(message) ? message.join(". ") : message;
        alert(typeof text === "string" ? text : t.explorer.orderFailed);
      } else {
        alert(t.explorer.orderFailedRetry);
      }
    } finally {
      setBuyingProductId(null);
    }
  };

  const goToOffer = async (productId: string | number) => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    if (!isConnected) {
      try {
        await connectWallet();
      } catch {
        return;
      }
    }

    navigate(`/ofertas/${productId}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (cat: string) => {
    const next = cat === selectedCategory ? "" : cat;
    setSelectedCategory(next);
    setSelectedSubcategory("");
    setFilters((prev) => ({ ...prev, category: next, subcategory: "" }));
  };

  const handleSubcategorySelect = (sub: string) => {
    const next = sub === selectedSubcategory ? "" : sub;
    setSelectedSubcategory(next);
    setCategoryOpen(false);
    setFilters((prev) => ({ ...prev, subcategory: next }));
  };

  const toggleFilter = (key: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayFilter = (key: "condition" | "sellerType", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      subcategory: "",
      condition: [],
      priceMin: "",
      priceMax: "",
      location: "",
      sellerType: [],
      minRating: 0,
    });
    setSelectedCategory("");
    setSelectedSubcategory("");
  };


  const selectedCatObj = categories.find((c) => c.name === (selectedCategory || filters.category));
  const activeLabel = selectedSubcategory || selectedCategory || "{t.common.allCategories}";

  const activeFilterCount =
    (filters.condition.length > 0 ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.sellerType.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex-1 flex items-center space-x-4 max-w-3xl relative z-50 overflow-visible">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={t.explorer.searchPlaceholder}
              className="block w-full pl-10 pr-3 py-2 bg-brand-sidebar border-none text-sm rounded-xl focus:ring-1 focus:ring-brand-purple text-gray-200 placeholder-gray-500 transition-all"
            />
          </div>

          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                selectedCategory
                  ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30"
                  : "bg-brand-sidebar text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="max-w-[140px] truncate">{activeLabel}</span>
              <svg className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {categoryOpen && (
              <div className="absolute left-0 mt-2 w-[520px] bg-[#1e1e24] border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out overflow-hidden z-50 flex">
                <div className="w-1/2 border-r border-white/5 py-2 max-h-[320px] overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); setCategoryOpen(false); setFilters((prev) => ({ ...prev, category: "", subcategory: "" })); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      !selectedCategory ? "text-brand-purple bg-brand-purple/10 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t.common.allCategories}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === cat.name ? "text-brand-purple bg-brand-purple/10 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="w-1/2 py-2 max-h-[320px] overflow-y-auto no-scrollbar">
                  {selectedCatObj ? (
                    <>
                      <p className="px-4 py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{t.common.subcategories}</p>
                      {selectedCatObj.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSubcategorySelect(sub)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            selectedSubcategory === sub ? "text-brand-purple bg-brand-purple/10 font-semibold" : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs px-4 text-center">
                      {t.common.selectCategory}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm transition-colors relative ${
                filtersOpen || activeFilterCount > 0
                  ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30"
                  : "bg-brand-sidebar text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>{t.common.filters}</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-purple text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filtersOpen && (
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-brand-sidebar border border-violet-500/20 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 ease-out z-50 p-4 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Filtros</h3>
                  <button onClick={clearFilters} className="text-[11px] text-brand-purple hover:underline">{t.common.clearAll}</button>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {filters.condition.map((c) => (
                      <button key={c} onClick={() => toggleArrayFilter("condition", c)} className="flex items-center space-x-1 text-[10px] px-2 py-1 bg-brand-purple/15 text-brand-purple rounded-full border border-brand-purple/20">
                        <span>{c}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      </button>
                    ))}
                    {(filters.priceMin || filters.priceMax) && (
                      <button onClick={() => setFilters((prev) => ({ ...prev, priceMin: "", priceMax: "" }))} className="flex items-center space-x-1 text-[10px] px-2 py-1 bg-brand-purple/15 text-brand-purple rounded-full border border-brand-purple/20">
                        <span>${filters.priceMin || "0"} - ${filters.priceMax || "∞"}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      </button>
                    )}
                  </div>
                )}

                <div className="bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
                  <button onClick={() => toggleFilter("precio")} className="flex items-center justify-between w-full px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold hover:text-white transition-colors">
                    <span>{t.common.price}</span>
                    <svg className={`w-3 h-3 transition-transform ${collapsed.precio ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {!collapsed.precio && (
                    <div className="px-3 pb-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder={t.common.min} value={filters.priceMin} onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))} className="w-full bg-brand-sidebar border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple outline-none" />
                        <span className="text-gray-600 text-xs">a</span>
                        <input type="number" placeholder={t.common.max} value={filters.priceMax} onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))} className="w-full bg-brand-sidebar border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple outline-none" />
                      </div>
                      <p className="text-[9px] text-gray-600">{t.common.priceInAvax}</p>
                    </div>
                  )}
                </div>

                <div className="bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
                  <button onClick={() => toggleFilter("condicion")} className="flex items-center justify-between w-full px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold hover:text-white transition-colors">
                    <span>{t.common.condition}</span>
                    <svg className={`w-3 h-3 transition-transform ${collapsed.condicion ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {!collapsed.condicion && (
                    <div className="px-3 pb-3 space-y-1.5">
                      {[t.common.new, t.common.used].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                          <input type="checkbox" checked={filters.condition.includes(opt)} onChange={() => toggleArrayFilter("condition", opt)} className="w-3.5 h-3.5 rounded border-gray-600 bg-brand-sidebar text-brand-purple focus:ring-brand-purple/30 accent-brand-purple" />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
                  <button onClick={() => toggleFilter("ubicacion")} className="flex items-center justify-between w-full px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold hover:text-white transition-colors">
                    <span>{t.common.location}</span>
                    <svg className={`w-3 h-3 transition-transform ${collapsed.ubicacion ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {!collapsed.ubicacion && (
                    <div className="px-3 pb-3">
                      <input type="text" placeholder={t.common.cityPlaceholder} value={filters.location} onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))} className="w-full bg-brand-sidebar border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple outline-none" />
                    </div>
                  )}
                </div>

                <div className="bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
                  <button onClick={() => toggleFilter("vendedor")} className="flex items-center justify-between w-full px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold hover:text-white transition-colors">
                    <span>{t.common.sellerType}</span>
                    <svg className={`w-3 h-3 transition-transform ${collapsed.vendedor ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {!collapsed.vendedor && (
                    <div className="px-3 pb-3 space-y-1.5">
                      {[t.common.verified, t.common.notVerified].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                          <input type="checkbox" checked={filters.sellerType.includes(opt)} onChange={() => toggleArrayFilter("sellerType", opt)} className="w-3.5 h-3.5 rounded border-gray-600 bg-brand-sidebar text-brand-purple focus:ring-brand-purple/30 accent-brand-purple" />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
                  <button onClick={() => toggleFilter("rating")} className="flex items-center justify-between w-full px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold hover:text-white transition-colors">
                    <span>{t.common.minRating}</span>
                    <svg className={`w-3 h-3 transition-transform ${collapsed.rating ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  {!collapsed.rating && (
                    <div className="px-3 pb-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setFilters((prev) => ({ ...prev, minRating: prev.minRating === star ? 0 : star }))} className={`transition-colors ${filters.minRating >= star ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      {filters.minRating > 0 && <p className="text-[9px] text-brand-purple mt-1">{tr(t.common.fromStars, { n: filters.minRating })}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-purple ring-2 ring-brand-dark" />
            </button>
            <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          </div>

          <div className="relative">
            <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShieldOpen(!shieldOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />
          </div>

          <LanguageSwitcher compact />
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </header>

      <section className="px-8 py-10">
        <h1 className="text-4xl font-bold max-w-2xl leading-tight">
          {t.explorer.hero} <span className="text-brand-purple">{t.common.secure}</span> {t.common.and} <span className="text-brand-purple">{t.common.decentralized}</span>.
        </h1>
      </section>

      <section className="px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{t.explorer.featured}</h2>
          <span className="text-xs text-gray-500">{tr(t.common.results, { n: data.length })}</span>
        </div>
        {/* Agregado de leo , pedir productos al backend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.length > 0 ? data.map((product:ProductoInterface) => (
              <article
                key={product.id_product}
                className="bg-brand-sidebar rounded-[2rem] p-5 flex flex-col border border-white/5 relative group hover:border-brand-purple/40 transition-all"
              >
                <button className="absolute top-6 left-6 p-2 bg-brand-dark/40 rounded-full text-white/80 hover:text-brand-purple transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>

                {/* {product.badge && (
                  <div className="absolute top-6 right-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-brand-purple rounded-md shadow-lg shadow-brand-purple/20">
                      {product.badge}
                    </span>
                  </div>
                )} */}

                <div className="aspect-square rounded-2xl bg-brand-dark overflow-hidden mb-4 flex items-center justify-center p-4">
                  <img
                    src={product.image_url || "https://via.placeholder.com/400?text=Producto"}
                    alt={product.name}
                    className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://i.pravatar.cc/50"
                      alt={product.seller}
                      className="w-6 h-6 rounded-full border border-brand-purple/30"
                    />
                    <span className="text-xs font-medium text-gray-200">{product.seller}</span>
                    {/* {product.sellerVerified && (
                      <svg className="w-3.5 h-3.5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                      </svg>
                    )} */}
                  </div>
                  {/* <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    product.condition === "Nuevo" ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"
                  }`}>
                    {product.condition}
                  </span> */}
                </div>

                {/* <div className="flex items-center space-x-1 text-[10px] text-gray-500 mb-2">
                  <div className="flex items-center text-brand-purple">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-bold">{product.rating}</span>
                    <span className="text-gray-500 ml-0.5">({product.reviews})</span>
                  </div>
                  <span>•</span>
                  <span>{product.time}</span>
                  <span>•</span>
                  <span>{product.location}</span>
                </div> */}

                <h3 className="text-sm font-bold text-white mb-0.5">{product.name}</h3>
                {/* <p className="text-[10px] text-gray-500 mb-4">{product.description}</p> */}

                <div className="mt-auto">
                  <div className="flex flex-col mb-4">
                    <span className="text-lg font-bold text-brand-purple">{product.price} AVAX</span>
                    {/* <span className="text-[10px] text-gray-500">≈ {product.usd}</span> */}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      disabled={buyingProductId === product.id_product}
                      onClick={() => handleBuy(product)}
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <span>{buyingProductId === product.id_product ? t.explorer.processing : t.explorer.buyNow}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToOffer(product.id_product)}
                      className="flex-1 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>{t.explorer.offer}</span>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <p className="text-lg font-medium">{t.explorer.noResults}</p>
                <p className="text-sm mt-1">{t.explorer.noResultsHint}</p>
              </div>
            )}
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
                <span className="text-[9px] text-gray-500 uppercase font-semibold">{t.common.activeUsers}</span>
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
                <span className="text-[9px] text-gray-500 uppercase font-semibold">{t.common.listedProducts}</span>
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
                <span className="text-[9px] text-gray-500 uppercase font-semibold">{t.common.transactions}</span>
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
                <span className="text-[9px] text-gray-500 uppercase font-semibold">{t.common.secureTransactions}</span>
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
                <h4 className="text-xs font-bold leading-tight">{t.common.decentralizedTx}</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Sin intermediarios. Tu dinero y tus datos siempre están bajo control.</p>
              <button className="text-[9px] text-brand-purple hover:underline">{t.common.howItWorks} →</button>
            </div>

            <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold leading-tight">{t.common.userVerification}</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Perfiles verificados para garantizar confianza en cada operación.</p>
              <button className="text-[9px] text-brand-purple hover:underline">{t.common.seeMore} →</button>
            </div>

            <div className="bg-brand-sidebar rounded-2xl p-4 border border-white/5 group hover:border-brand-purple/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold leading-tight">{t.common.support247}</h4>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
              <button className="text-[9px] text-brand-purple hover:underline">{t.common.connectSupport} →</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
