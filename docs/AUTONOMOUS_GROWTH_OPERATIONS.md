# Autonomous Growth Operations

## Safe startup

1. Copy `.env.example` to the local environment.
2. Keep `AUTONOMOUS_GROWTH_MODE=test`.
3. Run the app and visit `/autonomous-growth`.
4. Confirm the test-mode banner and global kill switch are visible.
5. Exercise the calculator and prospect view.

## Production activation gate

Do not set production mode until all conditions are true:

- administrator credentials are configured
- database migration is applied
- tenant RLS policies are implemented and tested
- service-role key is server-only
- sender domain has SPF, DKIM, and DMARC
- bounce, complaint, unsubscribe, and reply webhooks are verified
- global suppression tests pass
- approved business identity and physical mailing address are configured
- campaign limits and quiet hours are approved
- calendar permissions are restricted and tested
- no cold SMS or automated outbound calling is enabled
- the end-to-end test workflow passes twice

## First pilot

Use Central Florida concrete-coating businesses. Limit the first run to 100 researched records, 10 private audits, and no more than 10 individually reviewed business emails per day. Keep all unverified claims blocked. Stop automatically after any complaint or threshold breach.

## Kill switches

Environment defaults disable email, SMS, outbound calls, and social publishing. Production adapters must check both the global and channel switch at execution time—not only when a job is created.
