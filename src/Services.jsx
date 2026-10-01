import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ServiceArt, { flowSteps } from './components/ServiceArt.jsx';
import { duration, ease, spring } from './motion.js';
import Icon from './Icons.jsx';

// Films load only when a service card opens, keeping them out of the initial bundle.
const loadFilm = () => import('./film/FilmPlayer.jsx');
const FilmPlayer = lazy(loadFilm);

const groups = ['AI & automation', 'Websites', 'Audits & advisory'];
export const services = [
  ['AI & automation', '01', 'Enquiry assistants', 'Make every enquiry easier to act on.', 'An assistant grounded in your approved business information, with a clear handoff to your team.', ['Business FAQ and knowledge setup', 'Lead capture and qualification', 'Human handoff and answer testing']],
  ['AI & automation', '02', 'Quote preparation', 'From a loose brief to a useful draft.', 'Turn product requirements, quantities, and timelines into structured briefs and draft quotations.', ['Requirements capture', 'Draft quote workflow', 'Staff approval before sending']],
  ['AI & automation', '03', 'Knowledge assistants', 'Your company’s knowledge, within reach.', 'Help your team find answers in approved documents, with sources and appropriate access controls.', ['Document preparation and search', 'Source-linked answers', 'Permissions and quality checks']],
  ['AI & automation', '04', 'Document workflows', 'Less copying. More useful information.', 'Extract and organize information from invoices, forms, and PDFs, with review for uncertain results.', ['Structured data extraction', 'Review and correction steps', 'Export to your existing tools']],
  ['AI & automation', '05', 'Support copilots', 'Give your team a better first draft.', 'Help support staff find policies, categorize requests, and draft consistent responses.', ['Ticket classification', 'Policy-grounded reply drafts', 'Escalation to a person']],
  ['AI & automation', '06', 'CRM & follow-ups', 'Keep the next step clear.', 'Connect enquiries to your CRM and prepare useful summaries, assignments, and follow-up drafts.', ['Enquiry routing', 'Conversation summaries', 'Reviewable follow-up workflows']],
  ['AI & automation', '07', 'Product discovery', 'Help buyers find the right fit.', 'Guide visitors through your catalog using specifications and requirements, with real product information.', ['Catalog and specification setup', 'Guided product matching', 'Sales-team handoff']],
  ['AI & automation', '08', 'Content & reporting', 'Turn source material into useful drafts.', 'Create repeatable workflows for approved content and business summaries, with human review.', ['Reusable content workflows', 'Source-linked reporting', 'Approval before publication']],
  ['Websites', '09', 'Custom websites', 'Built around your business.', 'A responsive website shaped around your audience, content, and enquiry journey.', ['Custom interface and development', 'Mobile and desktop layouts', 'Launch checks and handover']],
  ['Websites', '10', 'WordPress development', 'Flexible content. Considered design.', 'Custom WordPress implementation with an editing experience your team can use.', ['Design and CMS implementation', 'Relevant plugin integrations', 'Editor training and handover']],
  ['Websites', '11', 'AI feature integration', 'Give your existing product new abilities.', 'Add a focused AI workflow to your website or application, starting with a scoped pilot.', ['Use-case and data review', 'API and application integration', 'Testing and usage controls']],
  ['Websites', '12', 'Website care', 'Keep the essentials working.', 'Ongoing technical care with an agreed scope, update process, and maintenance schedule.', ['Updates and backups', 'Form and uptime checks', 'Performance maintenance']],
  ['Audits & advisory', '13', 'Website quality review', 'Know what to fix first.', 'A practical review of your website’s usability, reliability, performance, and technical SEO.', ['Mobile and key-flow review', 'Prioritized findings', 'Implementation roadmap']],
  ['Audits & advisory', '14', 'Accessibility', 'Make the experience easier to use.', 'Review and remediate against an agreed WCAG target, combining manual checks with automated tools.', ['Keyboard, focus, and forms', 'Contrast and semantic structure', 'Documented fixes and retesting']],
  ['Audits & advisory', '15', 'Privacy & GDPR readiness', 'Understand and improve data handling.', 'Technical privacy implementation and readiness support. Legal interpretation and sign-off stay with your legal adviser.', ['Tracker and form inventory', 'Consent and script controls', 'Retention and deletion workflows']],
  ['Audits & advisory', '16', 'AI opportunity review', 'Choose a useful first step.', 'Identify a specific business workflow worth testing, its data needs, and a realistic pilot scope.', ['Workflow discovery', 'Cost and feasibility assessment', 'Pilot success criteria']],
  ['Audits & advisory', '17', 'AI quality & care', 'Keep the system useful after launch.', 'Evaluate answers, failures, costs, and model changes against an agreed set of checks.', ['Evaluation examples and testing', 'Usage and failure monitoring', 'Scheduled improvements']],
  ['Audits & advisory', '18', 'AI adoption & training', 'Help your team use AI thoughtfully.', 'Practical training and operating guidance tailored to your team’s workflows and data.', ['Role-specific workshops', 'Data handling and review rules', 'Repeatable working practices']],
];

