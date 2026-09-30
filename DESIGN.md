# Tanxdai design system

## Product context
A developer portfolio for prospective clients. Three views—Work, Services, Personal—share one viewport-sized application frame. Projects and services paginate; the page itself does not scroll. Dialog content can scroll when text enlargement or a short viewport requires it.

## Direction
Restrained black application UI with a personal bento composition. The supplied Personal reference and the owner's explicit black/no-scroll preferences are the source of truth. Retain DM Sans rather than introducing another font. Real project screenshots provide color and identity. No fabricated availability, social accounts, booking confirmations, or results.

## Consultation
The current design's weak point is small mobile text, not a shortage of components. Prioritize work previews and readable explanations. Maintain predictable tabs and explicit controls. Creative choices already requested: a one-screen portfolio instead of a conventional long page, and a playful Personal bento inside a restrained shell. Their costs are pagination and constrained space; handle that through fewer visible items, not progressively smaller body copy.

## Typography
DM Sans for headings, body and UI; sans-serif fallback. Headings 24–36px, service titles 19–26px, body 14–16px, UI labels 12–14px. Tiny decorative demo labels are not substitutes for readable explanations. Numbers use tabular figures. Retain existing font delivery until separately optimizing assets.

## Palette
Canvas #000; panel #101010; card #191919; elevated #242424; border #333; text #f3f3f3; secondary #aaa. Mint #b7efcf only for primary actions/live status. White primary action is allowed in the Personal composition to match its reference. No blue tint, glowing background, or decorative gradient.

## Layout and space
4px base; 8/12/16/24/32px spacing. Hierarchical radii: 8px controls, 14–16px cards, 20px overlays, pill only for capsules. Desktop project preview plus a compact details column. Mobile uses its own portrait screenshot. Services use six tiles on desktop, four on larger phones, two on short phones. Personal retains the supplied bento proportions.

## Motion
Short opacity transitions; spring only for spatial transitions and card expansion. No continuous decorative loops. Reduced-motion disables decorative movement. No live iframe loading. Previews are local WebP images with explicit external links.

## Interaction and accessibility
Native buttons, native modal focus containment, labeled controls, visible focus, keyboard tab navigation. Target 44px actions. Content must remain reachable with enlarged text; permit internal modal overflow rather than clipping. Never show fake success for unavailable contact actions.

## Decisions log
- Owner-selected: black palette, application shell, no page scrolling, service tiles, personal bento, local screenshots.
- Consultation recommendation: give client work visual priority; remove low-information copy and preserve mobile readability.
- Owner-confirmed emphasis: the interactive app experience, with playful motion. Express this through tile lift, service-page transitions, connected tabs, and Personal card entrance; keep the black palette and avoid persistent decorative loops.
