# Fhugawz Design Quality Rules

These rules are local guidance for design and UI work on the Fhugawz site. They are intentionally prompt/document based: do not install third-party skills, hooks, CLIs, browser runners, or generated scripts unless the user explicitly approves that setup.

## Design Direction

- Treat Fhugawz as a dark experimental music and visual-world project: cinematic, intimate, industrial, atmospheric, and artist-led.
- Prefer usable pages and real content over marketing filler or generic landing-page patterns.
- Keep the visual tone mature. Avoid childish handwritten styling, generic SaaS polish, decorative gradient blobs, and stock-looking imagery.
- Use existing site patterns first: current components, typography variables, color tokens, spacing rhythm, Astro conventions, and bilingual content structure.
- Preserve the first-viewport identity of the page. On branded or object-focused pages, the artist/project/resource should be obvious immediately.

## Layout

- Use stable layout systems: CSS grid, flexbox, container constraints, aspect ratios, and explicit min/max widths.
- Avoid negative margins and absolute positioning for major content layout unless the existing component already depends on it and it has been tested.
- Set `min-width: 0` on grid/flex children that contain long text.
- Test long Spanish strings, not only English. Spanish headings and buttons often require more width or earlier stacking.
- Do not nest cards inside cards. Use cards for repeated items, modals, or framed tools, not for every page section.
- Keep operational sections compact and scannable. Avoid oversized hero typography inside dense cards, sidebars, or tool surfaces.

## Typography

- Match type scale to context: hero titles can be large; section, card, filter, and control labels should be controlled and readable.
- Do not use viewport-only type scaling that causes unpredictable wrapping. Prefer `clamp()` with sensible min/max values.
- Keep letter spacing at `0` or a mild negative value only where the design already uses it intentionally and it has been checked across languages.
- Use mature quote styling for internal project pages: mono or body font, cinematic spacing, and controlled line-height.

## Copy And Internationalization

- Use `Fhugawz` in normal copy, descriptions, footers, and metadata. Reserve `FHUGAWZ` for intentional logo/display marks.
- Prefer natural Spanish over literal translation.
- Avoid unnecessary hyphens in visible copy when a normal space reads naturally, for example `AI assisted`, `sound based`, `world building`, and `post industrial`.
- Check every bilingual page in both language states before considering the task finished.

## Color, Media, And Atmosphere

- Avoid one-note palettes dominated by a single hue family. Dark can still include contrast, warmth, and material variation.
- Use real or generated bitmap media when the page needs visual atmosphere or product/resource recognition.
- Social preview images should use meaningful public assets, not textures or abstract placeholders.
- Do not blur, crop, or darken primary media so heavily that the user cannot inspect the subject.

## Interaction And Controls

- Buttons should express clear actions. Icon buttons should use familiar symbols and tooltips where needed.
- Resource and product cards should expose one obvious primary action unless a secondary action is truly useful.
- Filters, language switches, nav links, and article cards must work in English and Spanish.
- Avoid hidden or visually broken text states on hover, focus, active, loading, and small screens.

## Accessibility And Performance

- Maintain semantic heading order where possible.
- Preserve keyboard access and visible focus for interactive elements.
- Use descriptive image alt text for content images and social metadata.
- Keep images sized and optimized for their purpose.
- Run `npm run build` before deploy-oriented work. For local visual QA, use the Astro background dev server workflow from `AGENTS.md`.

## Safe Use Of External Design Skills

- Treat external design skills as reference material until reviewed.
- Prefer copying distilled, repo-specific guidance into `docs/` over installing untrusted executable code.
- Do not run `npx`, global installs, plugin installs, setup scripts, hooks, browser automation runners, or video export scripts without explicit user approval.
- If a third-party skill includes useful prompts plus executable tooling, extract only the prompt-level ideas into local docs.
