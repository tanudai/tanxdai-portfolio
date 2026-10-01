import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { duration, ease, spring as springs } from './motion.js';
import { projects } from './projects.js';
import LivePreview, { initials } from './LivePreview.jsx';
import Services, { services } from './Services.jsx';
import { StatusCapsule, ContactDock, ContactActions } from './AppDetails.jsx';
import Icon from './Icons.jsx';
import PhysicsPile from './components/PhysicsPile.jsx';
import MemojiAvatar from './components/MemojiAvatar.jsx';
import { BorderTrail, TextReveal, trackSpotlight, useMagnetic, useTilt } from './components/motion-kit.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { Plate20KG, HexDumbbell, Kettlebell24KG, OlympicClamp, ShakerBottle, SteelFlask, HeavyGripper, ChalkBlock, ResistanceBand, JumpRope, FoamRoller, GymTowel } from './components/GymIcons.jsx';
import TerminalWidget from './components/TerminalWidget.jsx';
import SpotifyWidget from './components/SpotifyWidget.jsx';
import { triggerHaptic } from './lib/haptics.js';

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });

function ProjectPoster({ project, index, active, imgY }) {
  const info = useRef(null);
  const magnetic = useMagnetic();
  const openInfo = event => {
    const dialog = info.current;
    dialog.showModal();
    const from = event.currentTarget.getBoundingClientRect(), box = dialog.getBoundingClientRect();
    dialog.style.transformOrigin = `${from.left + from.width / 2 - box.left}px ${from.top + from.height / 2 - box.top}px`;
  };
  const facts = [
    ['Business impact', project.metric],
    ['My contribution', project.roleNote || 'Custom website development.'],
    ['Build approach', project.buildType],
    ['Build time', project.duration],
    ['Engagement', project.engagement],
  ].filter(([, detail]) => detail);
  return <div className={`project-poster live-poster spotlight theme-${index % 4} ${active ? 'is-active' : ''}`}>
    <div className="poster-top">
      <span>{project.type}</span>
      <div className="poster-top-badges">
        {project.metric && <span className="poster-metric-badge">{project.metric}</span>}
        <span className="live-badge"><i aria-hidden="true" />Live website</span>
      </div>
    </div>
    {active && <BorderTrail radius={13} size={220} />}
    <LivePreview project={project} imgY={imgY} />
    <div className="reel-caption"><span className="goal-label">THE DEVELOPMENT GOAL</span><TextReveal text={project.goal} play={active} delay={0.12} />
      <div className="poster-delivered"><b>Delivered</b> {project.buildType}{project.metric && <><span aria-hidden="true"> · </span><b>Impact</b> {project.metric}</>}{project.result && <><span aria-hidden="true"> · </span><b>Result</b> {project.result}</>}</div>
      {project.stack && <ul className="stack-chips" aria-label="Technology">{project.stack.split(' · ').map((tech, i) => <li key={tech} style={{ '--i': i }}>{tech}</li>)}</ul>}
      <div className="project-actions" onPointerDown={event => event.stopPropagation()}>
        <button className="project-info-button" aria-label={`About ${project.name}`} onClick={e => { triggerHaptic('light'); openInfo(e); }}><Icon name="info" /> <span>Project info</span></button>
        <motion.a className="visit-website" href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={() => triggerHaptic('medium')} {...magnetic}>Visit website <Icon name="arrowUpRight" /></motion.a>
      </div>
    </div>
    <dialog className="project-dialog" ref={info} onPointerDown={event => event.stopPropagation()} onClick={event => { if (event.target === info.current) info.current.close(); }}>
      <div className="project-dialog-head"><div><span className="goal-label">PROJECT NOTES</span><h2>{project.name}</h2><p>{project.type}</p></div>
        <button className="close-info" aria-label="Close project information" onClick={() => info.current.close()}><Icon name="close" /></button></div>
      <dl>{facts.map(([term, detail], i) => <div key={term} style={{ '--i': i }}><dt>{term}</dt><dd>{detail}</dd></div>)}
        {project.stack && <div style={{ '--i': facts.length }}><dt>Technology</dt><dd><ul className="stack-chips">{project.stack.split(' · ').map(tech => <li key={tech}>{tech}</li>)}</ul></dd></div>}</dl>
      <a className="visit-website" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live website <Icon name="arrowUpRight" /></a>
    </dialog>
  </div>;
}

