# Field Agent AI Social Department

The Social Department is the autonomous social-growth module inside Field Agent AI Virtual Office. It is designed around a closed operating loop:

**Learn → Plan → Create → Approve → Publish → Engage → Capture → Analyze → Improve → Repeat**

## Product promise

A customer connects the business, brand rules and social accounts once. The system maintains a Brand Brain, generates a strategy, creates platform-native content, routes approvals, publishes through official integrations, classifies inbound conversations, captures qualified leads, attributes outcomes and improves future work from measured performance.

## Agent roster

- Director — daily objectives, coordination, approvals and assignment report.
- Researcher — timely topics, competitor moves and audience questions.
- Strategist — campaign themes and 30/60/90-day plans.
- Writer — hooks, captions, CTAs and channel-specific copy.
- Designer — branded visual briefs, graphics and carousels.
- Publisher — scheduling, publish adapters, retries and logs.
- Community Manager — comment classification and safe-response workflow.
- DM Agent — approved routine conversations and exception routing.
- Lead Agent — qualification, CRM handoff and appointment intent.
- Analyst — engagement, conversion, pipeline and revenue attribution.
- Optimizer — updates future recommendations from performance data.

## Operating modes

`autopilot`: routine approved categories can publish/respond automatically.

`approval`: all outbound publishing/replies require human approval.

`hybrid`: routine content can run automatically while pricing, promotions, sensitive claims and exceptions require approval. This should be the default.

## Initial implementation in this branch

- `/social-department` command-center dashboard.
- `/api/social/director` Director briefing endpoint and assignment contract.
- Shared TypeScript domain model under `lib/social`.
- Supabase migration for Brand Brain, social accounts, campaigns, content queue, conversations, agent assignments and daily metrics.
- Morning assignment-report surface in the dashboard.

## Next integration phases

1. Connect the repository's authentication/organization model and replace demo dashboard data with tenant-scoped Supabase queries.
2. Add Brand Brain onboarding: website/business intake, goals, voice, audiences, services/offers, CTAs, prohibited claims and service areas.
3. Implement content pipeline states and approval actions.
4. Add official platform adapters beginning with Meta/Instagram, followed by Google Business and other channels according to API permission availability.
5. Implement durable jobs with idempotency, retries, publish logs and dead-letter handling.
6. Build unified conversation ingestion, classification, DM/comment approval rules and CRM lead handoff.
7. Add attribution events for conversation → qualified lead → appointment → sale/influenced pipeline.
8. Add subscription entitlements and usage metering for Social Department plans/add-ons.
9. Add morning Director briefing delivery plus on-demand generation.

## Guardrails

- Never assume all social networks expose the same publishing, comment or DM APIs.
- Use official APIs and store explicit scopes/capabilities per connected account.
- Do not fabricate engagement or lead metrics; retain raw provider payloads for auditability.
- Require approval for configured sensitive categories and provide a hard global kill switch for outbound automation.
- Treat every publisher job as idempotent and record external post IDs.
- Keep tenant data isolated and apply row-level security before production.
- Store provider tokens using the platform's secret-management strategy, never directly in client-visible records.

## Success metric

The module is successful when the dashboard can show a traceable chain from **content → engagement → conversation → qualified lead → appointment → revenue/pipeline**, rather than only vanity metrics.
