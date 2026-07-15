create table if not exists public.scorecard_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  language text not null default 'en' check (language in ('en','es')),
  total_score integer not null check (total_score between 0 and 80),
  result_level text not null check (result_level in ('fragmented','emerging','disconnected','ready')),
  artist_identity_score integer not null check (artist_identity_score between 0 and 16),
  sonic_direction_score integer not null check (sonic_direction_score between 0 and 16),
  visual_narrative_score integer not null check (visual_narrative_score between 0 and 16),
  release_preparation_score integer not null check (release_preparation_score between 0 and 16),
  audience_content_score integer not null check (audience_content_score between 0 and 16),
  strongest_categories text[] not null default '{}',
  weakest_categories text[] not null default '{}',
  answers_json jsonb not null default '{}'::jsonb,
  marketing_consent boolean not null default false,
  status text not null default 'new',
  source text not null default 'scorecard',
  user_agent text,
  submission_token text not null unique
);

alter table public.scorecard_results enable row level security;
create index if not exists scorecard_results_created_at_idx on public.scorecard_results(created_at desc);
create index if not exists scorecard_results_email_idx on public.scorecard_results(email);
