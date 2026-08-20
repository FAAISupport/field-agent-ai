"use client";

import { useEffect, useMemo, useState } from "react";
import type { GrowthOverview, RevenueScenario } from "@/lib/autonomous-growth/types";

const tabs = [
  "Overview",
  "Prospects",
  "Audits",
  "Campaigns",
  "Conversations",
  "Qualified Leads",
  "Demonstrations",
  "Content",
  "Partners",
  "Compliance",
  "Approvals",
  "Analytics",
  "Agent Activity",
  "Settings"
];

const metricLabels: Record<string, string> = {
  prospectsDiscovered: "Prospects discovered",
  approvedForOutreach: "Approved for outreach",
  auditsCreated: "Audits created",
  outreachSent: "Outreach sent",
  repliesReceived: "Replies received",
  qualifiedLeads: "Qualified leads",
  demosBooked: "Demos booked",
  proposalsGenerated: "Proposals generated",
  customersWon: "Customers won",
  estimatedMonthlyOpportunity: "Estimated monthly opportunity",
  optOuts: "Opt-outs",
  complaints: "Complaints",
  suppressedContacts: "Suppressed contacts",
  pendingApprovals: "Pending approvals"
};

const moneyMetrics = new Set(["estimatedMonthlyOpportunity"]);

function formatMetric(key: string, value: number) {
  return moneyMetrics.has(key)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    : value.toLocaleString();
}

