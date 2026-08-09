import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { z } from "zod";
import { adminDb, audit, isApiContext, jsonError, normalizePhone, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  lead_id: z.string().uuid().optional(),
  phone: z.string().min(7),
  message_type: z.string().default("follow_up"),
  message: z.string().min(1).max(1500)
});

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return jsonError("INTEGRATION_UNAVAILABLE", "SMS integration is not configured.", 503, true);

  const to = normalizePhone(parsed.data.phone);
  try {
    const client = twilio(sid, token);
    const msg = await client.messages.create({ from, to, body: parsed.data.message });
    await adminDb().from("messages").insert({
      tenant_id: ctx.tenantId,
      lead_id: parsed.data.lead_id ?? null,
      channel: "sms",
      direction: "outbound",
      phone: to,
      message_type: parsed.data.message_type,
      body: parsed.data.message,
      provider: "twilio",
      provider_id: msg.sid,
      status: msg.status,
      created_by: ctx.agentId
    });
    await audit({ ...ctx, endpoint: "/api/v1/ai/messages/sms", action: "sms_sent", leadId: parsed.data.lead_id, success: true, metadata: { provider_id: msg.sid } });
    return NextResponse.json({ success: true, message_id: msg.sid, status: msg.status });
  } catch (error) {
    await audit({ ...ctx, endpoint: "/api/v1/ai/messages/sms", action: "sms_failed", leadId: parsed.data.lead_id, success: false });
    return jsonError("SMS_FAILED", error instanceof Error ? error.message : "Unable to send SMS.", 502, true);
  }
}
