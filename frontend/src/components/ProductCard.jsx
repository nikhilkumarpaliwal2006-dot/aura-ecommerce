import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Heart, Eye, Plus, Check } from 'lucide-react';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isWishlisted, cart } = useCart();
  const wishlisted = isWishlisted(product.id);
  const isInCart = cart.some(item => item.productId === product.id);

  // Discount percentage if originalPrice exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-zinc-900/90 text-white text-[11px] font-bold rounded-full backdrop-blur-md shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            wishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 backdrop-blur-md text-zinc-600 hover:bg-white hover:text-zinc-900'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            onClick={() => onQuickView(product)}
            className="pointer-events-auto px-4 py-2 bg-white/95 text-zinc-900 font-bold text-xs rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-800">{product.rating}</span>
              <span className="text-zinc-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-sm text-zinc-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1 mb-1.5"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-zinc-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1 text-xs font-bold ${
              isInCart
                ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white hover:scale-105 active:scale-95'
            }`}
            title="Add to cart"
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">In Cart</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
