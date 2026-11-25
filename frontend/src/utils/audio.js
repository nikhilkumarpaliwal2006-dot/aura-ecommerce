// Luxury Web Audio API Sound Synthesizer for NIKK AURA
// Continuous luxury ambient audio + tactile interactive UI sounds

let audioCtx = null;
let isSoundEnabled = true;
let ambientNodes = [];
let ambientGain = null;
let isAmbientRunning = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const soundManager = {
  isEnabled: () => isSoundEnabled,
  isAmbientActive: () => isAmbientRunning,

  // Continuous luxury ambient sound loop (plays indefinitely until turned off)
  startContinuousAmbient: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return false;

      // Stop any existing loop first
      soundManager.stopContinuousAmbient();

      // Master ambient gain node
      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      // Gentle fade in over 1.2s to a warm, non-intrusive volume
      ambientGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
      ambientGain.connect(ctx.destination);

      // Warm luxury chord: C3 (130.81Hz), G3 (196.00Hz), C4 (261.63Hz), E4 (329.63Hz)
      const frequencies = [130.81, 196.00, 261.63, 329.63];
      ambientNodes = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const nodeGain = ctx.createGain();
        
        // Soft soothing sine waves with gentle detuning for lush stereo warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

        nodeGain.gain.setValueAtTime(0.25, ctx.currentTime);

        // Slow subtle LFO for breathing movement
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime); // ~6 second breath cycle
        lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(nodeGain.gain);

        osc.connect(nodeGain);
        nodeGain.connect(ambientGain);

        osc.start();
        lfo.start();

        ambientNodes.push(osc, lfo);
      });

      isAmbientRunning = true;
      return true;
    } catch (e) {
      console.warn('Continuous ambient audio init error:', e);
      return false;
    }
  },

  // Stop continuous ambient sound with smooth fade out
  stopContinuousAmbient: () => {
    try {
      if (ambientGain && audioCtx) {
        ambientGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      }
      setTimeout(() => {
        ambientNodes.forEach(node => {
          try {
            node.stop();
            node.disconnect();
          } catch (e) {}
        });
        ambientNodes = [];
        ambientGain = null;
        isAmbientRunning = false;
      }, 450);
    } catch (e) {
      ambientNodes = [];
      ambientGain = null;
      isAmbientRunning = false;
    }
  },

  // Toggle continuous ambient audio loop
  toggleContinuousAmbient: () => {
    if (isAmbientRunning) {
      soundManager.stopContinuousAmbient();
      return false;
    } else {
      return soundManager.startContinuousAmbient();
    }
  },

  // Toggle UI sound effects
  toggleSound: () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundManager.playChime();
    } else {
      soundManager.stopContinuousAmbient();
    }
    return isSoundEnabled;
  },

  setSoundEnabled: (enabled) => {
    isSoundEnabled = !!enabled;
    if (!isSoundEnabled) {
      soundManager.stopContinuousAmbient();
    }
  },

  // Soft luxury tactile tap
  playTap: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  },

  // Two-tone crystalline chime for Add to Cart
  playAddToCart: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Note 2: B5 (987.77 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.08);
      gain2.gain.setValueAtTime(0.14, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
    } catch (e) {}
  },

  // Rich ascending gold chime for Direct Price / Buy Now
  playDirectBuy: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Golden Major Chord)
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.11, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (e) {}
  },

  // Subtle golden chime for UI activations
  playChime: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  },

  // Grand, celebratory luxury fanfare for Order Success & Congratulations
  playCongratulationsSound: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Triumphant ascending fanfare: C4, E4, G4, C5, E5, G5, C6 (Grand Royal Fanfare)
      const fanfare = [
        { freq: 261.63, delay: 0.00, dur: 0.28 },
        { freq: 329.63, delay: 0.08, dur: 0.28 },
        { freq: 392.00, delay: 0.16, dur: 0.32 },
        { freq: 523.25, delay: 0.24, dur: 0.40 },
        { freq: 659.25, delay: 0.36, dur: 0.48 },
        { freq: 783.99, delay: 0.46, dur: 0.55 },
        { freq: 1046.50, delay: 0.58, dur: 1.25 } // Grand sustained high bell
      ];

      fanfare.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Shimmering bell tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        gain.gain.setValueAtTime(0.20, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.dur);
      });

      // Warm celebration sustained harmony chord under the final bell
      const harmonyChord = [261.63, 392.00, 523.25, 659.25];
      harmonyChord.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.58);
        gain.gain.setValueAtTime(0.09, now + 0.58);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.58);
        osc.stop(now + 1.86);
      });
    } catch (e) {
      console.warn('Celebration sound error:', e);
    }
  }
};
