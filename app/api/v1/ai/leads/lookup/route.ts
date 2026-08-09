import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, isApiContext, jsonError, normalizePhone, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({ phone: z.string().min(7) });

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const phone = normalizePhone(parsed.data.phone);
  const db = adminDb();
  const { data: customer } = await db.from("customers").select("id, first_name, last_name, phone, email").eq("tenant_id", ctx.tenantId).eq("phone", phone).limit(1).maybeSingle();
  const { data: leads, error } = await db.from("leads").select("id, customer_id, first_name, last_name, service, status, urgency, updated_at").eq("tenant_id", ctx.tenantId).eq("phone", phone).not("status", "in", '(won,lost,spam,duplicate)').order("updated_at", { ascending: false }).limit(5);
  if (error) return jsonError("INTERNAL_ERROR", "Unable to look up caller.", 500, true);

  return NextResponse.json({ success: true, found: Boolean(customer || leads?.length), customer: customer ?? null, open_leads: leads ?? [] });
}
