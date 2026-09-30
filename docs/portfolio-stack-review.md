# Portfolio technology and presentation review

Reviewed 30 September 2026. Scope: all six live homepages, available local source for Astrodai and Canada Advisory, and the portfolio information panels. This is not a full security audit or a test of purchases, enquiry delivery, or private administration. No forms were submitted and no client sites were modified.

Custom work is an authorship/build-approach statement provided by the owner. Frameworks, themes, CMSs and plugins describe implementation; using them does not negate custom work. Public assets cannot establish how much of an original theme was changed or which changes happened after handover.

## Evidence and accurate stack descriptions

| Project | Build approach | Verified technology | Evidence and limits |
| --- | --- | --- | --- |
| AIM Faucet | Custom WordPress website | WordPress, WooCommerce, BeTheme | Live generator and `/wp-content/themes/betheme/`, WooCommerce assets. Owner confirms custom WordPress work and subsequent SEO/maintenance handover. Current assets do not prove the original delivery used every current plugin. |
| Astrodai | Custom-coded website | Astro, TypeScript, native JavaScript/CSS, Three.js | Local `package.json`, `astro.config.mjs`, `.astro` and `.ts` source; live `/_astro/` assets agree. No React integration in current config. Three.js is imported by `ChartLearning.astro`. |
| Canada Immigration Advisory | Custom-coded website | Next.js, React, TypeScript, Tailwind CSS, Motion, Three.js | Local dependencies, TSX components, Tailwind CSS import, Motion components and `AuroraRibbons.tsx` Three.js import; live Next.js assets agree. |
| Synthesis Capital | Custom-coded website | Next.js, React | Live `/_next/static/` chunks and Next.js response headers. Vercel hosting. No matching source repository located; database, CMS and animation libraries are not established. |
| CosyToys | Custom-coded website | HTML, CSS, native JavaScript | Live DOM and inline application script containing the product catalog and direct DOM/form handling. No frontend framework detected on the inspected homepage; this does not prove the original build tooling. Vercel hosting, FormSubmit enquiry integration. |
| Dream Miles Consultants | Custom WordPress website | WordPress, Elementor, WP Travel Engine, WooCommerce | Generator tags and live plugin assets. Travlia theme, GSAP, ScrollTrigger, Lenis and Swiper assets also present. These are current dependencies, not proof of a proprietary theme or custom-written animation engine. |

### Additional source-confirmed Astrodai functionality

Local code contains libSQL storage, Razorpay and PayPal order/payment integration and webhook routes. This supports a stronger technical case study than a generic brochure site. Presence in source does not establish current production configuration or successful payment settlement. No secrets or database contents were read.

Local evidence:
- `/Users/admin/Documents/astrodai/package.json`
- `/Users/admin/Documents/astrodai/astro.config.mjs`
- `/Users/admin/Documents/astrodai/src/components/ChartLearning.astro`
- `/Users/admin/Documents/astrodai/src/server/store.ts`
- `/Users/admin/Documents/astrodai/src/server/payments.ts`
- `/Users/admin/Documents/Engine/Applications/Canada Immigration Advisory/site/package.json`
- `/Users/admin/Documents/Engine/Applications/Canada Immigration Advisory/site/components/AuroraRibbons.tsx`
- `/Users/admin/Documents/Engine/Applications/Canada Immigration Advisory/site/app/globals.css`

## Findings, in priority order

### High: CosyToys enquiry UI can report success after a failed request

The live inline form handler calls `r.json()` without checking HTTP status or the service's success field, then displays `formDone`. Its catch handler also hides the form and displays the same success state. A network or server failure can therefore look successful. This is established from the delivered client code; actual delivery was not tested. Fix in the CosyToys source: validate response success, preserve entered data, and show a retryable failure message. Only show completion after confirmed acceptance.

### Medium: CosyToys embeds large product images directly in application code

One inline script measures approximately 2.96 million characters and includes base64 JPEG product images. This increases HTML/script transfer and parsing, and prevents those images from being independently lazy-loaded and cached as normal image resources. Move catalog images into compressed external files and load them on demand. This is a client-site improvement, not a portfolio-code change.

### Medium: Dream Miles has content that needs a client-facing review

The public homepage contains generic-looking destination names and the heading “Bookmark in Your Own Way, With Saveday Our Travel Agency.” Verify these against real offerings and replace leftover template text before using the website as a flagship case study. Do not change factual claims such as customer or trip counts without owner evidence.

### Medium: Live embeds have substantial resource cost

Earlier seven-second cold desktop observations transferred about 4.7 MB for AIM, 4.8 MB for CosyToys and 21.2 MB for Synthesis. These are indicative single-run measurements, not controlled performance benchmarks or guaranteed totals. Synthesis is the largest observed candidate for click-to-load on constrained connections. The portfolio currently delays mounting 700 ms and mounts only the selected frame, unmounting on card/tab change. This bounds simultaneous work but does not undo bytes already downloaded.

### Expected limitation: Canada Advisory cannot be framed

Both live headers and `next.config.mjs` set `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN`. Keep the screenshot/new-tab fallback. The portfolio respects this restriction.

### Portfolio accuracy: contribution and dependencies should be separate

Replaced vague “Custom development” stack values with identified technologies and added a separate Build approach field. Retained AIM's handover attribution. Did not claim every plugin was authored by the owner, a custom theme was written from scratch, or unverified commercial results. Build times remain unspecified.

## What remains unverified

- Exact original delivery scope and subsequent changes on the four sites without local source.
- Synthesis backend/CMS and original build tools for CosyToys.
- Production payment and enquiry delivery, conversion rates and business outcomes.
- Full dependency vulnerability status: public version strings and package manifests are insufficient for a complete deployment audit.

## Live sources

- https://www.aimfaucet.com/
- https://astrodai.in/
- https://canada-immigration-advisory.vercel.app/
- https://www.synthesis.capital/
- https://www.cosytoys.in/
- https://dreammilesconsultants.com/
