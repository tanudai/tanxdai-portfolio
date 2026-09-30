# Tanxdai design system

## The one hard rule (owner)
A tab-based application. **Nothing ever scrolls**: not the page, not a panel, not a dialog. Every portfolio view follows this. When space runs out, paginate or show fewer items; never add scrolling and never shrink body text to squeeze content in.

Everything else below is current direction, not a constraint the owner set, and can change.

## Product context
A developer portfolio for prospective clients. Three tabs (Work, Services, Personal) share one viewport-sized application frame. Projects and services paginate.

## Direction
Feels like opening a premium application: every component animates with precision. Black canvas, DM Sans, real project screenshots supply colour. Effect level (owner, 2026-10-01): precise micro-interactions everywhere plus a few signature effects, each used in one place: a light trail round the active project frame, word-by-word text reveals, a cursor spotlight on cards.

## Honesty toward visitors
No fabricated availability, clients, results, social accounts or booking confirmations. Example content (such as the enquiry walkthroughs) is labelled as an example. Never show fake success for contact actions that are not wired up.

## Typography
DM Sans for headings, body and UI. Numbers use tabular figures. Body text stays readable on phones; drop items before shrinking copy.

## Palette
Canvas #000; panel #101010; card #191919; elevated #242424; border #333; text #f3f3f3; secondary #aaa; mint #b7efcf for primary actions and live status.

## Motion
Every curve and spring is a named preset in `src/motion.js` (ease enter/exit/hero, springs deck/ui/sheet/page), mirrored as `--ease-*`/`--dur-*` tokens in CSS. Exits run faster than entrances. Continuous effects run only on the visible, active element. Reduced motion shows final states without movement. Previews are local WebP screenshots with explicit links to the live sites.

## Interaction and accessibility
Native dialog, popover and tablist behaviour (Escape, focus return, keyboard tabs). Labelled controls, visible focus, 44px targets. Icons are SVG (`src/Icons.jsx`), never unicode glyphs.

## Quality gate
`npm run audit` (dev server running) checks motion presets, icons, that no card content escapes its card, and that nothing scrolls, across 11 viewport sizes, every project and every service page. Run it before shipping.

## Decisions log
- Owner: black application shell, tabs, no scrolling anywhere, service tiles, personal bento, local screenshots.
- 2026-10-01: Applied the video-knowledge method (named motion presets, one transition language, audit gate). Owner clarified the no-scroll tab rule is their only hard rule; earlier bans on glows, gradients and loops were removed. Chosen: precision plus signature effects; enquiry walkthrough demos now, a real AI enquiry assistant later.
- 2026-09-30: Service tiles explain each service as a three-step flow (input, what we do, outcome) using Phosphor duotone icons (MIT) in glass tiles; mint only on the outcome. Earlier tries with coloured and recoloured 3D emoji were dropped as off-theme. Text on tabs and cards follows one scale in `src/readability.css` (12/13/14px floors, text contrast 4.5:1 or better). Work cards show a factual "Delivered" line from `buildType`; an optional `result` field renders only when the owner supplies a real outcome.
