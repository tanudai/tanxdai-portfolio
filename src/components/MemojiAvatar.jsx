// An original Memoji-style avatar drawn as SVG (not Apple artwork): blinks, sways, and waves hello. Tap to wave again.
// Motion uses SVG-native animation (SMIL), not CSS transforms: pixel-exact rotation points that behave the same in Safari on iPhone,
// where CSS transform-origin on SVG parts is unreliable. Nothing here moves the eyes or brows up and down: a blink is an open/closed cross-fade.
// Reduced motion never starts them: the loops are not rendered and the wave is never triggered, so the avatar stays still.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

const SKIN = '#c58d65', SKIN_SHADE = '#a46c4a', SKIN_LIGHT = '#dcab84', HAIR = '#15110f', LASH = '#1b0f0a';
const WAVE_MS = 3400, WAVE_EVERY = 11000;

// One eye, drawn around x = 98. Open and closed states cross-fade for the blink.
function Eye({ dx, blink }) {
  return <g transform={`translate(${dx} 0)`}>
    <g>
      {blink && <animate attributeName="opacity" values="1;1;0;1;1" keyTimes="0;.95;.965;.98;1" dur="5.6s" repeatCount="indefinite" />}
      <path d="M86 110c5-9 19-9 24 0-5 8-19 8-24 0z" fill="#f5f0ea" />
      <circle cx="98.4" cy="110.4" r="5.8" fill="url(#mj-iris)" />
      <circle cx="98.4" cy="110.4" r="2.9" fill="#0b0605" />
      <circle cx="100.4" cy="108" r="1.7" fill="#fff" /><circle cx="96.4" cy="112.6" r=".8" fill="#fff" opacity=".7" />
      <path d="M84.5 110.5c6-10 20-10 26 0" fill="none" stroke={LASH} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M88 114.5c6 3 14 3 20 0" fill="none" stroke={SKIN_SHADE} strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
    </g>
    <path d="M86 111c5 5 19 5 24 0" fill="none" stroke={LASH} strokeWidth="2.6" strokeLinecap="round" opacity="0">
      {blink && <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.95;.965;.98;1" dur="5.6s" repeatCount="indefinite" />}
    </path>
  </g>;
}

export default function MemojiAvatar() {
  const reduced = useReducedMotion();
  const wave = useRef([]);
  const timers = useRef([]);
  const play = (delay = 0) => { timers.current.push(setTimeout(() => wave.current.forEach(a => a?.beginElement?.()), delay)); };
  const reg = i => el => { wave.current[i] = el; };

  useEffect(() => { // greet once shortly after opening, then every few seconds while the page is visible
    if (reduced) return;
    play(1200);
    const every = setInterval(() => { if (!document.hidden) play(); }, WAVE_EVERY);
    return () => { clearInterval(every); timers.current.forEach(clearTimeout); timers.current = []; };
  }, [reduced]);

  const dur = `${WAVE_MS}ms`;
  return <button type="button" className="mj-button" aria-label="Tanxdai's avatar. Activate to wave hello." onClick={() => !reduced && play()}>
    <svg className="mj" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <radialGradient id="mj-bg" cx=".5" cy=".28" r=".9"><stop offset="0" stopColor="#35483f" /><stop offset="1" stopColor="#161d18" /></radialGradient>
        <linearGradient id="mj-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SKIN_LIGHT} /><stop offset=".5" stopColor={SKIN} /><stop offset="1" stopColor="#ae7552" /></linearGradient>
        <radialGradient id="mj-glow" cx=".42" cy=".3" r=".6"><stop offset="0" stopColor="#ffd9b8" stopOpacity=".45" /><stop offset="1" stopColor="#ffd9b8" stopOpacity="0" /></radialGradient>
        <linearGradient id="mj-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2220" /><stop offset=".45" stopColor="#15110f" /><stop offset="1" stopColor="#0a0807" /></linearGradient>
        <linearGradient id="mj-tee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262626" /><stop offset="1" stopColor="#111" /></linearGradient>
        <radialGradient id="mj-iris" cx=".4" cy=".35" r=".75"><stop offset="0" stopColor="#6b4129" /><stop offset="1" stopColor="#2a160c" /></radialGradient>
        <linearGradient id="mj-neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f5a3c" /><stop offset="1" stopColor="#a96f4c" /></linearGradient>
        <pattern id="mj-stubble" width="4.2" height="4.2" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".62" fill="#22140e" /><circle cx="3.1" cy="3.1" r=".62" fill="#22140e" /></pattern>
        <clipPath id="mj-clip"><circle cx="120" cy="120" r="112" /></clipPath>
      </defs>
      <circle cx="120" cy="120" r="112" fill="url(#mj-bg)" />
      <circle cx="120" cy="120" r="111" fill="none" stroke="#b7efcf" strokeOpacity=".24" />
      <g clipPath="url(#mj-clip)">
        {/* shoulders and black tee */}
        <g transform="translate(0 -16)">
          <path d="M6 252c4-40 38-56 92-58h44c54 2 88 18 92 58z" fill="url(#mj-tee)" />
          <path d="M40 240c14-18 36-28 58-30M200 240c-14-18-36-28-58-30" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" opacity=".7" />
          <path d="M92 195c8 22 48 22 56 0-5 12-15 18-28 18s-23-6-28-18z" fill="#080808" />
          <path d="M92 195c8 22 48 22 56 0" fill="none" stroke="#2f2f2f" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* hand: starts hidden below the edge, lifts, waves, lowers (one pass per call to play) */}
        <g transform="translate(0 96)">
          <animateTransform ref={reg(0)} attributeName="transform" type="translate" values="0 96;0 0;0 0;0 96" keyTimes="0;.15;.85;1" dur={dur} begin="indefinite" calcMode="spline" keySplines=".16 1 .3 1;0 0 1 1;.7 0 .84 0" />
          <g>
            <animateTransform ref={reg(1)} attributeName="transform" type="rotate" values="0 196 236;0 196 236;-17 196 236;15 196 236;-17 196 236;15 196 236;0 196 236;0 196 236" keyTimes="0;.15;.27;.4;.53;.66;.8;1" dur={dur} begin="indefinite" />
            <rect x="182" y="168" width="28" height="46" rx="13" fill={SKIN} />
            {[[184, 146, -10, 30], [192, 140, -3, 34], [200, 141, 4, 32], [208, 147, 11, 26]].map(([x, y, r, h]) => <rect key={x} x={x - 4.5} y={y} width="9" height={h} rx="4.5" fill={SKIN} transform={`rotate(${r} ${x} ${y + h})`} />)}
            <rect x="170" y="186" width="9" height="26" rx="4.5" fill={SKIN_LIGHT} transform="rotate(-38 180 208)" />
            <rect x="178" y="208" width="36" height="36" rx="12" fill="#262626" />
          </g>
        </g>

        {/* head sways a degree or two from the neck */}
        <g>
          {!reduced && <animateTransform attributeName="transform" type="rotate" values="0 120 196;1.3 120 196;0 120 196;-1.1 120 196;0 120 196" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" keyTimes="0;.25;.5;.75;1" />}
          <path d="M98 168h44v22c-11 11-33 11-44 0z" fill="url(#mj-neck)" />
          <ellipse cx="60" cy="116" rx="9" ry="15" fill={SKIN} /><ellipse cx="180" cy="116" rx="9" ry="15" fill={SKIN} />
          <path d="M58 110c-3 4-3 12 1 17M182 110c3 4 3 12-1 17" fill="none" stroke={SKIN_SHADE} strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
          <path d="M62 108C60 62 86 36 120 36s60 26 58 72c-1 26-8 50-26 64-8 7-20 12-32 12s-24-5-32-12C70 158 63 134 62 108z" fill="url(#mj-face)" />
          <path d="M62 108C60 62 86 36 120 36s60 26 58 72c-1 26-8 50-26 64-8 7-20 12-32 12s-24-5-32-12C70 158 63 134 62 108z" fill="url(#mj-glow)" />
          {/* stubble over jaw, chin and upper lip */}
          <path d="M63 118c3 38 22 66 57 66s54-28 57-66c-11 22-25 29-57 29s-46-7-57-29z" fill="url(#mj-stubble)" opacity=".5" />
          <path d="M99 143c6-3 12-4 21-4s15 1 21 4c-6 4-12 5-21 5s-15-1-21-5z" fill="#22140e" opacity=".15" />
          <ellipse cx="120" cy="180" rx="22" ry="5" fill="#22140e" opacity=".14" />
          {/* cheeks */}
          <ellipse cx="80" cy="134" rx="14" ry="9" fill="#e07f60" opacity=".24" /><ellipse cx="160" cy="134" rx="14" ry="9" fill="#e07f60" opacity=".24" />
          {/* hair: short, black, volume on top, fringe swept to the side */}
          <path d="M56 114C42 62 68 20 122 20c52 0 76 38 62 94-3-18-8-30-16-40-24 12-62 12-90-6-12 10-20 26-22 46z" fill="url(#mj-hair)" />
          <path d="M88 46c10-6 22-8 34-6M128 38c14 0 28 6 38 16M72 64c8-10 18-17 30-21M150 50c10 4 18 12 22 22" fill="none" stroke="#4a403d" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
          <path d="M82 74c16 8 44 8 70-4M104 60c14-4 28-4 40 2" fill="none" stroke="#3a3230" strokeWidth="2.2" strokeLinecap="round" opacity=".45" />
          <path d="M56 108c-2 10 0 20 5 28l3-26zM184 108c2 10 0 20-5 28l-3-26z" fill={HAIR} />
          {/* brows: tapered, steady */}
          <path d="M82 98c7-10 20-13 31-8l-1 4c-10-3-18-1-25 7z" fill={HAIR} />
          <path d="M158 98c-7-10-20-13-31-8l1 4c10-3 18-1 25 7z" fill={HAIR} />
          <Eye dx={0} blink={!reduced} /><Eye dx={44} blink={!reduced} />
          {/* nose */}
          <path d="M120 106v18" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".08" />
          <path d="M125 120c5 6 3 12-5 14" fill="none" stroke={SKIN_SHADE} strokeWidth="2.6" strokeLinecap="round" opacity=".8" />
          <path d="M111 135c5 4 13 4 18 0" fill="none" stroke="#8d5a3e" strokeWidth="2.2" strokeLinecap="round" opacity=".75" />
          {/* mouth: calm smile that opens into a grin during the wave */}
          <g>
            <path d="M99 150c10 14 32 14 42 0" fill="none" stroke="#5c2b20" strokeWidth="4.2" strokeLinecap="round">
              {!reduced && <animate ref={reg(2)} attributeName="opacity" values="1;0;0;1" keyTimes="0;.12;.88;1" dur={dur} begin="indefinite" />}
            </path>
            <path d="M96 148c11 22 37 22 48 0-12 5-36 5-48 0z" fill="#fbf6f0" stroke="#5c2b20" strokeWidth="3.4" strokeLinejoin="round" opacity="0">
              {!reduced && <animate ref={reg(3)} attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur={dur} begin="indefinite" />}
            </path>
          </g>
          <path d="M96 147c-2 1-3 3-3 5M144 147c2 1 3 3 3 5" fill="none" stroke="#7d4a36" strokeWidth="2" strokeLinecap="round" opacity=".55" />
        </g>
      </g>
    </svg>
  </button>;
}
