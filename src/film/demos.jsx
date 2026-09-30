// "What you get" visuals for services 09–18. Each is a pure function of p (0..1) drawn in a 376 by 290 SVG.
import { clamp01, curves, mix } from './ease.js';

const INK = '#f3f3f3', DIM = '#aaa', LINE = '#333', PANEL = '#101010', CARD = '#191919', MINT = '#b7efcf';
const win = (p, a, b, curve = 'enter') => curves[curve](clamp01((p - a) / (b - a)));
const pop = k => ({ opacity: k, transform: `translateY(${mix(10, 0, k)}px)`, transformBox: 'fill-box', transformOrigin: 'center' });
const Tick = ({ x, y, k, r = 11 }) => <g opacity={k}><circle cx={x} cy={y} r={r} fill={MINT} /><path d={`M${x - 5} ${y}l3.5 3.5L${x + 5.5} ${y - 4}`} stroke="#0b0b0b" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
const Label = ({ x, y, children, size = 15, fill = DIM, weight = 500, anchor }) => <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor}>{children}</text>;

function Browser({ p }) {
  const blocks = [[18, 44, 304, 14, 0.05], [18, 76, 200, 22, 0.14], [18, 106, 150, 22, 0.22], [18, 142, 96, 30, 0.3], [18, 190, 94, 68, 0.4], [123, 190, 94, 68, 0.46], [228, 190, 94, 68, 0.52]];
  const phone = win(p, 0.62, 0.86, 'hero');
  return <>
    <rect x="10" y="10" width="340" height="270" rx="14" fill={PANEL} stroke={LINE} />
    <circle cx="28" cy="26" r="3.5" fill="#444" /><circle cx="40" cy="26" r="3.5" fill="#444" /><circle cx="52" cy="26" r="3.5" fill="#444" />
    {blocks.map(([x, y, w, h, at], i) => { const k = win(p, at, at + 0.14); return <rect key={i} x={x + 10} y={y} width={w} height={h} rx="6" fill={i === 3 ? MINT : i === 1 ? '#3a3a3a' : CARD} stroke={i > 3 ? LINE : 'none'} style={pop(k)} />; })}
    <g transform={`translate(${mix(300, 258, phone)} ${mix(96, 70, phone)})`} opacity={phone}>
      <rect width="104" height="200" rx="18" fill="#0b0b0b" stroke="#555" strokeWidth="2" />
      <rect x="14" y="20" width="76" height="10" rx="4" fill="#3a3a3a" /><rect x="14" y="40" width="56" height="10" rx="4" fill="#3a3a3a" />
      <rect x="14" y="62" width="40" height="16" rx="6" fill={MINT} /><rect x="14" y="90" width="76" height="44" rx="8" fill={CARD} stroke={LINE} /><rect x="14" y="142" width="76" height="44" rx="8" fill={CARD} stroke={LINE} />
    </g>
  </>;
}

function Blocks({ p }) {
  const chips = ['Hero', 'Gallery', 'Tour list', 'Enquiry'];
  const published = win(p, 0.82, 0.95);
  return <>
    <rect x="6" y="10" width="112" height="270" rx="12" fill={PANEL} stroke={LINE} />
    <Label x="20" y="36" size={13}>BLOCKS</Label>
    <rect x="130" y="10" width="240" height="270" rx="12" fill={PANEL} stroke={LINE} />
    {chips.map((name, i) => {
      const k = win(p, 0.08 + i * 0.17, 0.26 + i * 0.17, 'hero');
      const x = mix(18, 146, k), y = mix(52 + i * 48, 26 + i * 52, k), w = mix(88, 208, k);
      return <g key={name}>
        <rect x="18" y={52 + i * 48} width="88" height="38" rx="8" fill="none" stroke="#2a2a2a" strokeDasharray="4 4" opacity={k} />
        <rect x={x} y={y} width={w} height={mix(38, 44, k)} rx="8" fill={k > 0.98 ? CARD : '#222'} stroke={k > 0.98 ? LINE : MINT} />
        <Label x={x + 12} y={y + 25} size={14} fill={INK}>{name}</Label>
      </g>;
    })}
    <g opacity={published} transform={`translate(0 ${mix(8, 0, published)})`}><rect x="250" y="236" width="108" height="30" rx="15" fill={MINT} /><Label x="304" y="256" size={13} fill="#0b0b0b" weight={600} anchor="middle">Published</Label></g>
  </>;
}

