import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Tag, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

const PRICE_BUCKETS = [
  { label: 'All Budgets', max: 100000 },
  { label: 'Under ₹10k', max: 10000 },
  { label: '₹10k - ₹25k', max: 25000 },
  { label: '₹25k - ₹45k', max: 45000 },
  { label: '₹45k+ Luxury', max: 100000 }
];

export default function CategoryBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  totalCount,
  activePriceBucket,
  onSelectPriceBucket
}) {
  return (
    <div className="bg-white border-b border-zinc-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2.5">
        
        {/* Row 1: Categories & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playTap();
                    onSelectCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white shadow-sm scale-102 font-bold'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Filter Toggle and Sort Dropdown */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="text-xs text-zinc-400 font-medium hidden md:inline">
              <strong className="text-zinc-800">{totalCount}</strong> items
            </div>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => {
                  soundManager.playTap();
                  onSortChange(e.target.value);
                }}
                className="text-xs bg-zinc-100 hover:bg-zinc-200/70 text-zinc-800 font-semibold pl-8 pr-7 py-1.5 rounded-full border-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer appearance-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Toggle Sidebar Filter Button */}
            <button
              onClick={() => {
                soundManager.playTap();
                onToggleFilters();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                showFilters
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

        </div>

        {/* Row 2: Quick Direct Price Filter Options */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-zinc-100 text-xs">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Direct Price:</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {PRICE_BUCKETS.map((bucket, idx) => {
              const isBucketActive = activePriceBucket === bucket.label;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playTap();
                    if (onSelectPriceBucket) onSelectPriceBucket(bucket);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isBucketActive
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {bucket.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
