import { X, Trash2, ShoppingBag } from 'lucide-react';
import type { Product } from '../App';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (index: number) => void;
}

export function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem }: CartSidebarProps) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  function handleCheckout() {
    const phoneNumber = "5511999999999"; 
    const cartText = cartItems.map(item => 
      `- ${item.name} (R$ ${item.price.toFixed(2)})`
    ).join('%0A');

    const message = `*Novo Pedido na Store.Camisas!* 👕%0A%0A` +
      `*Itens:*%0A${cartText}%0A%0A` +
      `*Total: R$ ${total.toFixed(2)}*`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

  return (
    <>
      {/* Overlay Escuro */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* A Gaveta Lateral (Drawer) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l dark:border-gray-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Cabeçalho */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <ShoppingBag className="text-blue-600" />
              Seu Carrinho ({cartItems.length})
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Lista de Produtos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-4">
                <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700" />
                <p>Seu carrinho está vazio.</p>
                <button onClick={onClose} className="text-blue-600 font-semibold hover:underline">
                  Continuar comprando
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-100 dark:bg-gray-700" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                      <button 
                        onClick={() => onRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé (Total e Checkout) */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <button 
                onClick={handleCheckout} 
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-green-600/20 active:scale-95 transform transition-transform flex items-center justify-center gap-2"
              >
                Finalizar no WhatsApp
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}