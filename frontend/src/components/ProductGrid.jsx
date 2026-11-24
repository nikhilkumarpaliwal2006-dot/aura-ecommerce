import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ProductGrid({
  products = [],
  loading = false,
  highlightedProductId = null,
  onQuickView,
  onDirectBuy,
  onResetFilters
}) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-zinc-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
                <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-200 rounded w-full"></div>
                <div className="h-8 bg-zinc-200 rounded-xl mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">No Matching Products Found</h3>
        <p className="text-sm text-zinc-500 mb-6">
          We couldn't find any pieces matching your search or active filter criteria.
        </p>
        <button
          onClick={() => {
            soundManager.playTap();
            if (onResetFilters) onResetFilters();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-all shadow-md cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isHighlighted={highlightedProductId === product.id}
            onQuickView={onQuickView}
            onDirectBuy={onDirectBuy}
          />
        ))}
      </div>
    </div>
  );
}