export default function AutonomousGrowthPage() {
  const [overview, setOverview] = useState<GrowthOverview | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [calculator, setCalculator] = useState({
    monthlyCalls: 180,
    missedCallRate: 0.22,
    leadRate: 0.6,
    averageJobValue: 2200,
    closeRate: 0.25,
    recoveryRate: 0.35
  });
  const [scenario, setScenario] = useState<RevenueScenario | null>(null);

  useEffect(() => {
    fetch("/api/autonomous-growth/overview", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error ?? "Unable to load growth data.");
        return response.json() as Promise<GrowthOverview>;
      })
      .then(setOverview)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const visibleMetrics = useMemo(
    () => Object.entries(overview?.metrics ?? {}).filter(([key]) => metricLabels[key]),
    [overview]
  );

  async function calculate() {
    const response = await fetch("/api/autonomous-growth/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(calculator)
    });
    const data = await response.json();
    if (response.ok) setScenario(data.result);
  }

  if (error) {
    return (
      <main className="growth-shell">
        <div className="growth-state growth-error">
          <strong>Autonomous Growth is unavailable</strong>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!overview) {
    return (
      <main className="growth-shell">
        <div className="growth-state">Loading autonomous growth controls…</div>
      </main>
    );
  }

  return (
    <main className="growth-shell">
      <header className="growth-header">
        <div>
          <a href="/" className="growth-back">← Field Agent AI</a>
          <p className="growth-eyebrow">Autonomous Growth Engine v1.0</p>
          <h1>Growth Control Center</h1>
          <p>Manage by exception. Agents research, audit, qualify, and report inside approved limits.</p>
        </div>
        <div className="growth-mode-stack">
          <span className={`mode-pill ${overview.testMode ? "mode-test" : "mode-live"}`}>
            {overview.testMode ? "TEST MODE" : "PRODUCTION"}
          </span>
          <span className={`kill-pill ${overview.globalKillSwitch ? "is-on" : "is-off"}`}>
            Global kill switch: {overview.globalKillSwitch ? "ON" : "OFF"}
          </span>
        </div>
      </header>

      {overview.testMode && (
        <section className="safety-banner">
          <strong>Safe test mode is active.</strong>
          <span>Synthetic data only. No email, SMS, calls, calendar events, or external publishing can occur.</span>
        </section>
      )}

      <nav className="growth-tabs" aria-label="Autonomous Growth sections">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Overview" && (
        <>
          <section className="growth-metrics">
            {visibleMetrics.map(([key, value]) => (
              <article className="metric-card" key={key}>
                <span>{metricLabels[key]}</span>
                <strong>{formatMetric(key, value)}</strong>
              </article>
            ))}
          </section>

          <section className="growth-grid two-columns">
            <article className="growth-panel">
              <div className="panel-heading">
                <div>
                  <p className="growth-eyebrow">Pilot workflow</p>
                  <h2>Central Florida Concrete Coatings</h2>
                </div>
                <span className="status-chip blocked">External sending blocked</span>
              </div>
              <div className="workflow-line">
                {["Discover 50", "Score 20", "Audit 10", "Compliance", "Qualify", "Book demo", "Report"].map(
                  (step, index) => (
                    <div key={step} className="workflow-step">
                      <span>{index + 1}</span>
                      <strong>{step}</strong>
                    </div>
                  )
                )}
              </div>
            </article>

            <article className="growth-panel">
              <div className="panel-heading">
                <div>
                  <p className="growth-eyebrow">Judd’s queue</p>
                  <h2>Approvals required</h2>
                </div>
              </div>
              <div className="stack-list">
                {overview.approvals.map((approval) => (
                  <div className="list-row" key={approval.id}>
                    <div><strong>{approval.type.replaceAll("_", " ")}</strong><span>{approval.summary}</span></div>
                    <span className={`level-badge level-${approval.level}`}>{approval.level}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="growth-grid two-columns">
            <article className="growth-panel">
              <div className="panel-heading"><div><p className="growth-eyebrow">Agent health</p><h2>Autonomy registry</h2></div></div>
              <div className="stack-list">
                {overview.agents.map((agent) => (
                  <div className="agent-row" key={agent.id}>
                    <div><strong>{agent.name}</strong><span>{agent.purpose}</span></div>
                    <div className="agent-badges">
                      <span className={`level-badge level-${agent.level}`}>{agent.level}</span>
                      <span className={`status-chip ${agent.status}`}>{agent.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="growth-panel calculator-panel">
              <div className="panel-heading"><div><p className="growth-eyebrow">Transparent assumptions</p><h2>Opportunity calculator</h2></div></div>
              <div className="calculator-grid">
                {Object.entries(calculator).map(([key, value]) => (
                  <label key={key}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase())}
                    <input
                      type="number"
                      min="0"
                      step={key.includes("Rate") || key === "leadRate" || key === "closeRate" || key === "recoveryRate" ? "0.01" : "1"}
                      value={value}
                      onChange={(event) => setCalculator((current) => ({ ...current, [key]: Number(event.target.value) }))}
                    />
                  </label>
                ))}
              </div>
              <button className="growth-button" onClick={calculate}>Calculate illustrative range</button>
              {scenario && (
                <div className="scenario-result">
                  <span>Estimated monthly opportunity</span>
                  <strong>{formatMetric("estimatedMonthlyOpportunity", scenario.monthlyOpportunity)}</strong>
                  <small>Illustrative only. Not a guarantee of leads, revenue, savings, or performance.</small>
                </div>
              )}
            </article>
          </section>

          <section className="growth-panel">
            <div className="panel-heading"><div><p className="growth-eyebrow">Latest activity</p><h2>Evidence and outcomes</h2></div></div>
            <div className="stack-list">
              {overview.activity.map((item) => (
                <div className="list-row" key={item.id}>
                  <div><strong>{item.agent}: {item.action}</strong><span>{item.outcome}</span></div>
                  <time>{new Date(item.createdAt).toLocaleString()}</time>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "Prospects" && (
        <section className="growth-panel">
          <div className="panel-heading"><div><p className="growth-eyebrow">Permissioned public research</p><h2>Prospects</h2></div></div>
          <div className="prospect-table">
            <div className="table-row table-head"><span>Company</span><span>Market</span><span>Fit</span><span>Opportunity</span><span>Stage</span></div>
            {overview.prospects.map((prospect) => (
              <div className="table-row" key={prospect.id}>
                <span><strong>{prospect.companyName}</strong><small>{prospect.industry}</small></span>
                <span>{prospect.city}, {prospect.state}</span>
                <span>{prospect.fitScore}</span>
                <span>{prospect.opportunityScore}</span>
                <span className={`status-chip ${prospect.suppressed ? "blocked" : "active"}`}>{prospect.stage.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab !== "Overview" && activeTab !== "Prospects" && (
        <section className="growth-panel empty-section">
          <p className="growth-eyebrow">{activeTab}</p>
          <h2>Foundation installed</h2>
          <p>This module is represented in the production schema and agent policy. Its live adapter remains disabled until the required provider credentials and verification steps are complete.</p>
          <span className="status-chip blocked">Blocked by external configuration</span>
        </section>
      )}
    </main>
  );
}
