// Film timing and layout, derived from the words on screen: edit a script and its film retimes itself.
// Plain JS (no JSX) so the lint and Remotion can import it directly.
import { EXIT_MS } from './ease.js';

export const CANVAS = { width: 800, height: 500 };
export const WPS = 3;           // on-screen reading pace (words per second)
export const CHAT_WPS = 5;      // chat bubbles are skimmed, not studied
export const TYPING_MS = 520;
export const STAGE = { top: 150, bottom: 44, gap: 18 };
export const words = text => text.trim().split(/\s+/).filter(Boolean).length;
export const readMs = (count, wps = WPS) => (count / wps) * 1000;

// Estimated rendered heights (px on the 800 by 500 canvas) for the stacked chat, matching film.css.
const CHARS_PER_LINE = 30;
export function beatHeight(step) {
  if (step.type === 'msg') return 92 + 44 * Math.ceil(step.text.length / CHARS_PER_LINE);
  if (step.type === 'event') return 78;
  if (step.type === 'card') { const r = Math.ceil(step.rows.length / 2); return 88 + r * 62 + 14 * (r - 1); }
  return 20 + 46 * Math.ceil(step.text.length / 26); // done: 38px text beside the check
}
export const TYPING_HEIGHT = 70;

function beatWords(step) {
  if (step.type === 'card') return words(step.title) + step.rows.reduce((n, [, value]) => n + words(value), 0);
  return words(step.text);
}

export function walkthroughBeats(steps) {
  let at = 380, y = 0;
  return steps.map(step => {
    const typing = step.type === 'msg' && step.side === 'ai' ? TYPING_MS : 0;
    const dur = typing + Math.max(950, readMs(beatWords(step), CHAT_WPS) + 260);
    const height = beatHeight(step);
    const beat = { step, start: at, typing, dur, y, height };
    at += dur; y += height + STAGE.gap;
    return beat;
  });
}

export function timeline(film) {
  const scenes = [];
  const push = (key, label, dur, extra = {}) => {
    const last = scenes.at(-1);
    scenes.push({ key, label, start: last ? last.start + last.dur : 0, dur: Math.round(dur), ...extra });
  };
  push('hook', 'Hook', Math.max(2700, 800 + readMs(words(film.hook)) + 300));
  let at = 520;
  // Lines arrive on a quick stagger; the scene holds long enough to read all of them.
  const starts = film.need.map((_, i) => at + i * 700);
  const needWords = film.need.reduce((n, line) => n + words(line), 0);
  push('need', 'The problem', Math.max(starts.at(-1) + 1400, 400 + readMs(needWords) * 0.85), { starts });
  if (film.walkthrough) {
    const beats = walkthroughBeats(film.walkthrough.steps);
    push('gets', 'What you get', beats.at(-1).start + beats.at(-1).dur + 450, { beats });
  } else {
    let g = 900;
    const itemStarts = film.gets.map(item => { const s = g; g += readMs(words(item)) * 0.7 + 300; return s; });
    push('gets', 'What you get', Math.max(5200, g + (film.note ? readMs(words(film.note)) * 0.8 : 0) + 600), { itemStarts });
  }
  const rowStarts = film.industries.map((_, i) => 420 + i * 520);
  const bestWords = film.industries.reduce((n, [, name, why]) => n + words(name) + words(why), 0);
  push('best', 'Best for', Math.max(rowStarts.at(-1) + 1600, 300 + readMs(bestWords) * 0.62), { rowStarts });
  push('end', 'Next step', 2800);
  return { scenes, total: scenes.at(-1).start + scenes.at(-1).dur };
}

// Last settled moment of a scene before it leaves (reduced motion shows this frame).
export const settledAt = scene => scene.start + scene.dur - EXIT_MS - 1;
