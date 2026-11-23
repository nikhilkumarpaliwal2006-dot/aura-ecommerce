import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { api } from './api/client';

// Components
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryBar from './components/CategoryBar';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import WishlistModal from './components/WishlistModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import Footer from './components/Footer';
import GatewayAuth from './components/GatewayAuth';
import PostLoginAnimation from './components/PostLoginAnimation';

function ShopContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [guestAllowed, setGuestAllowed] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  // Filters & Search (prices in INR)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(60000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const catalogRef = useRef(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory,
        sort: sortBy,
        maxPrice: priceRange < 60000 ? priceRange : undefined,
        inStockOnly: inStockOnly ? 'true' : undefined,
        minRating: minRating > 0 ? minRating : undefined
      };

      const res = await api.getProducts(params);
      if (res.success) {
        setProducts(res.products);
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter change
  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory, sortBy, priceRange, inStockOnly, minRating]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceRange(60000);
    setInStockOnly(false);
    setMinRating(0);
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setWelcomeUser(loggedInUser);
    setShowWelcomeAnimation(true);
  };

  // Sleek dark splash while auth token initializes
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl border-2 border-amber-400/40 border-t-amber-400 animate-spin mb-4" />
        <span className="font-serif text-lg tracking-widest text-amber-400 font-bold">NIKK AURA</span>
      </div>
    );
  }

  // Gateway Entrance Portal for unauthenticated first-time visitors
  if (!isAuthenticated && !guestAllowed) {
    return (
      <>
        <Toast />
        <GatewayAuth
          onLoginSuccess={handleLoginSuccess}
          onContinueGuest={() => setGuestAllowed(true)}
        />
        {showWelcomeAnimation && (
          <PostLoginAnimation
            user={welcomeUser || user}
            onComplete={() => setShowWelcomeAnimation(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* Cinematic Welcome Animation just after login */}
      {showWelcomeAnimation && (
        <PostLoginAnimation
          user={welcomeUser || user}
          onComplete={() => setShowWelcomeAnimation(false)}
        />
      )}

      {/* Main Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        products={products}
      />

      {/* Hero Showcase Slider */}
      <HeroSlider onExploreClick={scrollToCatalog} />

      {/* Catalog Anchor */}
      <div ref={catalogRef}>
        {/* Category & Quick Filter Navigation */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          totalCount={products.length}
        />

        {/* Faceted Filter Drawer */}
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          minRating={minRating}
          onRatingChange={setMinRating}
          onResetFilters={handleResetFilters}
        />

        {/* Products Grid */}
        <main className="flex-1">
          <ProductGrid
            products={products}
            loading={loading}
            onQuickView={(p) => setQuickViewProduct(p)}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Footer */}
      <Footer
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        onProceedToCheckout={() => setCheckoutOpen(true)}
      />

      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onProductUpdated={loadProducts}
        />
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={() => loadProducts()}
      />

      <OrderHistoryModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefreshCatalog={loadProducts}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ShopContent />
      </CartProvider>
    </AuthProvider>
  );
}
