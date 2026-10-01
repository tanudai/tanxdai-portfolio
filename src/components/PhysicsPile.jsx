// A field of blocks that drop and pile up under gravity (Matter.js, loaded only when the Personal tab opens).
// Tap or press a block and it hops; drag it and it follows the pointer on a spring, then keeps its momentum when released.
// Blocks are real DOM buttons moved by transform, so text stays crisp and keyboard users can hop them with Enter or Space.
// Reduced motion: the pile is settled ahead of time and stays still. The loop sleeps once everything comes to rest.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { grip as gripFeel } from '../motion.js';

const STEP = 1000 / 60;
const TAP_MOVE = 6, TAP_TIME = 350; // pointer travel (px) and duration (ms) that still count as a tap
const FILL = 0.66; // share of the field the blocks may cover, so the pile never reaches the top

// Small seeded generator: the same pile every time the tab opens, which keeps screenshots and tests stable.
const seeded = seed => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export default function PhysicsPile({ items, variant = 'chip', label }) {
  const field = useRef(null);
  const nodes = useRef([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = field.current;
    let dispose = () => {};
    let alive = true;
    let key = '';
    // Start (or restart) the simulation whenever the field gets a real size, e.g. when its tab is shown. Hidden tabs have no size and no engine.
    const observer = new ResizeObserver(() => {
      const { width, height } = root.getBoundingClientRect();
      const next = `${Math.round(width / 12)}x${Math.round(height / 12)}`;
      if (next === key) return;
      key = next;
      dispose();
      dispose = () => {};
      if (width < 40 || height < 40) return;
      import('matter-js').then(({ default: Matter }) => { if (alive && key === next) dispose = start(Matter, root, nodes.current, reduced, label, variant); }).catch(() => {});
    });
    observer.observe(root);
    return () => { alive = false; observer.disconnect(); dispose(); };
  }, [reduced, label, variant]);

  return <div ref={field} className="phys-field" role="group" aria-label={`${label}. ${reduced ? '' : 'Drag or tap the blocks to play.'}`}>
    {items.map((item, i) => <button key={item.key} ref={el => { nodes.current[i] = el; }} type="button" className={`phys-block phys-${variant}`} tabIndex={reduced ? -1 : 0} data-i={i}>{item.node}</button>)}
  </div>;
}

