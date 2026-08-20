import type {
  ComplianceResult,
  GrowthAgent,
  Prospect,
  RevenueAssumptions,
  RevenueScenario
} from "./types";

export const TARGET_INDUSTRIES = [
  "Concrete Coatings",
  "Landscaping",
  "Tree Service",
  "Roofing",
  "HVAC",
  "Plumbing"
];

export const TARGET_MARKETS = [
  "Lake County, FL",
  "The Villages, FL",
  "Leesburg, FL",
  "Orlando, FL",
  "Tampa, FL",
  "Ocala, FL"
];

export const agents: GrowthAgent[] = [
  {
    id: "prospect-discovery",
    name: "Prospect Discovery Agent",
    purpose: "Find and score permitted public business prospects.",
    level: "green",
    status: "active",
    allowedActions: ["research_public_businesses", "deduplicate", "score_prospects"],
    prohibitedActions: ["buy_lists", "collect_sensitive_personal_data", "contact_prospects"],
    dailyLimit: 50,
    confidenceThreshold: 0.75
  },
  {
    id: "missed-call-audit",
    name: "Missed-Call Audit Agent",
    purpose: "Create private evidence-based lead-capture audits.",
    level: "green",
    status: "active",
    allowedActions: ["inspect_public_pages", "calculate_estimates", "create_private_audit"],
    prohibitedActions: ["submit_fake_leads", "publish_negative_findings", "guarantee_revenue"],
    dailyLimit: 20,
    confidenceThreshold: 0.8
  },
  {
    id: "outreach",
    name: "Outreach Agent",
    purpose: "Prepare and send approved low-volume business email campaigns.",
    level: "yellow",
    status: "blocked",
    allowedActions: ["draft_verified_email", "send_approved_email", "process_opt_out"],
    prohibitedActions: ["cold_sms", "automated_calls", "invent_personalization"],
    dailyLimit: 20,
    confidenceThreshold: 0.9
  },
  {
    id: "qualification",
    name: "Qualification Agent",
    purpose: "Qualify replies and recommend approved products.",
    level: "green",
    status: "active",
    allowedActions: ["answer_approved_faq", "qualify", "recommend_product"],
    prohibitedActions: ["negotiate", "discount", "promise_unavailable_features"],
    dailyLimit: 100,
    confidenceThreshold: 0.85
  },
  {
    id: "demo-booking",
    name: "Demo Booking Agent",
    purpose: "Schedule qualified prospects into approved calendar windows.",
    level: "green",
    status: "blocked",
    allowedActions: ["read_availability", "book_demo", "send_reminders"],
    prohibitedActions: ["move_protected_events", "promise_unconfirmed_attendance"],
    dailyLimit: 25,
    confidenceThreshold: 0.9
  },
  {
    id: "crm",
    name: "CRM Management Agent",
    purpose: "Maintain stages, activities, attribution, and next actions.",
    level: "green",
    status: "active",
    allowedActions: ["create_record", "update_stage", "schedule_follow_up"],
    prohibitedActions: ["permanently_delete", "export_private_data"],
    dailyLimit: 500,
    confidenceThreshold: 0.8
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    purpose: "Block unsupported claims and prohibited contact.",
    level: "green",
    status: "active",
    allowedActions: ["scan_content", "block_action", "create_approval"],
    prohibitedActions: ["override_suppression", "approve_red_action"],
    dailyLimit: 1000,
    confidenceThreshold: 0.95
  },
  {
    id: "executive-reporting",
    name: "Executive Reporting Agent",
    purpose: "Summarize results and exceptions for Judd.",
    level: "green",
    status: "active",
    allowedActions: ["aggregate_metrics", "rank_opportunities", "report_exceptions"],
    prohibitedActions: ["invent_attribution", "hide_failures"],
    dailyLimit: 1,
    confidenceThreshold: 0.9
  }
];

const blockedPatterns = [
  /guaranteed? (revenue|leads|savings|results)/i,
  /certified by/i,
  /official partner of/i,
  /you (lost|are losing) \$[\d,]+/i,
  /we spoke (before|previously)/i
];

const warningPatterns = [/best in the industry/i, /will increase/i, /never miss/i];

export function checkCompliance(content: string, suppressed = false): ComplianceResult {
  const blockedReasons = suppressed ? ["Contact is suppressed."] : [];
  const warnings: string[] = [];

  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) blockedReasons.push(`Blocked claim: ${pattern.source}`);
  }
  for (const pattern of warningPatterns) {
    if (pattern.test(content)) warnings.push(`Review wording: ${pattern.source}`);
  }

  return { passed: blockedReasons.length === 0, blockedReasons, warnings };
}

export function calculateRevenueScenario(input: RevenueAssumptions): RevenueScenario {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error("Revenue assumptions must be finite, non-negative numbers.");
  }
  const missedCalls = input.monthlyCalls * input.missedCallRate;
  const missedLeads = missedCalls * input.leadRate;
  const monthlyOpportunity =
    missedLeads * input.closeRate * input.recoveryRate * input.averageJobValue;

  return {
    missedCalls: Math.round(missedCalls),
    missedLeads: Math.round(missedLeads),
    monthlyOpportunity: Math.round(monthlyOpportunity),
    annualOpportunity: Math.round(monthlyOpportunity * 12)
  };
}

export function scoreProspect(prospect: Pick<Prospect, "industry" | "reviewCount" | "evidence">) {
  let score = 20;
  const reasons: string[] = [];
  if (TARGET_INDUSTRIES.some((industry) => industry.toLowerCase() === prospect.industry.toLowerCase())) {
    score += 25;
    reasons.push("Approved target industry");
  }
  if (prospect.reviewCount >= 20) {
    score += 15;
    reasons.push("Established public review footprint");
  }
  const observations = prospect.evidence.map((item) => item.observation.toLowerCase()).join(" ");
  if (observations.includes("no online booking")) {
    score += 15;
    reasons.push("No visible online booking");
  }
  if (observations.includes("after-hours")) {
    score += 10;
    reasons.push("After-hours response gap");
  }
  if (observations.includes("slow response") || observations.includes("unanswered")) {
    score += 15;
    reasons.push("Public communication concern");
  }
  return { score: Math.min(score, 100), reasons };
}

export function recommendProduct(answers: {
  missedCalls: boolean;
  needsInboundAnswering: boolean;
  needsCrm: boolean;
  needsScheduling: boolean;
}) {
  if (answers.needsCrm && (answers.needsInboundAnswering || answers.needsScheduling)) {
    return "Field Agent AI Virtual Office";
  }
  if (answers.needsCrm) return "HedgeBotCRM";
  if (answers.needsInboundAnswering) return "AI Virtual Receptionist";
  if (answers.missedCalls) return "Missed-Call Revenue Recovery";
  return "Free Workflow Consultation";
}
