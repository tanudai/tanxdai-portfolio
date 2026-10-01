// UI audit gate: `npm run audit` (start `npm run dev` first for the fit check).
// Static rules always run; the fit check needs the gstack browse binary and a running dev server.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { projects } from '../src/projects.js';

const src = new URL('../src/', import.meta.url).pathname;
const read = file => readFileSync(join(src, file), 'utf8');
const files = readdirSync(src, { recursive: true }).map(String);
const css = files.filter(f => f.endsWith('.css'));
const jsx = files.filter(f => /\.[jt]sx?$/.test(f));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

// Motion: every curve comes from the named tokens in workspace.css / motion.js.
for (const file of css) {
  const text = read(file).replace(/@theme[^{]*\{[^}]*\}/g, ''); // tokens are defined once in styles.css @theme
  check(!/cubic-bezier\(/.test(text), `${file}: raw cubic-bezier; use var(--ease-enter|exit|hero)`);
  for (const [rule] of text.matchAll(/(?:animation|transition):[^;}]*\blinear\b[^;}]*/g))
    check(/spin/.test(rule), `${file}: linear motion "${rule}"; only constant rotation may be linear`);
}
for (const file of jsx.filter(f => f !== 'motion.js' && f !== join('lib', 'utils.js')))
  check(!/stiffness|ease:\s*\[|ease-linear|ease-\[/.test(read(file)), `${file}: inline spring/ease; import a preset from motion.js or use ease-enter|exit|hero`);
check(css.some(f => /prefers-reduced-motion/.test(read(f))), 'no prefers-reduced-motion guard');

// Icons: SVG only, no unicode glyphs standing in for icons.
for (const file of jsx) check(!/[↗↑↓←→×ⓘ✳⌘◈]/.test(read(file)), `${file}: unicode glyph icon; use <Icon name=…>`);

// Fit: no card content escapes its card, nothing scrolls, and no text is under 12px, at every size, tab, project and service page.
const browse = process.env.BROWSE || `${homedir()}/.claude/skills/gstack/browse/dist/browse`;
const url = process.env.AUDIT_URL || 'http://127.0.0.1:5173/';
const sizes = ['1920x1080', '1440x900', '1366x768', '1280x650', '1024x700', '768x1024', '390x844', '375x667', '320x568', '844x390', '720x450'];
let fit = 'SKIPPED (browse binary not found)';
if (existsSync(browse)) {
  const b = (...args) => execFileSync(browse, args, { encoding: 'utf8', timeout: 20000 });
  const script = new URL('fit-check.js', import.meta.url).pathname;
  const textScript = new URL('text-check.js', import.meta.url).pathname;
  try {
    for (const size of sizes) {
      b('viewport', size); b('goto', url);
      const measure = label => {
        execFileSync('sleep', ['0.8']);
        const clean = out => out.replace(/-+ (BEGIN|END) UNTRUSTED[^\n]*\n?/g, '').trim();
        const result = clean(b('eval', script));
        check(result === 'ok', `fit ${size} ${label}: ${result}`);
        const text = clean(b('eval', textScript));
        check(text === 'ok', `text ${size} ${label}: ${text}`);
      };
      b('js', 'document.getElementById("work-tab")?.click()');
      for (let n = 1; n <= projects.length; n++) { measure(`work #${n}`); if (n < projects.length) { b('js', 'document.getElementById("next-project")?.click()'); execFileSync('sleep', ['0.4']); } }
      b('js', 'document.getElementById("services-tab")?.click()');
      for (let page = 1; ; page++) {
        measure(`services p${page}`);
        if (b('js', `document.querySelector('[aria-label="Next services"]').disabled`).includes('true')) break;
        b('js', 'document.querySelector("[aria-label=\\"Next services\\"]")?.click()');
      }
      b('js', 'document.getElementById("personal-tab")?.click()'); measure('personal');
      b('js', 'document.getElementById("work-tab")?.click()');
      for (let n = 1; n <= projects.length; n++) {
        b('js', 'document.querySelector(".react-card:not([aria-hidden=true]) .project-info-button")?.click()');
        execFileSync('sleep', ['0.6']);
        measure(`project #${n} notes`);
        b('press', 'Escape');
        execFileSync('sleep', ['0.4']);
        if (n < projects.length) {
          b('js', 'document.getElementById("next-project")?.click()');
          execFileSync('sleep', ['0.5']);
        }
      }
      b('js', 'document.getElementById("services-tab")?.click()');
      for (const [pageClicks, nth, id] of [[0, 1, '01'], [1, 5, '11'], [2, 3, '15']]) { // first card and the two longest
        b('js', 'document.getElementById("services-tab")?.click()'); execFileSync('sleep', ['0.4']);
        const perPage = Number(b('js', 'document.querySelectorAll(".service-grid > .service-tile").length').replace(/\D+/g, ' ').trim().split(' ').pop());
        if (!perPage) continue;
        const index = Number(id) - 1, target = Math.floor(index / perPage);
        for (let k = 0; k < target; k++) b('js', 'document.querySelector("[aria-label=\\"Next services\\"]")?.click()');
        b('js', `document.querySelector(".service-grid > .service-tile:nth-child(${index % perPage + 1})")?.click()`);
        execFileSync('sleep', ['1']);
        measure(`service ${id} card`); b('press', 'Escape'); execFileSync('sleep', ['0.8']);
      }
      if (b('js', 'document.querySelector("#contact-button") !== null').includes('true')) {
        b('js', 'document.querySelector("#contact-button")?.click()'); measure('contact popover'); b('press', 'Escape');
      }
      if (b('js', 'document.querySelector(".status-capsule") !== null').includes('true')) {
        b('js', 'document.querySelector(".status-capsule")?.click()'); measure('studio popover'); b('press', 'Escape');
      }
      b('js', 'document.getElementById("personal-tab")?.click()');
      if (b('js', 'document.querySelector(".bento-collab button") !== null').includes('true')) {
        b('js', 'document.querySelector(".bento-collab button")?.click()'); measure('contact dialog'); b('press', 'Escape');
      }
    }
    fit = 'ran';
  } catch (error) { fit = 'errored'; failures.push(`fit check could not run against ${url}: ${error.message.split('\n')[0]}`); }
}

console.log(`motion + icons: checked ${css.length} css, ${jsx.length} js/jsx files · fit: ${fit}`);
if (failures.length) { console.log(`FAIL (${failures.length})\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log('PASS');
