import { NextRequest, NextResponse } from "next/server";
import { audit, dbInsert, dbSelect, dbUpdate, isApiContext, jsonError, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

type Escalation = Record<string, unknown> & { id: string };

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const reason = requiredString(body, "reason");
  if (!reason) return jsonError("INVALID_REQUEST", "reason is required.", 422);

  const { leadId } = await params;
  const priority = body.priority === "emergency" || body.priority === "high" ? body.priority : "normal";
  try {
    const lead = (await dbSelect<{ id: string }>("leads", { select: "id", filters: { id: `eq.${leadId}`, tenant_id: `eq.${ctx.tenantId}` }, limit: 1 }))[0];
    if (!lead) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);

    const escalation = (await dbInsert<Escalation>("escalations", {
      tenant_id: ctx.tenantId,
      lead_id: leadId,
      reason,
      priority,
      requested_action: typeof body.requested_action === "string" ? body.requested_action : "human_callback",
      caller_waiting: body.caller_waiting === true,
      status: "queued",
      created_by: ctx.agentId
    }))[0];
    if (!escalation) throw new Error("No escalation returned");

    const leadUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (priority === "emergency") leadUpdate.urgency = "emergency";
    await dbUpdate("leads", { id: `eq.${leadId}`, tenant_id: `eq.${ctx.tenantId}` }, leadUpdate);
    await audit({ ...ctx, endpoint: `/api/v1/ai/leads/${leadId}/escalate`, action: "escalated", leadId, success: true, metadata: { priority } });
    return NextResponse.json({ success: true, escalation });
  } catch {
    return jsonError("INTERNAL_ERROR", "Unable to create escalation.", 500, true);
  }
}
