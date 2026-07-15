# Artist Identity & Release Readiness Scorecard — Product Spec

Version: 0.1  
Status: Functional specification complete; front-end prototype not started  
Branch: `feature/artist-readiness-scorecard`  
Planned route: `/scorecard`  
Public navigation: disabled until approval

## Objective

Create a free bilingual diagnostic for independent artists that measures how prepared their artistic identity and release system are. The MVP must deliver useful results without requiring email, Supabase, Resend, accounts, or payment.

## Audience

- Independent artists in early or intermediate stages.
- Projects with partially developed music, aesthetics, or narrative.
- Artists whose elements exist but do not yet form a coherent system.
- Artists preparing a release without knowing what is truly ready.
- Artists using AI as support who still need human direction and judgment.

## Value proposition

In approximately 5–8 minutes, the user receives:

- A total readiness score from 0 to 80.
- A score for five categories.
- Strongest area.
- Weakest area.
- A short diagnosis.
- Three priority next steps.
- A recommended resource or service.

## Categories

1. Artist Identity.
2. Sonic Direction.
3. Visual & Narrative World.
4. Release Preparation.
5. Audience & Content System.

Each category contains four questions and scores from 0 to 16.

## Answer scale

- 0 — Not started.
- 1 — Early idea.
- 2 — Partially defined.
- 3 — Mostly clear.
- 4 — Fully defined.

## Questions

### Artist Identity

1. I can explain in one clear sentence who I am as an artist and what makes my project distinct.
2. I have defined the themes, emotions, or conflicts that repeatedly appear in my work.
3. I know what kind of experience I want someone to feel when discovering my project.
4. My creative decisions come from my own identity, not only from imitating references.

### Sonic Direction

1. I can describe my sonic direction without relying only on the names of other artists.
2. I have a recognizable palette of genres, textures, instruments, production choices, or atmospheres.
3. My recent songs or demos feel as if they belong to the same universe, even when they vary.
4. I know which musical elements should remain constant and which may change between releases.

### Visual & Narrative World

1. I have a defined visual direction for color, typography, imagery, texture, and composition.
2. My covers, profiles, images, and visual assets communicate a coherent feeling.
3. Symbols, stories, characters, places, or concepts expand the meaning of my music.
4. I can translate the emotional world of a song into concrete visual and narrative decisions.

### Release Preparation

1. I have defined my next release and the role it plays within my project.
2. The song, artwork, credits, metadata, and required files each have a clear status.
3. I have a realistic date or release window and a schedule for actions before and after release.
4. I know what must happen before publishing and what indicators I will review afterward.

### Audience & Content System

1. I know the kind of person I want to connect with and why my project may matter to them.
2. I have content themes or pillars related to my identity, not only promotional posts.
3. I can turn a song, concept, or process into several useful content pieces.
4. I have a sustainable system to create, review, publish, and measure content without relying on daily inspiration.

## Calculation

- Each answer is worth 0–4 points.
- Each category scores 0–16.
- Total score is 0–80.
- No weighting in the MVP.
- Ties show all tied areas as strengths or priorities.

## Result ranges

### 0–20 — Fragmented Foundation

Ideas and materials exist, but they do not yet form a usable identity or release system.

Priority: define foundation, intention, and direction before increasing production or promotion.

### 21–40 — Emerging Direction

The identity is beginning to form, but several decisions remain scattered or depend too much on external references.

Priority: document the direction and connect sound, image, narrative, and release.

### 41–60 — Defined but Disconnected

Most components exist, but they do not yet work as a consistent and repeatable system.

Priority: close gaps between areas and turn creative decisions into processes.

### 61–80 — Release-Ready System

A solid and coherent direction exists and is sufficiently prepared to support an intentional release.

Priority: execute, measure, and improve without losing coherence.

## Result screen

Display:

- Total score and readiness percentage.
- Result level.
- One-paragraph diagnosis.
- Five category scores.
- Strongest area or tied areas.
- Weakest area or tied areas.
- Three next actions derived from weak categories.
- One contextual CTA.
- Restart button.

## Recommendation logic

- Weak Artist Identity → identity foundation exercise and Artist World Building.
- Weak Sonic Direction → sonic identity map and production direction.
- Weak Visual & Narrative World → world-building canvas and visual direction.
- Weak Release Preparation → release checklist and future Artist Release OS.
- Weak Audience & Content System → content pillars and release-content system.

The first CTA must remain useful and educational, not an aggressive sales pitch.

## MVP flow

1. Intro screen.
2. Language selection or existing site-language detection.
3. Five category sections.
4. Twenty questions.
5. Progress indicator.
6. Local score calculation.
7. Results screen.
8. Optional CTA.
9. Restart option.

## Bilingual requirements

- Full English and Spanish parity.
- No mixed-language screens.
- Language changes preserve answers and progress.
- Spanish copy must be natural, not literal machine translation.

## Front-end MVP scope

Include:

- Isolated `/scorecard` route.
- Responsive layout.
- Keyboard-accessible controls.
- Visible focus states.
- Local state only.
- Previous and next navigation.
- Incomplete-answer validation.
- Progress bar.
- Score and diagnosis.
- Site visual identity without changing public navigation.
- Deploy Preview validation.

Exclude initially:

- Supabase writes.
- Resend emails.
- Email capture.
- PDF generation.
- Accounts or authentication.
- Payment.
- AI-generated diagnosis.
- Public navigation link.
- Production deploy.

## Future data architecture

Possible `scorecard_results` fields:

- id
- created_at
- language
- email
- consent
- total_score
- result_level
- artist_identity_score
- sonic_direction_score
- visual_narrative_score
- release_preparation_score
- audience_content_score
- strongest_categories
- weakest_categories
- answers_json
- source
- utm_source
- utm_medium
- utm_campaign

No database migration is authorized during the front-end prototype phase.

## Future email flow

After explicit consent:

1. Store the result.
2. Send the diagnosis.
3. Include category scores.
4. Include three next steps.
5. Link to the recommended resource.
6. Optionally begin a short educational sequence.

No marketing subscription may be inferred from requesting the result.

## Analytics plan

Planned events:

- `scorecard_viewed`
- `scorecard_started`
- `scorecard_category_completed`
- `scorecard_completed`
- `scorecard_result_viewed`
- `scorecard_cta_clicked`
- `scorecard_restarted`

Do not send raw answers or personal information to analytics.

## Privacy and security

- Collect no personal data in the front-end prototype.
- Do not expose service-role keys in browser code.
- Use server-side functions for future writes.
- Validate all future server payloads.
- Require explicit consent before email storage.
- Provide privacy notice before future collection.
- Do not present the result as medical, psychological, legal, or financial advice.

## Acceptance criteria

The prototype is acceptable when:

- All 20 questions work in English and Spanish.
- Answers persist while moving backward and forward.
- Language switching preserves progress.
- Score calculation is correct.
- Category totals are correct.
- Ties are handled correctly.
- Result range is correct at boundaries 0, 20, 21, 40, 41, 60, 61, and 80.
- Incomplete completion is prevented.
- Mobile and desktop layouts are usable.
- Keyboard interaction and focus states work.
- Build passes.
- No existing route changes unexpectedly.
- No public navigation link is added.
- No production deploy occurs without approval.

## Verification record

- Notion source: `Content & Products → Artist Identity & Release Readiness Scorecard — Product Spec`.
- Git branch: `feature/artist-readiness-scorecard`.
- This file is the versioned implementation source of truth for Codex.
