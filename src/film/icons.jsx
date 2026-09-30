// Stroke icons for films (same drawing style as src/Icons.jsx). Pure SVG, no state.
const paths = {
  factory: <><path d="M3 21V10l5 3V10l5 3V10l5 3V5h3v16Z" /><path d="M7 17h2M12 17h2M17 17h1" /></>,
  hotel: <><path d="M4 21V4h11v17M15 9h5v12M2 21h20" /><path d="M8 8h3M8 12h3M8 16h3" /></>,
  home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v11h14V10M10 21v-6h4v6" /></>,
  box: <><path d="m3 7 9-4 9 4v10l-9 4-9-4Z" /><path d="m3 7 9 4 9-4M12 11v10" /></>,
  building: <><path d="M4 21V3h10v18M14 8h6v13M2 21h20" /><path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1M17 12h1M17 16h1" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" /></>,
  clinic: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  school: <><path d="m2 9 10-5 10 5-10 5Z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  truck: <><path d="M2 6h11v10H2ZM13 10h5l3 3v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  cart: <><path d="M3 4h2l2.5 11h11L21 7H6" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>,
  window: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
  plane: <path d="M10 13 3 11l1-2 7 1 5-6a1.5 1.5 0 0 1 2 2l-6 5 1 7-2 1-2-7-3 3v2l-1.5 1L5 16l-2.5-1.5L3.5 13h2Z" />,
  pen: <><path d="M4 20l4-1 11-11-3-3L5 16Z" /><path d="m14 7 3 3" /></>,
  heart: <path d="M12 20s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 10-8 10Z" />,
  rocket: <><path d="M12 15c4-2 7-6 7-11-5 0-9 3-11 7Z" /><path d="M8 11 4 12l3 3M12 15l1 4 3-3M14.5 9.5h.01" /></>,
  shop: <><path d="M4 9 5 4h14l1 5M4 9v11h16V9M4 9h16" /><path d="M9 20v-5h6v5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></>,
  columns: <><path d="M3 9 12 4l9 5M4 21h16M6 10v8M10 10v8M14 10v8M18 10v8" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
  sofa: <><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3ZM6 17v2M18 17v2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  cross: <path d="M7 7l10 10M17 7 7 17" />,
  sparkle: <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  play: <path d="M8 5v14l11-7Z" fill="currentColor" />,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  replay: <><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export default function FilmIcon({ name, size = 24, stroke = 1.75, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}

export const iconNames = Object.keys(paths);
