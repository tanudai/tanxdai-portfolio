// A service film: pure function of (film, t). No state, no timers, so the browser player and Remotion draw identical frames.
// Canvas is a fixed 800 by 500 logical stage; the caller scales it.
import { EXIT_MS, arrive, clamp01, curves, mix, presence, progress, tween } from './ease.js';
import { CANVAS, STAGE, timeline } from './plan.js';
import Demo from './demos.jsx';
import FilmIcon from './icons.jsx';

export { CANVAS, timeline };
export { settledAt } from './plan.js';

const outAt = (scene, isLast) => (isLast ? null : scene.dur - EXIT_MS);

function Words({ text, t, start, gap = 70, style }) {
  return <span style={style}>{text.split(' ').map((word, i) => <span key={i}>{i > 0 && ' '}<span style={{ display: 'inline-block', ...arrive(t, start + i * gap, { distance: 18, blur: 10 }) }}>{word}</span></span>)}</span>;
}

function Outline({ id, t, start }) {
  const draw = tween(t, start, 1500, 'hero');
  return <svg className="film-outline" viewBox="0 0 400 260" aria-hidden="true">
    <text x="400" y="230" textAnchor="end" fontSize="260" fontWeight="600" fill="none" stroke="#262626" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw}>{id}</text>
  </svg>;
}

function Hook({ film, lt, out }) {
  const bar = tween(lt, 750, 700, 'hero');
  return <div className="film-scene" style={out != null && lt >= out ? { opacity: 1 - tween(lt, out, EXIT_MS, 'exit') } : undefined}>
    <Outline id={film.id} t={lt} start={0} />
    <div className="film-kicker" style={arrive(lt, 0)}>{film.category}</div>
    <h2 className="film-hook"><Words text={film.hook} t={lt} start={90} /></h2>
    <div className="film-bar" style={{ transform: `scaleX(${bar})` }} />
  </div>;
}

function Need({ film, scene, lt, out }) {
  return <div className="film-scene">
    <div className="film-kicker film-kicker-dim" style={presence(lt, 0, out)}>Sound familiar?</div>
    <ul className="film-needs">{film.need.map((line, i) => {
      const draw = tween(lt, scene.starts[i] + 120, 500, 'enter');
      return <li key={line} style={presence(lt, scene.starts[i], out)}>
        <span className="film-need-icon"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#8a8a8a" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" opacity={draw} /></svg></span>{line}</li>;
    })}</ul>
  </div>;
}

