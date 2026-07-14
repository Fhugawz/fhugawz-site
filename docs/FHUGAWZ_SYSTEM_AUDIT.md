# FHUGAWZ System Audit — Preliminary

Date: 2026-07-14
Branch: `feature/fhugawz-studio-foundation`
Scope: repository, Netlify functions, Supabase, Notion and Scorecard foundation. Cases studies and editorial publishing are excluded from this phase.

## Confirmed architecture

- Framework: Astro 7.
- Runtime requirement: Node >= 22.12.0.
- Hosting/deploy: Netlify.
- Database: Supabase project `fhugawz-web`.
- Email delivery: Resend through Netlify Functions.
- Public site URL: https://fhugawz.com.

## Existing operational features

- Contact form frontend at `src/pages/contact.astro`.
- Contact endpoint at `netlify/functions/contact.js`.
- Project brief endpoint at `netlify/functions/brief.js`.
- Contact messages persist to Supabase table `contact_messages`.
- Project briefs persist to Supabase table `lead_briefs`.
- Resend notifications are already implemented through environment variables.
- Basic anti-spam checks, length limits, HTML escaping and honeypot fields are present.
- GA4 event tracking is invoked on successful contact submission.

## Preliminary findings

### High priority

1. The public contact page still contains obsolete fallback copy: `Message ready. Email connection will be added soon.` The actual JavaScript submits to the Netlify function, so the copy should be updated after a successful end-to-end preview test.
2. `lead_briefs` has RLS enabled but no policies. Current server-side inserts use the service role key, so submissions can work, but the database configuration needs documentation and a deliberate policy decision.
3. There are no recorded Supabase migrations. Database state is therefore not reproducible from the repository.
4. The repository README is still the default Astro starter README and does not document the real project, environment variables, deployment flow or recovery steps.
5. No lint, type-check or automated test scripts are defined in `package.json`; only build and preview commands are present.

### Medium priority

1. Duplicate indexes exist on `blog_likes` and `blog_subscribers` according to Supabase advisors.
2. `lead_briefs` indexes are currently unused; do not remove them yet because traffic is minimal and the tables are new.
3. `netlify.toml` has a sensible baseline security policy, but CSP and external integrations should be retested when the Scorecard is introduced.
4. The current repository is large; local inventory must identify whether heavy media files or private source assets are tracked unnecessarily.

## Security review completed so far

- `.env`, `.env.local` and `.env.production` are ignored.
- No obvious API key literals were found through repository code search for common Supabase, Resend, Google and generic secret patterns.
- Environment variable names are referenced server-side rather than hard-coded values.
- A full historical secret scan still must run locally across all commits.
- The local `FHUGAWZ_HUB` and book library must remain outside Git unless explicitly whitelisted.

## Supabase state

Tables confirmed:

- `blog_subscribers` — RLS enabled.
- `blog_likes` — RLS enabled.
- `contact_messages` — RLS enabled; existing rows confirm prior submissions.
- `lead_briefs` — RLS enabled; no policies reported by the advisor.

## Approved phase boundaries

Included:

- Repository and local inventory.
- Historical secret scan.
- Foundation branch.
- Contact form end-to-end verification.
- Netlify Deploy Preview.
- Internal operating structure in Notion.
- Separate Scorecard project design.

Excluded:

- Production deployment without approval.
- Broad redesign of the public website.
- Studio Ops application.
- Case studies.
- New blog posts and editorial calendar.
- Automated publishing or sales.

## Local audit tasks for Codex in VS Code

1. Confirm repository root and nested `FHUGAWZ_HUB` path.
2. Run `git status`, inspect remotes and verify the active branch.
3. Inventory files by category, size and extension without moving or deleting anything.
4. Confirm that books, source design files, exports and private assets are not tracked by Git.
5. Run a historical secret scan across all commits using an available local scanner or conservative regex checks.
6. Run `npm ci` and `npm run build`.
7. Run `npx astro check` if compatible; document any new dependency requirement before installing it.
8. Verify Netlify function paths and environment variable names without printing secret values.
9. Test the contact flow locally or in a Deploy Preview with a dedicated test submission.
10. Append findings, commands and results to this document.

## Next implementation sequence

1. Complete local inventory and historical security scan.
2. Fix documentation and obsolete contact status copy in this branch.
3. Confirm Netlify environment variables by name and scope.
4. Generate a Deploy Preview and perform one controlled test submission.
5. Verify Supabase row creation and Resend delivery.
6. Document a migration baseline without changing production schema.
7. Finalize the Scorecard product brief and select its isolated hosting structure.
