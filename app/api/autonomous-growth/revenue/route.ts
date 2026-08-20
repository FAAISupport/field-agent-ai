import { NextRequest, NextResponse } from "next/server";
import { calculateRevenueScenario } from "@/lib/autonomous-growth/engine";
import type { RevenueAssumptions } from "@/lib/autonomous-growth/types";

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as RevenueAssumptions;
    const result = calculateRevenueScenario(input);
    return NextResponse.json({
      result,
      disclaimer:
        "This estimate uses user-supplied assumptions and is illustrative. It is not a guarantee of leads, revenue, savings, or performance."
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid assumptions." },
      { status: 400 }
    );
  }
}
