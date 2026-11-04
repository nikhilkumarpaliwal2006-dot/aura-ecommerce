import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  X,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  ChevronRight,
  Search
} from 'lucide-react';

export default function OrderHistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingLookup, setTrackingLookup] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      api.getMyOrders()
        .then(res => {
          if (res.success) {
            setOrders(res.orders || []);
            if (res.orders && res.orders.length > 0) {
              setSelectedOrder(res.orders[0]);
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!trackingLookup.trim()) return;
    try {
      setLookupError('');
      const res = await api.getOrderById(trackingLookup.trim());
      if (res.success) {
        setLookupResult(res.order);
        setSelectedOrder(res.order);
      }
    } catch (err) {
      setLookupError(err.message || 'Order reference not found');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-full">In Transit</span>;
      case 'processing':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Processing</span>;
      default:
        return <span className="px-2.5 py-1 bg-zinc-100 text-zinc-800 text-[10px] font-bold rounded-full">Pending</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Order Tracking & Receipts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleLookup} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ord_1001) to view status..."
                value={trackingLookup}
                onChange={(e) => setTrackingLookup(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Track Order
            </button>
          </form>

          {lookupError && (
            <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl mb-4">
              {lookupError}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-xs text-zinc-400">Loading order records...</div>
          ) : orders.length === 0 && !selectedOrder ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1">No Orders Found</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {isAuthenticated
                  ? "You haven't placed any orders with this account yet."
                  : "Please sign in or enter your Order Reference above to track your package."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Orders List Sidebar */}
              {orders.length > 0 && (
                <div className="space-y-2 md:border-r md:border-zinc-100 md:pr-4">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Recent Orders ({orders.length})
                  </div>
                  {orders.map(order => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full p-3 rounded-2xl text-left border transition-all ${
                        selectedOrder?.id === order.id
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                          : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className={`text-[11px] ${selectedOrder?.id === order.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()} · ${order.totalAmount?.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Order Detail Pane */}
              <div className={orders.length > 0 ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"}>
                {selectedOrder ? (
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-6">
                    
                    {/* Status header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
                      <div>
                        <div className="text-xs text-zinc-500">Order Reference</div>
                        <div className="font-mono text-base font-extrabold text-zinc-900">{selectedOrder.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Current Status</div>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3">
                        Delivery Progress
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { name: 'Pending', step: 1 },
                          { name: 'Processing', step: 2 },
                          { name: 'Shipped', step: 3 },
                          { name: 'Delivered', step: 4 }
                        ].map((s) => {
                          const orderStepMap = { pending: 1, processing: 2, shipped: 3, delivered: 4 };
                          const currentStep = orderStepMap[selectedOrder.status?.toLowerCase()] || 2;
                          const isReached = currentStep >= s.step;

                          return (
                            <div key={s.name} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                  isReached
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-zinc-200 text-zinc-400'
                                }`}
                              >
                                {isReached ? '✓' : s.step}
                              </div>
                              <span className={`text-[10px] font-semibold ${isReached ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                {s.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                        Package Contents
                      </div>
                      <div className="space-y-2">
                        {(selectedOrder.items || []).map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-zinc-200">
                            <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="font-bold text-zinc-900 truncate">{it.title}</div>
                              <div className="text-zinc-500">Qty: {it.quantity} · ${(it.price * it.quantity).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount Applied:</span>
                          <span>-${selectedOrder.discountAmount?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping & Handling:</span>
                        <span>${selectedOrder.shippingFee?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>${selectedOrder.taxAmount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-100">
                        <span>Total Paid:</span>
                        <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Receipt Action */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    </div>

                  </div>
                ) : null}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
