import { NextRequest, NextResponse } from "next/server";
import { audit, dbInsert, isApiContext, jsonError, normalizePhone, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const rawPhone = requiredString(body, "phone");
  const message = requiredString(body, "message");
  if (!rawPhone || !message) return jsonError("INVALID_REQUEST", "phone and message are required.", 422);

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return jsonError("INTEGRATION_UNAVAILABLE", "SMS integration is not configured.", 503, true);

  const to = normalizePhone(rawPhone);
  try {
    const form = new URLSearchParams({ From: from, To: to, Body: message });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString(),
      cache: "no-store"
    });
    const result = await response.json() as { sid?: string; status?: string; message?: string };
    if (!response.ok || !result.sid) throw new Error(result.message || `Twilio returned ${response.status}`);

    const leadId = typeof body.lead_id === "string" ? body.lead_id : null;
    await dbInsert("messages", {
      tenant_id: ctx.tenantId,
      lead_id: leadId,
      channel: "sms",
      direction: "outbound",
      phone: to,
      message_type: typeof body.message_type === "string" ? body.message_type : "follow_up",
      body: message,
      provider: "twilio",
      provider_id: result.sid,
      status: result.status ?? "queued",
      created_by: ctx.agentId
    });
    await audit({ ...ctx, endpoint: "/api/v1/ai/messages/sms", action: "sms_sent", leadId, success: true, metadata: { provider_id: result.sid } });
    return NextResponse.json({ success: true, message_id: result.sid, status: result.status ?? "queued" });
  } catch (error) {
    const leadId = typeof body.lead_id === "string" ? body.lead_id : null;
    await audit({ ...ctx, endpoint: "/api/v1/ai/messages/sms", action: "sms_failed", leadId, success: false });
    return jsonError("SMS_FAILED", error instanceof Error ? error.message : "Unable to send SMS.", 502, true);
  }
}
