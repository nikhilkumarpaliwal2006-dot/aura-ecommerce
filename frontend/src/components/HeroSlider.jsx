import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const SLIDES = [
  {
    tag: 'FLAGSHIP AUDIO RELEASE 2026',
    title: 'Acoustic Precision. Pure Silence.',
    subtitle: 'Engineered with custom 40mm beryllium drivers and hybrid active noise cancellation for the purest sonic listening experience.',
    cta: 'Discover NIKK AURA Studio',
    video: '/videos/headphones.mp4',
    videoFallback: 'https://assets.mixkit.co/videos/5452/5452-720.mp4',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
    highlight: '₹24,999',
    productId: 'prod_1',
    productName: 'NIKK AURA Studio Wireless Headphones',
    rating: '4.9 ★ (128 reviews)'
  },
  {
    tag: 'HOROLOGY & BIOMETRICS',
    title: 'Grade-5 Titanium. Sapphire Crystal.',
    subtitle: 'Seamlessly marrying timeless Swiss minimalism with continuous health biomonitoring and 14 days of relentless battery life.',
    cta: 'Explore Chronos Watch',
    video: '/videos/watch.mp4',
    videoFallback: 'https://assets.mixkit.co/videos/9104/9104-720.mp4',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
    highlight: '₹32,490',
    productId: 'prod_2',
    productName: 'Chronos Titanium Minimalist Smartwatch',
    rating: '4.8 ★ (94 reviews)'
  },
  {
    tag: 'MONGOLIAN CASHMERE EDIT',
    title: 'Unrivaled Softness. Timeless Drape.',
    subtitle: 'Woven from ethically harvested grade-A cashmere fibers, tailored for warmth without bulk across every season.',
    cta: 'Shop Cashmere Collection',
    video: 'https://assets.mixkit.co/videos/32692/32692-720.mp4',
    videoFallback: 'https://assets.mixkit.co/videos/4146/4146-720.mp4',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=80',
    highlight: '₹42,500',
    productId: 'prod_3',
    productName: 'Kashmir Pure Cashmere Oversized Overcoat',
    rating: '5.0 ★ (42 reviews)'
  }
];

export default function HeroSlider({ onExploreClick, onQuickView, onDirectBuy }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const slide = SLIDES[currentSlide];

  // Auto slide advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  // Update video playback continuously without pause
  useEffect(() => {
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlide]);

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

  const handleNextSlide = () => {
    soundManager.playTap();
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  };

  const handlePrevSlide = () => {
    soundManager.playTap();
    setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleDirectBuyClick = (e, productId) => {
    e.stopPropagation();
    soundManager.playDirectBuy();
    const cleanPrice = parseInt(slide.highlight.replace(/[^0-9]/g, ''), 10) || 24999;
    const directObj = {
      id: productId,
      title: slide.productName,
      price: cleanPrice,
      category: 'Luxury Essentials',
      image: slide.image
    };
    if (onDirectBuy) {
      onDirectBuy(directObj);
    } else if (onQuickView) {
      onQuickView(productId);
    }
  };

  return (
    <div className="relative bg-zinc-950 text-white overflow-hidden select-none">
      
      {/* Background Video Layer: Continuous Loop, No Pausing */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slide.video ? (
          <video
            ref={videoRef}
            key={slide.video}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            poster={slide.image}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-45 scale-100' : 'opacity-20 scale-105'
            }`}
          >
            <source src={slide.video} type="video/mp4" />
            {slide.videoFallback && <source src={slide.videoFallback} type="video/mp4" />}
          </video>
        ) : (
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
          />
        )}

        {/* Ambient Dark Luxury Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
        
        {/* Animated ambient light orb */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 min-h-[580px] flex flex-col justify-between">
        
        {/* Top Floating Badge & Audio Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/40">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>CONTINUOUS CINEMATIC MOTION</span>
          </div>

          {/* Sound Control Button (Pause button removed as requested) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all shadow-md cursor-pointer text-xs font-semibold ${
                !isMuted 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-zinc-900/70 hover:bg-zinc-800 border-zinc-700/60 text-zinc-300 hover:text-white'
              }`}
              title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
              aria-label="Toggle sound"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sound OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="hidden sm:inline text-amber-400 font-bold">Sound ON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Section with Interactive Floating Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Heading, Subtitle & Direct Price Buttons */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {slide.tag}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-5 text-white">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-8 max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTAs with Direct Price Active Button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  soundManager.playTap();
                  if (onExploreClick) onExploreClick();
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm rounded-full transition-all flex items-center gap-2 shadow-xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {/* Fully Active Direct Price Instant Buy Button */}
              <button
                onClick={(e) => handleDirectBuyClick(e, slide.productId)}
                className="group flex items-center gap-2.5 px-5 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-full border border-amber-400/60 hover:border-amber-400 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={`Instant Direct Checkout at ${slide.highlight}`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-semibold">Direct Price:</span>
                <strong className="text-amber-400 text-base font-extrabold tracking-tight">{slide.highlight}</strong>
                <span className="text-[11px] font-bold text-zinc-400 group-hover:text-amber-300 transition-colors ml-1">&rarr; Buy Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Animated Product Spotlight Card with Direct Order */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => {
                soundManager.playTap();
                if (onQuickView) onQuickView(slide.productId);
              }}
            >
              {/* Outer Glowing Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-amber-300/30 to-amber-600/40 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse duration-1000" />
              
              {/* Glass Card */}
              <div className="relative bg-zinc-900/85 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-5 shadow-2xl max-w-xs transition-transform transform group-hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-2">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>In-Motion Preview</span>
                  </span>
                  <span className="text-emerald-400">● Live Reel</span>
                </div>

                {/* Mini Image thumbnail */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-zinc-800 relative">
                  <img
                    src={slide.image}
                    alt={slide.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      {slide.productName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 mb-3">
                  <span className="text-zinc-400 font-medium">{slide.rating}</span>
                  <span className="font-extrabold text-amber-400 text-sm">{slide.highlight}</span>
                </div>

                {/* Direct Action inside Floating Card */}
                <button
                  onClick={(e) => handleDirectBuyClick(e, slide.productId)}
                  className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-zinc-950" />
                  <span>Direct Buy Now</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Pagination & Navigation Dots */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playTap();
                  setCurrentSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 h-2 bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee strip */}
      <div className="relative z-10 bg-zinc-900/90 border-t border-zinc-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Complimentary Shipping Over ₹2,499</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>2-Year Authentic Warranty</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Certified Sustainable Craft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
