# Tanxdai portfolio

React + Motion portfolio prototype, built with Vite.

- `npm install`
- `npm run dev -- --port 5173`
- `npm run build`
- `npm run preview`
- `npm run audit` (motion, icon and screen-fit gate; start the dev server first)

Open `/` or `/prototype/motion.html`. Both routes render the React app.

The vertical project deck supports Motion-powered pointer/touch dragging and spring settling, keyboard navigation, wheel navigation, and buttons. Reduced motion is respected. Work and Personal tabs preserve the selected project. Project data is in `src/projects.js`. Six live projects use real desktop/mobile screenshots. Projects use local responsive screenshots only; no client website is embedded or loaded in the background. The preview and Visit website action open the live site in a new tab. Project info dialogs include goals, contribution, stack, and build time; unconfirmed details remain labeled. Build times are unspecified; contact details remain placeholders.

Older explorations in `prototype/` are retained for reference and are not loaded by the React app.