function Plugin({ p }) {
  const panel = win(p, 0.18, 0.42, 'hero');
  const line = (a, b) => win(p, a, b);
  const chip = win(p, 0.72, 0.86);
  return <>
    <rect x="6" y="10" width="364" height="270" rx="14" fill={PANEL} stroke={LINE} />
    {[0, 1, 2, 3, 4].map(i => <g key={i}><rect x="24" y={40 + i * 46} width="30" height="30" rx="8" fill={CARD} /><rect x="64" y={46 + i * 46} width={[150, 120, 170, 110, 140][i]} height="8" rx="4" fill="#333" /><rect x="64" y={60 + i * 46} width="90" height="6" rx="3" fill="#262626" /></g>)}
    <g transform={`translate(${mix(380, 196, panel)} 0)`}>
      <rect x="0" y="24" width="160" height="242" rx="12" fill="#0f1a14" stroke={`${MINT}66`} />
      <path d="M22 44c.5 3.5 2.3 5.3 5.8 5.8-3.5.5-5.3 2.3-5.8 5.8-.5-3.5-2.3-5.3-5.8-5.8 3.5-.5 5.3-2.3 5.8-5.8Z" fill={MINT} />
      <Label x="36" y="55" size={13} fill={MINT} weight={600}>Assistant</Label>
      <rect x="16" y="76" width={mix(0, 128, line(0.4, 0.52))} height="8" rx="4" fill="#3d5a4a" />
      <rect x="16" y="92" width={mix(0, 104, line(0.5, 0.62))} height="8" rx="4" fill="#3d5a4a" />
      <rect x="16" y="108" width={mix(0, 116, line(0.58, 0.7))} height="8" rx="4" fill="#3d5a4a" />
      <g opacity={chip} transform={`translate(0 ${mix(8, 0, chip)})`}><rect x="16" y="140" width="128" height="34" rx="17" fill={MINT} /><Label x="80" y="162" size={13} fill="#0b0b0b" weight={600} anchor="middle">Apply suggestion</Label></g>
    </g>
  </>;
}

function Uptime({ p }) {
  const draw = win(p, 0.05, 0.6, 'linear');
  const pts = '20,120 70,120 90,120 104,84 118,150 132,108 150,120 220,120 240,120 254,90 268,146 282,112 300,120 350,120';
  const rows = ['Backups', 'Forms', 'Speed'];
  const ok = win(p, 0.82, 0.95);
  return <>
    <rect x="6" y="10" width="364" height="270" rx="14" fill={PANEL} stroke={LINE} />
    {[70, 120, 170].map(y => <path key={y} d={`M20 ${y}h330`} stroke="#1f1f1f" />)}
    <polyline points={pts} fill="none" stroke={MINT} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
    {rows.map((name, i) => { const k = win(p, 0.42 + i * 0.12, 0.54 + i * 0.12); return <g key={name}><Label x={40 + i * 112} y="214" size={14} fill={INK}>{name}</Label><Tick x={30 + i * 112} y={209} k={k} r={8} /></g>; })}
    <g opacity={ok}><rect x="96" y="232" width="184" height="32" rx="16" fill="#0f1a14" stroke={`${MINT}66`} /><Label x="188" y="253" size={13} fill={MINT} weight={600} anchor="middle">All checks passing</Label></g>
  </>;
}

function Audit({ p }) {
  const spots = [[70, 70], [150, 150], [96, 214]];
  const bars = [['Fix first', 150], ['Next', 104], ['Later', 62]];
  return <>
    <rect x="6" y="10" width="180" height="270" rx="12" fill={PANEL} stroke={LINE} />
    <rect x="22" y="30" width="148" height="12" rx="4" fill="#2a2a2a" /><rect x="22" y="56" width="110" height="26" rx="6" fill={CARD} /><rect x="22" y="96" width="148" height="80" rx="8" fill={CARD} /><rect x="22" y="190" width="148" height="60" rx="8" fill={CARD} />
    {spots.map(([x, y], i) => { const k = win(p, 0.08 + i * 0.12, 0.2 + i * 0.12); return <g key={i} style={pop(k)} opacity={k}><circle cx={x} cy={y} r="14" fill={MINT} /><Label x={x} y={y + 5} size={14} fill="#0b0b0b" weight={700} anchor="middle">{i + 1}</Label></g>; })}
    {bars.map(([name, w], i) => { const k = win(p, 0.46 + i * 0.12, 0.66 + i * 0.12); return <g key={name}><Label x="204" y={70 + i * 72} size={14} fill={INK} weight={600}>{name}</Label><rect x="204" y={82 + i * 72} width="160" height="12" rx="6" fill="#1f1f1f" /><rect x="204" y={82 + i * 72} width={w * k} height="12" rx="6" fill={i === 0 ? MINT : i === 1 ? '#7fa892' : '#4a5f53'} /></g>; })}
  </>;
}

