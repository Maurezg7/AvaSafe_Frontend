import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../components/NotificationDropdown";
import ShieldDropdown from "../components/ShieldDropdown";
import UserMenu from "../components/UserMenu";
import { productosService } from "../api/productos.service";
import { useLanguage } from "../context/LanguageContext";

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

const conditions = ["Nuevo", "Usado"] as const;

export default function VenderPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shieldOpen, setShieldOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    subcategory: "",
    condition: "Nuevo" as string,
    location: "",
  });

  const address = localStorage.getItem("avasafe_wallet_address") || "";

  useEffect(() => {
    if (!address) return;
    productosService.findByUser(address)
      .then((res) => setMyProducts(res.data))
      .catch(() => {
        const stored = localStorage.getItem("my_products");
        if (stored) {
          try { setMyProducts(JSON.parse(stored)); } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", image_url: "", category: "", subcategory: "", condition: "Nuevo", location: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSubmitting(true);
    try {
      const res = await productosService.create({
        name: form.name,
        price: Number(form.price),
        description: form.description || undefined,
        category: form.category || undefined,
        subcategory: form.subcategory || undefined,
        condition: form.condition,
        location: form.location || undefined,
        image_url: form.image_url || undefined,
      });
      const newProduct = res.data;
      const updated = [newProduct, ...myProducts];
      setMyProducts(updated);
      localStorage.setItem("my_products", JSON.stringify(updated));
      resetForm();
    } catch {
      const fallback = {
        id_product: String(Date.now()),
        name: form.name,
        price: Number(form.price),
        description: form.description || undefined,
        category: form.category || undefined,
        subcategory: form.subcategory || undefined,
        condition: form.condition,
        location: form.location || undefined,
        image_url: form.image_url || "",
        seller: address,
        create: new Date().toISOString(),
      };
      const updated = [fallback, ...myProducts];
      setMyProducts(updated);
      localStorage.setItem("my_products", JSON.stringify(updated));
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (address) {
      productosService.remove(id, address).catch(() => {});
    }
    const updated = myProducts.filter((p: any) => p.id_product !== id);
    setMyProducts(updated);
  };

  const selectedCat = categories.find((c) => c.name === form.category);
  const subcategories = selectedCat?.subcategories ?? [];

  if (!isLoggedIn) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-brand-dark">
        <div className="text-center max-w-md px-8">
          <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">{t.vender.loginRequired}</h2>
          <p className="text-sm text-gray-400 mb-6">{t.vender.loginRequiredHint}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-sm font-bold transition-all"
          >
            {t.userMenu.signIn}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-brand-dark">
      <header className="sticky top-0 z-10 flex items-center justify-end px-8 py-4 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-6">
          <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          <ShieldDropdown isOpen={shieldOpen} onClose={() => setShieldOpen(false)} />
          <UserMenu isLoggedIn={isLoggedIn} onLogin={onLogin} />
        </div>
      </header>

      <section className="px-8 pt-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t.vender.title}</h1>
            <p className="text-sm text-gray-400 mb-6">{t.vender.subtitle}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-sm font-bold flex items-center space-x-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>{t.vender.createProduct}</span>
          </button>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-sidebar rounded-[2rem] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto no-scrollbar border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-bold text-white">{t.vender.publishProduct}</h2>
              <button onClick={() => !submitting && setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.productName}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. MacBook Pro 16"
                  className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.description}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder={t.vender.describeProduct}
                  rows={3}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.priceAvax}</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.condition}</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                  >
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c === "Nuevo" ? t.common.new : t.common.used}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.category}</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                  >
                    <option value="">{t.vender.select}</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.subcategory}</label>
                  <select
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    disabled={!form.category}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 focus:ring-1 focus:ring-brand-purple transition-all outline-none disabled:opacity-40"
                  >
                    <option value="">{t.vender.select}</option>
                    {subcategories.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.location}</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ej. Ciudad de México, MX"
                  className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">{t.vender.imageUrl}</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-brand-dark border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                />
              </div>

              {form.image_url && (
                <div className="rounded-xl overflow-hidden border border-white/5">
                  <img src={form.image_url} alt="preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-brand-dark border border-white/5 hover:border-white/20 text-gray-400 rounded-xl text-sm font-semibold transition-all"
                  disabled={submitting}
                >
                  {t.vender.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.price}
                  className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{t.vender.publishing}</span>
                    </>
                  ) : (
                    <span>{t.vender.publish}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="px-8 pb-8 flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <svg className="w-8 h-8 animate-spin text-brand-purple" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : myProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-lg font-medium">{t.vender.noProducts}</p>
            <p className="text-sm mt-1">{t.vender.noProductsHint}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-sm font-bold transition-all"
            >
              {t.vender.createProduct}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {myProducts.map((p: any) => (
              <article
                key={p.id_product}
                className="bg-brand-sidebar rounded-[2rem] p-5 flex flex-col border border-white/5 relative group hover:border-brand-purple/40 transition-all"
              >
                <div className="relative mb-4 rounded-2xl overflow-hidden aspect-[4/3] bg-brand-dark">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex space-x-1.5">
                    <span className="px-2 py-0.5 bg-brand-purple/80 text-white rounded-full text-[9px] font-semibold">{p.condition || t.common.new}</span>
                    {p.category && (
                      <span className="px-2 py-0.5 bg-white/10 text-gray-300 rounded-full text-[9px] font-semibold">{p.category}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(p.id_product)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/70 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-white leading-tight">{p.name}</h3>
                </div>
                <p className="text-[10px] text-gray-500 mb-3 line-clamp-2">{p.description || p.name}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-brand-purple/30 flex items-center justify-center text-[8px] font-bold text-brand-purple">
                    {(p.seller || "Y")[0]}
                  </div>
                  <span className="text-[10px] text-gray-500">{p.seller ? p.seller.slice(0, 6) + "..." + p.seller.slice(-4) : "Yo"}</span>
                  <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
                  </svg>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-brand-purple">{Number(p.price).toFixed(2)} AVAX</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple rounded-xl text-[10px] font-semibold transition-all">
                      {t.vender.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_product)}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-semibold transition-all"
                    >
                      {t.vender.delete}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
