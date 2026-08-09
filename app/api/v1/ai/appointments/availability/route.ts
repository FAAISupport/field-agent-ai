import { NextRequest, NextResponse } from "next/server";
import { dbSelect, isApiContext, jsonError, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

type Slot = { id: string; starts_at: string; ends_at: string; service?: string | null };

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const leadId = requiredString(body, "lead_id");
  if (!leadId) return jsonError("INVALID_REQUEST", "lead_id is required.", 422);

  try {
    const leads = await dbSelect<{ id: string }>("leads", { select: "id", filters: { id: `eq.${leadId}`, tenant_id: `eq.${ctx.tenantId}` }, limit: 1 });
    if (!leads[0]) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);

    const filters: Record<string, string> = {
      tenant_id: `eq.${ctx.tenantId}`,
      available: "eq.true",
      starts_at: `gte.${new Date().toISOString()}`
    };
    if (typeof body.service === "string" && body.service.trim()) filters.service = `eq.${body.service.trim()}`;

    const data = await dbSelect<Slot>("appointment_slots", { select: "id,starts_at,ends_at,service", filters, order: "starts_at.asc", limit: 20 });
    const preferredDate = typeof body.preferred_date === "string" ? body.preferred_date : null;
    const slots = data.filter((slot) => !preferredDate || slot.starts_at.startsWith(preferredDate)).map((slot) => ({ slot_id: slot.id, start: slot.starts_at, end: slot.ends_at, service: slot.service }));
    return NextResponse.json({ success: true, slots });
  } catch {
    return jsonError("INTERNAL_ERROR", "Unable to load appointment availability.", 500, true);
  }
}
