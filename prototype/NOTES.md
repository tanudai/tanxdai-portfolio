# Folder portfolio — throwaway exploration

Question: which folder interaction should become the entire portfolio?

Run from the repository root: `python3 -m http.server 4173`
Open http://localhost:4173/prototype/?variant=A

- A: stacked archive, staggered tabs, inline unfolding project preview.
- B: compact folder list and persistent desktop preview; inline expansion on mobile.
- C: desktop folder tiles that expand into a full-width project.

Eight fictional projects demonstrate overflow and natural page scrolling. Website previews are illustrative compositions, not live websites. About content is a placeholder. Click folder tabs (or focus with Tab and activate with Enter/Space). Bottom arrows or keyboard Left/Right change direction. Reduced motion is respected.

Decision: awaiting user comparison. Keep the selected structure and rebuild it with real projects; remove this prototype and its exploration controls before production.

## Second round — compact dimensional stack
Open http://localhost:4173/prototype/motion.html?variant=A
A: spring stack; B: floating project window (inline on phone); C: tilted dimensional stack.
All three include work, about, experience, and contact within the folder system. Personal content is explicitly placeholder. User direction: prefer A's archive structure, compact presentation, dimensional motion, and everything opening within the same world.
Verified: JavaScript syntax; opening folders across all three variants; 390px A and 1280px B/C horizontal overflow checks. Selection remains pending.

## Chosen direction — refined folder showcase
The user selected the dimensional horizontal collection and authorized the minimal redesign. `motion.html` now serves the single refined interface using `showcase.css` and `showcase.js`; comparison controls are removed. Previous standalone explorations remain in their existing files as reference.

Compact header, quiet neutral workspace, horizontal tabs, cover previews, unfolding project details, and persistent About/Contact access. Mobile uses swipeable folders and downward expansion with normal page scrolling. Data and website previews remain illustrative.

Verified in browser: desktop 1280px, tablet 768px, phone 390px; no page horizontal overflow; project open/close; contact file accessible; mobile content height equals its scroll height (no nested scroll area). Reduced-motion CSS and keyboard controls provided.

## Tiled personal space
User requested a new tiled direction from four visual references: dark instrument-like tiles, layered translucent cards, an expanding top information widget, and glass contact controls. User explicitly requested sample weather/contact details for now.
`motion.html` now uses `tiles.css` and `tiles.js`. Ten tiles, project dialogs, Everything/Work/Personal filters, an expandable local date/calendar and day-progress panel, labeled sample weather, and a floating contact menu. Contact form saves a local text draft; it does not send messages. No live weather integration or real recipient configured.
Verified desktop and 390px mobile render without horizontal page overflow; project and contact dialogs open/close; Personal filter returns two tiles; weather tab and contact menu operate.

## 3D tab performance pass
Replaced per-card backdrop blur with layered gradients; removed animated margins/background/shadows; tab spacing now uses compositor-friendly translate. Removed the queued 800ms scroll timeout in favor of a cancellable animation frame. Retained 3D transforms and reduced-motion handling.
Same local headless-browser 1.8-second rapid-navigation check: before 50 frames / 17 intervals over 34ms / maximum 117ms; after 109 frames / 0 intervals over 34ms / maximum 18ms. These are local observations, not a device-wide guarantee. Verified one selected tab, no page overflow, mobile inline opening, and Personal filtering.

## Video-led vertical collection
User supplied a local Pinterest MP4 and requested downward browsing with project name, time taken, goal, and separate top tabs for personal content. Inspected a contact sheet of video frames: dark background, muted luminous header, curved tabs, bold condensed titles, and vertically stacked poster imagery.
Replaced the active entry with `reel.css` / `reel.js`: vertical projects, layered posters, sticky top navigation, desktop side-by-side information/preview, phone stacked layout, project notes, and Personal content. Previous folder code remains as historical prototype files. Build times, goals, previews, and contact are samples. Verified eight projects, desktop/390px layouts, no phone horizontal overflow, notes, top tabs, scroll restoration, contact dialog.

## Single vertical swipe deck
Corrected the vertical list to a TikTok-style single-card deck at the user's request. `swipe.js` / `swipe.css` adapt the poster content to a fixed active slide with animated vertical transitions. Supports touch/pointer dragging, wheel, keyboard arrows/PageUp/PageDown/Space/Home/End, and previous/next arrows beneath the card. Inactive slides are inert and hidden from accessibility APIs. Replaced sage/earth tones with near-black, cool blue, lavender, and silver. Personal tab remains separate and retains the active project.
Verified arrow, keyboard, wheel progression 01→02→03→04; swipe completion logic; single active slide; desktop controls fit 900px viewport; mobile controls fit 844px viewport; no horizontal overflow; personal-tab round trip preserves position. Artwork and project timings remain samples.

## React + Motion migration
User explicitly requested React with Motion. Active entry points `/` and `/prototype/motion.html` now mount the React app in `src/`. Vite handles development and production builds. The deck uses `motion.div` dragging, a shared `useMotionValue` for the entire track, and Motion spring settling; legacy imperative prototype scripts are no longer loaded. Work/Personal selection and contact dialog are React-managed. Original CSS is retained in src/base.css and src/deck.css with Motion-specific overrides in src/react.css.
Validation: production build; real Playwright mouse drag and CDP touch swipe; arrows, keyboard, selection persistence, first/last boundaries, mobile overflow, contact open/Escape, reduced-motion mode, no browser page errors. Real project imagery/content remains pending.

## Verified live GitHub projects
Used authenticated GitHub account tanudai. Checked owned repository homepages, public project README links, and remaining repository deployment records. Added only functional public websites: Astrodai (astrodai.in), Canada Immigration Advisory, and the Self-Knowledge Vault landing page. Excluded Svelte portfolio (directory listing) and Astro portfolio (coming-soon page). No other deployment URLs were found in remaining repository deployment metadata. Private source content is not included.
Replaced sample project data and artwork with live URLs and six optimized desktop/mobile WebP screenshots. Build durations are explicitly unspecified; goals summarize the public sites. Count is dynamic. Verified screenshots load, responsive image selection, navigation, and actual new-tab link opening; production build passes.
