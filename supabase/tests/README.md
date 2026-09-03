# Portal tenant-isolation verification

Run these checks against a dedicated development/test Supabase project before production:

1. Create Company A and Company B.
2. Create one auth user per company and insert one active `company_users` membership for each.
3. As User A, SELECT `company_users`, `companies`, and `billing_accounts`; only Company A rows must be returned.
4. As User A, query Company B IDs directly; zero rows must be returned.
5. Repeat the inverse as User B.
6. Verify `audit_events` cannot be selected by either authenticated customer.
7. Verify an unauthenticated client cannot select any portal-core table.
8. Run Supabase security and performance advisors after schema application.

These checks are acceptance blockers for checkout/payment work because payment, invoice, entitlement, and order records will inherit the same `company_id` isolation pattern.
