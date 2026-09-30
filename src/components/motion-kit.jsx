// Premium motion primitives (patterns from Motion Primitives / Animate UI), built on the presets in motion.js.
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { duration, ease, loop, spring } from '@/motion';

// Signature: a short light that travels round the element's border. Mount only on the active element.
export function BorderTrail({ radius = 12, size = 170, className }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <div aria-hidden="true" data-decorative className={cn('pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-2 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]', className)}>
    <motion.div className="absolute aspect-square bg-[linear-gradient(90deg,transparent,#b7efcf_55%,#fff_92%,transparent)]"
      style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${radius}px)` }}
      initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }} transition={loop.trail} />
  </div>;
}

// Signature: words arrive one by one (blur to sharp). Replays whenever `play` flips on.
export function TextReveal({ text, as = 'p', play = true, delay = 0, className }) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  const animateIn = play && !reduced;
  return <Tag key={animateIn ? 'play' : 'still'} className={className} initial={animateIn ? 'hidden' : false} animate="shown"
    transition={{ staggerChildren: 0.03, delayChildren: delay }}>
    <span className="sr-only">{text}</span>
    {words.map((word, i) => <span key={i} aria-hidden="true">{i > 0 && ' '}<motion.span className="inline-block"
      variants={{ hidden: { opacity: 0, y: 6, filter: 'blur(6px)' }, shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: duration.base, ease: ease.enter } } }}>{word}</motion.span></span>)}
  </Tag>;
}

// Digits roll in the direction the value moved.
export function SlidingNumber({ value, pad = 2, className }) {
  const reduced = useReducedMotion();
  const digits = String(value).padStart(pad, '0').split('');
  return <span className={cn('inline-flex tabular-nums', className)}>
    {digits.map((digit, i) => <span key={i} className="relative inline-block overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={digit} className="inline-block" initial={reduced ? false : { y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: '-100%', opacity: 0 }} transition={spring.ui}>{digit}</motion.span>
      </AnimatePresence>
    </span>)}
  </span>;
}

// Pointer-following pull for primary actions. Returns props for a motion element.
export function useMagnetic(strength = 0.22, max = 8) {
  const x = useSpring(useMotionValue(0), spring.ui);
  const y = useSpring(useMotionValue(0), spring.ui);
  const reduced = useReducedMotion();
  if (reduced) return {};
  const clamp = value => Math.max(-max, Math.min(max, value));
  return {
    style: { x, y },
    onPointerMove: event => {
      if (event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      x.set(clamp((event.clientX - box.left - box.width / 2) * strength));
      y.set(clamp((event.clientY - box.top - box.height / 2) * strength));
    },
    onPointerLeave: () => { x.set(0); y.set(0); },
  };
}

// Signature: cursor spotlight. One listener feeds --spot-x/--spot-y to whichever .spotlight card is under the pointer.
export function trackSpotlight() {
  const move = event => {
    const card = event.target.closest?.('.spotlight');
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
  };
  window.addEventListener('pointermove', move, { passive: true });
  return () => window.removeEventListener('pointermove', move);
}
