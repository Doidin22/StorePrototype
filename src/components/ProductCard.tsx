import { ShoppingCart } from 'lucide-react';

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  onAddToCart: (product: any) => void;
}

export function ProductCard({ product, onAddToCart }: ProductProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      
      {/* Imagem */}
      <div className="h-72 overflow-hidden relative bg-gray-100 dark:bg-gray-700">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badge de Categoria */}
        <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md dark:text-white">
          {product.category}
        </span>

        {/* Botão de Ação */}
        <button 
          onClick={() => onAddToCart(product)} 
          className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Infos */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Coleção 2024</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </div>
  );
}