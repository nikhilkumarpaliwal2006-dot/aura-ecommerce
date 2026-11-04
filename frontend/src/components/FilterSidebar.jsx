import React from 'react';
import { X, RotateCcw, Star } from 'lucide-react';

export default function FilterSidebar({
  isOpen,
  onClose,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  minRating,
  onRatingChange,
  onResetFilters
}) {
  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-zinc-200 py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">Refine Selection</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3">
              Maximum Price: <strong className="text-zinc-900">${priceRange}</strong>
            </label>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
              <span>$50</span>
              <span>$300</span>
              <span>$600+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3">
              Customer Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Ratings', value: 0 },
                { label: '4.5+ Stars', value: 4.5 },
                { label: '4.8+ Stars', value: 4.8 }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onRatingChange(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    minRating === opt.value
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {opt.value > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3">
              Availability
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-xs font-medium text-zinc-700 group-hover:text-zinc-900">
                In Stock & Ready to Dispatch Only
              </span>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}
