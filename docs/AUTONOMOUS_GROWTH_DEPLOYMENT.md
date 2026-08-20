# Autonomous Growth Deployment

## Environment variables

See `.env.example`. The safe default is test mode with every external channel disabled.

## Database

Apply `supabase/migrations/202608190001_autonomous_growth.sql` to a dedicated development project first. Add tenant-membership policies before application users receive database access.

## Vercel

Configure environment variables separately for Preview and Production. Keep production channel switches disabled during initial deployment. Use a strong generated administrator password and rotate it after setup.

## External configuration still required

- Supabase project and tenant membership design
- durable job queue compatible with Vercel
- permissioned business-data source
- authenticated email provider and webhooks
- restricted Google Calendar integration
- error monitoring and alert routing
- legal approval of outbound policy

## Rollback

Set `GROWTH_GLOBAL_KILL_SWITCH=true` and all channel switches to false. If necessary, switch `AUTONOMOUS_GROWTH_MODE=test` to return the site to synthetic read-only operation.
