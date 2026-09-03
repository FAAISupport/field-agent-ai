"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PortalViewProps = {
  companyName: string;
  userEmail: string;
  role: string;
  planName: string;
  subscriptionStatus: string;
  monthlyPlanCents: number;
  monthlyAddonsCents: number;
  outstandingCents: number;
};

const categories = [
  { name: "Social Presence & Growth", services: [["Social Presence Setup", "$497 one-time", "one-time"], ["Social Presence Management", "$297/month", "monthly"], ["LinkedIn Company Page Setup", "$99 one-time", "one-time"], ["X Business Profile Setup", "$99 one-time", "one-time"], ["TikTok Business Account Setup", "$149 one-time", "one-time"], ["YouTube Brand Channel Setup", "$149 one-time", "one-time"]] },
  { name: "User & Account Administration", services: [["Add New Employee/User", "$25", "one-time"], ["Remove Employee/User", "$15", "one-time"], ["Password Reset", "Included", "included"], ["Change User Permissions", "$20", "one-time"], ["Update Business Hours", "$20", "one-time"], ["Holiday/Special Hours", "$15", "one-time"], ["Update Contact Information", "$15", "one-time"]] },
  { name: "Services, Territory & Pricing", services: [["Add/Change Service Area", "$25", "one-time"], ["Update Existing Service", "$25", "one-time"], ["Add New Service", "$50", "one-time"], ["Update Pricing", "$35", "one-time"], ["Update Estimate Template", "$50", "one-time"]] },
  { name: "Customer Experience & Scheduling", services: [["Add/Update FAQs", "$25", "one-time"], ["Update Appointment Rules", "$35", "one-time"], ["Modify Scheduling Rules", "$50", "one-time"], ["Update Lead Qualification Questions", "$50", "one-time"], ["Update SMS or Email Messages", "$35", "one-time"]] },
  { name: "AI, Workflows & Notifications", services: [["Modify Missed-Call Workflow", "$50", "one-time"], ["Update Notification/Escalation Rules", "$50", "one-time"], ["AI Receptionist Conversation Changes", "$75", "one-time"], ["New AI Workflow/Automation", "Starting at $150", "quote"]] },
  { name: "Data, Training & Growth", services: [["Customer Data Import", "Starting at $75", "quote"], ["CRM/Data Cleanup", "Starting at $75", "quote"], ["Staff Training", "$100/hour", "quote"], ["New Department", "Starting at $295", "quote"]] },
  { name: "Integrations & Development", services: [["New Software Integration", "Starting at $395", "quote"], ["Custom Development", "Quoted before work begins", "quote"]] },
] as const;

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function PortalClient(props: PortalViewProps) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return categories;
    return categories.map((category) => ({ ...category, services: category.services.filter(([name]) => name.toLowerCase().includes(q)) })).filter((category) => category.services.length > 0);
  }, [query]);

  return (
    <main className="portal-shell">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-brand">Field Agent AI</Link>
        <div className="portal-company">{props.companyName}</div>
        <nav><a href="#overview">Overview</a><a href="#services">Services</a><a href="#billing">Billing</a><a href="#orders">Service Orders</a><a href="#support">Support</a></nav>
      </aside>
      <section className="portal-main">
        <header className="portal-topbar">
          <div><span className="portal-eyebrow">FIELD AGENT AI, LLC</span><h1>{props.companyName} Virtual Office</h1><small>{props.userEmail} · {props.role}</small></div>
          <Link className="portal-outline-button" href="/">Back to website</Link>
        </header>
        <section id="overview" className="portal-hero-card">
          <div><span className="portal-status">AUTHENTICATED CUSTOMER PORTAL</span><h2>Everything your business needs, in one place.</h2><p>Your workspace is isolated to {props.companyName} and loaded from the authenticated company membership.</p></div>
          <div className="portal-plan-box"><span>Current plan</span><strong>{props.planName}</strong><small>{props.subscriptionStatus.replaceAll("_", " ")}</small></div>
        </section>
        <section id="billing" className="portal-stats">
          <article><span>Monthly plan</span><strong>{money(props.monthlyPlanCents)}</strong><small>Tenant billing record</small></article>
          <article><span>Monthly add-ons</span><strong>{money(props.monthlyAddonsCents)}</strong><small>Tenant billing record</small></article>
          <article><span>Outstanding balance</span><strong>{money(props.outstandingCents)}</strong><small>{props.outstandingCents ? "Payment due" : "Account current"}</small></article>
          <article><span>Open service orders</span><strong>0</strong><small>Order backend is next</small></article>
        </section>
        <section id="services" className="portal-section">
          <div className="portal-section-heading"><div><span className="portal-eyebrow">SERVICE MARKETPLACE</span><h2>Order changes and growth services</h2></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services..." aria-label="Search services" /></div>
          {visible.map((category) => <div className="portal-category" key={category.name}><h3>{category.name}</h3><div className="portal-service-grid">{category.services.map(([name, price, type]) => <article className="portal-service-card" key={name}><div><span className={`portal-badge portal-badge-${type}`}>{type === "monthly" ? "MONTHLY" : type === "included" ? "INCLUDED" : type === "quote" ? "REQUEST / QUOTE" : "ONE-TIME"}</span><h4>{name}</h4><strong>{price}</strong></div><button type="button" disabled title="Checkout and service-order wiring is being implemented next">Coming soon</button></article>)}</div></div>)}
        </section>
        <section id="orders" className="portal-section portal-empty-state"><span className="portal-eyebrow">SERVICE ORDERS</span><h2>Track every request from order to completion.</h2><p>Orders will appear here after the payment and service-order backend is connected.</p></section>
        <section id="support" className="portal-support"><div><span className="portal-eyebrow">NEED SOMETHING ELSE?</span><h2>Request custom work.</h2><p>Custom-work submission will be enabled with the service-order backend.</p></div><button type="button" disabled>Coming soon</button></section>
      </section>
    </main>
  );
}
