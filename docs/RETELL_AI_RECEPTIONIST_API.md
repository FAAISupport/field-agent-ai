# Emily / Retell AI Receptionist API

This branch adds a server-side integration layer for Emily to create and manage CRM opportunities during live calls without exposing Supabase or Twilio credentials to Retell.

## Base URL

Use the deployed Field Agent AI domain, for example:

`https://fieldagentai.com/api/v1/ai`

Every request must include:

```http
Authorization: Bearer <HEDGEBOT_AI_API_KEY>
Content-Type: application/json
X-Integration: retell
X-Agent-ID: emily
```

The server maps the API key to the configured `HEDGEBOT_TENANT_ID`. Retell should never receive the Supabase service-role key or Twilio auth token.

## Endpoints

### POST /api/v1/ai/leads/lookup

Looks up a returning caller by normalized phone number.

```json
{ "phone": "+13525551212" }
```

### POST /api/v1/ai/leads/upsert

Creates a lead when no open lead exists for the tenant + phone number, otherwise enriches the current lead.

Minimum payload:

```json
{ "phone": "+13525551212" }
```

Typical payload:

```json
{
  "phone": "+13525551212",
  "first_name": "Robert",
  "last_name": "Miller",
  "email": "robert@example.com",
  "service": "Tree Removal",
  "description": "Oak tree leaning over garage",
  "urgency": "high",
  "city": "Leesburg",
  "state": "FL",
  "postal_code": "34748",
  "preferred_date": "2026-08-11",
  "preferred_time": "afternoon",
  "call_id": "retell_call_123",
  "notes": "Customer is concerned about storm damage."
}
```

Save incrementally during the call instead of waiting until hangup.

### POST /api/v1/ai/service-area/check

```json
{
  "city": "Leesburg",
  "state": "FL",
  "postal_code": "34748",
  "service": "Tree Removal"
}
```

Emily must not promise service unless `in_service_area` and `booking_allowed` are true.

### POST /api/v1/ai/appointments/availability

```json
{
  "lead_id": "<uuid>",
  "service": "Tree Removal",
  "preferred_date": "2026-08-11"
}
```

Only offer appointment slots returned by this endpoint.

### POST /api/v1/ai/appointments/book

```json
{
  "lead_id": "<uuid>",
  "slot_id": "<uuid>",
  "appointment_type": "estimate",
  "service": "Tree Removal",
  "notes": "Inspect oak near garage"
}
```

Emily may say an appointment is confirmed only after this endpoint returns success.

### POST /api/v1/ai/messages/sms

```json
{
  "lead_id": "<uuid>",
  "phone": "+13525551212",
  "message_type": "photo_request",
  "message": "Hi Robert, this is Emily. Reply here with photos of the tree and the area around the garage."
}
```

The server sends through Twilio and records the outbound message.

### POST /api/v1/ai/leads/{leadId}/escalate

```json
{
  "reason": "Tree has fallen onto occupied structure",
  "priority": "emergency",
  "requested_action": "human_callback",
  "caller_waiting": true
}
```

This creates an auditable escalation record. It does not claim a human has actually accepted the handoff; downstream notification/dispatch logic should update escalation status when implemented.

## Database setup

Apply:

`supabase/migrations/20260808_ai_receptionist_crm.sql`

The migration creates the minimum tables required by these endpoints and enables RLS. The server uses `SUPABASE_SERVICE_ROLE_KEY` and every query still scopes records by `tenant_id`.

## Required environment variables

Copy `.env.example` and configure the values in Vercel:

- `HEDGEBOT_AI_API_KEY`
- `HEDGEBOT_TENANT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## Recommended Retell tool order

1. `hedgebot_lookup_caller`
2. `hedgebot_upsert_lead`
3. `hedgebot_check_service_area`
4. `hedgebot_get_availability`
5. `hedgebot_book_appointment`
6. `hedgebot_send_sms`
7. `hedgebot_escalate`

## Emily rules

- Save a lead as soon as meaningful intent is known.
- Enrich the same lead as the caller provides more information.
- Never invent service-area eligibility.
- Never invent appointment availability.
- Never claim a text was sent unless the SMS endpoint returns success.
- Never claim an escalation reached a human merely because it was queued.
- Never expose API keys, Supabase credentials, Twilio credentials, or internal database data.
