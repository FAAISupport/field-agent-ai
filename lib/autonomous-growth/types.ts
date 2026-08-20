export type AutonomyLevel = "green" | "yellow" | "red";
export type AgentStatus = "active" | "paused" | "blocked";
export type ProspectStage =
  | "discovered"
  | "researching"
  | "audited"
  | "approved_for_outreach"
  | "contacted"
  | "engaged"
  | "qualified"
  | "demo_booked"
  | "proposal_sent"
  | "won"
  | "lost"
  | "nurture"
  | "suppressed";

export type GrowthAgent = {
  id: string;
  name: string;
  purpose: string;
  level: AutonomyLevel;
  status: AgentStatus;
  allowedActions: string[];
  prohibitedActions: string[];
  dailyLimit: number;
  confidenceThreshold: number;
};

export type Prospect = {
  id: string;
  companyName: string;
  industry: string;
  city: string;
  state: string;
  website: string;
  publicEmail?: string;
  publicPhone?: string;
  reviewCount: number;
  rating: number;
  fitScore: number;
  opportunityScore: number;
  stage: ProspectStage;
  suppressed: boolean;
  evidence: Evidence[];
};

export type Evidence = {
  id: string;
  type: "website" | "review" | "directory" | "manual";
  sourceUrl: string;
  observation: string;
  capturedAt: string;
  confidence: number;
  outreachEligible: boolean;
};

export type RevenueAssumptions = {
  monthlyCalls: number;
  missedCallRate: number;
  leadRate: number;
  averageJobValue: number;
  closeRate: number;
  recoveryRate: number;
};

export type RevenueScenario = {
  missedCalls: number;
  missedLeads: number;
  monthlyOpportunity: number;
  annualOpportunity: number;
};

export type ComplianceResult = {
  passed: boolean;
  blockedReasons: string[];
  warnings: string[];
};

export type GrowthOverview = {
  testMode: boolean;
  globalKillSwitch: boolean;
  metrics: Record<string, number>;
  agents: GrowthAgent[];
  prospects: Prospect[];
  approvals: Array<{
    id: string;
    type: string;
    summary: string;
    level: AutonomyLevel;
    status: "pending" | "approved" | "rejected";
  }>;
  activity: Array<{
    id: string;
    agent: string;
    action: string;
    outcome: string;
    createdAt: string;
  }>;
};
