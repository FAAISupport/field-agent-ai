import { NextResponse } from "next/server";
import { testOverview } from "@/lib/autonomous-growth/fixtures";

export const dynamic = "force-dynamic";

export async function GET() {
  const mode = process.env.AUTONOMOUS_GROWTH_MODE ?? "test";
  if (mode !== "test") {
    return NextResponse.json(
      {
        error: "Production data adapter is not activated.",
        required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "AUTONOMOUS_GROWTH_MODE=production"]
      },
      { status: 503 }
    );
  }
  return NextResponse.json(testOverview, {
    headers: { "Cache-Control": "no-store" }
  });
}
