import { requirePortalContext } from "../../lib/auth/portal-context";
import PortalClient from "./portal-client";

export default async function PortalPage() {
  const context = await requirePortalContext();
  const billing = context.billing;

  return (
    <PortalClient
      companyName={context.company.name}
      userEmail={context.user.email}
      role={context.role}
      planName={billing?.planName ?? "Virtual Office"}
      subscriptionStatus={billing?.subscriptionStatus ?? "not_configured"}
      monthlyPlanCents={billing?.monthlyPlanCents ?? 0}
      monthlyAddonsCents={billing?.monthlyAddonsCents ?? 0}
      outstandingCents={billing?.outstandingCents ?? 0}
    />
  );
}