function Focus({ p }) {
  const fields = [60, 118, 176];
  const stops = [...fields, 234];
  const seg = Math.min(3, Math.floor(clamp01(p / 0.66) * 3.999));
  const local = curves.hero(clamp01((clamp01(p / 0.66) * 4 - seg)));
  const y = seg < 3 ? mix(stops[seg], stops[seg + 1], local) : stops[3];
  const w = y >= 226 ? 140 : 300;
  const contrast = win(p, 0.72, 0.9);
  const grey = Math.round(mix(58, 205, contrast));
  return <>
    <rect x="6" y="10" width="364" height="270" rx="14" fill={PANEL} stroke={LINE} />
    <Label x="40" y="44" size={14} fill={`rgb(${grey},${grey},${grey})`} weight={600}>Book an appointment</Label>
    {fields.map((fy, i) => <g key={fy}><rect x="40" y={fy} width="300" height="40" rx="8" fill={CARD} stroke={LINE} /><Label x="54" y={fy + 25} size={13} fill={`rgb(${grey - 8},${grey - 8},${grey - 8})`}>{['Name', 'Email', 'Preferred date'][i]}</Label></g>)}
    <rect x="40" y="234" width="140" height="40" rx="20" fill={MINT} /><Label x="110" y="259" size={14} fill="#0b0b0b" weight={600} anchor="middle">Continue</Label>
    <rect x="35" y={y - 5} width={w + 10} height="50" rx={w === 140 ? 25 : 12} fill="none" stroke={MINT} strokeWidth="3" />
  </>;
}

function Consent({ p }) {
  const toggle = win(p, 0.38, 0.5, 'hero');
  const trackers = ['Analytics', 'Ads', 'Chat'];
  const del = win(p, 0.78, 0.92);
  return <>
    <rect x="6" y="10" width="364" height="270" rx="14" fill={PANEL} stroke={LINE} />
    <Label x="28" y="44" size={15} fill={INK} weight={600}>Your privacy choices</Label>
    {['Essential', 'Analytics', 'Marketing'].map((name, i) => { const on = i === 0 ? 1 : i === 1 ? toggle : 0; return <g key={name}><Label x="28" y={84 + i * 40} size={14} fill={DIM}>{name}</Label>
      <rect x="150" y={70 + i * 40} width="40" height="22" rx="11" fill={on > 0.5 ? MINT : '#333'} /><circle cx={mix(161, 179, on)} cy={81 + i * 40} r="8" fill={on > 0.5 ? '#0b0b0b' : '#888'} /></g>; })}
    {trackers.map((name, i) => { const live = i === 0 ? toggle : 0; return <g key={name} transform={`translate(${220 + 0} ${70 + i * 40})`}>
      <rect width="130" height="28" rx="8" fill={live > 0.5 ? '#0f1a14' : CARD} stroke={live > 0.5 ? `${MINT}66` : LINE} />
      <Label x="34" y="19" size={13} fill={live > 0.5 ? MINT : '#777'}>{name}</Label>
      <g transform="translate(10 6)" stroke={live > 0.5 ? MINT : '#777'} fill="none" strokeWidth="1.6"><rect x="1" y="7" width="13" height="9" rx="2" /><path d={live > 0.5 ? 'M4 7V5a4 4 0 0 1 8 0' : 'M4 7V5a3.5 3.5 0 0 1 7 0v2'} /></g></g>; })}
    <g opacity={del} transform={`translate(0 ${mix(8, 0, del)})`}><rect x="28" y="206" width="322" height="50" rx="12" fill={CARD} stroke={LINE} /><Label x="46" y="236" size={14} fill={INK}>Old enquiries: scheduled for deletion</Label></g>
  </>;
}

function Target({ p }) {
  const names = ['Quotes', 'Invoices', 'Support', 'Reports', 'Onboarding', 'Scheduling'];
  const scores = [0.55, 0.92, 0.7, 0.5, 0.38, 0.6];
  const pick = win(p, 0.7, 0.86, 'hero');
  return <>
    {names.map((name, i) => { const x = 8 + (i % 3) * 122, y = 20 + Math.floor(i / 3) * 132; const k = win(p, 0.04 + i * 0.05, 0.2 + i * 0.05); const fill = win(p, 0.3 + i * 0.04, 0.6 + i * 0.04); const best = i === 1;
      return <g key={name} opacity={k * (best ? 1 : mix(1, 0.4, pick))} style={pop(k)}>
        <rect x={x} y={y} width="112" height="118" rx="12" fill={best ? mix(0, 1, pick) > 0.5 ? '#0f1a14' : CARD : CARD} stroke={best ? (pick > 0.5 ? MINT : LINE) : LINE} strokeWidth={best && pick > 0.5 ? 2 : 1} />
        <Label x={x + 12} y={y + 30} size={14} fill={INK} weight={600}>{name}</Label>
        <rect x={x + 12} y={y + 82} width="88" height="8" rx="4" fill="#262626" /><rect x={x + 12} y={y + 82} width={88 * scores[i] * fill} height="8" rx="4" fill={best ? MINT : '#6c7f74'} />
        {best && <g opacity={pick}><rect x={x + 12} y={y + 44} width="56" height="24" rx="12" fill={MINT} /><Label x={x + 40} y={y + 61} size={12} fill="#0b0b0b" weight={700} anchor="middle">Pilot</Label></g>}
      </g>; })}
  </>;
}