import { useMagnetic, useTilt } from './components/motion-kit.jsx';

function ServiceTile({ service, i, hovered, setHovered, setSelected, opener, loadFilm, reducedMotion }) {
  const tilt = useTilt(10);
  const magnetic = useMagnetic(0.3, 12);

  const handlePointerMove = e => {
    tilt.onPointerMove?.(e);
  };
  const handlePointerLeave = e => {
    tilt.onPointerLeave?.(e);
  };

  return <motion.button className="service-tile spotlight" 
    onHoverStart={() => { setHovered(service[1]); loadFilm(); }} 
    onHoverEnd={() => setHovered(null)} 
    onFocus={() => { setHovered(service[1]); loadFilm(); }} 
    onBlur={() => setHovered(null)} 
    layoutId={`service-${service[1]}`} 
    whileHover={reducedMotion ? undefined : { y: -4, scale: 1.008 }} 
    whileTap={{ scale: 0.98 }} 
    style={{ borderRadius: 16, ...tilt.style }} 
    onPointerMove={handlePointerMove}
    onPointerLeave={handlePointerLeave}
    transition={spring.sheet} 
    onClick={event => { opener.current = event.currentTarget; setSelected(service); }}>
    <span className="service-stage">
      <ServiceArt id={service[1]} active={hovered === service[1]} delay={0.1 + i * 0.07} />
      <motion.span className="service-open" {...magnetic} onPointerDown={e => e.stopPropagation()}><Icon name="arrowUpRight" /></motion.span>
    </span>
    <span className="service-category"><b>{service[1]}</b><span className="service-group"> · {service[0]}</span></span><h2>{service[2]}</h2><p>{service[3]}</p><span className="service-flow">{flowSteps(service[1]).map((label, n) => <span key={label}>{n > 0 && <Icon name="arrowRight" />}{label}</span>)}</span>
  </motion.button>;
}

