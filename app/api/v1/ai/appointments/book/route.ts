import { NextRequest, NextResponse } from "next/server";
import { audit, dbInsert, dbSelect, dbUpdate, isApiContext, jsonError, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

type Lead = { id: string; phone?: string | null };
type Slot = { id: string; starts_at: string; ends_at: string; service?: string | null; available: boolean };
type Appointment = Record<string, unknown> & { id: string };

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const leadId = requiredString(body, "lead_id");
  const slotId = requiredString(body, "slot_id");
  if (!leadId || !slotId) return jsonError("INVALID_REQUEST", "lead_id and slot_id are required.", 422);

  try {
    const lead = (await dbSelect<Lead>("leads", { select: "id,phone", filters: { id: `eq.${leadId}`, tenant_id: `eq.${ctx.tenantId}` }, limit: 1 }))[0];
    if (!lead) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);
    const slot = (await dbSelect<Slot>("appointment_slots", { select: "id,starts_at,ends_at,service,available", filters: { id: `eq.${slotId}`, tenant_id: `eq.${ctx.tenantId}` }, limit: 1 }))[0];
    if (!slot || !slot.available) return jsonError("SLOT_NO_LONGER_AVAILABLE", "That appointment slot is no longer available.", 409);

    const appointment = (await dbInsert<Appointment>("appointments", {
      tenant_id: ctx.tenantId,
      lead_id: lead.id,
      slot_id: slot.id,
      appointment_type: typeof body.appointment_type === "string" ? body.appointment_type : "estimate",
      service: typeof body.service === "string" ? body.service : slot.service ?? null,
      notes: typeof body.notes === "string" ? body.notes : null,
      starts_at: slot.starts_at,
      ends_at: slot.ends_at,
      status: "confirmed",
      created_by: ctx.agentId
    }))[0];
    if (!appointment) throw new Error("No appointment returned");

    await dbUpdate("appointment_slots", { id: `eq.${slot.id}`, tenant_id: `eq.${ctx.tenantId}`, available: "eq.true" }, { available: false, updated_at: new Date().toISOString() });
    await dbUpdate("leads", { id: `eq.${lead.id}`, tenant_id: `eq.${ctx.tenantId}` }, { status: "appointment_scheduled", updated_at: new Date().toISOString() });
    await audit({ ...ctx, endpoint: "/api/v1/ai/appointments/book", action: "appointment_booked", leadId: lead.id, success: true, metadata: { appointment_id: appointment.id } });
    return NextResponse.json({ success: true, appointment });
  } catch {
    return jsonError("INTERNAL_ERROR", "Unable to book appointment.", 500, true);
  }
}
