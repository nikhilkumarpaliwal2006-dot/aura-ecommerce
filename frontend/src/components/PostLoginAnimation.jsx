import React, { useEffect, useState } from 'react';

export default function PostLoginAnimation({ user, onComplete }) {
  const [stage, setStage] = useState(0); // 0: enter, 1: glow/monogram, 2: welcome text, 3: ready, 4: exit
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 1: Reveal monogram
    const t1 = setTimeout(() => setStage(1), 300);
    // Stage 2: Reveal welcome message
    const t2 = setTimeout(() => setStage(2), 1100);
    // Stage 3: Ready to enter
    const t3 = setTimeout(() => setStage(3), 2200);
    // Stage 4: Fade out and complete
    const t4 = setTimeout(() => {
      setStage(4);
      setTimeout(onComplete, 600);
    }, 3200);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 55);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(interval);
    };
  }, [onComplete]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Valued Collector';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 text-white overflow-hidden transition-opacity duration-700 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-zinc-950/80 to-zinc-950" />
      </div>

      {/* Main Animated Card */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-8 text-center">
        
        {/* Animated Brand Monogram Emblem */}
        <div className="relative mb-8">
          <div
            className={`w-24 h-24 rounded-full border-2 border-amber-400/30 flex items-center justify-center bg-zinc-900/90 shadow-[0_0_50px_rgba(217,119,6,0.25)] transition-all duration-1000 transform ${
              stage >= 1 ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-45 opacity-0'
            }`}
          >
            {/* Spinning decorative orbit */}
            <div className="absolute inset-0 rounded-full border-t-2 border-amber-400 animate-spin duration-3000" />
            <div className="text-2xl font-serif font-black tracking-widest text-amber-300">
              NA
            </div>
          </div>
          
          {/* Subtle pulse ring */}
          <div className="absolute -inset-2 rounded-full border border-amber-400/20 animate-ping opacity-25" />
        </div>

        {/* Brand Title */}
        <div
          className={`transition-all duration-700 transform ${
            stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-amber-400 font-semibold mb-2 block">
            Welcome to the World of
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white mb-3">
            NIKK <span className="text-amber-400 font-light italic">AURA</span>
          </h1>
        </div>

        {/* Personalized Welcome text */}
        <div
          className={`transition-all duration-700 delay-200 transform ${
            stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="text-lg md:text-xl font-light text-zinc-300 mb-2">
            Namaste, <span className="font-semibold text-amber-200">{userName}</span>
          </p>
          <p className="text-xs md:text-sm text-zinc-400 max-w-sm tracking-wide">
            Preparing your curated luxury catalog & bespoke Indian living essentials...
          </p>
        </div>

        {/* Progress loader */}
        <div className="w-64 mt-8 flex flex-col items-center">
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(251,191,36,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between w-full mt-2 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            <span>Authenticating</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Skip button in bottom */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest underline decoration-zinc-700 underline-offset-4"
        >
          Enter Store Immediately &rarr;
        </button>

      </div>
    </div>
  );
}
