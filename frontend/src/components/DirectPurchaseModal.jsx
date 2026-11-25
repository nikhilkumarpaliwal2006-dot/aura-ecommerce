import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';
import { soundManager } from '../utils/audio';
import {
  X,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DirectPurchaseModal({ product, options = {}, isOpen, onClose, onOrderPlaced }) {
  if (!isOpen || !product) return null;

  const { user } = useAuth();
  const { showToast } = useCart();

  const [quantity, setQuantity] = useState(options.quantity || 1);
  const [selectedFinish, setSelectedFinish] = useState(
    options.finish || (product.finishes && product.finishes[0]) || 'Signature'
  );
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Pre-populate shipping address
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: 'Bespoke Luxury Residence, South Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110049'
  });

  const unitPrice = product.price || 0;
  const totalPrice = unitPrice * quantity;
  const freeDelivery = true;

  const handleInputChange = (e) => {
    setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceDirectOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.name.trim()) {
      showToast('Please provide your name for direct delivery', 'error');
      return;
    }
    if (!shippingAddress.phone.trim()) {
      showToast('Please provide a contact phone number', 'error');
      return;
    }

    try {
      setSubmitting(true);
      soundManager.playTap();

      const orderData = {
        items: [
          {
            product: product.id,
            productId: product.id,
            title: product.title,
            name: product.title,
            price: product.price,
            quantity: quantity,
            selectedFinish: selectedFinish,
            image: product.image
          }
        ],
        shippingAddress: {
          fullName: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.pincode,
          country: 'India'
        },
        paymentMethod: paymentMethod === 'upi' ? 'UPI / NetBanking' : (paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'),
        subtotal: totalPrice,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: totalPrice,
        deliveryOption: 'Direct Express Priority (2-Day Guaranteed)'
      };

      const res = await api.createOrder(orderData);
      if (res.success && res.order) {
        soundManager.playCongratulationsSound();
        setOrderSuccess(res.order);
        showToast('🎉 Congratulations! Direct Order Placed.');
        if (onOrderPlaced) onOrderPlaced(res.order);
      } else {
        throw new Error(res.message || 'Direct checkout could not be completed');
      }
    } catch (err) {
      showToast(err.message || 'Direct Order Placement Error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-zinc-950 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-amber-500/30 relative animate-in zoom-in-95">
        
        {/* Top Direct Express Header */}
        <div className="bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-600/20 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Zap className="w-4 h-4 fill-zinc-950" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
                Exclusive Direct Line
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                1-Click Express Purchase
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(16,185,129,0.3)] animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
                Order Confirmed • Direct VIP Fulfillment
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                Thank You, {shippingAddress.name || 'Valued Patron'}!
              </h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
                Your direct order <span className="font-mono text-amber-400 font-bold">{orderSuccess.id}</span> has been confirmed. Our bespoke courier is preparing express 2-day delivery to {shippingAddress.city}.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Product</span>
                <span className="font-semibold text-white">{product.title}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Finish / Quantity</span>
                <span className="text-zinc-300">{selectedFinish} × {quantity}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Total Amount Paid</span>
                <span className="font-bold text-amber-400 text-sm">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Payment Mode</span>
                <span className="text-emerald-400 font-semibold uppercase">{paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full max-w-md py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Continue Shopping &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceDirectOrder} className="p-6 space-y-5">
            {/* Product Summary Row */}
            <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">
                  {product.category || 'Luxury'}
                </span>
                <h4 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                  {product.title}
                </h4>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="text-lg font-extrabold text-amber-400 font-mono">
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded-full font-semibold">
                    Direct VIP Price
                  </span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-xl px-2 py-1 gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-white font-bold text-sm px-1"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white min-w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-white font-bold text-sm px-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Finishes selection if present */}
            {product.finishes && product.finishes.length > 0 && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 block">
                  Select Finish / Edition
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.finishes.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedFinish === f
                          ? 'bg-amber-400 text-zinc-950 font-bold border border-amber-400 shadow-md shadow-amber-400/20'
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                Instant Payment Gateway
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-bold">UPI / GPay / PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-bold">Card (Visa/Master)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs font-bold">Pay on Delivery</span>
                </button>
              </div>
            </div>

            {/* Express Shipping Details */}
            <div className="space-y-3 pt-1">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Express Delivery Destination (India)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (e.g. +91 98765 43210)"
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Guaranteed Perks */}
            <div className="flex items-center justify-between py-2 text-[11px] text-zinc-400 border-t border-zinc-800/80">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Truck className="w-3.5 h-3.5" /> Express 2-Day Air Shipping
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic Guaranteed
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                    Confirming Direct Purchase...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    <span>Confirm & Buy Now • ₹{totalPrice.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
