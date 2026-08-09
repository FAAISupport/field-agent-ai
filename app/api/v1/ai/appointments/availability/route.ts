import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, isApiContext, jsonError, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  lead_id: z.string().uuid(),
  service: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional()
});

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const db = adminDb();
  const { data: lead } = await db.from("leads").select("id").eq("id", parsed.data.lead_id).eq("tenant_id", ctx.tenantId).maybeSingle();
  if (!lead) return jsonError("LEAD_NOT_FOUND", "Lead not found.", 404);

  let query = db.from("appointment_slots")
    .select("id, starts_at, ends_at, service")
    .eq("tenant_id", ctx.tenantId)
    .eq("available", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(20);

  if (parsed.data.service) query = query.eq("service", parsed.data.service);
  const { data, error } = await query;
  if (error) return jsonError("INTERNAL_ERROR", "Unable to load appointment availability.", 500, true);

  const preferredDate = parsed.data.preferred_date;
  const slots = (data ?? []).filter((slot) => !preferredDate || slot.starts_at.startsWith(preferredDate)).map((slot) => ({
    slot_id: slot.id,
    start: slot.starts_at,
    end: slot.ends_at,
    service: slot.service
  }));

  return NextResponse.json({ success: true, slots });
}
