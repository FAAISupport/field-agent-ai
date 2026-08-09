create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  first_name text,
  last_name text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customers_tenant_phone_idx on customers (tenant_id, phone);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid,
  first_name text,
  last_name text,
  phone text not null,
  email text,
  company_name text,
  service text,
  service_category text,
  description text,
  status text not null default 'new',
  urgency text not null default 'normal',
  lead_temperature text,
  source text not null default 'ai_receptionist',
  channel text not null default 'voice',
  street text,
  city text,
  state text,
  postal_code text,
  preferred_date text,
  preferred_time text,
  qualification jsonb not null default '{}'::jsonb,
  service_area_verified boolean,
  last_call_id text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_contact_at timestamptz,
  converted_at timestamptz
);
create index if not exists leads_tenant_phone_idx on leads (tenant_id, phone);
create index if not exists leads_tenant_status_idx on leads (tenant_id, status);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  lead_id uuid not null,
  note text not null,
  source text,
  agent_id text,
  call_id text,
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_tenant_lead_idx on lead_notes (tenant_id, lead_id);

create table if not exists service_areas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text not null,
  state text,
  city text,
  postal_code text,
  service text,
  booking_allowed boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists service_areas_tenant_idx on service_areas (tenant_id, active);

create table if not exists appointment_slots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  service text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists appointment_slots_tenant_time_idx on appointment_slots (tenant_id, starts_at);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  lead_id uuid not null,
  slot_id uuid,
  appointment_type text not null default 'estimate',
  service text,
  notes text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists appointments_tenant_lead_idx on appointments (tenant_id, lead_id);
create unique index if not exists appointments_slot_unique_idx on appointments (slot_id) where slot_id is not null;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  lead_id uuid,
  channel text not null,
  direction text not null,
  phone text,
  message_type text,
  body text not null,
  provider text,
  provider_id text,
  status text,
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists messages_tenant_lead_idx on messages (tenant_id, lead_id);

create table if not exists escalations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  lead_id uuid not null,
  reason text not null,
  priority text not null default 'normal',
  requested_action text not null default 'human_callback',
  caller_waiting boolean not null default false,
  status text not null default 'queued',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists escalations_tenant_lead_idx on escalations (tenant_id, lead_id);

create table if not exists ai_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  integration text not null,
  agent_id text not null,
  endpoint text not null,
  action text not null,
  lead_id uuid,
  request_id text,
  success boolean not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists ai_audit_log_tenant_created_idx on ai_audit_log (tenant_id, created_at desc);

alter table customers enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table service_areas enable row level security;
alter table appointment_slots enable row level security;
alter table appointments enable row level security;
alter table messages enable row level security;
alter table escalations enable row level security;
alter table ai_audit_log enable row level security;

-- The server-side AI routes use SUPABASE_SERVICE_ROLE_KEY and always apply tenant_id filters.
-- Do not expose the service-role key to browsers, Retell, or client-side JavaScript.
