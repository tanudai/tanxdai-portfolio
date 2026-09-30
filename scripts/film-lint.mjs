// Film script lint: `node scripts/film-lint.mjs`. Exits 1 with a list of problems.
// Checks every service has a complete film, lines fit their time on screen, and copy stays honest and glyph-free.
import { films } from '../src/service-films.js';
import { timeline, words, WPS, CHAT_WPS } from '../src/film/plan.js';
import { readFileSync } from 'node:fs';

// Icon and demo names come from their (JSX) sources, so the lint stays dependency-free.
const source = file => readFileSync(new URL(`../src/film/${file}`, import.meta.url), 'utf8');
const iconNames = [...source('icons.jsx').split('const paths = {')[1].split('\n};')[0].matchAll(/^  (\w+):/gm)].map(m => m[1]);
const demoKinds = [...source('demos.jsx').match(/const demos = \{([^}]*)\}/)[1].matchAll(/(\w+):/g)].map(m => m[1]);

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const ids = Array.from({ length: 18 }, (_, i) => String(i + 1).padStart(2, '0'));
const GLYPHS = /[↗↑↓←→×ⓘ✳⌘◈✓✔➜➔»]/;
const STATS = /\d+\s*%|\bpercent\b|\b\d+x\b|\b(doubles?|triples?|guarantee[ds]?|unlimited)\b/i;

for (const id of ids) {
  const film = films[id];
  if (!film) { failures.push(`${id}: missing film`); continue; }
  const texts = [film.hook, ...film.need, film.cta, ...film.industries.flatMap(([, name, why]) => [name, why]), ...(film.gets || []), film.note || ''];
  if (film.walkthrough) texts.push(...film.walkthrough.steps.flatMap(step => step.type === 'card' ? [step.title, ...step.rows.flat()] : [step.text, step.who || '']));
  for (const text of texts) {
    check(!GLYPHS.test(text), `${id}: glyph in "${text}"`);
    check(!STATS.test(text), `${id}: statistic or promise in "${text}" (no unverified claims)`);
  }
  check(words(film.hook) <= 8, `${id}: hook has ${words(film.hook)} words (max 8)`);
  check(film.need.length >= 2 && film.need.length <= 3, `${id}: need must have 2–3 lines`);
  film.need.forEach(line => check(words(line) <= 7, `${id}: need line too long "${line}"`));
  check(film.industries.length >= 3 && film.industries.length <= 4, `${id}: 3–4 industries`);
  film.industries.forEach(([icon, name, why]) => { check(iconNames.includes(icon), `${id}: unknown icon "${icon}"`); check(words(why) <= 6, `${id}: industry reason too long "${why}"`); check(words(name) <= 3, `${id}: industry name too long "${name}"`); });
  check(words(film.cta) <= 6, `${id}: cta too long`);
  if (film.walkthrough) check(/example/i.test(film.walkthrough.label), `${id}: walkthrough must be labelled as an example`);
  else {
    check(demoKinds.includes(film.demo), `${id}: unknown demo "${film.demo}"`);
    check(film.gets?.length === 3, `${id}: needs exactly three deliverables`);
  }
  const { scenes } = timeline(film);
  check(scenes.map(s => s.key).join() === 'hook,need,gets,best,end', `${id}: scenes must be hook, need, gets, best, end`);
  // Reading pace: words on screen per second of scene must stay under the pace limit.
  const pace = (count, scene, wps) => check(count / (scene.dur / 1000) <= wps, `${id}: ${scene.key} reads at ${(count / (scene.dur / 1000)).toFixed(1)} words/s (limit ${wps})`);
  const byKey = Object.fromEntries(scenes.map(s => [s.key, s]));
  pace(words(film.hook), byKey.hook, WPS);
  pace(film.need.reduce((n, l) => n + words(l), 0), byKey.need, WPS * 1.2);
  pace(film.industries.reduce((n, [, a, b]) => n + words(a) + words(b), 0), byKey.best, WPS * 1.8);
  if (film.walkthrough) byKey.gets.beats.forEach(beat => { const s = beat.step; const n = s.type === 'card' ? words(s.title) + s.rows.reduce((m, [, v]) => m + words(v), 0) : words(s.text); check(n / ((beat.dur - beat.typing) / 1000) <= CHAT_WPS + 0.01, `${id}: chat beat too fast "${s.text || s.title}"`); });
  else pace(film.gets.reduce((n, g) => n + words(g), 0) + (film.note ? words(film.note) : 0), byKey.gets, WPS);
}

const totals = ids.filter(id => films[id]).map(id => timeline(films[id]).total / 1000);
console.log(`films: ${totals.length} · length ${Math.min(...totals).toFixed(1)}–${Math.max(...totals).toFixed(1)}s`);
if (failures.length) { console.log(`FAIL (${failures.length})\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log('PASS');
