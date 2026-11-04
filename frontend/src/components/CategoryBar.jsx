import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  totalCount
}) {
  return (
    <div className="bg-white border-b border-zinc-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-sm scale-102'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter Toggle and Sort Dropdown */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Showing <strong className="text-zinc-800">{totalCount}</strong> pieces
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs bg-zinc-100 hover:bg-zinc-200/70 text-zinc-800 font-semibold pl-8 pr-8 py-2 rounded-full border-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer appearance-none"
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
            onClick={onToggleFilters}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              showFilters
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

      </div>
    </div>
  );
}
