# PR4 validation blockers

- Create a dedicated Field Agent AI Supabase project.
- Apply the portal core schema and run Supabase security/performance advisors.
- Generate database TypeScript types from the deployed project.
- Regenerate `package-lock.json` for the pinned Supabase packages before any pipeline that uses `npm ci`.
- Add two-company tenant isolation integration tests against the test project.
