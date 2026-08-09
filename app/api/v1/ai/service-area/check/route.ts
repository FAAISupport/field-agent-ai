import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, isApiContext, jsonError, requireAiContext } from "@/lib/ai-api/core";

const Body = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(2),
  postal_code: z.string().optional(),
  service: z.string().optional()
});

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("INVALID_REQUEST", parsed.error.message, 422);

  const db = adminDb();
  const { data, error } = await db.from("service_areas")
    .select("id, name, state, city, postal_code, service, booking_allowed")
    .eq("tenant_id", ctx.tenantId)
    .eq("active", true);
  if (error) return jsonError("INTERNAL_ERROR", "Unable to verify service area.", 500, true);

  const input = parsed.data;
  const match = (data ?? []).find((area) => {
    const stateOk = !area.state || area.state.toLowerCase() === input.state.toLowerCase();
    const cityOk = !area.city || (!!input.city && area.city.toLowerCase() === input.city.toLowerCase());
    const zipOk = !area.postal_code || (!!input.postal_code && area.postal_code === input.postal_code);
    const serviceOk = !area.service || !input.service || area.service.toLowerCase() === input.service.toLowerCase();
    return stateOk && cityOk && zipOk && serviceOk;
  });

  if (!match) return NextResponse.json({ success: true, in_service_area: false, booking_allowed: false, reason: "Outside configured service territory." });
  return NextResponse.json({ success: true, in_service_area: true, booking_allowed: match.booking_allowed !== false, service_area: match.name });
}
