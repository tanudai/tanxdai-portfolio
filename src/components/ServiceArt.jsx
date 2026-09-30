// One small animated explainer per service tile, drawn as a pure function of progress p (0 to 1).
// Each tells the service as three captioned steps (input, what we do, outcome) using free 3D objects
// (Microsoft Fluent Emoji 3D, MIT, see public/service-3d/LICENSE), recoloured to silver and mint. Plays once, rests on the finished flow, replays on hover or focus.
import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { curves } from '../film/ease.js';

const C = { line: '#343434', dim: '#6a6a6a', ink: '#e6e6e6', mint: '#b7efcf', fill: '#161616' };
// Eased 0..1 for the slice of p between a and b.
const seg = (p, a, b, curve = 'enter') => curves[curve](Math.min(1, Math.max(0, (p - a) / (b - a))));
// Objects are recoloured to the site palette: silver for the working steps, mint for the outcome.
const asset = (name, last) => `${import.meta.env.BASE_URL}service-3d/${name}-${last ? 'mint' : 'silver'}.webp`;

// Each story: three steps of [3D object, caption]. The last step is the outcome and is highlighted in mint.
const stories = {
  '01': [['speech_balloon', 'Enquiry'], ['robot', 'Grounded answers'], ['check_mark_button', 'Lead handed on']],
  '02': [['memo', 'Loose brief'], ['receipt', 'Draft quote'], ['check_mark_button', 'You approve']],
  '03': [['books', 'Your documents'], ['magnifying_glass_tilted_left', 'Search'], ['link', 'Answer + source']],
  '04': [['page_with_curl', 'Invoice or form'], ['eye', 'Extract, review'], ['open_file_folder', 'Your tools']],
  '05': [['ticket', 'Request'], ['headphone', 'Policy draft'], ['check_mark_button', 'You send']],
  '06': [['incoming_envelope', 'Enquiry'], ['memo', 'Summary'], ['calendar', 'Follow-up']],
  '07': [['package', 'Your catalog'], ['compass', 'Guided match'], ['gem_stone', 'Right fit']],
  '08': [['memo', 'Source material'], ['chart_increasing', 'Report draft'], ['fountain_pen', 'You approve']],
  '09': [['artist_palette', 'Design'], ['desktop_computer', 'Build'], ['rocket', 'Launch']],
  '10': [['artist_palette', 'Design'], ['puzzle_piece', 'CMS build'], ['graduation_cap', 'Team handover']],
  '11': [['desktop_computer', 'Your product'], ['electric_plug', 'Connect AI'], ['sparkles', 'New ability']],
  '12': [['floppy_disk', 'Backups'], ['wrench', 'Updates'], ['green_heart', 'Stays healthy']],
  '13': [['magnifying_glass_tilted_right', 'Review'], ['clipboard', 'Findings'], ['check_mark_button', 'Fix first']],
  '14': [['keyboard', 'Keyboard'], ['eye', 'Contrast + focus'], ['wheelchair_symbol', 'Usable by all']],
  '15': [['clipboard', 'Data inventory'], ['locked', 'Consent controls'], ['shield', 'Ready']],
  '16': [['light_bulb', 'Ideas'], ['balance_scale', 'Feasibility'], ['bullseye', 'Pilot scope']],
  '17': [['stopwatch', 'Monitor'], ['bar_chart', 'Evaluate'], ['sparkles', 'Improve']],
  '18': [['graduation_cap', 'Train'], ['handshake', 'Practice together'], ['brain', 'Confident use']],
};

const X = [52, 160, 268]; // step centres in the 320 x 74 viewBox, shaped like the tile's stage
const SIZE = 38, CY = 25;
const START = [0, .3, .6]; // when each step appears, as a share of p

function Step({ name, label, i, p, last }) {
  const k = seg(p, START[i], START[i] + .2, 'hero');
  const fin = last ? seg(p, .82, 1) : 0; // the outcome glows once the flow arrives
  const cx = X[i];
  return <g opacity={Math.min(1, k * 2)} transform={`translate(0 ${(1 - k) * 8})`}>
    <circle cx={cx} cy={CY} r="24" fill={C.fill} stroke={last && fin > .5 ? C.mint : C.line} opacity=".9" />
    {last && <circle cx={cx} cy={CY} r={24 + fin * 4} fill="none" stroke={C.mint} opacity={(1 - fin) * .6} />}
    <image href={asset(name, last)} x={cx - SIZE / 2} y={CY - SIZE / 2} width={SIZE} height={SIZE} style={{ transformOrigin: `${cx}px ${CY}px`, transform: `scale(${.55 + .45 * k})` }} />
    <text className="lbl" x={cx} y="62" textAnchor="middle" fontSize="10" fill={last && fin > .5 ? C.mint : C.ink} opacity={seg(p, START[i] + .08, START[i] + .22)}>{label}</text>
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
    const run = animate(progress, 1, { duration: 1.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 });
    return () => { run.stop(); animate(progress, 1, { duration: 0.3, ease: 'linear' }); };
  }, [active, reduced, progress]);
  return <svg className="service-art" viewBox="0 0 320 74" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><Scene id={id} p={p} /></svg>;
}
