# PR4 Acceptance Criteria

- Anonymous requests to `/portal/*` redirect to `/login`.
- Authenticated users without an active `company_users` membership are denied portal context.
- Authenticated users can read only their own company and billing account through RLS.
- Customer roles have no write grants to portal-core tables.
- `audit_events` remains unavailable to customer roles.
- Portal company name and billing summary come from server-validated tenant data.
- Order, Request, and Custom Work actions remain disabled until real service-order and payment flows exist.
