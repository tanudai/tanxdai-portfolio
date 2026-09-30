// An original Memoji-style avatar drawn as SVG (not Apple artwork): blinks, bobs, and waves hello. Tap to wave again.
// All motion is CSS (see avatar.css) so it costs no JavaScript per frame, and it stops entirely under reduced motion.
import { useState } from 'react';

const SKIN = '#c38b63', SKIN_SHADE = '#a56f4d', SKIN_LIGHT = '#d6a27b', HAIR = '#141010', TEE = '#1d1d1d';

function Eye({ x }) {
  return <g className="mj-eye" style={{ transformOrigin: `${x}px 110px` }}>
    <ellipse cx={x} cy="110" rx="10" ry="8" fill="#f4efe9" />
    <circle cx={x} cy="110" r="6" fill="#2a1a12" />
    <circle cx={x} cy="110" r="3" fill="#0b0706" />
    <circle cx={x + 2.2} cy="107.6" r="1.7" fill="#fff" />
  </g>;
}

export default function MemojiAvatar() {
  const [wave, setWave] = useState(0); // bumping the key remounts the hand, which restarts its animation
  return <button type="button" className="mj-button" aria-label="Tanxdai's avatar. Activate to wave hello." onClick={() => setWave(n => n + 1)}>
    <svg className="mj" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <radialGradient id="mj-bg" cx=".5" cy=".3" r=".85"><stop offset="0" stopColor="#33443c" /><stop offset="1" stopColor="#182019" /></radialGradient>
        <linearGradient id="mj-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SKIN_LIGHT} /><stop offset=".55" stopColor={SKIN} /><stop offset="1" stopColor={SKIN_SHADE} /></linearGradient>
        <pattern id="mj-stubble" width="4.4" height="4.4" patternUnits="userSpaceOnUse"><circle cx="1.1" cy="1.1" r=".7" fill="#22140e" /><circle cx="3.3" cy="3.3" r=".7" fill="#22140e" /></pattern>
        <clipPath id="mj-clip"><circle cx="120" cy="120" r="112" /></clipPath>
      </defs>
      <circle cx="120" cy="120" r="112" fill="url(#mj-bg)" />
      <circle cx="120" cy="120" r="111" fill="none" stroke="#b7efcf" strokeOpacity=".22" />
      <g clipPath="url(#mj-clip)">
        {/* shoulders and black tee */}
        <path d="M14 250c2-42 38-60 106-60s104 18 106 60z" fill={TEE} />
        <path d="M14 250c2-42 38-60 106-60s104 18 106 60" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
        <path d="M86 196c10 16 58 16 68 0" fill="none" stroke="#0c0c0c" strokeWidth="5" strokeLinecap="round" />
        {/* waving hand, lifted from the bottom edge */}
        <g key={wave} className="mj-hand" style={{ transformOrigin: '196px 236px' }}>
          <g className="mj-hand-wave" style={{ transformOrigin: '196px 236px' }}>
            <rect x="182" y="168" width="28" height="44" rx="13" fill={SKIN} />
            {[[184, 146, -10, 30], [192, 140, -3, 34], [200, 141, 4, 32], [208, 147, 11, 26]].map(([x, y, r, h]) => <rect key={x} x={x - 4.5} y={y} width="9" height={h} rx="4.5" fill={SKIN} transform={`rotate(${r} ${x} ${y + h})`} />)}
            <rect x="170" y="186" width="9" height="26" rx="4.5" fill={SKIN_LIGHT} transform="rotate(-38 180 208)" />
            <rect x="178" y="206" width="36" height="34" rx="12" fill={SKIN_SHADE} />
          </g>
        </g>
        {/* head group bobs and tilts from the neck */}
        <g className="mj-head" style={{ transformOrigin: '120px 190px' }}>
          <path d="M96 168h48v30c-12 12-36 12-48 0z" fill={SKIN_SHADE} />
          <ellipse cx="59" cy="116" rx="9" ry="15" fill={SKIN} /><ellipse cx="181" cy="116" rx="9" ry="15" fill={SKIN} />
          <ellipse cx="59" cy="117" rx="4" ry="8" fill={SKIN_SHADE} opacity=".7" /><ellipse cx="181" cy="117" rx="4" ry="8" fill={SKIN_SHADE} opacity=".7" />
          <path d="M58 104c0-50 28-70 62-70s62 20 62 70c0 46-24 80-62 80s-62-34-62-80z" fill="url(#mj-face)" />
          {/* stubble over the jaw, chin and upper lip */}
          <path d="M62 118c4 42 26 66 58 66s54-24 58-66c-12 22-26 28-58 28s-46-6-58-28z" fill="url(#mj-stubble)" opacity=".55" />
          <path d="M96 142c6-3 12-4 24-4s18 1 24 4c-6 4-12 5-24 5s-18-1-24-5z" fill="#22140e" opacity=".22" />
          {/* cheeks */}
          <ellipse cx="82" cy="134" rx="14" ry="9" fill="#d97a5e" opacity=".22" /><ellipse cx="158" cy="134" rx="14" ry="9" fill="#d97a5e" opacity=".22" />
          {/* hair: short, black, swept up and to the side */}
          <path d="M55 104c-8-44 16-82 66-82 44 0 74 28 66 82-4-16-10-26-18-32-22 8-58 8-84-6-14 8-24 20-30 38z" fill={HAIR} />
          <path d="M60 100c-2-18 4-30 12-40M96 40c10-6 26-8 40-4M130 32c16 2 30 10 38 22M112 50c14-4 30-2 42 6" fill="none" stroke="#3a3432" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <path d="M55 104c-2 10 0 18 4 24l4-18zM185 104c2 10 0 18-4 24l-4-18z" fill={HAIR} />
          {/* brows, eyes */}
          <g className="mj-brows"><path d="M84 92q13-9 26-2" fill="none" stroke={HAIR} strokeWidth="7.5" strokeLinecap="round" /><path d="M130 90q13-7 26 2" fill="none" stroke={HAIR} strokeWidth="7.5" strokeLinecap="round" /></g>
          <Eye x={98} /><Eye x={142} />
          {/* nose, smile */}
          <path d="M117 118q8 12-2 17" fill="none" stroke={SKIN_SHADE} strokeWidth="3" strokeLinecap="round" opacity=".85" />
          <path d="M112 138q8 4 16 0" fill="none" stroke="#7d4a36" strokeWidth="2" strokeLinecap="round" opacity=".6" />
          <path className="mj-smile" d="M97 150q23 20 46 0" fill="none" stroke="#5a2a20" strokeWidth="4.5" strokeLinecap="round" />
          <path className="mj-grin" d="M95 149q25 28 50 0q-25 8-50 0z" fill="#f7f2ec" stroke="#5a2a20" strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  </button>;
}