// Endless deck helpers: the project shown at an unbounded position, and the slot a card takes so it sits nearest that position.
const wrap = position => ((position % projects.length) + projects.length) % projects.length;
const slotFor = (i, position) => { const n = projects.length, half = Math.floor(n / 2); return position + ((i - wrap(position) + n + half) % n) - half; };

function ProjectCard({ project, i, index, position, y, step, height }) {
  const slot = slotFor(i, position);
  const yActive = -(slot * step);
  const yNextActive = -((slot + 1) * step);
  
  const scale = useTransform(y, [yActive + step, yActive, yNextActive], [1, 1, 0.92]);
  const filter = useTransform(y, [yActive + step, yActive, yNextActive], ['brightness(1)', 'brightness(1)', 'brightness(0.5)']);
  const imgY = useTransform(y, [yActive + step, yActive, yNextActive], [80, 0, -80]);

  return <motion.article className={`react-card theme-${i % 4}`}
    style={{ top: slot * step, height, scale, filter }} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}: ${project.name}`}
    aria-hidden={i !== index} inert={i !== index}>
    <ProjectPoster project={project} index={i} active={i === index} imgY={imgY} />
  </motion.article>;
}

function ProjectDeck({ enabled }) {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [height, setHeight] = useState(550);
  const viewport = useRef(null);
  const selected = useRef(0);
  const running = useRef(null);
  const wheel = useRef({ amount: 0, last: 0, lockedUntil: 0 });
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const step = height + 24;

  // The deck loops endlessly: `selected` is an unbounded position, the visible project is that position modulo the count,
  // and each card sits in the slot nearest the position (see slotFor), so only an off-screen card ever moves to the other end.
  const goTo = useCallback((nextPosition) => {
    setDirection(nextPosition >= selected.current ? 1 : -1);
    selected.current = nextPosition;
    setPosition(nextPosition);
    setIndex(wrap(nextPosition));
    running.current?.stop();
    if (reducedMotion) y.set(-nextPosition * step);
    else running.current = animate(y, -nextPosition * step, springs.deck);
  }, [reducedMotion, step, y]);
  // Jump to a project by index along the shorter way round.
  const show = useCallback(i => { const n = projects.length, d = ((i - wrap(selected.current)) % n + n + Math.floor(n / 2)) % n - Math.floor(n / 2); goTo(selected.current + d); }, [goTo]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.height <= 0) return;
      const newHeight = entry.contentRect.height;
      setHeight(newHeight);
      running.current?.stop();
      y.set(-selected.current * (newHeight + 24));
    });
    observer.observe(viewport.current);
    return () => { observer.disconnect(); running.current?.stop(); };
  }, [y]);

  useEffect(() => {
    if (!enabled) return;
    function keydown(event) {
      if (document.querySelector('dialog[open], :popover-open') || event.target.closest?.('input, textarea, select, [contenteditable="true"]') || event.target.closest?.('[role=tablist]')) return;
      const directions = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
      if (event.key in directions) { event.preventDefault(); goTo(selected.current + directions[event.key]); }
      else if (event.code === 'Space' && !event.target.closest?.('button, a')) { event.preventDefault(); goTo(selected.current + (event.shiftKey ? -1 : 1)); }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); show(event.key === 'Home' ? 0 : projects.length - 1); }
    }
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [enabled, goTo, show]);

  useEffect(() => {
    const element = viewport.current;
    function onWheel(event) {
      if (!enabled || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || document.querySelector('dialog[open]')) return;
      event.preventDefault();
      const now = performance.now();
      const state = wheel.current;
      if (now - state.last > 140) state.amount = 0;
      state.last = now;
      if (now < state.lockedUntil) return;
      state.amount += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(state.amount) > 45) {
        goTo(selected.current + (state.amount > 0 ? 1 : -1));
        state.amount = 0;
        state.lockedUntil = now + 600;
      }
    }
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [enabled, goTo]);

  const finishDrag = (_, info) => {
    const distance = info.offset.y;
    const shouldAdvance = Math.abs(distance) > height * 0.16 || (Math.abs(distance) > 25 && Math.abs(info.velocity.y) > 400);
    goTo(selected.current + (shouldAdvance ? (distance < 0 ? 1 : -1) : 0));
  };

  return <>
    <div className="deck-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <span className="deck-eyebrow">PROJECT PORTFOLIO</span>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.h1 id="deck-title" key={index} custom={direction}
            variants={{ from: dir => ({ opacity: 0, y: dir * 14 }), shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.enter } }, gone: dir => ({ opacity: 0, y: dir * -10, transition: { duration: duration.quick, ease: ease.exit } }) }}
            initial={reducedMotion ? false : 'from'} animate="shown" exit={reducedMotion ? undefined : 'gone'}>
            {projects[index].name}
          </motion.h1>
        </AnimatePresence>
      </div>
      <div className="deck-controls" style={{ display: 'flex', gap: '8px', padding: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} id="previous-project" onClick={() => { triggerHaptic('light'); goTo(selected.current - 1); }} aria-label="Previous project" style={{ width: 44, height: 44, background: '#151d29' }}><Icon name="arrowUp" /></motion.button>
        <motion.button whileTap={{ scale: 0.9 }} id="next-project" onClick={() => { triggerHaptic('light'); goTo(selected.current + 1); }} aria-label="Next project" style={{ width: 44, height: 44, background: '#151d29' }}><Icon name="arrowDown" /></motion.button>
      </div>
    </div>
    <div id="projects" ref={viewport} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Projects. Swipe up or down, or use arrow keys.">
      <motion.div className="deck-track" style={{ y }} drag={enabled ? 'y' : false} dragMomentum={false}
        dragConstraints={{ top: -(position + 1) * step, bottom: -(position - 1) * step }} dragElastic={0.08}
        onDragStart={() => running.current?.stop()} onDragEnd={finishDrag}
        onPointerCancel={() => goTo(selected.current)}>
        {projects.map((project, i) => <ProjectCard key={project.name} project={project} i={i} index={index} position={position} y={y} step={step} height={height} />)}
      </motion.div>
    </div>
  </>;
}

function Personal({ onWork, onServices, onContact }) {
  const avatarTilt = useTilt(16);
  const toolsRef = useRef(null);
  const gymRef = useRef(null);
  const [activePhysics, setActivePhysics] = useState('gym');
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 600px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)');
    const sync = () => setIsPhone(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const playgroundItems = [
    { key: 'react', node: <><b>Re</b><small>React</small></> },
    { key: 'python', node: <><b>Py</b><small>Python</small></> },
    { key: 'ai', node: <><b>AI</b><small>AI Tools</small></> },
    { key: 'ts', node: <><b>TS</b><small>TypeScript</small></> },
    { key: 'next', node: <><b>Next</b><small>Next.js</small></> },
    { key: 'wp', node: <><b>WP</b><small>WordPress</small></> },
    { key: 'motion', node: <><b>M</b><small>Motion</small></> },
    { key: 'auto', node: <><b>Auto</b><small>Workflows</small></> },
    ...(isPhone ? [
      { key: 'node', node: <><b>JS</b><small>Node.js</small></> },
      { key: 'docker', node: <><b>DK</b><small>Docker</small></> },
      { key: 'postgres', node: <><b>SQL</b><small>Postgres</small></> },
      { key: 'redis', node: <><b>R</b><small>Redis</small></> },
    ] : []),
  ];

  const gymItems = [
    { key: 'plate', shape: 'circle', node: <Plate20KG /> },
    { key: 'db', shape: 'dumbbell', node: <HexDumbbell /> },
    { key: 'kb', shape: 'kettlebell', node: <Kettlebell24KG /> },
    { key: 'clamp', shape: 'circle', node: <OlympicClamp /> },
    { key: 'shaker', shape: 'rect', node: <ShakerBottle /> },
    { key: 'flask', shape: 'rect', node: <SteelFlask /> },
    { key: 'gripper', shape: 'rect', node: <HeavyGripper /> },
    { key: 'chalk', shape: 'rect', node: <ChalkBlock /> },
    ...(isPhone ? [
      { key: 'band', label: 'Resistance band', shape: 'circle', node: <ResistanceBand /> },
      { key: 'rope', label: 'Jump rope', shape: 'rect', node: <JumpRope /> },
      { key: 'roller', label: 'Foam roller', shape: 'rect', node: <FoamRoller /> },
      { key: 'towel', label: 'Gym towel', shape: 'rect', node: <GymTowel /> },
    ] : []),
  ];

  return (
    <div className="personal-studio">
      {!isPhone && (
        <div className="personal-bento">
          <article className="bento-intro">
            <span className="bento-label">DESIGN & DEVELOPMENT</span>
            <h1>Hey, I’m Tanxdai<span>.</span></h1>
            <p>Bespoke web developer & AI engineer building clean, high-performance interfaces.</p>
            <div className="intro-status-chips">
              <span className="intro-chip available"><span className="pulse-dot" /> Available</span>
              <span className="intro-chip">5+ Yrs</span>
              <span className="intro-chip">100% Remote</span>
            </div>
          </article>

          <motion.div className="bento-avatar" {...avatarTilt}>
            <MemojiAvatar />
          </motion.div>

          <button className="bento-work" onClick={onWork}>
            <span className="bento-card-top">Selected work <span><Icon name="arrowUpRight" /></span></span>
            <div className="bento-previews">
              {[projects[0], projects[1], projects[4]].map((project, index) => (
                <img key={project.name} src={project.image} alt={project.name} style={{ '--order': index }} />
              ))}
            </div>
            <span className="bento-footnote">Explore featured client builds</span>
          </button>

          <article className="bento-terminal">
            <TerminalWidget />
          </article>

          <article className="bento-tools" data-decorative="true">
            <div className="bento-card-top">
              <span className="bento-label">TECH TOOLKIT</span>
              <button
                type="button"
                className="phys-shake-btn"
                data-decorative="true"
                onClick={() => { triggerHaptic('shake'); toolsRef.current?.shake?.(); }}
                aria-label="Shake Tech Toolkit"
                title="Shake & toss blocks"
              >
                <span>↺ Shake</span>
              </button>
            </div>
            <PhysicsPile ref={toolsRef} label="Interactive toolkit" variant="tile" items={playgroundItems} />
          </article>

          <article className="bento-gym" data-decorative="true">
            <div className="bento-card-top">
              <div className="gym-head-title">
                <span className="bento-label">IRON & DISCIPLINE</span>
                <span className="gym-pr-tag" data-decorative="true">PRs: DL 240kg · SQ 175kg · BP 140kg</span>
              </div>
              <button
                type="button"
                className="phys-shake-btn gym-shake-btn"
                data-decorative="true"
                onClick={() => { triggerHaptic('shake'); gymRef.current?.shake?.(); }}
                aria-label="Shake Iron Gym"
                title="Shake iron weights"
              >
                <span>↺ Shake</span>
              </button>
            </div>
            <PhysicsPile ref={gymRef} label="Gym playground" variant="gym" items={gymItems} />
          </article>

          <article className="bento-stats" data-decorative="true">
            <div className="bento-card-top">
              <span className="bento-label">AT A GLANCE</span>
              <div className="availability-badge">
                <span className="pulse-dot" />
                <span>Available</span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <b>5+</b>
                <small>Years Building</small>
              </div>
              <div className="stat-item">
                <b>100%</b>
                <small>Remote Worldwide</small>
              </div>
            </div>
            <SpotifyWidget />
          </article>
        </div>
      )}

      {isPhone && (
        <div className="personal-phone-stack">
          {/* 1. Profile compaction on top */}
          <article className="phone-profile-compact">
            <div className="phone-profile-info">
              <h1>Hey, I’m Tanxdai<span>.</span></h1>
              <p>Bespoke web developer & AI engineer building clean, high-performance interfaces.</p>
              <div className="intro-status-chips">
                <span className="intro-chip available"><span className="pulse-dot" /> Available</span>
                <span className="intro-chip">5+ Yrs</span>
                <span className="intro-chip">Remote</span>
              </div>
            </div>
            <div className="phone-avatar-wrap">
              <MemojiAvatar />
            </div>
          </article>

          {/* 2. Small vinyl to play sound */}
          <div className="phone-vinyl-card">
            <SpotifyWidget compact />
          </div>

          {/* 3. CRT Terminal under profile compaction */}
          <article className="phone-terminal-card">
            <TerminalWidget compact />
          </article>

          {/* 4. Iron discipline & code switchable physics playground */}
          <article className="phone-physics-card">
            <div className="phone-physics-bar">
              <div className="physics-switch-pills" role="group" aria-label="Physics collection">
                <button
                  type="button"
                  className={`phys-pill-btn ${activePhysics === 'tools' ? 'active' : ''}`}
                  aria-pressed={activePhysics === 'tools'}
                  onClick={() => { triggerHaptic('selection'); setActivePhysics('tools'); }}
                >
                  <span>⚡ Code</span>
                </button>
                <button
                  type="button"
                  className={`phys-pill-btn ${activePhysics === 'gym' ? 'active' : ''}`}
                  aria-pressed={activePhysics === 'gym'}
                  onClick={() => { triggerHaptic('selection'); setActivePhysics('gym'); }}
                >
                  <span>🏋️ Iron</span>
                </button>
              </div>
              {activePhysics === 'gym' && (
                <span className="phone-gym-prs" data-decorative="true">DL 240 · SQ 175 · BP 140</span>
              )}
              <button
                type="button"
                className="phone-shake-btn"
                onClick={() => { triggerHaptic('shake'); (activePhysics === 'tools' ? toolsRef : gymRef).current?.shake?.(); }}
                aria-label="Shake physics playground"
                title="Shake items"
              >
                <span>↺ Shake</span>
              </button>
            </div>
            <div className="phone-physics-canvas">
              <PhysicsPile
                key={activePhysics}
                ref={activePhysics === 'tools' ? toolsRef : gymRef}
                label={activePhysics === 'tools' ? 'Interactive toolkit' : 'Gym playground'}
                variant={activePhysics === 'tools' ? 'tile' : 'gym'}
                items={activePhysics === 'tools' ? playgroundItems : gymItems}
              />
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('work');
  const [tabDirection, setTabDirection] = useState(1);
  const [callTopic, setCallTopic] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  
  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    triggerHaptic('selection');
    const tabs = ['work', 'services', 'personal'];
    setTabDirection(tabs.indexOf(newTab) > tabs.indexOf(tab) ? 1 : -1);
    setTab(newTab);
  };
  const [time, setTime] = useState(formatTime);
  const contact = useRef(null);
  const tabBar = useRef(null);
  const [surface, setSurface] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const active = tabBar.current?.querySelector?.(`[data-tab="${tab}"]`);
      if (!active) return;
      setSurface({ x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tab]);
  useEffect(() => { const timer = setInterval(() => setTime(formatTime()), 60000); return () => clearInterval(timer); }, []);
  useEffect(trackSpotlight, []);
  useEffect(() => {
    const lockPortrait = () => {
      try {
        if (typeof window !== 'undefined' && window.screen?.orientation?.lock) {
          window.screen.orientation.lock('portrait').catch(() => {});
        }
      } catch (_) {}
    };
    lockPortrait();
    window.addEventListener('click', lockPortrait, { once: true });
    window.addEventListener('touchend', lockPortrait, { once: true });
    return () => {
      window.removeEventListener('click', lockPortrait);
      window.removeEventListener('touchend', lockPortrait);
    };
  }, []);
  const touchX = useRef(null);
  const handleTouchStart = e => {
    touchX.current = null;
    if (e.target.closest('.studio-physics, .phys-field') || e.touches.length !== 1) return;
    touchX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = e => {
    if (e.target.closest('.studio-physics, .phys-field')) { touchX.current = null; return; }
    if (touchX.current === null) return;
    const diff = touchX.current - e.changedTouches[0].clientX;
    const tabs = ['work', 'services', 'personal'];
    const i = tabs.indexOf(tab);
    if (diff > 50 && i < tabs.length - 1) { handleTabChange(tabs[i + 1]); setServiceFilter('All'); }
    else if (diff < -50 && i > 0) { handleTabChange(tabs[i - 1]); setServiceFilter('All'); }
    touchX.current = null;
  };
  return <><div className="ambient" aria-hidden="true" />
    <header><a href="/" className="wordmark">tanxdai<span aria-hidden="true">®</span></a><StatusCapsule time={time} onContact={() => { triggerHaptic('medium'); setCallTopic(''); contact.current.showModal(); }} /><ContactDock onContact={() => { triggerHaptic('medium'); setCallTopic(''); contact.current.showModal(); }} /></header>
    <div className="workspace-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchX.current = null; }}><nav ref={tabBar} className="top-tabs" role="tablist" aria-label="Portfolio sections" onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); event.stopPropagation(); const tabs = [...event.currentTarget.querySelectorAll('[role=tab]')]; const index = tabs.indexOf(document.activeElement); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : Math.max(0, Math.min(tabs.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1))); if (next === index) return; tabs[next].focus(); tabs[next].click(); }}>{surface && <motion.span className="active-tab-surface" aria-hidden="true" initial={false} animate={{ x: surface.x, width: surface.width }} style={{ top: surface.y, height: surface.height }} transition={springs.ui} />}{[['work', 'Selected work', String(projects.length).padStart(2, '0')], ['services', 'Services', String(services.length)], ['personal', 'Personal', null]].map(([key, title, count]) => <button key={key} className={tab === key ? 'active' : ''} data-tab={key} role="tab" id={`${key}-tab`} aria-controls={`${key}-panel`} aria-selected={tab === key} tabIndex={tab === key ? 0 : -1} onClick={() => { handleTabChange(key); setServiceFilter('All'); window.scrollTo({ top: 0, behavior: 'instant' }); }}><svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{key === 'work' ? <path d="M3 7h7l2-3h9v16H3z" /> : key === 'services' ? <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></> : <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0116 0v2"/></>}</svg><span>{title}</span>{count && <small>{count}</small>}</button>)}</nav>
    <main>
      <ErrorBoundary resetKey={tab}>
        <section id="work-panel" role="tabpanel" aria-labelledby="work-tab" hidden={tab !== 'work'} aria-label="Selected work"><ProjectDeck enabled={tab === 'work'} /></section>
        <section id="services-panel" role="tabpanel" aria-labelledby="services-tab" hidden={tab !== 'services'} aria-label="Services">{tab === 'services' && <Services initialFilter={serviceFilter} onCall={name => { setCallTopic(name); contact.current.showModal(); }} />}</section>
        <section id="personal-panel" role="tabpanel" aria-labelledby="personal-tab" hidden={tab !== 'personal'} aria-label="Personal side">{tab === 'personal' && <Personal onWork={() => handleTabChange('work')} onServices={(filter = 'All') => { setServiceFilter(filter); handleTabChange('services'); }} onContact={() => { triggerHaptic('medium'); setCallTopic(''); contact.current.showModal(); }} />}</section>
      </ErrorBoundary>
    </main></div>
    <footer><span>TANXDAI © 2026</span><span>A LITTLE INTENTION. A LITTLE PLAY.</span></footer>
    <dialog ref={contact} id="contact-dialog"><button id="close-contact" aria-label="Close contact" onClick={() => { triggerHaptic('light'); contact.current.close(); }}><Icon name="close" /></button><span className="eyebrow">CONTACT</span><h2>Discuss your<br />project.</h2><p>{callTopic ? `Let’s talk about ${callTopic.toLowerCase()}.` : 'Let’s talk about your next project.'}</p><div className="contact-dialog-actions"><ContactActions key={callTopic} topic={callTopic} /></div><button id="back-work" onClick={() => { triggerHaptic('light'); contact.current.close(); }}>Back to exploring <Icon name="arrowUpRight" /></button></dialog>
  </>;
}
