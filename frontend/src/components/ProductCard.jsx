import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Heart, Eye, Plus, Check, Zap, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ProductCard({ product, onQuickView, onDirectBuy }) {
  const { addToCart, toggleWishlist, isWishlisted, cart } = useCart();
  const wishlisted = isWishlisted(product.id);
  const isInCart = cart.some(item => item.productId === product.id);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  // Discount percentage if originalPrice exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    soundManager.playAddToCart();
    addToCart(product, 1, { color: selectedColor });
  };

  const handleDirectBuy = (e) => {
    e.stopPropagation();
    soundManager.playDirectBuy();
    if (onDirectBuy) {
      onDirectBuy(product.id || product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    soundManager.playTap();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    soundManager.playTap();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image Container */}
      <div 
        onClick={handleQuickView}
        className="relative aspect-[4/3] bg-zinc-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 bg-zinc-950/90 text-amber-300 text-[10px] font-bold rounded-full backdrop-blur-md shadow-sm border border-amber-400/20">
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
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm cursor-pointer ${
            wishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/85 backdrop-blur-md text-zinc-600 hover:bg-white hover:text-zinc-900'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Low Stock Indicator */}
        {product.stockQuantity && product.stockQuantity <= 15 && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-sm text-zinc-950 font-bold text-[9px] uppercase tracking-wider">
              Only {product.stockQuantity} Left
            </span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            onClick={handleQuickView}
            className="pointer-events-auto px-4 py-2 bg-white/95 text-zinc-900 font-bold text-xs rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
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
            onClick={handleQuickView}
            className="font-bold text-sm text-zinc-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription || product.description}
          </p>

          {/* Interactive Color Swatches if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Shade:</span>
              <div className="flex flex-wrap items-center gap-1">
                {product.colors.slice(0, 3).map((col, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playTap();
                      setSelectedColor(col);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      selectedColor === col
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Direct Shopping Actions */}
        <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-zinc-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              Free Express
            </span>
          </div>

          {/* Action Button Row: Direct Price Buy + Add to Bag */}
          <div className="grid grid-cols-5 gap-1.5">
            {/* Direct Price Buy Button */}
            <button
              onClick={handleDirectBuy}
              className="col-span-3 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
              title="Instant Direct Purchase"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Direct Buy</span>
            </button>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className={`col-span-2 py-2 px-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 text-xs font-bold cursor-pointer ${
                isInCart
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white hover:scale-102 active:scale-98'
              }`}
              title="Add to cart"
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