export default function Services({ onCall, initialFilter = 'All' }) {
  const reducedMotion = useReducedMotion();
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 700px), (max-height: 650px)').matches);
  const [isPhone, setIsPhone] = useState(() => matchMedia('(max-width: 700px)').matches);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  
  useEffect(() => {
    const media = matchMedia('(max-width: 700px), (max-height: 650px)');
    const phoneMedia = matchMedia('(max-width: 700px)');
    const update = () => { setCompact(media.matches); setIsPhone(phoneMedia.matches); setPage(0); };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  
  const filtered = services.filter(service => filter === 'All' || service[0] === filter);
  const perPage = isPhone ? 1 : compact ? 4 : 6;
  const pages = Math.ceil(filtered.length / perPage);
  
  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= pages) return;
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };
  
  const touchY = useRef(null);
  const handleTouchStart = e => { touchY.current = e.touches[0].clientY; };
  const handleTouchEnd = e => {
    if (touchY.current === null) return;
    const diff = touchY.current - e.changedTouches[0].clientY;
    if (diff > 50) goToPage(page + 1);
    else if (diff < -50) goToPage(page - 1);
    touchY.current = null;
  };
  
  const wheelState = useRef({ amount: 0, last: 0, lockedUntil: 0 });
  const viewport = useRef(null);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    function onWheel(event) {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || document.querySelector('dialog[open]')) return;
      event.preventDefault();
      const now = performance.now();
      const state = wheelState.current;
      if (now - state.last > 140) state.amount = 0;
      state.last = now;
      if (now < state.lockedUntil) return;
      state.amount += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(state.amount) > 45) {
        goToPage(page + (state.amount > 0 ? 1 : -1));
        state.amount = 0;
        state.lockedUntil = now + 600;
      }
    }
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [page, pages]);
  
  // The card flies from its tile into the dialog and back: the dialog stays open until the return flight lands.
  const close = () => setSelected(null);
  useLayoutEffect(() => { if (selected && !dialog.current.open) dialog.current.showModal(); }, [selected]); // same frame as the click
  const landed = () => { dialog.current?.close(); opener.current?.focus(); };
  
  return <div className={`services-app ${isPhone ? 'services-readable' : ''}`} ref={viewport} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} tabIndex={0} style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div className="services-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <span className="deck-eyebrow">SERVICES</span><h1>How I can help</h1>
        <p>Development, AI integrations, and technical advice.</p>
      </div>
      <div className="deck-controls" style={{ display: 'flex', gap: '8px', padding: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} id="previous-project" onClick={() => goToPage(page - 1)} disabled={page === 0} aria-label="Previous services" style={{ width: 38, height: 38, background: 'transparent', borderColor: 'transparent' }}><Icon name="arrowUp" /></motion.button>
        <motion.button whileTap={{ scale: 0.9 }} id="next-project" onClick={() => goToPage(page + 1)} disabled={page === pages - 1} aria-label="Next services" style={{ width: 38, height: 38, background: 'transparent', borderColor: 'transparent' }}><Icon name="arrowDown" /></motion.button>
      </div>
    </div>
    <div className="service-filters" aria-label="Filter services">{['All', ...groups].map(group => <button key={group} aria-pressed={filter === group} onClick={() => { setFilter(group); setPage(0); }}>{group}</button>)}</div>
    <div style={{ position: 'relative', flex: 1, minHeight: 0, paddingBottom: '20px' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={`${filter}-${page}`} custom={direction} className="service-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gridTemplateRows: isPhone ? '1fr' : 'repeat(2, minmax(0, 350px))', height: '100%', position: 'absolute', inset: '0 0 20px 0', alignContent: isPhone ? 'stretch' : 'center' }}
          variants={{
            from: dir => ({ opacity: 0, y: dir * 50 }),
            shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
            gone: dir => ({ opacity: 0, y: dir * -50, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } })
          }}
          initial={reducedMotion ? false : 'from'} animate="shown" exit={reducedMotion ? undefined : 'gone'}>
          {filtered.slice(page * perPage, (page + 1) * perPage).map((service, i) => <ServiceTile key={service[1]} service={service} i={i} hovered={hovered} setHovered={setHovered} setSelected={setSelected} opener={opener} loadFilm={loadFilm} reducedMotion={reducedMotion} />)}
        </motion.div>
      </AnimatePresence>
    </div>
    <dialog ref={dialog} className="service-dialog" aria-label={selected ? selected[2] : 'Service'} onCancel={event => { event.preventDefault(); close(); }}>
      <AnimatePresence onExitComplete={landed}>
        {selected && <motion.div key="scrim" className="service-scrim" onClick={close} initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.enter } }} exit={{ opacity: 0, transition: { duration: duration.base, ease: ease.exit } }} />}
        {selected && <motion.div key={`card-${selected[1]}`} className="service-expanded" layoutId={reducedMotion ? undefined : `service-${selected[1]}`} style={{ borderRadius: 20 }} transition={spring.sheet}
          exit={reducedMotion ? { opacity: 0 } : undefined}>
          <motion.div className="service-expanded-body" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.14, duration: duration.base, ease: ease.enter } }} exit={{ opacity: 0, transition: { duration: duration.quick, ease: ease.exit } }}>
            <button className="service-close" aria-label="Close service" onClick={close}><Icon name="close" /></button>
            <div className="service-film"><Suspense fallback={<div className="service-film-loading" />}><FilmPlayer id={selected[1]} startDelay={550} /></Suspense></div>
            <div className="service-info"><span className="service-category">{selected[0]} / {selected[1]}</span><h2>{selected[2]}</h2><p className="service-description">{selected[4]}</p><span className="goal-label">WHAT WE CAN WORK ON</span><ul>{selected[5].map(item => <li key={item}>{item}</li>)}</ul><div className="service-call"><span>Tell me what you need.<br />We’ll discuss scope and next steps.</span><button className="visit-website" onClick={() => { const name = selected[2]; close(); onCall(name); }}>Get on a call <Icon name="arrowUpRight" /></button></div></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  </div>;
}
