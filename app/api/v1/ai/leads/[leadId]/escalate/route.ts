import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, audit, isApiContext, jsonError, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  reason: z.string().min(3),
  priority: z.enum(["normal", "high", "emergency"]).default("normal"),
  requested_action: z.string().default("human_callback"),
  caller_waiting: z.boolean().optional()
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const { leadId } = await params;
  const db = adminDb();
  const { data: lead } = await db.from("leads").select("id").eq("id", leadId).eq("tenant_id", ctx.tenantId).maybeSingle();
  if (!lead) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);

  const { data, error } = await db.from("escalations").insert({
    tenant_id: ctx.tenantId,
    lead_id: leadId,
    reason: parsed.data.reason,
    priority: parsed.data.priority,
    requested_action: parsed.data.requested_action,
    caller_waiting: parsed.data.caller_waiting ?? false,
    status: "queued",
    created_by: ctx.agentId
  }).select("*").single();

  if (error || !data) return jsonError("INTERNAL_ERROR", "Unable to create escalation.", 500, true);
  await db.from("leads").update({ urgency: parsed.data.priority === "emergency" ? "emergency" : undefined, updated_at: new Date().toISOString() }).eq("id", leadId).eq("tenant_id", ctx.tenantId);
  await audit({ ...ctx, endpoint: `/api/v1/ai/leads/${leadId}/escalate`, action: "escalated", leadId, success: true, metadata: { priority: parsed.data.priority } });
  return NextResponse.json({ success: true, escalation: data });
}
