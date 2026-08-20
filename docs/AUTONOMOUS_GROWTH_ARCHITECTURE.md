# Autonomous Growth Architecture

## Control plane

The control center reads from `/api/autonomous-growth/overview`. Test mode returns synthetic fixtures and cannot perform external actions. Production mode intentionally returns unavailable until a persistent adapter and credentials are configured.

## Domain layer

`lib/autonomous-growth/engine.ts` owns deterministic business rules:

- target industries and markets
- agent policy registry
- compliance screening
- revenue-opportunity calculations
- explainable prospect scoring
- product recommendations

This logic is isolated from providers so it can be tested without email, calendar, AI, or database access.

## Production data layer

The Supabase migration introduces tenant-scoped prospects, evidence, audits, campaigns, suppressions, approvals, and immutable-style agent action records. RLS is enabled and access defaults to service-role only until membership policies are added.

## Safety model

- Green: research, scoring, private audits, CRM updates, qualification, reporting
- Yellow: approved low-volume outreach and publication inside hard limits
- Red: pricing, contracts, guarantees, customer proof, high-volume contact, spending, and legal claims

Global and channel kill switches default to on/off-safe values. Suppression always overrides campaign eligibility.

## Required production adapters

- Supabase repository adapter
- Background-job queue
- Permissioned business-data source
- Email provider and signed event webhooks
- Calendar provider
- AI generation provider with structured output validation
- Analytics and error monitoring
