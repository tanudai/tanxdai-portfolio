// One small animated explainer per service tile, drawn as a pure function of progress p (0 to 1).
// Each tells the service as three captioned steps (input, what we do, outcome) using Phosphor duotone icons
// (MIT, see public/service-icons-LICENSE.txt) in glass tiles. Plays once, replays twice on hover or focus, then rests on the finished flow.
import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { curves } from '../film/ease.js';
import icons from './serviceIcons.js';

const C = { line: '#343434', dim: '#6a6a6a', ink: '#e6e6e6', mint: '#b7efcf', fill: '#161616' };
// Eased 0..1 for the slice of p between a and b.
const seg = (p, a, b, curve = 'enter') => curves[curve](Math.min(1, Math.max(0, (p - a) / (b - a))));
// Each story: three steps of [icon, caption]. The last step is the outcome and is highlighted in mint.
const stories = {
  '01': [['chat-circle-text', 'Enquiry'], ['robot', 'Grounded answers'], ['handshake', 'Lead handed on']],
  '02': [['note-pencil', 'Loose brief'], ['receipt', 'Draft quote'], ['seal-check', 'You approve']],
  '03': [['books', 'Your documents'], ['magnifying-glass', 'Search'], ['link', 'Answer + source']],
  '04': [['file-text', 'Invoice or form'], ['scan', 'Extract, review'], ['table', 'Your tools']],
  '05': [['ticket', 'Request'], ['headset', 'Policy draft'], ['check-circle', 'You send']],
  '06': [['envelope-simple', 'Enquiry'], ['notepad', 'Summary'], ['calendar-check', 'Follow-up']],
  '07': [['package', 'Your catalog'], ['compass', 'Guided match'], ['diamond', 'Right fit']],
  '08': [['article', 'Source material'], ['chart-line-up', 'Report draft'], ['pen-nib', 'You approve']],
  '09': [['paint-brush', 'Design'], ['browser', 'Build'], ['rocket-launch', 'Launch']],
  '10': [['paint-brush', 'Design'], ['puzzle-piece', 'CMS build'], ['graduation-cap', 'Team handover']],
  '11': [['browser', 'Your product'], ['plugs-connected', 'Connect AI'], ['sparkle', 'New ability']],
  '12': [['hard-drives', 'Backups'], ['wrench', 'Updates'], ['heartbeat', 'Stays healthy']],
  '13': [['magnifying-glass', 'Review'], ['clipboard-text', 'Findings'], ['check-square', 'Fix first']],
  '14': [['keyboard', 'Keyboard'], ['eye', 'Contrast + focus'], ['person-arms-spread', 'Usable by all']],
  '15': [['clipboard-text', 'Data inventory'], ['lock-key', 'Consent controls'], ['shield-check', 'Ready']],
  '16': [['lightbulb', 'Ideas'], ['scales', 'Feasibility'], ['target', 'Pilot scope']],
  '17': [['gauge', 'Monitor'], ['chart-bar', 'Evaluate'], ['sparkle', 'Improve']],
  '18': [['graduation-cap', 'Train'], ['users-three', 'Practice'], ['brain', 'Confident use']],
};

// Step captions of a service's flow, used as a caption where the stage is too small for step labels.
export const flowSteps = id => (stories[id] || []).map(step => step[1]);

const X = [52, 160, 268]; // step centres in the 320 x 74 viewBox, shaped like the tile's stage
const TILE = 46, ICON = 30, CY = 25;
const START = [0, .3, .6]; // when each step appears, as a share of p

function Step({ name, label, i, p, last }) {
  const k = seg(p, START[i], START[i] + .2, 'hero');
  const fin = last ? seg(p, .82, 1) : 0; // the outcome lights up once the flow arrives
  const cx = X[i], on = last && fin > .5;
  return <g opacity={Math.min(1, k * 2)} transform={`translate(0 ${(1 - k) * 8})`}>
    {last && <circle cx={cx} cy={CY} r="34" fill="url(#sa-glow)" opacity={fin * .9} />}
    <rect x={cx - TILE / 2} y={CY - TILE / 2} width={TILE} height={TILE} rx="13" fill="url(#sa-tile)" stroke={on ? C.mint : C.line} strokeOpacity={on ? .9 : 1} />
    <rect x={cx - TILE / 2 + 1} y={CY - TILE / 2 + 1} width={TILE - 2} height="14" rx="12" fill="url(#sa-sheen)" />
    <g transform={`translate(${cx} ${CY}) scale(${ICON / 256 * (.7 + .3 * k)}) translate(-128 -128)`} color={on ? C.mint : C.ink} fill="currentColor" dangerouslySetInnerHTML={{ __html: icons[name] }} />
    <text className="lbl" x={cx} y="62" textAnchor="middle" fontSize="10" fill={on ? C.mint : C.ink} opacity={seg(p, START[i] + .08, START[i] + .22)}>{label}</text>
  </g>;
}

// A connector draws from one step to the next; a small packet rides its leading edge.
function Link({ i, p }) {
  const a = X[i] + 30, b = X[i + 1] - 30, from = START[i] + .14, k = seg(p, from, from + .2, 'hero');
  return <g opacity={k > 0 ? 1 : 0}>
    <path d={`M${a} ${CY}H${b}`} stroke={C.dim} strokeWidth="1.2" strokeDasharray="1" pathLength="1" strokeDashoffset={1 - k} strokeLinecap="round" />
    <path d={`M${b - 4} ${CY - 4}l4 4-4 4`} fill="none" stroke={C.dim} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity={seg(p, from + .14, from + .2)} />
    {k > 0 && k < 1 && <circle cx={a + (b - a) * k} cy={CY} r="2.4" fill={C.mint} />}
  </g>;
}

function Scene({ id, p }) {
  const steps = stories[id];
  if (!steps) return null;
  return <>{steps.map(([name, label], i) => <Step key={name + i} name={name} label={label} i={i} p={p} last={i === 2} />)}{[0, 1].map(i => <Link key={i} i={i} p={p} />)}</>;
}

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
    const run = animate(progress, 1, { duration: 1.6, ease: 'linear', repeat: 1, repeatDelay: 0.6 }); // two passes, then it rests on the finished flow
    return () => { run.stop(); animate(progress, 1, { duration: 0.3, ease: 'linear' }); };
  }, [active, reduced, progress]);
  return <svg className="service-art" viewBox="0 0 320 74" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="sa-tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#202020" /><stop offset="1" stopColor="#121212" /></linearGradient><linearGradient id="sa-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".07" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient><radialGradient id="sa-glow"><stop offset="0" stopColor="#b7efcf" stopOpacity=".28" /><stop offset="1" stopColor="#b7efcf" stopOpacity="0" /></radialGradient></defs><Scene id={id} p={p} /></svg>;
}
