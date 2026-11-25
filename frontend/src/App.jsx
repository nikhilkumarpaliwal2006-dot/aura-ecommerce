import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './api/client';
import { soundManager } from './utils/audio';

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
import VideoProductSpotlight from './components/VideoProductSpotlight';
import DirectPurchaseModal from './components/DirectPurchaseModal';
import CongratulationsModal from './components/CongratulationsModal';

function ShopContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const [guestAllowed, setGuestAllowed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('guest') === 'true' ||
           localStorage.getItem('aura_guest_allowed') === 'true';
  });
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
  const [priceRange, setPriceRange] = useState(100000);
  const [activePriceBucket, setActivePriceBucket] = useState('All Budgets');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Modals & Direct Purchase
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [directBuyProduct, setDirectBuyProduct] = useState(null);
  const [directBuyOptions, setDirectBuyOptions] = useState({});
  const [celebrationOrder, setCelebrationOrder] = useState(null);
  const [highlightedProductId, setHighlightedProductId] = useState(null);
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
        maxPrice: priceRange < 100000 ? priceRange : undefined,
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
    setPriceRange(100000);
    setActivePriceBucket('All Budgets');
    setInStockOnly(false);
    setMinRating(0);
  };

  const handlePriceBucketSelect = (bucket) => {
    setActivePriceBucket(bucket.label);
    if (bucket.label === 'All Budgets') {
      setPriceRange(100000);
    } else {
      setPriceRange(bucket.max);
    }
    scrollToCatalog();
  };

  const handleDirectBuy = (productIdOrObj, options = {}) => {
    let target = null;
    if (typeof productIdOrObj === 'string') {
      target = products.find(p => p.id === productIdOrObj || p.title?.toLowerCase().includes(productIdOrObj.toLowerCase())) ||
               products[0];
    } else if (productIdOrObj && typeof productIdOrObj === 'object') {
      target = productIdOrObj;
    }

    if (!target && products.length > 0) {
      target = products[0];
    }

    if (target) {
      soundManager.playDirectBuy();
      setDirectBuyProduct(target);
      setDirectBuyOptions(options);
    }
  };

  const handleLocateProduct = (productId) => {
    soundManager.playTap();
    let target = products.find(p => p.id === productId);
    if (!target) {
      target = products.find(p => p.title?.toLowerCase().includes(String(productId).toLowerCase()));
    }

    if (target) {
      if (selectedCategory !== 'All' && target.category !== selectedCategory) {
        setSelectedCategory('All');
      }

      setHighlightedProductId(target.id);

      setTimeout(() => {
        const el = document.getElementById(`product-card-${target.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (catalogRef.current) {
          catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);

      setTimeout(() => {
        setHighlightedProductId(curr => (curr === target.id ? null : curr));
      }, 4500);
    }
  };

  const handleOrderPlaced = (order) => {
    loadProducts();
    if (order) {
      setCelebrationOrder(order);
    }
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
          onContinueGuest={() => {
            try {
              localStorage.setItem('aura_guest_allowed', 'true');
            } catch (e) {}
            setGuestAllowed(true);
          }}
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
        onLocateProduct={handleLocateProduct}
        products={products}
      />

      {/* Hero Showcase Slider with Continuous Video Background & Active Direct Buy */}
      <HeroSlider
        onExploreClick={scrollToCatalog}
        onQuickView={(id) => {
          const p = products.find(x => x.id === id);
          if (p) setQuickViewProduct(p);
        }}
        onDirectBuy={handleDirectBuy}
      />

      {/* Catalog Anchor */}
      <div ref={catalogRef}>
        {/* Category & Quick Filter Navigation with Direct Price Buttons */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          totalCount={products.length}
          activePriceBucket={activePriceBucket}
          onSelectPriceBucket={handlePriceBucketSelect}
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
            highlightedProductId={highlightedProductId}
            onQuickView={(p) => setQuickViewProduct(p)}
            onDirectBuy={handleDirectBuy}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Dedicated In-Motion Video Product Spotlight */}
      <VideoProductSpotlight
        product={products.find(p => p.id === 'prod_1') || products[0]}
        onQuickView={(id) => {
          const p = products.find(x => x.id === id);
          if (p) setQuickViewProduct(p);
        }}
        onDirectBuy={handleDirectBuy}
      />

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

      {/* Dedicated Direct Express Purchase Modal */}
      {directBuyProduct && (
        <DirectPurchaseModal
          isOpen={!!directBuyProduct}
          product={directBuyProduct}
          options={directBuyOptions}
          onClose={() => setDirectBuyProduct(null)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          allProducts={products}
          onSelectProduct={(p) => setQuickViewProduct(p)}
          onClose={() => setQuickViewProduct(null)}
          onProductUpdated={loadProducts}
          onDirectBuy={handleDirectBuy}
        />
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Royal Congratulations Celebration Popup */}
      {celebrationOrder && (
        <CongratulationsModal
          isOpen={!!celebrationOrder}
          order={celebrationOrder}
          onClose={() => setCelebrationOrder(null)}
          onViewDetails={() => {
            setCelebrationOrder(null);
            setOrdersOpen(true);
          }}
        />
      )}

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
