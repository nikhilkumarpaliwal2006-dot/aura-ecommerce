import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import {
  CheckCircle2,
  Sparkles,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  Printer,
  PackageCheck,
  PartyPopper
} from 'lucide-react';

export default function CongratulationsModal({ order, isOpen, onClose, onViewDetails }) {
  if (!isOpen || !order) return null;

  useEffect(() => {
    // 1. Play grand celebratory fanfare sound
    soundManager.playCongratulationsSound();

    // 2. Multi-stage luxury golden fireworks and confetti cannon
    const end = Date.now() + 2500;
    const colors = ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#eab308'];

    // Immediate center burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 },
      colors
    });

    // Side cannons interval
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors
      });
    }, 300);

    return () => clearInterval(interval);
  }, [order]);

  const customerName = order.shippingAddress?.fullName || order.shippingAddress?.name || 'Valued Patron';
  const orderId = order.id || order._id || 'AURA-' + Date.now().toString().slice(-6);
  const totalAmount = order.total || order.subtotal || 0;
  const paymentMethod = order.paymentMethod || 'UPI / Instant Verified';
  const city = order.shippingAddress?.city || 'India';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-zinc-950 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-amber-400/40 relative animate-in zoom-in-95 duration-400">
        
        {/* Ambient golden celebration light */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-600/20 rounded-full blur-[80px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.15),_transparent_65%)]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-6 sm:p-8 text-center space-y-6">
          
          {/* Animated celebratory gold badge */}
          <div className="relative inline-flex mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 p-[2px] shadow-[0_0_50px_rgba(245,158,11,0.4)] animate-bounce">
              <div className="w-full h-full bg-zinc-950 rounded-3xl flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Congratulations Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PAYMENT SUCCESSFUL • ORDER VERIFIED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight mt-1">
              Congratulations!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 font-light">
              बधाई हो, <span className="font-semibold text-amber-300">{customerName}</span>! Your luxury order is officially confirmed.
            </p>
          </div>

          {/* Order Summary Receipt Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 font-medium">Order Number</span>
              <span className="font-mono font-bold text-amber-400 text-sm tracking-wide">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="text-zinc-400">Total Amount Paid</span>
              <span className="font-bold text-white text-sm font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="text-zinc-400">Payment Mode</span>
              <span className="text-emerald-400 font-semibold uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="text-zinc-400">Delivery Destination</span>
              <span className="text-zinc-200 truncate max-w-[200px]">{city}</span>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Truck className="w-3.5 h-3.5" /> Express 2-Day Priority Air
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                onClose();
                if (onViewDetails) onViewDetails(order);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Order Receipt</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium text-xs rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
