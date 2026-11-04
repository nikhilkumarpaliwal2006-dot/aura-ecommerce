import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistModal({ isOpen, onClose, onQuickView }) {
  if (!isOpen) return null;

  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Saved Favorites</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full">
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="overflow-y-auto p-6 space-y-3 flex-1">
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mx-auto mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1">Your wishlist is currently empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
                Save pieces you love while browsing to keep track of them here.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-all shadow-md"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlist.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-zinc-50 hover:bg-zinc-100/70 rounded-2xl border border-zinc-200 transition-all"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-xl bg-white border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                    className="font-bold text-xs text-zinc-900 hover:text-amber-700 cursor-pointer truncate"
                  >
                    {product.title}
                  </h4>
                  <div className="text-xs font-extrabold text-zinc-900 mt-1">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                    }}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Move to Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-white rounded-xl transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
