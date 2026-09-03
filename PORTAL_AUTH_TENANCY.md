# Portal Auth & Tenant Isolation

This branch adds the production identity boundary for the Field Agent AI customer portal.

## Implemented
- Supabase SSR server client using publishable keys only.
- Next.js 16 `proxy.ts` session refresh and `/portal/*` protection.
- Email/password sign-in and sign-out server actions.
- Server-side authenticated portal context.
- `companies`, `company_users`, `billing_accounts`, and `audit_events` schema.
- Row Level Security and least-privilege Data API grants.
- Tenant-derived company and billing display in `/portal`.
- Nonfunctional marketplace buttons are disabled until checkout/service orders exist.

## Deployment prerequisites
1. Create/select a dedicated Field Agent AI Supabase project.
2. Apply `supabase/schema/portal_core.sql` and run Supabase security/performance advisors.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel.
4. Create auth users and insert their `company_users` membership server-side.
5. Regenerate TypeScript database types from the deployed schema.
6. Refresh `package-lock.json` with the pinned Supabase dependencies before using `npm ci`.

## Security model
The browser never supplies an authoritative company ID. The signed-in user's `auth.uid()` is matched to `company_users`, and RLS limits company and billing reads to that membership. No authenticated role is granted customer-side writes in this foundation.
