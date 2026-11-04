import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
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

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(600);
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
        maxPrice: priceRange < 600 ? priceRange : undefined,
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
    setPriceRange(600);
    setInStockOnly(false);
    setMinRating(0);
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      
      {/* Toast Notification Container */}
      <Toast />

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
