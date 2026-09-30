// One generic renderer for every walkthrough in walkthroughs.js. Plays once on mount; Replay restarts it.
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Icon from '../Icons.jsx';
import { duration, ease, spring } from '../motion.js';

const STEP_MS = 1150;   // pause between beats
const TYPING_MS = 700;  // assistant "typing" before its message lands

const arrive = { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1, transition: spring.ui } };

function Step({ step }) {
  if (step.type === 'event') return <motion.div layout {...arrive} className="wt-event"><i aria-hidden="true" />{step.text}</motion.div>;
  if (step.type === 'msg') return <motion.div layout {...arrive} className={`wt-msg wt-${step.side}`}><span>{step.who}</span><p>{step.text}</p></motion.div>;
  if (step.type === 'card') return <motion.div layout {...arrive} className="wt-card"><strong>{step.title}</strong>
    <dl>{step.rows.map(([term, detail], i) => <motion.div key={term} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * 0.07, duration: duration.base, ease: ease.enter } }}><dt>{term}</dt><dd>{detail}</dd></motion.div>)}</dl>
  </motion.div>;
  return <motion.div layout {...arrive} className="wt-done"><Icon name="check" />{step.text}</motion.div>;
}

export default function Walkthrough({ script }) {
  const reduced = useReducedMotion();
  const total = script.steps.length;
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(reduced ? total : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) { setShown(total); return; }
    setShown(0);
    const timers = [];
    let at = 350;
    script.steps.forEach((step, i) => {
      if (step.type === 'msg' && step.side === 'ai') {
        timers.push(setTimeout(() => setTyping(true), at));
        at += TYPING_MS;
      }
      timers.push(setTimeout(() => { setTyping(false); setShown(i + 1); }, at));
      at += STEP_MS;
    });
    return () => timers.forEach(clearTimeout);
  }, [run, reduced, script, total]);

  return <div className="wt-stage" aria-label={`${script.label}, illustrative`}>
    <div className="wt-head"><span className="wt-label">{script.label}</span>
      <button className="wt-replay" onClick={() => setRun(value => value + 1)} disabled={!reduced && shown < total} aria-label="Replay example"><Icon name="replay" /> Replay</button></div>
    <div className="wt-feed">
      <AnimatePresence initial={false}>
        {script.steps.slice(0, shown).map((step, i) => <Step key={`${run}-${i}`} step={step} />)}
        {typing && <motion.div key="typing" layout {...arrive} exit={{ opacity: 0, transition: { duration: duration.quick, ease: ease.exit } }} className="wt-typing" aria-hidden="true"><i /><i /><i /></motion.div>}
      </AnimatePresence>
    </div>
  </div>;
}
