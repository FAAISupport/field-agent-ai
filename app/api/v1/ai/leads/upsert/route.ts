import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, audit, isApiContext, jsonError, normalizePhone, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  phone: z.string().min(7),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  company_name: z.string().optional().nullable(),
  service: z.string().optional().nullable(),
  service_category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  urgency: z.enum(["low", "normal", "high", "emergency"]).optional(),
  source: z.string().default("ai_receptionist"),
  channel: z.string().default("voice"),
  call_id: z.string().optional().nullable(),
  lead_status: z.string().optional(),
  notes: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  preferred_date: z.string().optional().nullable(),
  preferred_time: z.string().optional().nullable(),
  qualification: z.record(z.string(), z.unknown()).optional()
});

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const db = adminDb();
  const body = parsed.data;
  const phone = normalizePhone(body.phone);

  const { data: existing } = await db.from("leads")
    .select("id, customer_id, created_at")
    .eq("tenant_id", ctx.tenantId)
    .eq("phone", phone)
    .not("status", "in", '(won,lost,spam,duplicate)')
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    tenant_id: ctx.tenantId,
    phone,
    first_name: body.first_name ?? undefined,
    last_name: body.last_name ?? undefined,
    email: body.email ?? undefined,
    company_name: body.company_name ?? undefined,
    service: body.service ?? undefined,
    service_category: body.service_category ?? undefined,
    description: body.description ?? undefined,
    urgency: body.urgency ?? undefined,
    source: body.source,
    channel: body.channel,
    status: body.lead_status ?? undefined,
    street: body.street ?? undefined,
    city: body.city ?? undefined,
    state: body.state ?? undefined,
    postal_code: body.postal_code ?? undefined,
    preferred_date: body.preferred_date ?? undefined,
    preferred_time: body.preferred_time ?? undefined,
    qualification: body.qualification ?? undefined,
    last_call_id: body.call_id ?? undefined,
    updated_at: new Date().toISOString()
  };

  const clean = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
  const query = existing
    ? db.from("leads").update(clean).eq("id", existing.id).eq("tenant_id", ctx.tenantId).select("*").single()
    : db.from("leads").insert({ ...clean, status: body.lead_status ?? "new", created_by: ctx.agentId }).select("*").single();

  const { data: lead, error } = await query;
  if (error || !lead) {
    await audit({ ...ctx, endpoint: "/api/v1/ai/leads/upsert", action: "upsert", success: false, metadata: { error: error?.message } });
    return jsonError("INTERNAL_ERROR", "Unable to save the lead.", 500, true);
  }

  if (body.notes) {
    await db.from("lead_notes").insert({ tenant_id: ctx.tenantId, lead_id: lead.id, note: body.notes, source: "ai_receptionist", agent_id: ctx.agentId, call_id: body.call_id ?? null });
  }

  await audit({ ...ctx, endpoint: "/api/v1/ai/leads/upsert", action: existing ? "updated" : "created", leadId: lead.id, requestId: body.call_id, success: true });
  return NextResponse.json({ success: true, action: existing ? "updated" : "created", lead });
}
