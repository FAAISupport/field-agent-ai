# PR4 Security Notes

- Authorization derives from `auth.uid()` and database membership, never from a browser-provided company ID.
- Public/publishable Supabase credentials only; no service-role credential is referenced by client code.
- RLS is enabled before authenticated table grants.
- Customer access is read-only in this foundation.
- Billing, invoice, payment, entitlement, and service-order writes will be server-mediated in the next implementation slice.
