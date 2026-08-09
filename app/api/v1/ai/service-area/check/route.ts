import { NextRequest, NextResponse } from "next/server";
import { dbSelect, isApiContext, jsonError, readJsonObject, requireAiContext, requiredString } from "@/lib/ai-api/core";

type ServiceArea = {
  id: string;
  name: string;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;
  service?: string | null;
  booking_allowed?: boolean | null;
};

export async function POST(req: NextRequest) {
  const ctx = requireAiContext(req);
  if (!isApiContext(ctx)) return ctx;
  const body = await readJsonObject(req);
  if (!body) return jsonError("INVALID_REQUEST", "A JSON object is required.", 422);
  const state = requiredString(body, "state");
  if (!state) return jsonError("INVALID_REQUEST", "state is required.", 422);

  try {
    const areas = await dbSelect<ServiceArea>("service_areas", {
      select: "id,name,state,city,postal_code,service,booking_allowed",
      filters: { tenant_id: `eq.${ctx.tenantId}`, active: "eq.true" }
    });
    const city = typeof body.city === "string" ? body.city : "";
    const postal = typeof body.postal_code === "string" ? body.postal_code : "";
    const service = typeof body.service === "string" ? body.service : "";
    const match = areas.find((area) => {
      const stateOk = !area.state || area.state.toLowerCase() === state.toLowerCase();
      const cityOk = !area.city || area.city.toLowerCase() === city.toLowerCase();
      const zipOk = !area.postal_code || area.postal_code === postal;
      const serviceOk = !area.service || !service || area.service.toLowerCase() === service.toLowerCase();
      return stateOk && cityOk && zipOk && serviceOk;
    });
    if (!match) return NextResponse.json({ success: true, in_service_area: false, booking_allowed: false, reason: "Outside configured service territory." });
    return NextResponse.json({ success: true, in_service_area: true, booking_allowed: match.booking_allowed !== false, service_area: match.name });
  } catch {
    return jsonError("INTERNAL_ERROR", "Unable to verify service area.", 500, true);
  }
}
