import { NextRequest, NextResponse } from "next/server";
import { audit, dbInsert, dbSelect, dbUpdate, isApiContext, jsonError, normalizePhone, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

type Lead = Record<string, unknown> & { id: string };

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const rawPhone = requiredString(body, "phone");
  if (!rawPhone) return jsonError("INVALID_REQUEST", "phone is required.", 422);

  const phone = normalizePhone(rawPhone);
  const existing = await dbSelect<Lead>("leads", {
    filters: { tenant_id: `eq.${ctx.tenantId}`, phone: `eq.${phone}`, status: "not.in.(won,lost,spam,duplicate)" },
    order: "updated_at.desc",
    limit: 1
  });

  const allowed = ["first_name", "last_name", "email", "company_name", "service", "service_category", "description", "urgency", "street", "city", "state", "postal_code", "preferred_date", "preferred_time", "qualification"];
  const payload: Record<string, unknown> = { tenant_id: ctx.tenantId, phone, source: body.source ?? "ai_receptionist", channel: body.channel ?? "voice", updated_at: new Date().toISOString() };
  for (const key of allowed) if (body[key] !== undefined) payload[key] = body[key];
  if (body.lead_status !== undefined) payload.status = body.lead_status;
  if (body.call_id !== undefined) payload.last_call_id = body.call_id;

  let lead: Lead | undefined;
  let action: "created" | "updated";
  try {
    if (existing[0]) {
      action = "updated";
      lead = (await dbUpdate<Lead>("leads", { id: `eq.${existing[0].id}`, tenant_id: `eq.${ctx.tenantId}` }, payload))[0];
    } else {
      action = "created";
      lead = (await dbInsert<Lead>("leads", { ...payload, status: body.lead_status ?? "new", created_by: ctx.agentId }))[0];
    }
    if (!lead) throw new Error("No lead returned");
    if (typeof body.notes === "string" && body.notes.trim()) {
      await dbInsert("lead_notes", { tenant_id: ctx.tenantId, lead_id: lead.id, note: body.notes.trim(), source: "ai_receptionist", agent_id: ctx.agentId, call_id: body.call_id ?? null });
    }
    await audit({ ...ctx, endpoint: "/api/v1/ai/leads/upsert", action, leadId: lead.id, requestId: typeof body.call_id === "string" ? body.call_id : null, success: true });
    return NextResponse.json({ success: true, action, lead });
  } catch (error) {
    await audit({ ...ctx, endpoint: "/api/v1/ai/leads/upsert", action: "upsert", success: false, metadata: { error: error instanceof Error ? error.message : "unknown" } });
    return jsonError("INTERNAL_ERROR", "Unable to save the lead.", 500, true);
  }
}
