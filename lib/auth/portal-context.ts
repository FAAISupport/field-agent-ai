import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";

export type PortalContext = {
  user: { id: string; email: string };
  company: { id: string; name: string; status: string };
  role: "owner" | "admin" | "member";
  billing: {
    planName: string | null;
    subscriptionStatus: string;
    monthlyPlanCents: number;
    monthlyAddonsCents: number;
    outstandingCents: number;
  } | null;
};

export async function requirePortalContext(): Promise<PortalContext> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: membership, error: membershipError } = await supabase
    .from("company_users")
    .select("role, company_id, companies(id,name,status)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    throw new Error("Authenticated user does not have an active company membership");
  }

  const companyValue = membership.companies as unknown;
  const company = Array.isArray(companyValue) ? companyValue[0] : companyValue;
  if (!company || typeof company !== "object") throw new Error("Company context could not be resolved");
  const typedCompany = company as { id: string; name: string; status: string };
  if (typedCompany.status !== "active") throw new Error("This company portal is not active");

  const { data: billing } = await supabase
    .from("billing_accounts")
    .select("plan_name, subscription_status, monthly_plan_cents, monthly_addons_cents, outstanding_cents")
    .eq("company_id", membership.company_id)
    .maybeSingle();

  return {
    user: { id: user.id, email: user.email ?? "" },
    company: typedCompany,
    role: membership.role as PortalContext["role"],
    billing: billing ? {
      planName: billing.plan_name,
      subscriptionStatus: billing.subscription_status,
      monthlyPlanCents: billing.monthly_plan_cents,
      monthlyAddonsCents: billing.monthly_addons_cents,
      outstandingCents: billing.outstanding_cents,
    } : null,
  };
}
