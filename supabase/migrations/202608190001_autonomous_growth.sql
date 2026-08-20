begin;

create extension if not exists pgcrypto;

create table if not exists public.growth_prospects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_name text not null,
  industry text not null,
  website text,
  public_email text,
  public_phone text,
  city text,
  state text,
  postal_code text,
  service_area text,
  business_hours jsonb not null default '{}'::jsonb,
  timezone text,
  review_count integer not null default 0 check (review_count >= 0),
  rating numeric(2,1) check (rating between 0 and 5),
  fit_score integer not null default 0 check (fit_score between 0 and 100),
  opportunity_score integer not null default 0 check (opportunity_score between 0 and 100),
  stage text not null default 'discovered',
  consent_status text not null default 'unknown',
  suppressed boolean not null default false,
  suppression_reason text,
  last_contact_at timestamptz,
  next_eligible_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, website)
);

create table if not exists public.growth_evidence (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  evidence_type text not null,
  source_url text not null,
  observation text not null,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  outreach_eligible boolean not null default false,
  captured_at timestamptz not null default now()
);

create table if not exists public.growth_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  slug text not null unique,
  status text not null default 'draft',
  findings jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '{}'::jsonb,
  scenario jsonb not null default '{}'::jsonb,
  disclaimer text not null,
  compliance_status text not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.growth_campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text not null,
  industry text,
  market text,
  status text not null default 'draft',
  daily_limit integer not null default 10 check (daily_limit between 0 and 100),
  sending_windows jsonb not null default '{}'::jsonb,
  allowed_claims jsonb not null default '[]'::jsonb,
  prohibited_claims jsonb not null default '[]'::jsonb,
  stop_conditions jsonb not null default '{}'::jsonb,
  kill_switch boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_suppressions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  normalized_destination text not null,
  channel text not null,
  reason text not null,
  source text not null,
  evidence jsonb not null default '{}'::jsonb,
  suppressed_at timestamptz not null default now(),
  unique (tenant_id, normalized_destination, channel)
);

create table if not exists public.growth_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  action_type text not null,
  autonomy_level text not null check (autonomy_level in ('green','yellow','red')),
  summary text not null,
  evidence jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid,
  decision_reason text
);

create table if not exists public.growth_agent_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  agent_id text not null,
  action_type text not null,
  target_type text,
  target_id uuid,
  autonomy_level text not null check (autonomy_level in ('green','yellow','red')),
  input_summary jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) check (confidence between 0 and 1),
  compliance_status text not null,
  approval_status text not null,
  idempotency_key text not null,
  retry_count integer not null default 0,
  outcome text not null,
  error text,
  created_at timestamptz not null default now(),
  unique (tenant_id, idempotency_key)
);

create index if not exists growth_prospects_tenant_stage_idx on public.growth_prospects(tenant_id, stage);
create index if not exists growth_actions_tenant_created_idx on public.growth_agent_actions(tenant_id, created_at desc);
create index if not exists growth_approvals_tenant_status_idx on public.growth_approvals(tenant_id, status);

alter table public.growth_prospects enable row level security;
alter table public.growth_evidence enable row level security;
alter table public.growth_audits enable row level security;
alter table public.growth_campaigns enable row level security;
alter table public.growth_suppressions enable row level security;
alter table public.growth_approvals enable row level security;
alter table public.growth_agent_actions enable row level security;

-- Policies must be bound to the application's tenant membership model before production.
-- Until then, only the server-side service role may access these tables.

commit;
