import { agents, calculateRevenueScenario } from "./engine";
import type { GrowthOverview, Prospect } from "./types";

const now = new Date().toISOString();

export const testProspects: Prospect[] = [
  {
    id: "test-prospect-001",
    companyName: "Central Florida Coatings (Test)",
    industry: "Concrete Coatings",
    city: "Leesburg",
    state: "FL",
    website: "https://example.com/test-coatings",
    publicEmail: "sandbox@example.com",
    reviewCount: 86,
    rating: 4.7,
    fitScore: 88,
    opportunityScore: 82,
    stage: "audited",
    suppressed: false,
    evidence: [
      {
        id: "evidence-001",
        type: "website",
        sourceUrl: "https://example.com/test-coatings",
        observation: "No online booking and no after-hours response instructions visible.",
        capturedAt: now,
        confidence: 0.92,
        outreachEligible: true
      }
    ]
  },
  {
    id: "test-prospect-002",
    companyName: "Ocala Outdoor Services (Test)",
    industry: "Landscaping",
    city: "Ocala",
    state: "FL",
    website: "https://example.com/test-landscaping",
    publicEmail: "suppressed@example.com",
    reviewCount: 41,
    rating: 4.4,
    fitScore: 74,
    opportunityScore: 68,
    stage: "suppressed",
    suppressed: true,
    evidence: []
  }
];

const scenario = calculateRevenueScenario({
  monthlyCalls: 180,
  missedCallRate: 0.22,
  leadRate: 0.6,
  averageJobValue: 2200,
  closeRate: 0.25,
  recoveryRate: 0.35
});

export const testOverview: GrowthOverview = {
  testMode: true,
  globalKillSwitch: true,
  metrics: {
    prospectsDiscovered: 2,
    approvedForOutreach: 0,
    auditsCreated: 1,
    outreachSent: 0,
    repliesReceived: 0,
    qualifiedLeads: 0,
    demosBooked: 0,
    proposalsGenerated: 0,
    customersWon: 0,
    estimatedMonthlyOpportunity: scenario.monthlyOpportunity,
    optOuts: 1,
    complaints: 0,
    suppressedContacts: 1,
    pendingApprovals: 1
  },
  agents,
  prospects: testProspects,
  approvals: [
    {
      id: "approval-001",
      type: "production_activation",
      summary: "Verify sender domain, calendar, and suppression webhook before enabling outreach.",
      level: "red",
      status: "pending"
    }
  ],
  activity: [
    {
      id: "activity-001",
      agent: "Missed-Call Audit Agent",
      action: "Created private test audit",
      outcome: "Passed compliance; no external communication sent",
      createdAt: now
    },
    {
      id: "activity-002",
      agent: "Compliance Agent",
      action: "Applied global kill switch",
      outcome: "Production outreach remains disabled",
      createdAt: now
    }
  ]
};
