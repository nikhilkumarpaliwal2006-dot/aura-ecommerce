import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { SEED_PRODUCTS } from '../data/seedData';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageSquarePlus,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ProductModal({
  product: initialProduct,
  allProducts = [],
  onSelectProduct,
  onClose,
  onProductUpdated,
  onDirectBuy
}) {
  if (!initialProduct) return null;

  const { addToCart, toggleWishlist, isWishlisted, showToast } = useCart();
  const { user } = useAuth();
  const modalScrollRef = useRef(null);
  const touchStartX = useRef(null);

  const [product, setProduct] = useState(initialProduct);

  const resolveImage = (item) => {
    if (!item) return '/images/charger.jpg';
    if (item.title?.toLowerCase().includes('charger') || item.id === 'prod_11') {
      return '/images/charger.jpg';
    }
    return item.image || (item.gallery && item.gallery[0]) || '/images/charger.jpg';
  };

  const getProductImages = (prod) => {
    if (!prod) return ['/images/charger.jpg'];
    if (prod.title?.toLowerCase().includes('charger') || prod.id === 'prod_11') {
      return ['/images/charger.jpg', '/images/charger-stand.jpg', '/images/charger-dock.jpg'];
    }
    if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
      return prod.gallery;
    }
    return [prod.image || '/images/charger.jpg'];
  };

  const [images, setImages] = useState(() => getProductImages(initialProduct));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState((initialProduct.colors && initialProduct.colors[0]) || null);
  const [selectedSize, setSelectedSize] = useState((initialProduct.sizes && initialProduct.sizes[0]) || null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sync state if initialProduct prop updates
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      const newImages = getProductImages(initialProduct);
      setImages(newImages);
      setActiveImageIndex(0);
      setSelectedColor((initialProduct.colors && initialProduct.colors[0]) || null);
      setSelectedSize((initialProduct.sizes && initialProduct.sizes[0]) || null);
      setQuantity(1);
    }
  }, [initialProduct]);

  // Handlers for bidirectional sync between Color buttons and Gallery Images
  const handleSelectColor = (color, colorIdx) => {
    soundManager.playTap();
    setSelectedColor(color);
    if (images.length > 0) {
      const targetIndex = colorIdx % images.length;
      setActiveImageIndex(targetIndex);
    }
  };

  const handleSelectThumbnail = (img, thumbIdx) => {
    soundManager.playTap();
    setActiveImageIndex(thumbIdx);
    if (product.colors && product.colors.length > 0) {
      const matchingColor = product.colors[thumbIdx % product.colors.length];
      setSelectedColor(matchingColor);
    }
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    soundManager.playTap();
    if (images.length <= 1) return;
    const newIdx = (activeImageIndex - 1 + images.length) % images.length;
    setActiveImageIndex(newIdx);
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[newIdx % product.colors.length]);
    }
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    soundManager.playTap();
    if (images.length <= 1) return;
    const newIdx = (activeImageIndex + 1) % images.length;
    setActiveImageIndex(newIdx);
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[newIdx % product.colors.length]);
    }
  };

  // Touch swipe support on main image preview
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    if (e.changedTouches && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          handlePrevImage();
        } else {
          handleNextImage();
        }
      }
    }
    touchStartX.current = null;
  };

  const wishlisted = isWishlisted(product.id || product._id);

  // Compute curated similar products
  const productPool = (Array.isArray(allProducts) && allProducts.length > 0) ? allProducts : SEED_PRODUCTS;
  const currentId = product.id || product._id;

  const sameCategory = productPool.filter(p => {
    const pId = p.id || p._id;
    return pId !== currentId && p.category === product.category;
  });

  const otherItems = productPool.filter(p => {
    const pId = p.id || p._id;
    return pId !== currentId && !sameCategory.some(sc => (sc.id || sc._id) === pId);
  });

  const similarProducts = [...sameCategory, ...otherItems].slice(0, 4);

  const handleSelectSimilarProduct = (item) => {
    soundManager.playTap();
    setProduct(item);
    const itemImages = getProductImages(item);
    setImages(itemImages);
    setActiveImageIndex(0);
    setSelectedColor((item.colors && item.colors[0]) || null);
    setSelectedSize((item.sizes && item.sizes[0]) || null);
    setQuantity(1);
    setShowReviewForm(false);
    if (onSelectProduct) {
      onSelectProduct(item);
    }
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdd = () => {
    soundManager.playAddToCart();
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
  };

  const handleDirectBuy = () => {
    soundManager.playDirectBuy();
    if (onDirectBuy) {
      onDirectBuy(product.id || product, { color: selectedColor, size: selectedSize, quantity });
    } else {
      addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    }
    if (onClose) onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.addReview(product.id, {
        rating: newRating,
        comment: newComment,
        userName: (typeof user?.name === 'string' && user.name.trim()) 
          ? user.name 
          : ((typeof user?.email === 'string' && user.email.includes('@')) 
            ? user.email.split('@')[0] 
            : 'Verified Customer')
      });
      if (res.success) {
        showToast('Review submitted successfully!');
        setNewComment('');
        setShowReviewForm(false);
        if (onProductUpdated) onProductUpdated();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 backdrop-blur-md shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div ref={modalScrollRef} className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              {/* Swiping Image Viewer */}
              <div
                className="aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden relative border border-zinc-200 group select-none cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Horizontal Swiping Strip */}
                <div
                  className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 relative overflow-hidden bg-zinc-50 flex items-center justify-center">
                      <img
                        src={img}
                        alt={`${product.title} - ${product.colors?.[idx] || idx + 1}`}
                        className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                          if (product.title?.toLowerCase().includes('charger')) {
                            e.currentTarget.src = '/images/charger.jpg';
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Left / Right Chevron Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/65 hover:bg-zinc-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-white/10 z-10 cursor-pointer"
                      title="Previous variety"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/65 hover:bg-zinc-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-white/10 z-10 cursor-pointer"
                      title="Next variety"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Active Variety Pill Tag */}
                {selectedColor && (
                  <div className="absolute bottom-3 left-3 z-10 px-3 py-1 bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-semibold text-amber-300 flex items-center gap-1.5 shadow-lg pointer-events-none animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="tracking-wide">{selectedColor}</span>
                  </div>
                )}

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-zinc-900/90 text-white text-xs font-bold rounded-full backdrop-blur-md shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Pagination Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeImageIndex === i ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails with Active Variety Sync */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => {
                    const matchingColor = product.colors && product.colors[idx % product.colors.length];
                    const isActive = activeImageIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectThumbnail(img, idx)}
                        title={matchingColor ? `View ${matchingColor}` : `Variety ${idx + 1}`}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {matchingColor && (
                          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-white text-center py-0.5 truncate px-0.5">
                            {matchingColor.split(' ')[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quality & Value badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 text-center text-[11px] text-zinc-600 font-medium">
                <div className="p-2.5 bg-zinc-50 rounded-xl">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-zinc-800" />
                  <span>Free Express</span>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-zinc-800" />
                  <span>2-Yr Warranty</span>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-zinc-800" />
                  <span>30-Day Trial</span>
                </div>
              </div>

              {/* Similar Products Section - fills the lower space elegantly */}
              {similarProducts.length > 0 && (
                <div className="pt-5 border-t border-zinc-200/80">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                        Similar & Complementary Pieces
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      {similarProducts.length} Curated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {similarProducts.map((item) => {
                      const itemImg = resolveImage(item);
                      const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;

                      return (
                        <div
                          key={item.id || item._id}
                          onClick={() => handleSelectSimilarProduct(item)}
                          className="group relative bg-zinc-50 hover:bg-white rounded-2xl p-2.5 border border-zinc-200 hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            {/* Product Thumbnail */}
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white mb-2 relative border border-zinc-100">
                              <img
                                src={itemImg}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/charger.jpg';
                                }}
                              />
                              {item.badge && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-zinc-950/80 backdrop-blur-xs text-[9px] font-bold text-amber-300 rounded">
                                  {item.badge}
                                </span>
                              )}
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-zinc-900/85 backdrop-blur-xs text-[9px] font-semibold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                View →
                              </span>
                            </div>

                            {/* Category & Rating */}
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="font-bold text-amber-600 uppercase tracking-wider truncate max-w-[90px]">
                                {item.category}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-zinc-700 text-[10px]">{item.rating || 4.8}</span>
                              </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {item.title}
                            </h4>
                          </div>

                          {/* Price & Action Buttons */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60">
                            <div>
                              <span className="text-xs font-extrabold text-zinc-900">
                                ₹{itemPrice.toLocaleString('en-IN')}
                              </span>
                              {item.originalPrice && item.originalPrice > itemPrice && (
                                <span className="text-[10px] text-zinc-400 line-through ml-1 hidden sm:inline">
                                  ₹{item.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="⚡ Direct 1-Click Buy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundManager.playDirectBuy();
                                  if (onDirectBuy) onDirectBuy(item);
                                  if (onClose) onClose();
                                }}
                                className="p-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 rounded-lg shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                <Zap className="w-3 h-3 fill-zinc-950" />
                              </button>
                              <button
                                type="button"
                                title="Add to Bag"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundManager.playAddToCart();
                                  addToCart(item, 1);
                                  showToast(`${item.title} added to bag!`);
                                }}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                <ShoppingBag className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-zinc-400">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-zinc-800">{product.rating}</span>
                    <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Price display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-zinc-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-zinc-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Urgency Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <span className={`w-2.5 h-2.5 rounded-full ${product.stockQuantity < 15 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-xs font-medium text-zinc-600">
                    {product.stockQuantity < 15
                      ? `Only ${product.stockQuantity} pieces remaining in vault`
                      : `In Stock · Ready to dispatch from warehouse`}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  {product.description || product.shortDescription}
                </p>

                {/* Color Variants with Bidirectional Sync & Active Golden Indicator */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Finish: <span className="text-amber-600 font-bold ml-1">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, idx) => {
                        const isSelected = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => handleSelectColor(color, idx)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'border-amber-400 bg-zinc-950 text-amber-300 shadow-md shadow-amber-500/15 scale-102 ring-1 ring-amber-400/50'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>}
                            <span>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Variants */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Select Size: <span className="text-zinc-900 font-semibold">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            selectedSize === size
                              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="space-y-3 pt-4 border-t border-zinc-100">
                  {/* Direct Buy Now Button */}
                  <button
                    onClick={handleDirectBuy}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-101 active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    <span>Direct Buy Now • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden">
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-bold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          setQuantity(Math.min(product.stockQuantity || 99, quantity + 1));
                        }}
                        className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playTap();
                        toggleWishlist(product);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        wishlisted
                          ? 'border-rose-200 bg-rose-50 text-rose-500'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Features list */}
              {product.features && product.features.length > 0 && (
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">
                    Engineering & Material Specifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-600">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Verified Customer Reviews</h3>
                <p className="text-xs text-zinc-500">Real feedback from verified purchasers worldwide</p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-xl transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 mb-8 animate-in fade-in">
                <h4 className="text-sm font-bold text-zinc-900 mb-3">Share your experience</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-zinc-600">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What did you love about the build quality, materials, or sound?..."
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 mb-3"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {/* Review Cards */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-zinc-900 flex items-center gap-2">
                        <span>{rev.userName}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                          Verified
                        </span>
                      </div>
                      <span className="text-zinc-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
