import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Zap,
  Activity,
  Shield,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function VideoProductSpotlight({ product, onQuickView, onDirectBuy }) {
  const { addToCart } = useCart();
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState('headphones'); // 'headphones' | 'watch'
  const videoRef = useRef(null);

  const videoData = {
    headphones: {
      productId: 'prod_1',
      title: 'NIKK AURA Studio Wireless ANC Headphones',
      tagline: 'Pure Acoustic Silence. Milled Aluminum & Hand-Stitched Leather.',
      price: 24999,
      originalPrice: 29999,
      videoSrc: '/videos/headphones.mp4',
      fallbackSrc: 'https://assets.mixkit.co/videos/5452/5452-720.mp4',
      features: [
        { icon: Activity, title: 'Hybrid ANC', desc: 'Dual-mic noise cancellation with 40dB suppression' },
        { icon: Zap, title: '50h Playtime', desc: '10-minute fast charge yields 5 full hours of listening' },
        { icon: Shield, title: 'Beryllium Drivers', desc: 'Custom 40mm transducers tuned for pristine spatial audio' }
      ]
    },
    watch: {
      productId: 'prod_2',
      title: 'Chronos Sapphire Minimalist Smartwatch',
      tagline: 'Grade-5 Aerospace Titanium. Sapphire Crystal Dial.',
      price: 32490,
      originalPrice: 36990,
      videoSrc: '/videos/watch.mp4',
      fallbackSrc: 'https://assets.mixkit.co/videos/9104/9104-720.mp4',
      features: [
        { icon: Activity, title: 'Bio-Sensors', desc: 'Continuous SpO2, heart rate variability and ECG tracking' },
        { icon: Zap, title: '14-Day Battery', desc: 'Ultra-efficient dual-core processor with always-on AMOLED' },
        { icon: Shield, title: '50M Water Resistance', desc: 'Precision CNC milled case rated for open ocean diving' }
      ]
    }
  };

  const current = videoData[activeTab];

  const toggleMute = () => {
    const active = soundManager.isAmbientActive();
    if (active) {
      soundManager.stopContinuousAmbient();
      setIsMuted(true);
      if (videoRef.current) videoRef.current.muted = true;
    } else {
      soundManager.startContinuousAmbient();
      setIsMuted(false);
      if (videoRef.current) videoRef.current.muted = false;
    }
  };

  const handleTabChange = (tab) => {
    soundManager.playTap();
    setActiveTab(tab);
  };

  const handleDirectBuy = () => {
    soundManager.playDirectBuy();
    const targetProduct = (product && product.id === current.productId) ? product : {
      id: current.productId,
      title: current.title,
      price: current.price,
      image: current.productId === 'prod_1' 
        ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics'
    };
    if (onDirectBuy) {
      onDirectBuy(targetProduct);
    } else if (onQuickView) {
      onQuickView(current.productId);
    }
  };

  const handleAddToCart = () => {
    soundManager.playAddToCart();
    const targetProduct = product && product.id === current.productId ? product : {
      id: current.productId,
      title: current.title,
      price: current.price,
      image: current.productId === 'prod_1' 
        ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      stockQuantity: 20
    };
    addToCart(targetProduct, 1);
  };

  return (
    <section className="relative my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Decorative Outer Shell */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl text-white">
        
        {/* Background Looping Video: Always Playing, No Pause */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={current.videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-all duration-1000 ease-out"
          >
            <source src={current.videoSrc} type="video/mp4" />
            <source src={current.fallbackSrc} type="video/mp4" />
          </video>

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14">
          
          {/* Top Bar: Selector Tabs & Sound Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            
            {/* Tabs Toggle */}
            <div className="flex items-center gap-2 p-1 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800">
              <button
                onClick={() => handleTabChange('headphones')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'headphones'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Studio Headphones</span>
                <span className="text-[10px] opacity-75 font-mono">₹24,999</span>
              </button>

              <button
                onClick={() => handleTabChange('watch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'watch'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Chronos Smartwatch</span>
                <span className="text-[10px] opacity-75 font-mono">₹32,490</span>
              </button>
            </div>

            {/* Live Equalizer Indicator & Sound Control (Pause button removed as requested) */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-1 h-5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                <span className="w-1 h-4 bg-amber-400 animate-pulse delay-100 rounded-full" />
                <span className="ml-1 uppercase tracking-wider text-amber-300 font-semibold">Live Loop</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border transition-all shadow-md cursor-pointer text-xs font-semibold ${
                  !isMuted
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:text-white'
                }`}
                title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden md:inline">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="hidden md:inline text-amber-300 font-bold">Sound ON</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Center Body: Title & Engineering Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured In-Motion Craftsmanship</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                {current.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
                {current.tagline}
              </p>

              {/* Engineering Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                {current.features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-400/40 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-amber-400 mb-2" />
                      <div className="text-xs font-bold text-white mb-1">{feat.title}</div>
                      <div className="text-[11px] text-zinc-400 leading-snug">{feat.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Direct Price Card & Fast Action Buttons */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm p-6 rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-amber-400/40 shadow-2xl shadow-black/60 text-center lg:text-left space-y-5">
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Direct Price Exclusive
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    In Stock • Ready to Ship
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-3 justify-center lg:justify-start">
                    <span className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-400">
                      ₹{current.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-zinc-500 line-through">
                      ₹{current.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Includes GST + Free Express Insured Delivery Across India
                  </p>
                </div>

                {/* Direct Action Buttons with Sound Integration */}
                <div className="space-y-2.5 pt-2">
                  {/* Direct Buy Now Button */}
                  <button
                    onClick={handleDirectBuy}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    <span>Direct Price Buy Now &rarr; ₹{current.price.toLocaleString('en-IN')}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>

                    {/* Quick View Details */}
                    <button
                      onClick={() => {
                        soundManager.playTap();
                        if (onQuickView) onQuickView(current.productId);
                      }}
                      className="py-2.5 px-4 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Specs</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2-Yr Warranty</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Same Day Dispatch</span>
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
