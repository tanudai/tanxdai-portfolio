// One small animated scene per service tile, drawn as a pure function of progress p (0 to 1).
// Plays once when the tile appears, rests on its final pose, replays on hover or focus.
import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { curves } from '../film/ease.js';

const C = { line: '#343434', dim: '#5a5a5a', ink: '#e6e6e6', mint: '#b7efcf', fill: '#161616' };
// Eased 0..1 for the slice of p between a and b.
const seg = (p, a, b, curve = 'enter') => curves[curve](Math.min(1, Math.max(0, (p - a) / (b - a))));
const bubble = (x, y, w, h, k, stroke) => <rect x={x} y={y + (1 - k) * 6} width={w} height={h} rx={h / 2} fill={C.fill} stroke={stroke} opacity={k} />;
const bar = (x, y, w, k, color = C.dim, h = 4) => <rect x={x} y={y} width={Math.max(0.01, w * k)} height={h} rx={h / 2} fill={color} />;
const tick = (x, y, k, color = C.mint) => <path d={`M${x} ${y}l4 4 8-9`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - k} />;

const scenes = {
  // Enquiry assistants: question in, answer out, lead captured.
  '01': p => <>{bubble(20, 10, 110, 18, seg(p, 0, .25), C.line)}{bar(32, 17, 70, seg(p, .1, .3))}
    {bubble(110, 34, 110, 18, seg(p, .3, .55), C.mint)}{bar(122, 41, 80, seg(p, .4, .6), C.mint)}
    <g opacity={seg(p, .65, .85)}><rect x="164" y="8" width="56" height="18" rx="9" fill="#b7efcf1f" stroke={C.mint} />{tick(174, 12, seg(p, .75, 1))}{bar(192, 15, 18, seg(p, .8, 1), C.mint)}</g></>,
  // Quote preparation: brief lines fill, price tag lands.
  '02': p => <><rect x="30" y="6" width="84" height="60" rx="8" fill={C.fill} stroke={C.line} />
    {[0, 1, 2, 3].map(i => <g key={i}>{bar(42, 18 + i * 11, [56, 44, 60, 36][i], seg(p, .05 + i * .1, .3 + i * .1))}</g>)}
    <g transform={`translate(${150 - 20 * (1 - seg(p, .5, .85))} 22)`} opacity={seg(p, .5, .8)}><path d="M0 0h52l12 14-12 14H0z" fill="#b7efcf1f" stroke={C.mint} /><circle cx="54" cy="14" r="3" fill={C.mint} />{bar(10, 12, 30, seg(p, .7, 1), C.mint)}</g></>,
  // Knowledge assistants: search sweeps the documents, one answer links back to its source.
  '03': p => { const s = seg(p, 0, .6, 'hero'); return <>{[0, 1, 2].map(i => <rect key={i} x={24 + i * 38} y="14" width="30" height="40" rx="5" fill={C.fill} stroke={i === 1 && p > .55 ? C.mint : C.line} />)}
    <g transform={`translate(${30 + s * 76} ${22})`}><circle cx="10" cy="10" r="9" fill="none" stroke={C.ink} strokeWidth="2" /><path d="m17 17 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" /></g>
    <path d="M77 54 C 100 70, 140 60, 160 40" fill="none" stroke={C.mint} strokeDasharray="1" pathLength="1" strokeDashoffset={1 - seg(p, .6, .85)} />
    {bubble(160, 26, 64, 18, seg(p, .75, 1), C.mint)}</>; },
  // Document workflows: a scan line reads the invoice, fields drop into rows.
  '04': p => { const y = 10 + seg(p, 0, .55, 'hero') * 50; return <><rect x="24" y="6" width="60" height="60" rx="6" fill={C.fill} stroke={C.line} />
    {[0, 1, 2, 3].map(i => <g key={i}>{bar(34, 16 + i * 12, 40, 1, C.line)}</g>)}<rect x="22" y={y} width="64" height="2" fill={C.mint} opacity={p < .6 ? 1 : 1 - seg(p, .6, .7)} />
    {[0, 1, 2].map(i => <g key={i} opacity={seg(p, .4 + i * .15, .6 + i * .15)} transform={`translate(${(1 - seg(p, .4 + i * .15, .6 + i * .15)) * -16} 0)`}><rect x="120" y={10 + i * 19} width="100" height="14" rx="4" fill={C.fill} stroke={i === 2 ? '#e8c07a' : C.line} />{bar(128, 15 + i * 19, i === 2 ? 30 : 60, 1, i === 2 ? '#e8c07a' : C.dim)}</g>)}</>; },
  // Support copilots: ticket arrives, gets a tag, a reply drafts itself.
  '05': p => <><rect x="16" y="12" width="92" height="46" rx="8" fill={C.fill} stroke={C.line} />{bar(26, 22, 60, seg(p, 0, .2))}{bar(26, 32, 44, seg(p, .05, .25))}
    <g opacity={seg(p, .25, .4)}><rect x="26" y="41" width="38" height="11" rx="5.5" fill="#b7efcf1f" stroke={C.mint} /></g>
    <path d="M114 35h18" stroke={C.dim} strokeDasharray="3 3" opacity={seg(p, .35, .5)} />
    <rect x="138" y="12" width="86" height="46" rx="8" fill={C.fill} stroke={C.mint} opacity={seg(p, .45, .6)} />
    {[0, 1, 2].map(i => <g key={i}>{bar(148, 22 + i * 10, [62, 54, 34][i], seg(p, .55 + i * .12, .75 + i * .12), C.mint)}</g>)}</>,
  // CRM & follow-ups: a lead card travels the pipeline to "follow-up".
  '06': p => { const k = seg(p, .15, .8, 'hero'); return <>{[0, 1, 2].map(i => <g key={i}><rect x={16 + i * 72} y="8" width="64" height="56" rx="7" fill="none" stroke={C.line} />{bar(24 + i * 72, 14, 26, 1, C.line, 3)}</g>)}
    <rect x={22 + k * 144} y="26" width="52" height="22" rx="5" fill={C.fill} stroke={k > .98 ? C.mint : C.ink} />{bar(28 + k * 144, 33, 30, 1, k > .98 ? C.mint : C.dim)}
    <circle cx="220" cy="10" r="4" fill={C.mint} opacity={seg(p, .85, 1)} /></>; },
  // Product discovery: the grid narrows to the one right match.
  '07': p => { const f = seg(p, .2, .7); return <>{[0, 1, 2, 3, 4, 5].map(i => { const hit = i === 4; const x = 40 + (i % 3) * 58, y = 6 + Math.floor(i / 3) * 33;
    return <rect key={i} x={x} y={y} width="48" height="27" rx="6" fill={C.fill} stroke={hit && f > .9 ? C.mint : C.line} opacity={hit ? 1 : 1 - f * .7} />; })}
    <path d="M14 14h16l-6 8v10l-4 2V22z" fill="none" stroke={C.ink} strokeLinejoin="round" opacity={seg(p, 0, .2)} />{tick(126, 44, seg(p, .75, 1))}</>; },
  // Content & reporting: figures rise, a trend draws, the draft is ready.
  '08': p => <>{[0, 1, 2, 3, 4].map(i => { const h = [18, 30, 24, 40, 48][i] * seg(p, i * .08, .35 + i * .08); return <rect key={i} x={24 + i * 22} y={64 - h} width="14" height={h} rx="3" fill={i === 4 ? C.mint : C.dim} />; })}
    <path d="M31 44 L53 34 L75 38 L97 22 L119 14" fill="none" stroke={C.ink} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - seg(p, .4, .75)} />
    <g opacity={seg(p, .7, .9)}><rect x="160" y="10" width="56" height="52" rx="6" fill={C.fill} stroke={C.mint} />{[0, 1, 2].map(i => <g key={i}>{bar(168, 22 + i * 10, [40, 32, 36][i], seg(p, .75 + i * .06, .9 + i * .03), C.mint)}</g>)}</g></>,
  // Custom websites: a page assembles inside the browser frame.
  '09': p => <><rect x="40" y="4" width="160" height="64" rx="8" fill={C.fill} stroke={C.line} /><path d="M40 16h160" stroke={C.line} />{[0, 1, 2].map(i => <circle key={i} cx={49 + i * 7} cy="10" r="2" fill={C.dim} />)}
    <rect x="50" y="22" width={110 * seg(p, .05, .35)} height="14" rx="3" fill={C.dim} />
    {[0, 1, 2].map(i => <rect key={i} x={50 + i * 48} y={44 + (1 - seg(p, .35 + i * .12, .6 + i * .12)) * 8} width="42" height="18" rx="4" fill={i === 1 ? '#b7efcf26' : C.fill} stroke={i === 1 ? C.mint : C.line} opacity={seg(p, .35 + i * .12, .6 + i * .12)} />)}</>,
  // WordPress development: content blocks stack like the editor.
  '10': p => <>{[0, 1, 2].map(i => { const k = seg(p, i * .22, .3 + i * .22, 'hero'); return <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * -14})`}><rect x="64" y={6 + i * 21} width="112" height="17" rx="4" fill={C.fill} stroke={i === 2 ? C.mint : C.line} />{bar(72, 12 + i * 21, [70, 50, 84][i], 1, i === 2 ? C.mint : C.dim)}</g>; })}
    <path d={`M${184} ${48 + (1 - seg(p, .7, 1)) * 10}l8 14 3-6 6-1z`} fill={C.ink} opacity={seg(p, .6, .8)} /></>,
  // AI feature integration: a new capability plugs into the existing app.
  '11': p => { const k = seg(p, .2, .75, 'hero'); return <><rect x="30" y="8" width="96" height="56" rx="8" fill={C.fill} stroke={C.line} />{bar(40, 20, 50, 1)}{bar(40, 30, 64, 1)}{bar(40, 40, 40, 1)}
    <g transform={`translate(${(1 - k) * 50} 0)`}><rect x="144" y="22" width="44" height="28" rx="7" fill="#b7efcf1a" stroke={C.mint} /><path d="M166 28v16M158 36h16M160.5 30.5l11 11M171.5 30.5l-11 11" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round" /></g>
    <path d="M126 36h18" stroke={C.mint} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - seg(p, .75, 1)} /></>; },
  // Website care: a steady heartbeat of checks.
  '12': p => <><path d="M16 40h40l8-18 10 34 10-26 6 10h134" fill="none" stroke={C.mint} strokeWidth="2" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - seg(p, 0, .8, 'hero')} />
    {[0, 1, 2].map(i => <circle key={i} cx={130 + i * 34} cy="40" r="6" fill={C.fill} stroke={C.mint} opacity={seg(p, .55 + i * .12, .7 + i * .12)} />)}</>,
  // Website quality review: findings ticked off in priority order.
  '13': p => <>{[0, 1, 2].map(i => <g key={i}><rect x="40" y={8 + i * 20} width="14" height="14" rx="4" fill={C.fill} stroke={seg(p, .15 + i * .22, .35 + i * .22) > .9 ? C.mint : C.line} />{tick(41.5, 11 + i * 20, seg(p, .15 + i * .22, .35 + i * .22))}{bar(64, 13 + i * 20, [120, 96, 108][i], 1, C.line)}{bar(64, 13 + i * 20, [120, 96, 108][i], seg(p, .15 + i * .22, .35 + i * .22), C.dim)}</g>)}</>,
  // Accessibility: a visible focus ring moves control to control.
  '14': p => { const k = seg(p, .1, .9, 'hero') * 2; const x = 38 + Math.min(2, k) * 60; return <>{[0, 1, 2].map(i => <rect key={i} x={44 + i * 60} y="24" width="48" height="24" rx="7" fill={C.fill} stroke={C.line} />)}
    <rect x={x} y="18" width="60" height="36" rx="11" fill="none" stroke={C.mint} strokeWidth="2.5" /></>; },
  // Privacy & GDPR readiness: consent switches set, shield confirms.
  '15': p => <>{[0, 1].map(i => { const k = seg(p, .15 + i * .25, .35 + i * .25); return <g key={i}>{bar(40, 20 + i * 24, 60, 1, C.line)}<rect x="116" y={13 + i * 24} width="30" height="16" rx="8" fill={k > .5 ? '#b7efcf33' : C.fill} stroke={k > .5 ? C.mint : C.line} /><circle cx={124 + k * 14} cy={21 + i * 24} r="5" fill={k > .5 ? C.mint : C.dim} /></g>; })}
    <path d="M186 10l20 7v14c0 13-9 22-20 26-11-4-20-13-20-26V17z" fill="#b7efcf14" stroke={C.mint} opacity={seg(p, .65, .85)} />{tick(180, 30, seg(p, .8, 1))}</>,
  // AI opportunity review: one clear target, one first step.
  '16': p => { const k = seg(p, .2, .75, 'hero'); return <>{[26, 18, 10].map((r, i) => <circle key={r} cx="150" cy="36" r={r} fill="none" stroke={i === 2 ? C.mint : C.line} opacity={seg(p, i * .1, .2 + i * .1)} />)}
    <g transform={`translate(${-80 * (1 - k)} 0)`} opacity={k}><path d="M70 36h72" stroke={C.ink} strokeWidth="2" strokeLinecap="round" /><path d="M136 30l8 6-8 6" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
    <circle cx="150" cy="36" r="3" fill={C.mint} opacity={seg(p, .75, .9)} /></>; },
  // AI quality & care: the gauge settles in the good zone.
  '17': p => { const a = (-160 + seg(p, .1, .8, 'hero') * 125) * Math.PI / 180; return <><path d="M80 60a40 40 0 0 1 80 0" fill="none" stroke={C.line} strokeWidth="6" strokeLinecap="round" /><path d="M140 29a40 40 0 0 1 20 31" fill="none" stroke={C.mint} strokeWidth="6" strokeLinecap="round" opacity=".7" />
    <path d={`M120 60L${120 + Math.cos(a) * 32} ${60 + Math.sin(a) * 32}`} stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" /><circle cx="120" cy="60" r="4" fill={C.ink} />{tick(186, 30, seg(p, .8, 1))}</>; },
  // AI adoption & training: the team connects around one shared practice.
  '18': p => <>{[[50, 20], [50, 52], [190, 36]].map(([x, y], i) => <g key={i} opacity={seg(p, i * .12, .25 + i * .12)}><circle cx={x} cy={y - 4} r="6" fill="none" stroke={C.ink} /><path d={`M${x - 10} ${y + 12}a10 9 0 0 1 20 0`} fill="none" stroke={C.ink} /></g>)}
    {[[60, 20], [60, 52], [180, 36]].map(([x, y], i) => <path key={i} d={`M${x} ${y}L120 36`} stroke={C.mint} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - seg(p, .35 + i * .1, .6 + i * .1)} />)}
    <circle cx="120" cy="36" r="13" fill="#b7efcf1a" stroke={C.mint} opacity={seg(p, .6, .8)} /><path d="M116 40h8M117 44h6M120 28a6 6 0 0 1 4 10.5V40h-8v-1.5A6 6 0 0 1 120 28z" fill="none" stroke={C.mint} strokeWidth="1.3" opacity={seg(p, .7, .9)} /></>,
};

export default function ServiceArt({ id, active, delay = 0 }) {
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? 1 : 0);
  const [p, setP] = useState(reduced ? 1 : 0);
  useMotionValueEvent(progress, 'change', setP);
  useEffect(() => { // intro once, on mount
    if (reduced) return;
    const run = animate(progress, 1, { duration: 1.6, delay, ease: 'linear' });
    return () => run.stop();
  }, [reduced, delay, progress]);
  useEffect(() => { // replay while hovered or focused
    if (reduced || !active) return;
    progress.set(0);
    const run = animate(progress, 1, { duration: 1.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 });
    return () => { run.stop(); animate(progress, 1, { duration: 0.3, ease: 'linear' }); };
  }, [active, reduced, progress]);
  return <svg className="service-art" viewBox="0 0 240 72" preserveAspectRatio="xMidYMid meet" aria-hidden="true">{scenes[id]?.(p)}</svg>;
}
