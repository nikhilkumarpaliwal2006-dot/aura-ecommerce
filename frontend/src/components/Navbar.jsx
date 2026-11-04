import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Shield,
  Clock,
  LogOut,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenAuth,
  onOpenWishlist,
  onOpenOrders,
  onOpenAdmin,
  products = []
}) {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter top 4 quick matching search suggestions
  const searchSuggestions = searchTerm.trim().length > 1
    ? products
        .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 4)
    : [];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SPRING RELEASE</span>
        </span>
        <span className="hidden sm:inline text-zinc-500">|</span>
        <span className="hidden sm:inline">Complimentary express shipping on orders over $100</span>
        <span className="text-zinc-500">|</span>
        <span>Use code <strong className="text-white underline decoration-amber-400 decoration-2">WELCOME10</strong> for 10% off</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-zinc-900/10 group-hover:scale-105 transition-transform">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tighter text-zinc-900 leading-tight">
                    AURA
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400">
                    LIVING & CO.
                  </span>
                </div>
              </a>
            </div>

            {/* Interactive Search Bar */}
            <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search audio, watches, cashmere, accessories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 text-sm pl-10 pr-10 py-2.5 rounded-full border border-transparent focus:border-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Quick Suggestions
                  </div>
                  {searchSuggestions.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSearchTerm(product.title)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 text-left transition-colors"
                    >
                      <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-zinc-900 truncate">{product.title}</div>
                        <div className="text-xs text-zinc-500">{product.category} · ${product.price.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Admin Badge Quick Toggle */}
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-xs font-semibold rounded-full border border-amber-500/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-semibold hidden md:inline">
                    {isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden md:inline" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <div className="text-xs text-zinc-500">Signed in as</div>
                          <div className="text-sm font-bold text-zinc-900 truncate">{user.name}</div>
                          <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                              Administrator
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenOrders();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 text-left transition-colors"
                        >
                          <Clock className="w-4 h-4 text-zinc-400" />
                          <span>My Orders & Receipts</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onOpenAdmin();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 text-left transition-colors"
                          >
                            <Shield className="w-4 h-4 text-amber-500" />
                            <span>Store Management</span>
                          </button>
                        )}

                        <div className="border-t border-zinc-100 my-1"></div>

                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 text-center border-b border-zinc-100">
                          <p className="text-xs text-zinc-600 mb-2">Sign in to track orders and save your wishlist</p>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onOpenAuth();
                            }}
                            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                          >
                            Sign In / Register
                          </button>
                        </div>

                        {/* Quick 1-Click Demo Login Switches */}
                        <div className="px-4 py-2">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Quick Demo Logins
                          </div>
                          <button
                            onClick={async () => {
                              await quickDemoLogin('customer');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
                          >
                            <span>👤 Demo Customer</span>
                            <span className="text-[10px] text-zinc-400">1-click</span>
                          </button>
                          <button
                            onClick={async () => {
                              await quickDemoLogin('admin');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
                          >
                            <span>👑 Store Admin</span>
                            <span className="text-[10px] text-zinc-400">1-click</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold">{cartCount}</span>
              </button>

            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-100 text-zinc-900 text-sm pl-9 pr-8 py-2 rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-zinc-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
