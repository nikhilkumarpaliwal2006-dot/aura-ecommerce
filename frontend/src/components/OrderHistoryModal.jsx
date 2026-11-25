import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  X,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  ChevronRight,
  Search,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

// Helper to generate realistic step-by-step milestone timeline matching the reference layout
function generateOrderTimeline(order) {
  if (!order) return [];

  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatShort = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const tPlaced = new Date(createdDate.getTime());
  const tProcessing = new Date(createdDate.getTime() + 4 * 60 * 60 * 1000);
  const tInTransit = new Date(createdDate.getTime() + 16 * 60 * 60 * 1000);
  const tDelivered = new Date(createdDate.getTime() + 48 * 60 * 60 * 1000);

  const status = (order.status || 'shipped').toLowerCase();
  let activeStep = 3; // 1: Placed, 2: Processing, 3: In Transit, 4: Delivered
  if (status === 'pending') activeStep = 1;
  else if (status === 'processing') activeStep = 2;
  else if (status === 'shipped') activeStep = 3;
  else if (status === 'delivered') activeStep = 4;

  const destinationCity = order.shippingAddress?.city || 'Delhi';
  const carrier = order.carrier || 'Blue Dart Priority Air';

  return [
    {
      step: 1,
      title: 'Placed',
      description: "We've received your order and payment is verified in NIKK AURA vault.",
      timestamp: `${formatShort(tPlaced)} ${formatTime(tPlaced)}`,
      location: 'Central Vault Queue',
      isCompleted: activeStep >= 1,
      isCurrent: activeStep === 1
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Your order is being packed. White-glove inspection & tamper-proof luxury seal applied.',
      timestamp: `${formatShort(tProcessing)} ${formatTime(tProcessing)}`,
      location: 'Fulfillment Center, New Delhi',
      isCompleted: activeStep >= 2,
      isCurrent: activeStep === 2
    },
    {
      step: 3,
      title: 'In Transit',
      description: `Your order is on the way via ${carrier}. Dispatched from air cargo sort hub.`,
      timestamp: activeStep >= 3 ? `${formatShort(tInTransit)} ${formatTime(tInTransit)}` : `Expected ${formatShort(tInTransit)}`,
      location: order.currentLocation || `Air Cargo departed Hub -> ${destinationCity}`,
      isCompleted: activeStep >= 3,
      isCurrent: activeStep === 3
    },
    {
      step: 4,
      title: 'Delivered',
      description: 'Your order is ready to be picked up / delivered with contactless OTP verification.',
      timestamp: activeStep === 4 ? `${formatShort(tDelivered)} ${formatTime(tDelivered)}` : `Expected ${order.estimatedDelivery || formatShort(tDelivered)}`,
      location: order.shippingAddress?.street ? `${order.shippingAddress.street}, ${destinationCity}` : `Destination: ${destinationCity}`,
      isCompleted: activeStep === 4,
      isCurrent: activeStep === 4
    }
  ];
}

