import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

const SLIDES = [
  {
    tag: 'NEW AUDIO RELEASE 2026',
    title: 'Acoustic Precision. Pure Silence.',
    subtitle: 'Engineered with custom 40mm beryllium drivers and hybrid active noise cancellation for the purest sonic listening experience.',
    cta: 'Discover Aura Studio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
    highlight: '$299.00'
  },
  {
    tag: 'HOROLOGY & BIOMETRICS',
    title: 'Grade-5 Titanium. Sapphire Crystal.',
    subtitle: 'Seamlessly marrying timeless Swiss minimalism with continuous health biomonitoring and 14 days of relentless battery life.',
    cta: 'Explore Chronos',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
    highlight: '$389.00'
  },
  {
    tag: 'MONGOLIAN CASHMERE EDIT',
    title: 'Unrivaled Softness. Timeless Drape.',
    subtitle: 'Woven from ethically harvested grade-A cashmere fibers, tailored for warmth without bulk across every season.',
    cta: 'Shop Cashmere',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=80',
    highlight: '$495.00'
  }
];

export default function HeroSlider({ onExploreClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 min-h-[520px] flex flex-col justify-between">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            {slide.tag}
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 font-sans">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed mb-8 max-w-xl">
            {slide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-7 py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-sm rounded-full transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <span>{slide.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 text-zinc-400 text-xs">
              <span>Starting at</span>
              <strong className="text-white text-base font-semibold">{slide.highlight}</strong>
            </div>
          </div>
        </div>

        {/* Carousel Indicators and Controls */}
        <div className="flex items-center justify-between pt-12 border-t border-white/10 mt-12">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % SLIDES.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
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
              <span>Complimentary Shipping Over $100</span>
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
