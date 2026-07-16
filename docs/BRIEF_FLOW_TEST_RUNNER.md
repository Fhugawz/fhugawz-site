# Controlled Brief Flow Test Runner

## Purpose

This local runner validates the technical submission and duplicate-protection flow for controlled Fhugawz Studio test briefs. It uses only Node.js APIs and never accesses Supabase directly.

The runner tests:

- Demo Reconstruction
- Music Production
- Mixing / Mastering

It does not test Artist World-Building or the general contact form.

## Required environment variables

Set the target site and an email address explicitly authorized to receive test notifications. Replace the example email before running either command.

```powershell
$env:BRIEF_TEST_BASE_URL="https://fhugawz.com"
$env:BRIEF_TEST_EMAIL="correo-autorizado@example.com"
```

No email address or secret is stored in the runner.

## Dry run

Generate and safety-check the three payloads without making network requests:

```powershell
npm run test:brief-flow -- --dry-run
```

The dry run prints each payload with the email partially masked and lists the exact test identifiers.

## Real controlled test

Only after reviewing a successful dry run, submit the controlled briefs with:

```powershell
npm run test:brief-flow
```

For each service, the runner validates the original successful response, waits 1.5 seconds, resends the exact same payload, and requires the duplicate-protection response. The duplicate response confirms that no second row was created.

## Scope and follow-up

The runner validates HTTP responses and the endpoint's duplicate-protection contract. It does not inspect, modify, or delete Supabase data; access Gmail; create Notion leads; validate deploy configuration; or prove delivery of notification emails.

Review Supabase and Gmail after the run, then perform cleanup separately. Never use this runner with real client information. Delete only records and emails whose identifiers exactly match the three identifiers printed for that execution.
