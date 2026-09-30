// Deterministic timing for films: every value is a pure function of t (ms). Same numbers in the browser and in Remotion.
import { ease as presets } from '../motion.js';

// Cubic-bezier evaluator (x to y) for the named presets in motion.js. Newton steps with a bisection fallback.
function bezier([x1, y1, x2, y2]) {
  const a = (p1, p2) => 1 - 3 * p2 + 3 * p1, b = (p1, p2) => 3 * p2 - 6 * p1, c = p1 => 3 * p1;
  const at = (s, p1, p2) => ((a(p1, p2) * s + b(p1, p2)) * s + c(p1)) * s;
  const slope = (s, p1, p2) => 3 * a(p1, p2) * s * s + 2 * b(p1, p2) * s + c(p1);
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let s = x;
    for (let i = 0; i < 8; i++) {
      const d = slope(s, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      s -= (at(s, x1, x2) - x) / d;
    }
    if (s < 0 || s > 1 || Math.abs(at(s, x1, x2) - x) > 1e-4) {
      let lo = 0, hi = 1;
      for (let i = 0; i < 30; i++) { s = (lo + hi) / 2; if (at(s, x1, x2) < x) lo = s; else hi = s; }
    }
    return at(s, y1, y2);
  };
}

export const curves = { enter: bezier(presets.enter), exit: bezier(presets.exit), hero: bezier(presets.hero), linear: x => Math.min(1, Math.max(0, x)) };

export const clamp01 = x => Math.min(1, Math.max(0, x));
// Raw progress of a window [start, start + dur] at time t.
export const progress = (t, start, dur) => clamp01((t - start) / dur);
// Eased progress through a window.
export const tween = (t, start, dur, curve = 'enter') => curves[curve](progress(t, start, dur));
export const mix = (from, to, p) => from + (to - from) * p;

// The one transition language: things arrive rising and sharpening, and leave lifting and fading.
export const ENTER_MS = 560;
export const EXIT_MS = 320;
export function arrive(t, start, { distance = 22, blur = 8 } = {}) {
  const p = tween(t, start, ENTER_MS, 'enter');
  return { opacity: p, transform: `translate3d(0, ${mix(distance, 0, p)}px, 0)`, filter: p < 1 ? `blur(${mix(blur, 0, p)}px)` : 'none' };
}
export function leave(t, start, { distance = 14 } = {}) {
  const p = tween(t, start, EXIT_MS, 'exit');
  return { opacity: 1 - p, transform: `translate3d(0, ${mix(0, -distance, p)}px, 0)` };
}
// Combine an arrival and an optional departure into one style.
export function presence(t, inAt, outAt) {
  const a = arrive(t, inAt);
  if (outAt == null || t < outAt) return a;
  const l = leave(t, outAt);
  return { opacity: a.opacity * l.opacity, transform: l.transform, filter: a.filter };
}