function Eval({ p }) {
  const rows = ['Refund policy', 'Delivery times', 'Out-of-scope question', 'Tone of voice'];
  const fixed = win(p, 0.66, 0.78);
  const arc = win(p, 0.3, 0.9, 'hero');
  return <>
    <rect x="6" y="10" width="364" height="270" rx="14" fill={PANEL} stroke={LINE} />
    {rows.map((name, i) => { const k = win(p, 0.06 + i * 0.1, 0.18 + i * 0.1); const failing = i === 2 && fixed < 0.5; return <g key={name} opacity={k}>
      <rect x="22" y={30 + i * 56} width="206" height="44" rx="10" fill={CARD} stroke={failing ? '#d9a3a3' : LINE} />
      <Label x="38" y={57 + i * 56} size={14} fill={INK}>{name}</Label>
      {failing ? <g transform={`translate(200 ${52 + i * 56})`} stroke="#e6b4b4" strokeWidth="2.2" strokeLinecap="round"><path d="M-5 -5l10 10M5 -5l-10 10" /></g> : <Tick x={205} y={52 + i * 56} k={1} r={9} />}
    </g>; })}
    <path d="M254 170a50 50 0 1 1 100 0" fill="none" stroke="#262626" strokeWidth="10" strokeLinecap="round" />
    <path d="M254 170a50 50 0 1 1 100 0" fill="none" stroke={MINT} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - arc * (fixed > 0.5 ? 1 : 0.75)} />
    <Label x="304" y="166" size={15} fill={INK} weight={600} anchor="middle">Checks</Label>
    <Label x="304" y="200" size={13} fill={DIM} anchor="middle">run on a schedule</Label>
  </>;
}

function Workshop({ p }) {
  const roles = [['Sales', ['Approved tools', 'Draft, then review']], ['Operations', ['Process prompts', 'Check the output']], ['Finance', ['No client data', 'Human sign-off']]];
  const book = win(p, 0.8, 0.94);
  return <>
    {roles.map(([name, rules], i) => { const k = win(p, 0.04 + i * 0.1, 0.24 + i * 0.1); return <g key={name} opacity={k} style={pop(k)}>
      <rect x={8 + i * 122} y="14" width="112" height="190" rx="12" fill={CARD} stroke={LINE} />
      <circle cx={30 + i * 122} cy="42" r="12" fill="#2a2a2a" /><Label x={48 + i * 122} y="47" size={14} fill={INK} weight={600}>{name}</Label>
      {rules.map((rule, j) => { const r = win(p, 0.34 + i * 0.1 + j * 0.08, 0.46 + i * 0.1 + j * 0.08); return <g key={rule} opacity={r}><rect x={18 + i * 122} y={72 + j * 58} width="92" height="46" rx="8" fill="#0f1a14" stroke={`${MINT}55`} />
        <foreignObject x={24 + i * 122} y={76 + j * 58} width="82" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: 12, lineHeight: '15px', color: MINT }}>{rule}</div></foreignObject></g>; })}
    </g>; })}
    <g opacity={book} transform={`translate(0 ${mix(8, 0, book)})`}><rect x="8" y="222" width="356" height="52" rx="12" fill={MINT} /><Label x="186" y="254" size={15} fill="#0b0b0b" weight={700} anchor="middle">Team AI playbook</Label></g>
  </>;
}

const demos = { browser: Browser, blocks: Blocks, plugin: Plugin, uptime: Uptime, audit: Audit, focus: Focus, consent: Consent, target: Target, eval: Eval, workshop: Workshop };
export const demoKinds = Object.keys(demos);

export default function Demo({ kind, p }) {
  const Visual = demos[kind];
  if (!Visual) throw new Error(`Unknown film demo "${kind}"`);
  return <svg viewBox="0 0 376 290" width="376" height="290" style={{ display: 'block', fontFamily: 'inherit', overflow: 'visible' }}><Visual p={p} /></svg>;
}