export default function OrderHistoryModal({ isOpen, initialOrderId, onClose }) {
  if (!isOpen) return null;

  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingLookup, setTrackingLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    soundManager.playTap();
    setLoading(true);
    api.getMyOrders()
      .then(res => {
        if (res.success && res.orders) {
          setOrders(res.orders);
          // If initialOrderId requested, find that; else select first order
          if (initialOrderId) {
            const found = res.orders.find(o => (o.id === initialOrderId || o._id === initialOrderId));
            setSelectedOrder(found || res.orders[0]);
          } else if (res.orders.length > 0) {
            setSelectedOrder(res.orders[0]);
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, initialOrderId]);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!trackingLookup.trim()) return;
    try {
      soundManager.playTap();
      setLookupError('');
      const res = await api.getOrderById(trackingLookup.trim());
      if (res.success && res.order) {
        setSelectedOrder(res.order);
        // Add to orders list if not present
        if (!orders.some(o => o.id === res.order.id)) {
          setOrders(prev => [res.order, ...prev]);
        }
      }
    } catch (err) {
      setLookupError(err.message || 'No matching order or tracking number found');
    }
  };

  const handleCopyTracking = (trackingNo) => {
    if (!trackingNo) return;
    navigator.clipboard?.writeText(trackingNo);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const timeline = selectedOrder ? generateOrderTimeline(selectedOrder) : [];
  const primaryItem = selectedOrder?.items && selectedOrder.items[0];
  const orderDateFormatted = selectedOrder?.createdAt
    ? new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Recent Order';

  const estDeliveryFormatted = selectedOrder?.estimatedDelivery || 'Within 2-3 Days';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-serif">
                  NIKK AURA • LIVE ORDER TRACKING
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active Logistics</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400">Real-time parcel journey, courier dispatch & delivery milestones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 bg-zinc-50/60">
          
          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. ord_7824) or Tracking AWB..."
                value={trackingLookup}
                onChange={(e) => setTrackingLookup(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-amber-400 font-mono shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track</span>
            </button>
          </form>

          {lookupError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl animate-in fade-in">
              {lookupError}
            </div>
          )}

          {/* Orders Switcher Tabs if multiple orders */}
          {orders.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                <span>Select Order to Track ({orders.length})</span>
                <span className="text-zinc-500 font-normal">Tap to inspect live status</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {orders.map((ord) => {
                  const isSelected = (selectedOrder?.id === ord.id) || (selectedOrder?._id === ord._id);
                  const firstItem = ord.items && ord.items[0];
                  const itemImg = firstItem?.image || '/images/charger.jpg';
                  const isDelivered = ord.status === 'delivered';

                  return (
                    <button
                      key={ord.id || ord._id}
                      onClick={() => {
                        soundManager.playTap();
                        setSelectedOrder(ord);
                      }}
                      className={`flex items-center gap-3 p-2.5 pr-4 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-zinc-950 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                          : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      <img src={itemImg} alt="" className="w-10 h-10 rounded-xl object-cover border border-zinc-200/50" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-black">{ord.id}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                            isDelivered
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          }`}>
                            {isDelivered ? 'Delivered' : 'In Transit'}
                          </span>
                        </div>
                        <div className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-500'} truncate max-w-[140px]`}>
                          {firstItem?.title || 'Luxury Item'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to live logistics dispatch vault...</span>
            </div>
          ) : !selectedOrder ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8">
              <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h4 className="font-bold text-zinc-900 text-base mb-1">No Orders Found</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No orders match your query. Place your first order or enter your Order Reference above.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* === TRACK ORDER HERO SECTION (Directly matching user's reference image) === */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-6">
                
                {/* Order Top Summary */}
                <div className="border-b border-zinc-100 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-serif">
                        Track order #{selectedOrder.id}
                      </h3>
                      <div className="text-xs sm:text-sm text-zinc-500 mt-1">
                        {orderDateFormatted}
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                          Carrier AWB
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTracking(selectedOrder.trackingNumber)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                          title="Copy tracking number"
                        >
                          <span>{selectedOrder.trackingNumber}</span>
                          {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Category / Items summary subtitle */}
                  <div className="mt-2 text-xs font-semibold text-zinc-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>
                      {selectedOrder.items?.map(i => i.title).join(', ') || 'Luxury Goods & Essentials'}
                    </span>
                  </div>
                </div>

                {/* Status & Estimated Delivery Two-Box Banner (Exactly matching reference) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Box 1: Status */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-700/80 mb-0.5">Status</div>
                      <div className="text-base sm:text-lg font-black text-emerald-950 capitalize flex items-center gap-1.5">
                        <span>{selectedOrder.status === 'delivered' ? 'Order Delivered' : 'Order Shipped'}</span>
                        {selectedOrder.status !== 'delivered' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Box 2: Estimated Delivery Date */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 border border-sky-100/80 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-sky-700/80 mb-0.5">Estimated delivery date</div>
                      <div className="text-base sm:text-lg font-black text-sky-950">
                        {estDeliveryFormatted}
                      </div>
                    </div>
                  </div>

                </div>

                {/* === VERTICAL TRACKING DETAILS TIMELINE (Matching reference) === */}
                <div className="pt-2">
                  <h4 className="text-sm font-extrabold text-zinc-900 tracking-tight mb-5">
                    Tracking details
                  </h4>

                  <div className="relative pl-2 sm:pl-3 space-y-6">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[17px] sm:left-[21px] top-3 bottom-3 w-[3px] bg-zinc-200">
                      <div
                        className="w-full bg-emerald-500 transition-all duration-700"
                        style={{
                          height: selectedOrder.status === 'delivered'
                            ? '100%'
                            : (selectedOrder.status === 'shipped' ? '66%' : '33%')
                        }}
                      />
                    </div>

                    {timeline.map((step) => {
                      return (
                        <div key={step.step} className="relative flex items-start gap-4 z-10">
                          
                          {/* Circular Marker (Green with check or grey) */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-all ${
                              step.isCompleted
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-50'
                                : (step.isCurrent
                                    ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-100 animate-pulse'
                                    : 'bg-white border-2 border-zinc-300 text-zinc-400')
                            }`}
                          >
                            {step.isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <span className="text-[11px] font-bold">{step.step}</span>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${step.isCompleted ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                  {step.title}
                                </span>
                                {step.isCurrent && (
                                  <span className="px-2 py-0.2 bg-amber-500/15 text-amber-700 border border-amber-500/30 text-[9px] font-black rounded-full uppercase tracking-wider">
                                    Current Status
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs font-semibold ${step.isCompleted ? 'text-zinc-700' : 'text-zinc-400'}`}>
                                {step.timestamp}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed">
                              {step.description}
                            </p>

                            {step.location && step.isCompleted && (
                              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 mt-1">
                                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{step.location}</span>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* === PACKAGE CONTENTS & PRODUCTS IN THIS ORDER === */}
              <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>Package Items ({selectedOrder.items?.length || 1})</span>
                  </h4>
                  <span className="text-xs text-zinc-500">
                    Total: ₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map((it, idx) => {
                    const isCharger = it.title?.toLowerCase().includes('charger') || it.productId === 'prod_11';
                    const itImg = isCharger ? '/images/charger.jpg' : (it.image || '/images/charger.jpg');

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60"
                      >
                        <img
                          src={itImg}
                          alt={it.title}
                          className="w-14 h-14 object-cover rounded-xl border border-zinc-200 shrink-0"
                          onError={(e) => { e.currentTarget.src = '/images/charger.jpg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                            {it.title}
                          </h5>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-zinc-500">
                            {it.selectedColor && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-800 font-medium">
                                Finish: {it.selectedColor}
                              </span>
                            )}
                            {it.selectedSize && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-800 font-medium">
                                Size: {it.selectedSize}
                              </span>
                            )}
                            <span>Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-extrabold text-xs sm:text-sm text-zinc-900">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Destination & Action Buttons */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>
                      Shipping Destination:{' '}
                      <strong className="text-zinc-900 font-semibold">
                        {selectedOrder.shippingAddress?.fullName || 'Valued Patron'}, {selectedOrder.shippingAddress?.city || 'India'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
