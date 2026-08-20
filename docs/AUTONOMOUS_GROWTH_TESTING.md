# Autonomous Growth Testing

## Implemented verification targets

- TypeScript compilation
- Next.js production build
- Test-mode overview endpoint
- Revenue calculator validation
- Compliance blocking rules
- Suppression override
- Explainable prospect scoring
- Product recommendation logic
- Responsive control-center rendering

## Required before production

1. Create a test prospect and evidence record.
2. Generate a private audit.
3. Confirm unsupported revenue guarantees are blocked.
4. Confirm a suppressed contact cannot be queued or contacted.
5. Confirm duplicate companies do not receive duplicate outreach.
6. Simulate bounce and complaint thresholds and verify campaign pause.
7. Put prompt-injection text in researched evidence and confirm it is never executed.
8. Verify two tenants cannot read or mutate each other's records.
9. Qualify a synthetic positive reply.
10. Book a sandbox calendar event.
11. Generate the daily executive report.
12. Repeat the complete workflow twice.

The current build must not be described as live-outreach ready until the external adapters and the above tests are completed.

## Verification record

Two independent production-server test-mode runs passed on August 19, 2026:

- overview endpoint returned HTTP 200 with test mode and the global kill switch enabled
- control-center page returned HTTP 200
- unsupported guaranteed-revenue and false-partnership claims were blocked
- a suppressed destination was blocked
- compliant educational wording passed
- valid revenue assumptions returned the expected transparent scenario
- negative revenue assumptions returned HTTP 400
- TypeScript completed without errors
- the optimized Next.js production build completed successfully
