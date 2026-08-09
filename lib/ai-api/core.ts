import { NextRequest, NextResponse } from "next/server";

export type ApiContext = {
  tenantId: string;
  integration: string;
  agentId: string;
};

type QueryOptions = {
  select?: string;
  filters?: Record<string, string>;
  order?: string;
  limit?: number;
};

export function jsonError(code: string, message: string, status = 400, retryable = false) {
  return NextResponse.json({ success: false, error: { code, message, retryable } }, { status });
}

export function requireAiContext(req: NextRequest): ApiContext | NextResponse {
  const expected = process.env.HEDGEBOT_AI_API_KEY;
  if (!expected) return jsonError("SERVER_MISCONFIGURED", "AI API key is not configured.", 500);
  if ((req.headers.get("authorization") ?? "") !== `Bearer ${expected}`) {
    return jsonError("UNAUTHORIZED", "Invalid AI integration credentials.", 401);
  }
  const tenantId = process.env.HEDGEBOT_TENANT_ID;
  if (!tenantId) return jsonError("SERVER_MISCONFIGURED", "Tenant ID is not configured.", 500);
  return {
    tenantId,
    integration: req.headers.get("x-integration") || "retell",
    agentId: req.headers.get("x-agent-id") || "emily"
  };
}

export function isApiContext(value: ApiContext | NextResponse): value is ApiContext {
  return !(value instanceof NextResponse);
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseFetch<T>(table: string, init: RequestInit, options: QueryOptions = {}): Promise<T[]> {
  const { url, key } = supabaseConfig();
  const query = new URLSearchParams();
  if (options.select) query.set("select", options.select);
  for (const [keyName, value] of Object.entries(options.filters ?? {})) query.set(keyName, value);
  if (options.order) query.set("order", options.order);
  if (options.limit) query.set("limit", String(options.limit));

  const response = await fetch(`${url}/rest/v1/${table}?${query.toString()}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) throw new Error(`Supabase ${table} request failed: ${response.status} ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) as T[] : [];
}

export function dbSelect<T>(table: string, options: QueryOptions = {}) {
  return supabaseFetch<T>(table, { method: "GET" }, { select: options.select ?? "*", ...options });
}

export function dbInsert<T>(table: string, body: Record<string, unknown> | Record<string, unknown>[]) {
  return supabaseFetch<T>(table, { method: "POST", body: JSON.stringify(body) }, { select: "*" });
}

export function dbUpdate<T>(table: string, filters: Record<string, string>, body: Record<string, unknown>) {
  return supabaseFetch<T>(table, { method: "PATCH", body: JSON.stringify(body) }, { select: "*", filters });
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
    await dbInsert("ai_audit_log", {
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
    // Audit failure must never take down a live receptionist call.
  }
}

export async function readJsonObject(req: NextRequest): Promise<Record<string, unknown> | null> {
  const value = await req.json().catch(() => null);
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function requiredString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
