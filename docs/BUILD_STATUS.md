# Field Agent AI Build Status

| Capability | Status | Notes |
|---|---|---|
| Repository audit | Tested | Baseline and risks documented |
| Autonomous Growth route | Implemented | Test-mode control center |
| Overview metrics | Tested | Derived from synthetic endpoint data |
| Agent registry | Implemented | Eight core agents with limits and policies |
| Green/yellow/red autonomy | Implemented | Domain configuration and UI visibility |
| Global kill switch | Implemented | Defaults to safe state |
| Channel kill switches | Implemented | Environment contract; production adapters pending |
| Prospect model | Implemented | TypeScript plus Supabase migration |
| Evidence model | Implemented | Source, observation, confidence, eligibility |
| Explainable prospect scoring | Implemented | Deterministic domain logic |
| Missed-call audit model | Implemented | Schema and test fixture |
| Private audit publishing | Not started | Requires persistent adapter and public signed-link design |
| Opportunity calculator | Tested | API and interactive UI with disclaimer |
| Compliance scanner | Tested | Blocks guarantees, false affiliations, suppression |
| Campaign model | Implemented | Schema includes limits and kill switch |
| Live email outreach | Blocked by external configuration | Sender, webhooks, legal review, job queue required |
| Cold SMS | Deferred with explanation | Prohibited in v1 |
| Automated outbound calls | Deferred with explanation | Prohibited in v1 |
| Inbound qualification | Implemented | Recommendation rules; conversation adapter pending |
| Demo booking | Blocked by external configuration | Calendar credentials and sandbox tests required |
| CRM pipeline persistence | Blocked by external configuration | Supabase adapter and tenant membership required |
| Proposal generation | Not started | Requires approved product catalog and templates |
| Content agent | Not started | Requires CMS/publishing adapter and claims library |
| LinkedIn agent | Blocked by external configuration | Publishing connection and platform approval required |
| Partnership agent | Not started | Requires permitted data source and partner policy |
| Approval queue | Implemented | Schema and test-mode UI |
| Suppression model | Implemented | Unique channel/destination control in schema |
| Agent action audit log | Implemented | Idempotency and retry fields included |
| Analytics | Implemented | Test-mode metrics; production aggregation pending |
| Daily executive report | Implemented | Dashboard summary foundation; delivery adapter pending |
| Authentication | Implemented | Production-mode Basic Auth foundation |
| Tenant isolation | Blocked by external configuration | RLS enabled; membership policies required |
| Background jobs | Not started | Durable provider selection required |
| Unit/integration/E2E suite | Tested | Type/build checks and two test-mode HTTP verification runs passed; provider tests pending |
| Production activation | Blocked by external configuration | See deployment checklist |
