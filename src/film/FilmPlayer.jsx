// Browser player for service films. Lazy-load it: const FilmPlayer = lazy(() => import('./film/FilmPlayer.jsx')).
// One requestAnimationFrame loop, only while mounted and playing; pauses when the tab is hidden.
import { useEffect, useMemo, useRef, useState } from 'react';
import Film, { CANVAS, settledAt, timeline } from './Film.jsx';
import FilmIcon from './icons.jsx';
import { films } from '../service-films.js';
import './film.css';
import './player.css';

const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function Transcript({ film }) {
  const gets = film.walkthrough ? film.walkthrough.steps.map(step => step.type === 'card' ? `${step.title}: ${step.rows.map(r => r.join(' ')).join(', ')}` : `${step.who ? `${step.who}: ` : ''}${step.text}`) : film.gets;
  return <div className="film-transcript">
    <p>{film.hook}</p><p>Sound familiar? {film.need.join('. ')}.</p>
    <p>What you get{film.walkthrough ? ` (${film.walkthrough.label}, illustrative)` : ''}: {gets.join('. ')}.{film.note ? ` ${film.note}` : ''}</p>
    <p>Best for: {film.industries.map(([, name, why]) => `${name}, ${why}`).join('. ')}.</p><p>{film.cta}.</p>
  </div>;
}

export default function FilmPlayer({ id, startDelay = 0, at }) {
  const film = films[id];
  const plan = useMemo(() => timeline(film), [film]);
  const reduced = useMemo(prefersReducedMotion, []);
  const [t, setT] = useState(() => (at != null ? at : reduced ? settledAt(plan.scenes[0]) : 0));
  const [playing, setPlaying] = useState(false);
  const [scale, setScale] = useState(0);
  const box = useRef(null);
  const time = useRef(t);
  time.current = t;

  // Fit the fixed canvas to the available width.
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / CANVAS.width));
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay after the host's open animation settles (never under reduced motion or a frozen preview).
  useEffect(() => {
    if (reduced || at != null) return;
    const timer = setTimeout(() => setPlaying(true), startDelay);
    return () => clearTimeout(timer);
  }, [reduced, at, startDelay]);

  // The single frame loop.
  useEffect(() => {
    if (!playing) return;
    let frame, last = performance.now();
    const tick = now => {
      const next = Math.min(plan.total, time.current + (now - last));
      last = now;
      setT(next);
      if (next >= plan.total) { setPlaying(false); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, plan.total]);

  // Pause when the page is hidden.
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const ended = t >= plan.total;
  const jump = scene => { setT(reduced ? settledAt(scene) : scene.start); if (!reduced) setPlaying(true); };
  const toggle = () => { if (ended) { setT(0); setPlaying(true); } else setPlaying(value => !value); };
  const current = plan.scenes.reduce((idx, scene, i) => (t >= scene.start ? i : idx), 0);

  return <figure className="film-player" aria-label={`${film.name}: explainer`}>
    <div className="film-screen" ref={box}>
      <div className="film-scaler" style={{ transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }} aria-hidden="true"><Film film={film} t={t} plan={plan} /></div>
    </div>
    <div className="film-controls">
      {!reduced && <button type="button" className="film-play" onClick={toggle} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}>
        <FilmIcon name={ended ? 'replay' : playing ? 'pause' : 'play'} size={16} stroke={2.2} /></button>}
      <div className="film-segments" role="group" aria-label="Scenes">
        {plan.scenes.map((scene, i) => {
          const fill = reduced ? (i <= current ? 1 : 0) : Math.min(1, Math.max(0, (t - scene.start) / scene.dur));
          return <button type="button" key={scene.key} style={{ flexGrow: reduced ? 1 : scene.dur }} onClick={() => jump(scene)} aria-label={`${scene.label}`} aria-current={i === current ? 'step' : undefined}>
            <span style={{ transform: `scaleX(${fill})` }} /></button>;
        })}
      </div>
      <span className="film-scene-name" aria-live="off">{plan.scenes[current].label}</span>
    </div>
    <figcaption className="film-sr"><Transcript film={film} /></figcaption>
  </figure>;
}
