-- Field Agent AI customer portal core schema.
-- Apply to the dedicated Field Agent AI Supabase project, then capture as a migration.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active','suspended','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_users (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);
create index if not exists company_users_user_id_idx on public.company_users(user_id);

create table if not exists public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  provider text,
  external_customer_id text,
  plan_name text,
  subscription_status text not null default 'not_configured' check (subscription_status in ('not_configured','trialing','active','past_due','paused','cancelled')),
  monthly_plan_cents integer not null default 0 check (monthly_plan_cents >= 0),
  monthly_addons_cents integer not null default 0 check (monthly_addons_cents >= 0),
  outstanding_cents integer not null default 0 check (outstanding_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists billing_accounts_company_id_idx on public.billing_accounts(company_id);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  company_id uuid references public.companies(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_company_id_idx on public.audit_events(company_id);
create index if not exists audit_events_actor_user_id_idx on public.audit_events(actor_user_id);

alter table public.companies enable row level security;
alter table public.company_users enable row level security;
alter table public.billing_accounts enable row level security;
alter table public.audit_events enable row level security;

revoke all on public.companies from anon, authenticated;
revoke all on public.company_users from anon, authenticated;
revoke all on public.billing_accounts from anon, authenticated;
revoke all on public.audit_events from anon, authenticated;

grant select on public.companies to authenticated;
grant select on public.company_users to authenticated;
grant select on public.billing_accounts to authenticated;

create policy "company users can read own memberships"
on public.company_users for select
to authenticated
using ((select auth.uid()) is not null and user_id = (select auth.uid()) and is_active = true);

create policy "company users can read own company"
on public.companies for select
to authenticated
using (
  exists (
    select 1 from public.company_users cu
    where cu.company_id = companies.id
      and cu.user_id = (select auth.uid())
      and cu.is_active = true
  )
);

create policy "company users can read own billing account"
on public.billing_accounts for select
to authenticated
using (
  exists (
    select 1 from public.company_users cu
    where cu.company_id = billing_accounts.company_id
      and cu.user_id = (select auth.uid())
      and cu.is_active = true
  )
);

-- audit_events intentionally has no authenticated policies. It is server/admin only.
