import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Zap,
  Activity,
  Shield
} from 'lucide-react';

export default function VideoProductSpotlight({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState('headphones'); // 'headphones' | 'watch'
  const videoRef = useRef(null);

  const videoData = {
    headphones: {
      title: 'NIKK AURA Studio Wireless Headphones',
      tagline: 'Pure Acoustic Silence. Milled Aluminum & Hand-Stitched Leather.',
      price: 24900,
      originalPrice: 29900,
      videoSrc: '/videos/headphones.mp4',
      fallbackSrc: 'https://assets.mixkit.co/videos/5452/5452-720.mp4',
      features: [
        { icon: Activity, title: 'Hybrid ANC', desc: 'Dual-mic noise cancellation with 40dB suppression' },
        { icon: Zap, title: '50h Playtime', desc: '10-minute fast charge yields 5 full hours of listening' },
        { icon: Shield, title: 'Beryllium Drivers', desc: 'Custom 40mm transducers tuned for pristine spatial audio' }
      ]
    },
    watch: {
      title: 'Chronos Minimalist Titanium Smartwatch',
      tagline: 'Grade-5 Aerospace Titanium. Sapphire Crystal Dial.',
      price: 32500,
      originalPrice: 38500,
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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleOrder = () => {
    if (product) {
      addToCart(product, 1);
    } else if (onQuickView) {
      onQuickView(activeTab === 'headphones' ? 'prod_1' : 'prod_2');
    }
  };

  return (
    <section className="relative my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Decorative Outer Shell */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl text-white">
        
        {/* Background Looping Video with Ambient Gradient */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />

          {/* Glowing Radial Orb */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[520px]">
          
          {/* Top Bar: Selector Tabs & Video Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
            
            {/* Tab Pill Switcher */}
            <div className="inline-flex p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('headphones')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'headphones'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🎧 Headphones 360° Video
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('watch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'watch'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ⏱️ Chronos Watch Video
              </button>
            </div>

            {/* Video Controls & Sound Equalizer Simulation */}
            <div className="flex items-center gap-3">
              {/* Equalizer animation */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-1 h-5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                <span className="w-1 h-4 bg-amber-400 animate-pulse delay-100 rounded-full" />
                <span className="ml-1 uppercase tracking-wider text-amber-300 font-semibold">Motion Reel</span>
              </div>

              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
                title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
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

              <p className="text-sm sm:text-base text-zinc-300 font-light max-w-xl leading-relaxed">
                {current.tagline}
              </p>

              {/* Price & Savings Badge */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl font-black text-amber-400 font-mono">
                  ₹{current.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-zinc-500 line-through font-mono">
                  ₹{current.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  Save ₹{(current.originalPrice - current.price).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOrder}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-amber-500/25 flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Flagship Piece</span>
                </button>

                <button
                  onClick={() => onQuickView && onQuickView(activeTab === 'headphones' ? 'prod_1' : 'prod_2')}
                  className="px-5 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wider rounded-xl border border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-zinc-400" />
                  <span>View Full Specs</span>
                </button>
              </div>
            </div>

            {/* Right: Feature Highlights Cards */}
            <div className="lg:col-span-5 space-y-3">
              {current.features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-400/40 transition-all duration-300 flex items-start gap-4 group"
                  >
                    <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {f.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Trust Indicators */}
          <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Complimentary insured air courier across India</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>30-day in-home auditory trial with full refund guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
