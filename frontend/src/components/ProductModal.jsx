import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
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
  MessageSquarePlus
} from 'lucide-react';

export default function ProductModal({ product, onClose, onProductUpdated }) {
  if (!product) return null;

  const { addToCart, toggleWishlist, isWishlisted, showToast } = useCart();
  const { user } = useAuth();

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || null);
  const [selectedSize, setSelectedSize] = useState((product.sizes && product.sizes[0]) || null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAdd = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.addReview(product.id, {
        rating: newRating,
        comment: newComment,
        userName: user ? user.name : 'Verified Customer'
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

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden relative border border-zinc-200">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-zinc-900/90 text-white text-xs font-bold rounded-full backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === img ? 'border-zinc-900 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
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
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-zinc-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
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

                {/* Color Variants */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Finish: <span className="text-zinc-900 font-semibold">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            selectedColor === color
                              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
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
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                      className="px-3.5 py-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-all ${
                      wishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
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
