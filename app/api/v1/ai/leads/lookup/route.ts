import { NextRequest, NextResponse } from "next/server";
import { dbSelect, isApiContext, jsonError, normalizePhone, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const rawPhone = requiredString(body, "phone");
  if (!rawPhone) return jsonError("INVALID_REQUEST", "phone is required.", 422);

  try {
    const phone = normalizePhone(rawPhone);
    const customers = await dbSelect<Record<string, unknown>>("customers", {
      select: "id,first_name,last_name,phone,email",
      filters: { tenant_id: `eq.${ctx.tenantId}`, phone: `eq.${phone}` },
      limit: 1
    });
    const leads = await dbSelect<Record<string, unknown>>("leads", {
      select: "id,customer_id,first_name,last_name,service,status,urgency,updated_at",
      filters: { tenant_id: `eq.${ctx.tenantId}`, phone: `eq.${phone}`, status: "not.in.(won,lost,spam,duplicate)" },
      order: "updated_at.desc",
      limit: 5
    });
    return NextResponse.json({ success: true, found: Boolean(customers[0] || leads.length), customer: customers[0] ?? null, open_leads: leads });
  } catch {
    return jsonError("INTERNAL_ERROR", "Unable to look up caller.", 500, true);
  }
}
