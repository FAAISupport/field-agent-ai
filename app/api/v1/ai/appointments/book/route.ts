import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, audit, isApiContext, jsonError, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  lead_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  appointment_type: z.string().default("estimate"),
  service: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const db = adminDb();
  const { data: lead } = await db.from("leads").select("id, phone").eq("id", parsed.data.lead_id).eq("tenant_id", ctx.tenantId).maybeSingle();
  if (!lead) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);

  const { data: slot } = await db.from("appointment_slots").select("id, starts_at, ends_at, service, available").eq("id", parsed.data.slot_id).eq("tenant_id", ctx.tenantId).maybeSingle();
  if (!slot || !slot.available) return jsonError("SLOT_NO_LONGER_AVAILABLE", "That appointment slot is no longer available.", 409);

  const { data: appointment, error } = await db.from("appointments").insert({
    tenant_id: ctx.tenantId,
    lead_id: lead.id,
    slot_id: slot.id,
    appointment_type: parsed.data.appointment_type,
    service: parsed.data.service ?? slot.service,
    notes: parsed.data.notes ?? null,
    starts_at: slot.starts_at,
    ends_at: slot.ends_at,
    status: "confirmed",
    created_by: ctx.agentId
  }).select("*").single();

  if (error || !appointment) return jsonError("INTERNAL_ERROR", "Unable to book appointment.", 500, true);

  await db.from("appointment_slots").update({ available: false, updated_at: new Date().toISOString() }).eq("id", slot.id).eq("tenant_id", ctx.tenantId);
  await db.from("leads").update({ status: "appointment_scheduled", updated_at: new Date().toISOString() }).eq("id", lead.id).eq("tenant_id", ctx.tenantId);
  await audit({ ...ctx, endpoint: "/api/v1/ai/appointments/book", action: "appointment_booked", leadId: lead.id, success: true, metadata: { appointment_id: appointment.id } });

  return NextResponse.json({ success: true, appointment });
}
