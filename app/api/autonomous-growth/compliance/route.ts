import { NextRequest, NextResponse } from "next/server";
import { checkCompliance } from "@/lib/autonomous-growth/engine";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { content?: unknown; suppressed?: unknown };
  if (typeof body.content !== "string" || body.content.length > 20_000) {
    return NextResponse.json({ error: "Content must be a string no longer than 20,000 characters." }, { status: 400 });
  }
  return NextResponse.json(checkCompliance(body.content, body.suppressed === true));
}
