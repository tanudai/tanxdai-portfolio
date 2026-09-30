import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { projects } from './projects.js';
import LivePreview from './LivePreview.jsx';
import Services, { services } from './Services.jsx';
import { StatusCapsule, ContactDock } from './AppDetails.jsx';

const spring = { type: 'spring', stiffness: 310, damping: 36, mass: 0.9 };
const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

function ProjectPoster({ project, index }) {
  const info = useRef(null);
  return <div className={`project-poster live-poster theme-${index % 4}`}>
    <div className="poster-top"><span>{project.type}</span><span className="live-badge"><i aria-hidden="true" />Live website</span></div>
    <LivePreview project={project} />
    <div className="reel-caption"><span className="goal-label">THE DEVELOPMENT GOAL</span><p>{project.goal}</p>
      <div className="project-actions" onPointerDown={event => event.stopPropagation()}>
        <button className="project-info-button" aria-label={`About ${project.name}`} onClick={() => info.current.showModal()}>ⓘ <span>Project info</span></button>
        <a className="visit-website" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit website ↗</a>
      </div>
    </div>
    <dialog className="project-dialog" ref={info} onPointerDown={event => event.stopPropagation()}>
      <button className="close-info" aria-label="Close project information" onClick={() => info.current.close()}>×</button>
      <span className="goal-label">PROJECT NOTES</span><h2>{project.name}</h2>
      <dl><div><dt>Development goal</dt><dd>{project.goal}</dd></div><div><dt>My contribution</dt><dd>{project.roleNote || 'Custom website development.'}</dd></div><div><dt>Build approach</dt><dd>{project.buildType}</dd></div><div><dt>Technology stack</dt><dd>{project.stack || 'To be confirmed'}</dd></div><div><dt>Build time</dt><dd>{project.duration || 'To be added'}</dd></div></dl>
      <a className="visit-website" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live website ↗</a>
    </dialog>
  </div>;
}

