import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function Footer({ onCategoryClick, onOpenOrders }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Strip */}
        <div className="pb-12 border-b border-zinc-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 tracking-widest uppercase mb-2 block">
              PRIVILEGED DISPATCH
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Join the Aura Inner Circle
            </h3>
            <p className="text-zinc-400 text-xs mt-1 max-w-md">
              Receive private previews of limited seasonal releases, acoustic engineering monographs, and invitations to private trunk sales.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You're on the list. Check your inbox shortly for your 10% welcome invitation.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-4">
              Curated Collections
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li><button onClick={() => onCategoryClick('Electronics')} className="hover:text-white transition-colors">High-Fidelity Audio</button></li>
              <li><button onClick={() => onCategoryClick('Electronics')} className="hover:text-white transition-colors">Titanium Horology</button></li>
              <li><button onClick={() => onCategoryClick('Fashion')} className="hover:text-white transition-colors">Mongolian Cashmere</button></li>
              <li><button onClick={() => onCategoryClick('Accessories')} className="hover:text-white transition-colors">Full-Grain Leatherware</button></li>
              <li><button onClick={() => onCategoryClick('Living')} className="hover:text-white transition-colors">Nordic Living Essentials</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-4">
              Concierge & Client Care
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li><button onClick={onOpenOrders} className="hover:text-white transition-colors">Track Your Consignment</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Complimentary Express Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">30-Day In-Home Trial</a></li>
              <li><a href="#" className="hover:text-white transition-colors">2-Year Precision Warranty</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Concierge (24/7)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-4">
              The Aura Atelier
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Acoustic Transducer Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainable Material Ethics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Artisan Biella Mills</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carbon-Neutral Packaging</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-4">
              Corporate Headquarters
            </h4>
            <div className="space-y-2 text-zinc-400 leading-relaxed">
              <p>742 Montgomery St, Suite 400<br />San Francisco, CA 94111</p>
              <p className="pt-2">concierge@aura-living.com<br />+1 (800) 892-AURA</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Strip */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © 2026 Aura Living & Co. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>PCI-DSS Level 1 Encrypted</span>
            </span>
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
