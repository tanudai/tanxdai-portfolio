// Web Audio API synthesizer for tactile physics feedback and ambient lo-fi sound
// Zero external asset dependencies, zero network latency, works 100% offline.

let audioCtx = null;

function getContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a physics collision thud.
 * @param {'gym'|'tile'|'chip'} variant
 * @param {number} intensity - 0 to 1
 */
export function playPhysicsThud(variant = 'gym', intensity = 0.5) {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const gain = ctx.createGain();
    const safeIntensity = Math.min(1, Math.max(0.12, intensity));

    if (variant === 'gym') {
      // Cast-iron resonant clank + low sub-thud
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, t);
      filter.frequency.exponentialRampToValueAtTime(55, t + 0.15);

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(115, t);
      osc1.frequency.exponentialRampToValueAtTime(36, t + 0.14);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75, t);
      osc2.frequency.exponentialRampToValueAtTime(28, t + 0.18);

      gain.gain.setValueAtTime(safeIntensity * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.17);
      osc2.stop(t + 0.18);
    } else {
      // Crisp acrylic/wood tactile chip tap
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(620, t);
      filter.Q.setValueAtTime(3, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.055);

      gain.gain.setValueAtTime(safeIntensity * 0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  } catch (_) {}
}
