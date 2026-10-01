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
  const facts = [['My contribution', project.roleNote || 'Custom website development.'], ['Build approach', project.buildType], ['Build time', project.duration], ['Engagement', project.engagement]].filter(([, detail]) => detail);
  return <div className={`project-poster live-poster spotlight theme-${index % 4} ${active ? 'is-active' : ''}`}>
    <div className="poster-top"><span>{project.type}</span><span className="live-badge"><i aria-hidden="true" />Live website</span></div>
    {active && <BorderTrail radius={13} size={220} />}
    <LivePreview project={project} imgY={imgY} />
    <div className="reel-caption"><span className="goal-label">THE DEVELOPMENT GOAL</span><TextReveal text={project.goal} play={active} delay={0.12} />
      <div className="poster-delivered"><b>Delivered</b> {project.buildType}{project.result && <><span aria-hidden="true"> · </span><b>Result</b> {project.result}</>}</div>
      {project.stack && <ul className="stack-chips" aria-label="Technology">{project.stack.split(' · ').map((tech, i) => <li key={tech} style={{ '--i': i }}>{tech}</li>)}</ul>}
      <div className="project-actions" onPointerDown={event => event.stopPropagation()}>
        <button className="project-info-button" aria-label={`About ${project.name}`} onClick={openInfo}><Icon name="info" /> <span>Project info</span></button>
        <motion.a className="visit-website" href={project.liveUrl} target="_blank" rel="noopener noreferrer" {...magnetic}>Visit website <Icon name="arrowUpRight" /></motion.a>
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
  const yActive = -(i * step);
  const yNextActive = -((i + 1) * step);
  
  const scale = useTransform(y, [yActive + step, yActive, yNextActive], [1, 1, 0.92]);
  const filter = useTransform(y, [yActive + step, yActive, yNextActive], ['brightness(1)', 'brightness(1)', 'brightness(0.5)']);
  const imgY = useTransform(y, [yActive + step, yActive, yNextActive], [80, 0, -80]);

  return <motion.article className={`react-card theme-${i % 4}`}
    style={{ top: slotFor(i, position) * step, height, scale, filter }} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}: ${project.name}`}
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
      if (document.querySelector('dialog[open], :popover-open') || event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const directions = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 };
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
    <div className="deck-heading"><span className="deck-eyebrow">PROJECT PORTFOLIO</span><AnimatePresence mode="wait" initial={false} custom={direction}><motion.h1 id="deck-title" key={index} custom={direction}
      variants={{ from: dir => ({ opacity: 0, y: dir * 14 }), shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.enter } }, gone: dir => ({ opacity: 0, y: dir * -10, transition: { duration: duration.quick, ease: ease.exit } }) }}
      initial={reducedMotion ? false : 'from'} animate="shown" exit={reducedMotion ? undefined : 'gone'}>{projects[index].name}</motion.h1></AnimatePresence></div>
    <div id="projects" ref={viewport} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Projects. Swipe up or down, or use arrow keys.">
      <motion.div className="deck-track" style={{ y }} drag={enabled ? 'y' : false} dragMomentum={false}
        dragConstraints={{ top: -(position + 1) * step, bottom: -(position - 1) * step }} dragElastic={0.08}
        onDragStart={() => running.current?.stop()} onDragEnd={finishDrag}
        onPointerCancel={() => goTo(selected.current)}>
        {projects.map((project, i) => <ProjectCard key={project.name} project={project} i={i} index={index} position={position} y={y} step={step} height={height} />)}
      </motion.div>
    </div>
    <div className="deck-controls" style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', padding: 0, gap: '15px', zIndex: 50, pointerEvents: 'auto' }}>
      <motion.button whileTap={{ scale: 0.9 }} id="previous-project" onClick={() => goTo(selected.current - 1)} aria-label="Previous project" style={{ width: 44, height: 44, background: '#151d29' }}><Icon name="arrowUp" /></motion.button>
      <motion.button whileTap={{ scale: 0.9 }} id="next-project" onClick={() => goTo(selected.current + 1)} aria-label="Next project" style={{ width: 44, height: 44, background: '#151d29' }}><Icon name="arrowDown" /></motion.button>
    </div>
  </>;
}

function Personal({ onWork, onServices, onContact }) {
  const avatarTilt = useTilt(20);
  return <div className="personal-bento">
    <article className="bento-intro"><span className="bento-label">DESIGN & DEVELOPMENT</span><h1>Hey, I’m Tanxdai<span>.</span></h1><p>Web developer · AI & automation</p></article>
    <motion.div className="bento-avatar" {...avatarTilt}><MemojiAvatar /><motion.span {...useMagnetic()}>Hello <Icon name="arrowUpRight" /></motion.span></motion.div>
    <div className="bento-shortcuts" aria-label="Explore my work"><button onClick={onWork}><span><Icon name="arrowUpRight" /></span>Projects</button><button onClick={() => onServices()}><span><Icon name="sparkle" /></span>Services</button><button onClick={onContact}><span><Icon name="at" /></span>Say hello</button><button onClick={() => onServices('Websites')}><span><Icon name="code" /></span>Development</button><button onClick={() => onServices('AI & automation')}><span><Icon name="layers" /></span>AI & more</button></div>
    <button className="bento-work" onClick={onWork}><span className="bento-card-top">Selected work <span><Icon name="arrowUpRight" /></span></span><div className="bento-previews">{[projects[0], projects[1], projects[4]].map((project, index) => <img key={project.name} src={project.image} alt={project.name} style={{ '--order': index }} />)}</div><span className="bento-footnote">Selected client projects</span></button>
    <article className="bento-services"><button type="button" className="bento-card-top bento-card-link" onClick={() => onServices()}>What I can help with <span><Icon name="arrowUpRight" /></span></button><PhysicsPile label="What I can help with" variant="chip" items={['Custom websites', 'AI workflows', 'WordPress', 'Automation', 'Audits', 'Consulting'].map(tag => ({ key: tag, node: tag }))} /></article>
    <article className="bento-tools"><span className="bento-label">MY TOOLKIT</span><PhysicsPile label="My toolkit" variant="tile" items={[['React', 'Re'], ['Python', 'Py'], ['AI tools', 'AI'], ['TypeScript', 'TS'], ['Astro', 'A'], ['WordPress', 'W'], ['Motion', 'M']].map(([name, mark]) => ({ key: name, node: <><b>{mark}</b><small>{name}</small></> }))} /></article>
    <article className="bento-collab"><span className="bento-label">HAVE A PROJECT IN MIND?</span><h2>Let’s work<br />{' '}together.</h2><p>Websites, applications, and AI integrations.</p><motion.button onClick={onContact} {...useMagnetic()}>Let’s collaborate <span><Icon name="arrowUpRight" /></span></motion.button></article>
  </div>;
}

export default function App() {
  const [tab, setTab] = useState('work');
  const [callTopic, setCallTopic] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [time, setTime] = useState(formatTime);
  const contact = useRef(null);
  const tabBar = useRef(null);
  const [surface, setSurface] = useState(null);
  useLayoutEffect(() => {
    const measure = () => { const active = tabBar.current.querySelector(`[data-tab="${tab}"]`); setSurface({ x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight }); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tab]);
  useEffect(() => { const timer = setInterval(() => setTime(formatTime()), 60000); return () => clearInterval(timer); }, []);
  useEffect(trackSpotlight, []);
  return <><div className="ambient" aria-hidden="true" />
    <header><a href="/" className="wordmark">tanxdai<span aria-hidden="true">®</span></a><StatusCapsule time={time} onContact={() => { setCallTopic(''); contact.current.showModal(); }} /><ContactDock onContact={() => { setCallTopic(''); contact.current.showModal(); }} /></header>
    <div className="workspace-shell"><nav ref={tabBar} className="top-tabs" role="tablist" aria-label="Portfolio sections" onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); event.stopPropagation(); const tabs = [...event.currentTarget.querySelectorAll('[role=tab]')]; const index = tabs.indexOf(document.activeElement); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; tabs[next].focus(); tabs[next].click(); }}>{surface && <motion.span className="active-tab-surface" aria-hidden="true" initial={false} animate={{ x: surface.x, width: surface.width }} style={{ top: surface.y, height: surface.height }} transition={springs.ui} />}{[['work', 'Selected work', String(projects.length).padStart(2, '0')], ['services', 'Services', String(services.length)], ['personal', 'Personal', null]].map(([key, title, count]) => <button key={key} className={tab === key ? 'active' : ''} data-tab={key} role="tab" id={`${key}-tab`} aria-controls={`${key}-panel`} aria-selected={tab === key} tabIndex={tab === key ? 0 : -1} onClick={() => { setTab(key); setServiceFilter('All'); window.scrollTo({ top: 0, behavior: 'instant' }); }}><svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{key === 'work' ? <path d="M3 7h7l2-3h9v16H3z" /> : key === 'services' ? <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></> : <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0116 0v2"/></>}</svg><span>{title}</span>{count && <small>{count}</small>}</button>)}</nav>
    <main data-active-view={tab}><section id="work-panel" role="tabpanel" aria-labelledby="work-tab" hidden={tab !== 'work'} aria-label="Selected work"><ProjectDeck enabled={tab === 'work'} /></section><section id="services-panel" role="tabpanel" aria-labelledby="services-tab" hidden={tab !== 'services'} aria-label="Services">{tab === 'services' && <Services initialFilter={serviceFilter} onCall={name => { setCallTopic(name); contact.current.showModal(); }} />}</section><section id="personal-panel" role="tabpanel" aria-labelledby="personal-tab" hidden={tab !== 'personal'} aria-label="Personal side"><Personal onWork={() => setTab('work')} onServices={(filter = 'All') => { setServiceFilter(filter); setTab('services'); }} onContact={() => { setCallTopic(''); contact.current.showModal(); }} /></section></main></div>
    <footer><span>TANXDAI © 2026</span><span>A LITTLE INTENTION. A LITTLE PLAY.</span></footer>
    <dialog ref={contact} id="contact-dialog"><button id="close-contact" aria-label="Close contact" onClick={() => contact.current.close()}><Icon name="close" /></button><span className="eyebrow">CONTACT</span><h2>Discuss your<br />project.</h2><p>{callTopic ? `Let’s talk about ${callTopic.toLowerCase()}.` : 'Let’s talk about your next project.'}</p><div className="contact-dialog-actions"><ContactActions key={callTopic} topic={callTopic} /></div><button id="back-work" onClick={() => contact.current.close()}>Back to exploring <Icon name="arrowUpRight" /></button></dialog>
  </>;
}