function start(Matter, root, els, reduced, label, variant = 'tile') {
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;
  const isGym = variant === 'gym';
  const { width: W, height: H } = root.getBoundingClientRect();
  const rand = seeded([...label].reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const engine = Engine.create({ enableSleeping: true, positionIterations: 8, velocityIterations: 6 });
  engine.gravity.y = isGym ? 1.38 : 1.05;

  // Keep as many blocks as fit comfortably (list order is priority order): within the area budget, and within the rows the height allows.
  let area = 0, rowWidth = 0, tallest = 0, shown = 0;
  const validEls = els.filter(Boolean);
  const sizes = validEls.map(el => { el.style.display = ''; return [el.offsetWidth, el.offsetHeight]; });
  sizes.forEach(([w, h], i) => {
    area += (w + 4) * (h + 4); rowWidth += w + 6; tallest = Math.max(tallest, h);
    const rows = Math.ceil(rowWidth / (W * 0.9));
    if ((area <= W * H * FILL && rows * tallest <= H) || i < 1) shown = i + 1;
  });
  validEls.forEach((el, i) => { el.style.display = i < shown ? '' : 'none'; });

  const wall = (x, y, w, h) => Bodies.rectangle(x, y, w, h, { isStatic: true, friction: 0.6 });
  Composite.add(engine.world, [wall(W / 2, H + 30, W * 4, 60), wall(-30, H / 2 - H * 2, 60, H * 6), wall(W + 30, H / 2 - H * 2, 60, H * 6)]);

  // They start stacked above the field and fall in one after another, so they land on each other.
  const bodies = [];
  const lanes = Math.max(1, Math.floor(W / (sizes.slice(0, shown).reduce((a, [w]) => a + w, 0) / Math.max(1, shown) + 8)));
  let y = -10;
  for (let i = 0; i < shown; i++) {
    const [w, h] = sizes[i] || [40, 20];
    y -= h * 1.15;
    const round = validEls[i]?.classList?.contains('phys-chip') ? h / 2 : 12;
    const x = Math.min(W - w / 2, Math.max(w / 2, W * (((i % lanes) + 0.5) / lanes) + (rand() - 0.5) * 24)); // spread across lanes, then pile on top
    const body = Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: Math.min(round, h / 2) },
      angle: (rand() - 0.5) * 1.1,
      restitution: isGym ? 0.1 : 0.32,
      friction: isGym ? 0.65 : 0.45,
      frictionAir: isGym ? 0.018 : 0.012,
      density: isGym ? 0.007 : 0.002,
      slop: 0.02
    });
    bodies.push(body);
  }
  Composite.add(engine.world, bodies);

  const paint = () => bodies.forEach((body, i) => {
    const el = validEls[i];
    if (!el || !sizes[i]) return;
    const [w, h] = sizes[i];
    el.style.transform = `translate3d(${body.position.x - w / 2}px,${body.position.y - h / 2}px,0) rotate(${body.angle}rad)`;
    el.style.opacity = 1;
  });
  const reset = () => validEls.forEach(el => { if (el) { el.style.transform = ''; el.style.opacity = ''; el.style.display = ''; el.classList?.remove('is-dragging'); } });

  if (reduced) { // settle off-screen, then show the finished pile
    for (let i = 0; i < 900; i++) Engine.update(engine, STEP);
    paint();
    return () => { reset(); Engine.clear(engine); };
  }

  // Loop: fixed 60Hz steps, runs only while something moves and the page is visible.
  let active = true;
  let raf = 0, last = 0, acc = 0, drag = null;
  const awake = () => active && (drag || bodies.some(b => !b.isSleeping));
  const frame = now => {
    if (!active) return;
    raf = 0;
    try {
      acc += Math.min(50, now - (last || now)); last = now;
      while (acc >= STEP) { Engine.update(engine, STEP); acc -= STEP; }
      paint();
      if (active && awake() && !document.hidden) raf = requestAnimationFrame(frame); else last = 0;
    } catch (_) {
      active = false;
    }
  };
  const run = () => { if (active && !raf && !document.hidden) raf = requestAnimationFrame(frame); };
  const wake = body => { if (active) { Sleeping.set(body, false); run(); } };
  paint();
  run();

  const hop = body => {
    if (!active) return;
    wake(body);
    const hopY = isGym ? -(4.8 + rand() * 1.6) : -(6.5 + rand() * 2);
    const hopX = isGym ? (rand() - 0.5) * 4 : (rand() - 0.5) * 6;
    Body.setVelocity(body, { x: hopX, y: hopY });
    Body.setAngularVelocity(body, (rand() - 0.5) * (isGym ? 0.2 : 0.35));
  };

  const local = e => { const r = root.getBoundingClientRect(); return { x: Math.min(W, Math.max(0, e.clientX - r.left)), y: Math.min(H, Math.max(0, e.clientY - r.top)) }; };
  const down = e => {
    if (!active) return;
    const el = e.target.closest('.phys-block');
    if (!el || drag || e.button > 0) return;
    const body = bodies[els.indexOf(el)];
    if (!body) return;
    const p = local(e), dx = p.x - body.position.x, dy = p.y - body.position.y, c = Math.cos(-body.angle), s = Math.sin(-body.angle);
    const grip = Constraint.create({ pointA: p, bodyB: body, pointB: { x: dx * c - dy * s, y: dx * s + dy * c }, ...gripFeel, length: 0 });
    Composite.add(engine.world, grip);
    drag = { id: e.pointerId, el, body, grip, x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    el.classList.add('is-dragging');
    try { el.setPointerCapture?.(e.pointerId); } catch (_) {}
    wake(body);
  };
  const move = e => {
    if (!active || !drag || e.pointerId !== drag.id) return;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
    drag.grip.pointA = local(e);
    wake(drag.body);
  };
  const up = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const { el, body, grip, moved, t } = drag;
    try { el.releasePointerCapture?.(e.pointerId); } catch (_) {}
    try { Composite.remove(engine.world, grip); } catch (_) {}
    el.classList?.remove('is-dragging');
    drag = null;
    if (active && e.type === 'pointerup' && moved < TAP_MOVE && performance.now() - t < TAP_TIME) hop(body);
    run();
  };
  const key = e => {
    if (!active || (e.key !== 'Enter' && e.key !== ' ')) return;
    const body = bodies[els.indexOf(e.target.closest('.phys-block'))];
    if (!body) return;
    e.preventDefault();
    hop(body);
  };
  const visibility = () => { if (active && !document.hidden) run(); };

  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', key);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (drag) {
      try { drag.el?.releasePointerCapture?.(drag.id); } catch (_) {}
      drag.el?.classList?.remove('is-dragging');
      drag = null;
    }
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', key);
    document.removeEventListener('visibilitychange', visibility);
    try { reset(); } catch (_) {}
    try { Composite.clear(engine.world, false); } catch (_) {}
    try { Engine.clear(engine); } catch (_) {}
  };
}
