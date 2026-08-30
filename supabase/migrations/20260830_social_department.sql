create extension if not exists pgcrypto;

create table if not exists social_brand_brains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  business_name text not null,
  website text,
  voice jsonb not null default '[]'::jsonb,
  audiences jsonb not null default '[]'::jsonb,
  offers jsonb not null default '[]'::jsonb,
  calls_to_action jsonb not null default '[]'::jsonb,
  prohibited_claims jsonb not null default '[]'::jsonb,
  service_areas jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  operating_mode text not null default 'hybrid' check (operating_mode in ('autopilot','approval','hybrid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id)
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  platform text not null,
  external_account_id text,
  display_name text,
  connection_status text not null default 'disconnected',
  permissions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name text not null,
  objective text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft',
  strategy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists social_content_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  campaign_id uuid references social_campaigns(id) on delete set null,
  platform text not null,
  title text not null,
  body text not null default '',
  call_to_action text,
  media jsonb not null default '[]'::jsonb,
  status text not null default 'idea' check (status in ('idea','drafting','review','approved','scheduled','published','failed')),
  scheduled_for timestamptz,
  published_at timestamptz,
  external_post_id text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  platform text not null,
  external_thread_id text,
  classification text not null default 'human_review',
  lead_score integer check (lead_score between 0 and 100),
  requires_human boolean not null default false,
  contact jsonb not null default '{}'::jsonb,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_agent_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  agent text not null,
  objective text not null,
  priority text not null default 'normal',
  status text not null default 'queued',
  human_approval_required boolean not null default false,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists social_metrics_daily (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  platform text not null,
  metric_date date not null,
  impressions integer not null default 0,
  engagements integer not null default 0,
  conversations integer not null default 0,
  qualified_leads integer not null default 0,
  appointments integer not null default 0,
  attributed_revenue numeric(12,2) not null default 0,
  influenced_pipeline numeric(12,2) not null default 0,
  raw jsonb not null default '{}'::jsonb,
  unique(organization_id, platform, metric_date)
);

create index if not exists idx_social_content_org_status on social_content_items(organization_id,status);
create index if not exists idx_social_content_schedule on social_content_items(scheduled_for) where status='scheduled';
create index if not exists idx_social_conversations_org on social_conversations(organization_id,last_message_at desc);
create index if not exists idx_social_assignments_org_status on social_agent_assignments(organization_id,status);
create index if not exists idx_social_metrics_org_date on social_metrics_daily(organization_id,metric_date desc);

comment on table social_brand_brains is 'Persistent brand rules, goals and operating mode used by Social Department agents.';
comment on table social_agent_assignments is 'Auditable work queue for the autonomous Social Department.';
