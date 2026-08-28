# Field Agent AI, LLC Customer Portal — Implementation Contract

## Purpose
This repository now contains the customer-facing portal foundation at `/portal`. The next production layer must connect authentication, tenant data, service orders, proposals, billing, subscriptions, invoices, entitlements, and payment webhooks.

## Required production entities
- companies
- company_users
- billing_accounts
- service_categories
- services
- service_prices
- subscriptions
- subscription_items
- proposals
- proposal_items
- quotes
- quote_items
- invoices
- invoice_items
- payments
- refunds
- service_orders
- service_order_updates
- customer_entitlements
- discounts
- credits
- audit_events

## Billing models
Each catalog item must be classified as one of:
- one_time
- recurring_monthly
- included
- quote_required
- hourly_quote

## Customer workflow
Proposal → Acceptance → Payment → Subscription/Entitlement Activation → Service Order → Completion → Invoice/Receipt History

## Service order states
- awaiting_payment
- paid
- submitted
- under_review
- scheduled
- in_progress
- waiting_on_customer
- completed
- cancelled
- refunded

## Quote workflow
requested → reviewing → quote_ready → customer_approval → payment → scheduled → in_progress → completed

## Security requirements
- Tenant isolation must be enforced server-side.
- Never trust browser-provided company IDs without validating membership.
- Company users may not access another company's proposals, invoices, orders, files, billing profile, or entitlements.
- Do not store raw card data.
- Payment success must be verified server-side before paid entitlements activate.
- Webhook replay protection/idempotency is required.
- Billing and permission changes must be audit logged.

## Portal routes planned
Customer:
- /portal
- /portal/billing
- /portal/services
- /portal/services/[service]
- /portal/orders
- /portal/orders/[id]
- /portal/subscription
- /portal/invoices
- /portal/invoices/[id]
- /proposal/[secure-token]
- /quote/[secure-token]
- /checkout/[secure-token]

Super Admin:
- /admin/revenue
- /admin/proposals
- /admin/proposals/new
- /admin/proposals/[id]
- /admin/quotes
- /admin/invoices
- /admin/service-orders
- /admin/service-catalog
- /admin/billing/customers/[id]

## Current repo constraint
At the time this foundation was added, the project only declared Next.js, React, React DOM, and TypeScript. There was no authentication package, database client/ORM, payment SDK, or existing customer dashboard. The portal UI therefore intentionally does not pretend to process real payments until those systems are connected.

## Production acceptance test
Create test company → create proposal → add setup fee → add monthly subscription → add Social Presence Setup → add Social Presence Management → accept proposal → complete test payment → verify subscription → verify recurring charges → verify entitlements → order admin service → create service order → complete service → generate invoice/receipt → verify customer billing history → verify Super Admin revenue reporting.
