import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export type ApiContext = {
  tenantId: string;
  integration: string;
  agentId: string;
};

export function jsonError(code: string, message: string, status = 400, retryable = false) {
  return NextResponse.json({ success: false, error: { code, message, retryable } }, { status });
}

export function requireAiContext(req: NextRequest): ApiContext | NextResponse {
  const expected = process.env.HEDGEBOT_AI_API_KEY;
  if (!expected) return jsonError("SERVER_MISCONFIGURED", "AI API key is not configured.", 500);

  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${expected}`) return jsonError("UNAUTHORIZED", "Invalid AI integration credentials.", 401);

  const tenantId = process.env.HEDGEBOT_TENANT_ID;
  if (!tenantId) return jsonError("SERVER_MISCONFIGURED", "Tenant ID is not configured.", 500);

  return {
    tenantId,
    integration: req.headers.get("x-integration") || "retell",
    agentId: req.headers.get("x-agent-id") || "emily"
  };
}

export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (value.startsWith("+") && digits.length >= 8) return `+${digits}`;
  return value.trim();
}

export async function audit(input: {
  tenantId: string;
  integration: string;
  agentId: string;
  endpoint: string;
  action: string;
  leadId?: string | null;
  requestId?: string | null;
  success: boolean;
  metadata?: Record<string, unknown>;
}) {
  try {
    await adminDb().from("ai_audit_log").insert({
      tenant_id: input.tenantId,
      integration: input.integration,
      agent_id: input.agentId,
      endpoint: input.endpoint,
      action: input.action,
      lead_id: input.leadId ?? null,
      request_id: input.requestId ?? null,
      success: input.success,
      metadata: input.metadata ?? {}
    });
  } catch {
    // Auditing should not take down a live receptionist call.
  }
}

export function isApiContext(value: ApiContext | NextResponse): value is ApiContext {
  return !(value instanceof NextResponse);
}