function ProjectDeck({ enabled }) {
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(550);
  const viewport = useRef(null);
  const selected = useRef(0);
  const running = useRef(null);
  const wheel = useRef({ amount: 0, last: 0, lockedUntil: 0 });
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const step = height + 24;

  const goTo = useCallback((nextIndex) => {
    const next = Math.max(0, Math.min(projects.length - 1, nextIndex));
    selected.current = next;
    setIndex(next);
    running.current?.stop();
    if (reducedMotion) y.set(-next * step);
    else running.current = animate(y, -next * step, spring);
  }, [reducedMotion, step, y]);

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
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : projects.length - 1); }
    }
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [enabled, goTo]);

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
    <div className="deck-heading"><span className="deck-eyebrow">PROJECT PORTFOLIO</span><h1 id="deck-title">{projects[index].name}</h1></div>
    <div id="projects" ref={viewport} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Projects. Swipe up or down, or use arrow keys.">
      <motion.div className="deck-track" style={{ y }} drag={enabled ? 'y' : false} dragMomentum={false}
        dragConstraints={{ top: -(projects.length - 1) * step, bottom: 0 }} dragElastic={0.08}
        onDragStart={() => running.current?.stop()} onDragEnd={finishDrag}
        onPointerCancel={() => goTo(selected.current)}>
        {projects.map((project, i) => <article key={project.name} className={`react-card theme-${i % 4}`}
          style={{ top: i * step, height }} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}: ${project.name}`}
          aria-hidden={i !== index} inert={i !== index}>
          <ProjectPoster project={project} index={i} />
        </article>)}
      </motion.div>
    </div>
    <div className="deck-controls"><motion.button whileTap={{ scale: 0.9 }} id="previous-project" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous project">↑</motion.button>
      <div className="project-selector"><div className="project-filmstrip" aria-label="Choose a project">{projects.map((project, i) => <button key={project.name} aria-label={`Show ${project.name}`} aria-pressed={i === index} title={project.name} onClick={() => goTo(i)}><img src={project.image} alt="" /><span>{String(i + 1).padStart(2, '0')}</span></button>)}</div><span id="deck-count" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><small>SWIPE TO EXPLORE</small></div>
      <motion.button whileTap={{ scale: 0.9 }} id="next-project" onClick={() => goTo(index + 1)} disabled={index === projects.length - 1} aria-label="Next project">↓</motion.button>
    </div>
  </>;
}

function Personal({ onWork, onServices, onContact }) {
  return <div className="personal-bento">
    <article className="bento-intro"><span className="bento-label">DESIGN & DEVELOPMENT</span><h1>Hey, I’m Tanxdai<span>.</span></h1><p>Web developer · AI & automation</p></article>
    <div className="bento-avatar" aria-label="Placeholder profile illustration"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="avatar-fill" x2="1" y2="1"><stop stopColor="#d5e4de"/><stop offset="1" stopColor="#7d9e96"/></linearGradient></defs><rect x="21" y="23" width="78" height="78" rx="28" fill="url(#avatar-fill)"/><path d="M25 46Q22 11 61 16Q98 16 98 49L85 40L76 27Q54 44 25 46" fill="#293932"/><ellipse cx="45" cy="62" rx="4" ry="5" fill="#263831"/><ellipse cx="76" cy="62" rx="4" ry="5" fill="#263831"/><path d="M47 79Q60 91 75 78" fill="none" stroke="#263831" strokeWidth="4" strokeLinecap="round"/></svg><span>Hello ↗</span></div>
    <div className="bento-shortcuts" aria-label="Explore my work"><button onClick={onWork}><span>↗</span>Projects</button><button onClick={onServices}><span>✳</span>Services</button><button onClick={onContact}><span>@</span>Say hello</button><button onClick={onWork}><span>⌘</span>Development</button><button onClick={onServices}><span>◈</span>AI & more</button></div>
    <button className="bento-work" onClick={onWork}><span className="bento-card-top">Selected work <span>↗</span></span><div className="bento-previews">{[projects[0], projects[1], projects[4]].map((project, index) => <img key={project.name} src={project.image} alt={project.name} style={{ '--order': index }} />)}</div><span className="bento-footnote">Selected client projects</span></button>
    <button className="bento-services" onClick={onServices}><span className="bento-card-top">What I can help with <span>↗</span></span><div className="bento-tags">{['Custom websites', 'AI workflows', 'WordPress', 'Automation', 'Audits', 'Consulting'].map(tag => <span key={tag}>{tag}</span>)}</div></button>
    <article className="bento-tools"><span className="bento-label">MY TOOLKIT</span><div className="tool-tiles">{[['React', 'Re'], ['Astro', 'A'], ['WordPress', 'W'], ['Motion', 'M'], ['TypeScript', 'TS']].map(([name, mark]) => <span title={name} key={name}><b>{mark}</b><small>{name}</small></span>)}</div></article>
    <article className="bento-collab"><span className="bento-label">HAVE A PROJECT IN MIND?</span><h2>Let’s work<br />together.</h2><p>Websites, applications, and AI integrations.</p><button onClick={onContact}>Let’s collaborate <span>↗</span></button></article>
  </div>;
}

export default function App() {
  const [tab, setTab] = useState('work');
  const [callTopic, setCallTopic] = useState('');
  const [time, setTime] = useState(formatTime);
  const contact = useRef(null);
  useEffect(() => { const timer = setInterval(() => setTime(formatTime()), 60000); return () => clearInterval(timer); }, []);
  return <><div className="ambient" aria-hidden="true" />
    <header><a href="/" className="wordmark">tanxdai<span>®</span></a><StatusCapsule time={time} onContact={() => { setCallTopic(''); contact.current.showModal(); }} /><ContactDock onContact={() => { setCallTopic(''); contact.current.showModal(); }} /></header>
    <div className="workspace-shell"><nav className="top-tabs" role="tablist" aria-label="Portfolio sections" onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); event.stopPropagation(); const tabs = [...event.currentTarget.querySelectorAll('[role=tab]')]; const index = tabs.indexOf(document.activeElement); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; tabs[next].focus(); tabs[next].click(); }}>{[['work', 'Selected work', String(projects.length).padStart(2, '0')], ['services', 'Services', String(services.length)], ['personal', 'Personal', '02']].map(([key, title, count]) => <button key={key} className={tab === key ? 'active' : ''} data-tab={key} role="tab" id={`${key}-tab`} aria-controls={`${key}-panel`} aria-selected={tab === key} tabIndex={tab === key ? 0 : -1} onClick={() => { setTab(key); window.scrollTo({ top: 0, behavior: 'instant' }); }}>{tab === key && <motion.span className="active-tab-surface" layoutId="active-tab" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />}<svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{key === 'work' ? <path d="M3 7h7l2-3h9v16H3z" /> : key === 'services' ? <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></> : <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0116 0v2"/></>}</svg><span>{title}</span><small>{count}</small></button>)}<span className="local-clock">{time} / LOCAL TIME</span></nav>
    <main data-active-view={tab}><section id="work-panel" role="tabpanel" aria-labelledby="work-tab" hidden={tab !== 'work'} aria-label="Selected work"><ProjectDeck enabled={tab === 'work'} /></section><section id="services-panel" role="tabpanel" aria-labelledby="services-tab" hidden={tab !== 'services'} aria-label="Services">{tab === 'services' && <Services onCall={name => { setCallTopic(name); contact.current.showModal(); }} />}</section><section id="personal-panel" role="tabpanel" aria-labelledby="personal-tab" hidden={tab !== 'personal'} aria-label="Personal side"><Personal onWork={() => setTab('work')} onServices={() => setTab('services')} onContact={() => { setCallTopic(''); contact.current.showModal(); }} /></section></main></div>
    <footer><span>TANXDAI © 2026</span><span>A LITTLE INTENTION. A LITTLE PLAY.</span></footer>
    <dialog ref={contact} id="contact-dialog"><button id="close-contact" aria-label="Close contact" onClick={() => contact.current.close()}>×</button><span className="eyebrow">CONTACT</span><h2>Discuss your<br />project.</h2><p>{callTopic ? `Let’s talk about ${callTopic.toLowerCase()}.` : 'Let’s talk about your next project.'}</p><p className="contact-placeholder">Booking link coming soon. This is a preview; no call has been scheduled.</p><button id="back-work" onClick={() => contact.current.close()}>Back to exploring ↗</button></dialog>
  </>;
}
