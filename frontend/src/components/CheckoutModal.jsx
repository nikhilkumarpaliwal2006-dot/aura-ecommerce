import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Printer,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  if (!isOpen) return null;

  const {
    cart,
    subtotal,
    coupon,
    discountAmount,
    taxAmount,
    clearCart,
    showToast
  } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [deliverySpeed, setDeliverySpeed] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Nikhil Paliwal',
    email: user?.email || 'nikhil@example.com',
    street: 'B-402, Royal Palms, Western Express Hwy',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400063',
    country: 'India',
    phone: '+91 98765 43210',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculations for current checkout
  const isExpress = deliverySpeed === 'express';
  const shippingFee = isExpress ? 499.00 : (subtotal >= 2499 ? 0.00 : 199.00);
  const totalAmount = parseFloat((Math.max(0, subtotal - discountAmount) + shippingFee + taxAmount).toFixed(2));

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const payload = {
        items: cart.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        deliverySpeed,
        couponCode: coupon?.code || null,
        paymentMethod: paymentMethod === 'credit_card'
          ? 'Credit Card (Visa ending 4242)'
          : paymentMethod === 'apple_pay'
            ? 'Apple Pay'
            : 'Cash on Delivery'
      };

      const res = await api.createOrder(payload);

      if (res.success) {
        setCompletedOrder(res.order);
        clearCart();
        showToast('Order confirmed! Receipt generated.');

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        if (onOrderPlaced) onOrderPlaced(res.order);
      }
    } catch (err) {
      showToast(err.message || 'Payment authorization failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 tracking-tight">
              {completedOrder ? 'Order Confirmation & Receipt' : 'NIKK AURA Express Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {completedOrder ? (
            /* =================== ORDER SUCCESS SCREEN =================== */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  Order Placed Successfully
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  Thank You, {completedOrder.customerName}!
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  A confirmation email has been sent to <strong>{completedOrder.customerEmail}</strong>
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order Reference:</span>
                  <strong className="font-mono text-zinc-900">{completedOrder.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tracking Code:</span>
                  <strong className="font-mono text-amber-600">{completedOrder.trackingNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivery Speed:</span>
                  <span className="font-semibold text-zinc-800">{completedOrder.deliverySpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Arrival:</span>
                  <span className="font-semibold text-emerald-700">{completedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-extrabold">
                  <span>Total Amount Paid:</span>
                  <span className="text-base text-zinc-900">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Items Purchased summary */}
              <div className="max-w-md mx-auto text-left space-y-2 pt-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ordered Items</h4>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                    <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-bold text-zinc-900 truncate">{it.title}</div>
                      <div className="text-zinc-500">Qty: {it.quantity} · ₹{(it.price * it.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Back to Store
                </button>
              </div>
            </div>
          ) : (
            /* =================== CHECKOUT STEP FLOW =================== */
            <div>
              {/* Stepper Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[
                  { num: 1, label: 'Address' },
                  { num: 2, label: 'Delivery' },
                  { num: 3, label: 'Payment' }
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : step > s.num
                            ? 'bg-emerald-500 text-white'
                            : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-bold ${step === s.num ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {s.label}
                    </span>
                    {s.num < 3 && <span className="text-zinc-300 mx-1">──</span>}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
                    Shipping & Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Continue to Delivery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Speed */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
                    Choose Delivery Method
                  </h3>

                  <div className="space-y-3">
                    <label
                      onClick={() => setDeliverySpeed('standard')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        deliverySpeed === 'standard'
                          ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliverySpeed === 'standard'}
                          onChange={() => setDeliverySpeed('standard')}
                          className="text-zinc-900 focus:ring-zinc-900"
                        />
                        <div>
                          <div className="font-bold text-xs text-zinc-900">Standard Ground Logistics</div>
                          <div className="text-[11px] text-zinc-500">Delivered within 3 to 5 business days</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {subtotal >= 2499 ? 'FREE' : '₹199'}
                      </span>
                    </label>

                    <label
                      onClick={() => setDeliverySpeed('express')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        deliverySpeed === 'express'
                          ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliverySpeed === 'express'}
                          onChange={() => setDeliverySpeed('express')}
                          className="text-zinc-900 focus:ring-zinc-900"
                        />
                        <div>
                          <div className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <span>Express Priority Air</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                              Fastest
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500">Guaranteed delivery in 1-2 business days</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-900">₹499</span>
                    </label>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Simulation */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-1">
                    Secure Payment Simulation
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Test payment gateway simulation. No real money will be charged.
                  </p>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                      { id: 'apple_pay', label: 'Apple Pay', icon: Sparkles },
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck }
                    ].map(pm => {
                      const Icon = pm.icon;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            paymentMethod === pm.id
                              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card Details Mock */}
                  {paymentMethod === 'credit_card' && (
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-200 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Expiry</label>
                          <input
                            type="text"
                            name="cardExp"
                            value={formData.cardExp}
                            onChange={handleChange}
                            className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-500 mb-1">CVC Code</label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary Recap */}
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({coupon?.code})</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping ({deliverySpeed})</span>
                      <span>₹{shippingFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated GST (5%)</span>
                      <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                      <span>Total to Authorize</span>
                      <span className="text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2"
                    >
                      {loading ? (
                        <span>Authorizing Transaction...</span>
                      ) : (
                        <>
                          <span>Place Order · ₹{totalAmount.toLocaleString('en-IN')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
