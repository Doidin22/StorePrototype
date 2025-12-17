import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Sun, Moon, User, LogOut, Search, CreditCard, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner'; // 1. Importação da Notificação
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { LoginModal } from './components/LoginModal';
import { products } from './data/products';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

function App() {
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem('loja-cart-v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [user, setUser] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem('loja-cart-v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const handleLogin = (email: string) => {
    setUser(email);
    toast.success(`Bem-vindo, ${email.split('@')[0]}!`);
  };

  const handleLogout = () => {
    setUser(null);
    toast.info("Você saiu da conta.");
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
    // 2. Disparo da Notificação
    toast.success(`${product.name} adicionado!`, {
      description: "Ótima escolha para o seu estilo.",
      action: {
        label: "Ver",
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    toast.error("Item removido.");
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Todos", "Básicas", "Estampadas", "Streetwear"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* 3. Componente VISUAL das Notificações (Obrigatório estar aqui) */}
      <Toaster richColors position="top-center" closeButton />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin} 
      />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight min-w-fit cursor-pointer"
            onClick={() => {setSelectedCategory("Todos"); setSearchQuery("")}}
          >
            Store<span className="text-blue-600">.Camisas</span>
          </motion.h1>

          {/* BARRA DE PESQUISA (Agora visível em telas maiores) */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar camisas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none"
            />
          </div>
          
          {/* Botões da Direita */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <User size={20} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group">
              <ShoppingBag size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors" />
              {cart.length > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* BARRA DE PESQUISA MOBILE (Aparece embaixo do header em telas pequenas) */}
        <div className="md:hidden px-4 pb-3 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="O que você procura?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none"
            />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 md:pt-32 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-multiply" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
              Nova Coleção 2024 🚀
            </span>
            <h2 className="text-4xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Vista o futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">com estilo.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Moda desenvolvida para quem cria o futuro.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-24 flex-grow w-full">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado com "{searchQuery}".</p>
             <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-600 hover:underline">Limpar pesquisa</button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Store.Camisas</h3>
              <p className="text-gray-500 dark:text-gray-400">Qualidade e código limpo.</p>
              <div className="flex gap-4 mt-4 text-gray-400">
                <Instagram size={20} /> <Facebook size={20} /> <Twitter size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Ajuda</h4>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>Entregas</li>
                <li>Trocas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Pagamento</h4>
              <div className="flex gap-2 text-gray-400">
                <CreditCard /> <span>PIX / Boleto</span>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs">
            © 2024 Ronald Alencar.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;