function Beat({ beat, lt, offset }) {
  const { step } = beat;
  const inAt = beat.start + beat.typing;
  const a = arrive(lt, inAt);
  const top = beat.y - offset;
  const fade = clamp01((top + beat.height) / 90); // dissolve as it scrolls off the top
  const style = { ...a, top, opacity: a.opacity * fade };
  if (step.type === 'msg') return <div className={`film-beat film-msg film-${step.side}`} style={style}>
    <span className="film-who">{step.side === 'ai' && <FilmIcon name="sparkle" size={20} />}{step.who}</span><p>{step.text}</p></div>;
  if (step.type === 'event') return <div className="film-beat film-event" style={style}><i />{step.text}</div>;
  if (step.type === 'card') return <div className="film-beat film-card" style={style}><strong>{step.title}</strong>
    <dl>{step.rows.map(([term, detail], i) => <div key={term} style={arrive(lt, inAt + 160 + i * 110, { distance: 10, blur: 4 })}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl></div>;
  const ring = tween(lt, inAt, 600, 'enter');
  return <div className="film-beat film-done" style={style}>
    <svg viewBox="0 0 48 48" width="64" height="64" fill="none" stroke="#b7efcf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="21" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ring} /><path d="m14 25 7 7 13-15" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - tween(lt, inAt + 250, 450, 'enter')} /></svg>
    <span>{step.text}</span></div>;
}

function Typing({ lt, beat, offset }) {
  if (!beat.typing || lt < beat.start || lt >= beat.start + beat.typing) return null;
  const k = tween(lt, beat.start, 200, 'enter');
  return <div className="film-typing" style={{ opacity: k, top: beat.y - offset + 36 }}>{[0, 1, 2].map(i => <i key={i} style={{ opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((lt - beat.start) / 110 - i * 0.9)) }} />)}</div>;
}

function Gets({ film, scene, lt, out }) {
  if (film.walkthrough) {
    const beats = scene.beats;
    const current = beats.reduce((idx, beat, i) => (lt >= beat.start ? i : idx), 0);
    // The conversation stacks like a chat and glides up to keep the newest beat in view.
    const room = CANVAS.height - STAGE.top - STAGE.bottom;
    const need = k => (k < 0 ? 0 : Math.max(0, beats[k].y + beats[k].height - room));
    const offset = mix(need(current - 1), need(current), tween(lt, beats[current].start, 560, 'hero'));
    return <div className="film-scene" style={out != null && lt >= out ? { opacity: 1 - tween(lt, out, EXIT_MS, 'exit') } : undefined}>
      <div className="film-row-head" style={arrive(lt, 0)}><span className="film-kicker">What you get</span><span className="film-pill">{film.walkthrough.label}</span></div>
      <div className="film-rail">{beats.map((beat, i) => { const on = clamp01((lt - beat.start) / 250); return <i key={i} style={{ background: i <= current && lt >= beat.start ? '#b7efcf' : '#333', transform: `scale(${mix(1, i === current ? 1.35 : 1, on)})` }} />; })}</div>
      <div className="film-stage">
        {beats.map((beat, i) => i <= current && <Beat key={i} beat={beat} lt={lt} offset={offset} />)}
        <Typing lt={lt} beat={beats[current]} offset={offset} />
      </div>
    </div>;
  }
  const p = progress(lt, 400, scene.dur - 1400);
  return <div className="film-scene" style={out != null && lt >= out ? { opacity: 1 - tween(lt, out, EXIT_MS, 'exit') } : undefined}>
    <div className="film-demo" style={arrive(lt, 0, { distance: 26 })}><Demo kind={film.demo} p={p} /></div>
    <div className="film-gets">
      <div className="film-kicker" style={arrive(lt, 150)}>What you get</div>
      <ul>{film.gets.map((item, i) => { const on = tween(lt, scene.itemStarts[i] + 250, 400, 'enter'); return <li key={item} style={arrive(lt, scene.itemStarts[i])}>
        <span className="film-check" style={{ background: on > 0.5 ? '#b7efcf' : 'transparent', borderColor: on > 0.2 ? '#b7efcf' : '#444' }}><FilmIcon name="check" size={20} stroke={2.4} style={{ color: '#0b0b0b', opacity: on }} /></span>{item}</li>; })}</ul>
    </div>
    {film.note && <p className="film-note" style={arrive(lt, scene.itemStarts.at(-1) + 900)}>{film.note}</p>}
  </div>;
}

function Best({ film, scene, lt, out }) {
  return <div className="film-scene">
    <div className="film-kicker" style={presence(lt, 0, out)}>Best for</div>
    <ul className="film-best">{film.industries.map(([icon, name, why], i) => <li key={name} style={presence(lt, scene.rowStarts[i], out)}>
      <span className="film-best-icon"><FilmIcon name={icon} size={34} /></span><span><strong>{name}</strong><small>{why}</small></span></li>)}</ul>
  </div>;
}

function End({ film, lt }) {
  const name = tween(lt, 60, 700, 'hero');
  return <div className="film-scene film-end">
    <Outline id={film.id} t={lt} start={0} />
    <div className="film-kicker" style={arrive(lt, 0)}>{film.category}</div>
    <h2 className="film-end-name" style={{ opacity: name, transform: `scale(${mix(0.94, 1, name)})`, filter: name < 1 ? `blur(${mix(8, 0, name)}px)` : 'none' }}>{film.name}</h2>
    <div className="film-cta" style={arrive(lt, 420)}>{film.cta}<FilmIcon name="arrowRight" size={26} stroke={2.2} /></div>
    <div className="film-wordmark" style={arrive(lt, 700)}>tanxdai<i /></div>
  </div>;
}

const SCENES = { hook: Hook, need: Need, gets: Gets, best: Best, end: End };

export default function Film({ film, t, plan = timeline(film) }) {
  const { scenes } = plan;
  const index = scenes.reduce((idx, scene, i) => (t >= scene.start ? i : idx), 0);
  const scene = scenes[index];
  const Scene = SCENES[scene.key];
  const lt = t - scene.start;
  // Top chrome fades in at the start and hands over to the end card's own wordmark.
  const brand = curves.enter(clamp01(t / 500)) * (scene.key === 'end' ? 1 - tween(lt, 0, 400, 'exit') : 1);
  return <div className="film" style={{ width: CANVAS.width, height: CANVAS.height }}>
    <div className="film-brand" style={{ opacity: brand }}>tanxdai<i /></div>
    <div className="film-scene-label" style={{ opacity: brand }}>{film.id} <span>{film.name}</span></div>
    <Scene key={scene.key} film={film} scene={scene} lt={lt} out={outAt(scene, index === scenes.length - 1)} />
  </div>;
}
