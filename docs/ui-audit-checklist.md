# UI Audit Checklist

Use this checklist for local Fhugawz visual QA. It is intentionally tool-agnostic and does not require installing third-party skills.

## Preflight

- Read the relevant Astro page, layout, component, and content files before editing.
- Confirm whether the task is design, copy, metadata, routing, content, or deploy-related.
- Preserve unrelated local changes.
- Do not deploy unless the user explicitly asks.

## Local Build And Server

- For deploy-oriented changes, run `npm run build`.
- For visual checks, start the dev server with `astro dev --background`.
- Manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`.
- If a browser automation tool is already available in the environment, use it for screenshots and interaction checks. Do not install Playwright or third-party browser skills without approval.

## Responsive Viewports

Check each affected page at minimum:

- Desktop: wide viewport around `1440px`.
- Tablet: around `768px` to `1024px`.
- Mobile: around `375px` to `430px`.

Verify:

- No overlapping headings, cards, buttons, media, or nav elements.
- No clipped text, hidden labels, or broken line breaks.
- Cards and buttons fit their content without large accidental empty space.
- Grids stack at the intended breakpoint.
- Spanish copy remains readable and does not invade adjacent columns.

## Bilingual QA

For affected pages, check English and Spanish:

- Navigation labels.
- Hero copy and calls to action.
- Section micro-labels, titles, descriptions, card titles, and buttons.
- Blog categories and filters.
- Article titles, slugs, previews, and metadata.
- Footer and normal body copy brand casing.

## Page-Specific Checks

### Home

- Hero image, title, description, and primary calls to action are correct.
- Resource preview, latest blog previews, and project/service sections align with the current content model.
- Social sharing metadata uses the intended default image.

### Resources

- Split-section left titles cannot overlap right cards.
- Resource cards have clear primary actions and no obsolete small text links.
- Free and premium resource buttons point to the correct external URLs.
- Latest posts and resource previews use current titles/categories.

### Blog

- Category filters work in English and Spanish.
- Cards show correct title, category, excerpt, and URL.
- Article pages use correct hero title wrapping, metadata, and language content.

### Internal Project Pages

- Quote typography feels mature, cinematic, and consistent with the brand.
- Project media, internal links, and calls to action remain intact.

## Visual Quality Pass

- Scan for generic or mismatched UI patterns.
- Confirm hierarchy: the most important content is visually dominant, and secondary content is quiet.
- Check spacing consistency between sections, cards, and controls.
- Verify imagery supports the actual music/resource/project rather than acting as abstract decoration.
- Confirm button states, hover states, and focus states are legible.

## Final Report

When finished, report:

- Files changed.
- Checks run.
- Any checks not run and why.
- Remaining TODOs or risks.
