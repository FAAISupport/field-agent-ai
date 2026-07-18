"use client";

import { useEffect, useState } from "react";

type AppCard = {
  name: string;
  market: string;
  summary: string;
  accent: string;
  positioning: string;
  features: string[];
  sharedCore: string[];
  industryFit: string[];
};

const trustPoints = [
  "Built for real service businesses",
  "Practical automation, not chatbot theater",
  "Designed for calls, scheduling, estimates, and follow-up",
  "AI systems that connect to real workflows"
];

const apps: AppCard[] = [
  {
    name: "HedgeBotCRM",
    market: "Landscaping and lawn care",
    summary:
      "AI office manager for green industry teams that need faster lead response, estimate follow-up, and crew coordination.",
    accent: "green",
    positioning:
      "Built for companies managing recurring service, seasonal demand, estimates, and crew-based field work.",
    features: ["AI receptionist", "Seasonal campaigns", "Estimate follow-up"],
    sharedCore: ["Lead capture", "Scheduling", "Messaging automation"],
    industryFit: ["Seasonal sales flow", "Property-based quoting", "Crew coordination"]
  },
  {
    name: "ApplianceBot.net",
    market: "Appliance repair",
    summary:
      "AI receptionist and scheduler that captures appliance details, books service calls, and reduces admin drag for repair shops.",
    accent: "blue",
    positioning:
      "Built for businesses that need better intake, cleaner diagnostic details, and tighter appointment scheduling for technicians.",
    features: ["Issue capture", "Appointment booking", "Reminder automation"],
    sharedCore: ["Call answering", "CRM workflows", "Customer reminders"],
    industryFit: ["Brand/model intake", "Repair-specific scheduling", "Service-call preparation"]
  },
  {
    name: "PoolBotCRM",
    market: "Pool service",
    summary:
      "AI office manager and route automation layer for recurring service, customer reminders, and operational visibility.",
    accent: "silver",
    positioning:
      "Built for route-based operators who need recurring visits, service records, customer communication, and billing support to stay aligned.",
    features: ["Route management", "Service logs", "Recurring billing support"],
    sharedCore: ["AI receptionist", "Customer messaging", "Operational dashboards"],
    industryFit: ["Weekly route logic", "Visit tracking", "Recurring customer workflows"]
  },
  {
    name: "TreeBotCRM",
    market: "Tree service",
    summary:
      "Storm-ready CRM and AI office manager for emergency call capture, estimate booking, and dispatch-heavy operations.",
    accent: "lime",
    positioning:
      "Built for businesses handling urgent inbound demand, estimate-heavy sales, large jobs, and storm-response spikes.",
    features: ["Storm mode", "Crew dispatch", "Review requests"],
    sharedCore: ["Lead recovery", "Estimate follow-up", "Review automation"],
    industryFit: ["Emergency intake", "Dispatch prioritization", "Storm-volume handling"]
  }
];

const appCoreCapabilities = [
  "Every product shares the same automation backbone for calls, CRM, scheduling, messaging, reviews, and reporting",
  "Each app is adapted to the language, service flow, customer expectations, and job structure of its industry",
  "This lets Field Agent AI launch purpose-built vertical systems faster without shipping generic software"
];

const futureApps = [
  "RoofBotCRM",
  "IrrigationBotCRM",
  "PlumbingBotCRM",
  "HVACBotCRM",
  "PressureWashBotCRM",
  "CleaningBotCRM",
  "PestBotCRM"
];

const problems = [
  "Missed calls during busy hours",
  "Slow response to new leads",
  "Inconsistent scheduling and dispatch",
  "Estimates that never get followed up",
  "Too much manual texting, emailing, and admin work"
];

const solutions = [
  "AI receptionist and voice agent workflows",
  "Missed-call text-back and lead recovery",
  "Appointment scheduling automation",
  "Estimate follow-up and customer reminders",
  "CRM, SMS, email, and payment automation",
  "Review generation and reactivation campaigns"
];

const platformLayers = [
  {
    name: "AI receptionist layer",
    copy:
      "Answers calls, captures intent, qualifies new leads, and routes customers into the right workflow without relying on office staff to catch every first touch."
  },
  {
    name: "CRM layer",
    copy:
      "Stores lead, customer, job, and communication history in one operating record so every automation has the right context."
  },
  {
    name: "Scheduling layer",
    copy:
      "Handles appointment booking, technician or crew availability, route logic, reminders, and reschedules with less manual coordination."
  },
  {
    name: "Estimate layer",
    copy:
      "Moves prospects from inquiry to quote to follow-up with structured estimate workflows designed to reduce slow responses and lost jobs."
  },
  {
    name: "Job management layer",
    copy:
      "Keeps jobs, crews, dispatch activity, and operational milestones connected so the front office and field team are working from the same system."
  },
  {
    name: "Messaging layer",
    copy:
      "Automates SMS and email touchpoints for confirmation, reminders, follow-up, reactivation, and customer communication."
  },
  {
    name: "Payment layer",
    copy:
      "Connects invoicing, payment collection, and payment-triggered workflows so booked work turns into completed revenue faster."
  },
  {
    name: "Review layer",
    copy:
      "Triggers timely review requests and post-job reputation workflows that help service businesses convert satisfied customers into public proof."
  },
  {
    name: "Analytics layer",
    copy:
      "Measures lead response, booking flow, campaign performance, missed-call recovery, and operational throughput so the system can improve."
  },
  {
    name: "Industry workflow layer",
    copy:
      "Adapts the entire platform to the terminology, customer journey, scheduling model, and field reality of each specific trade."
  }
];

const platformPrinciples = [
  "One reusable automation core supports multiple vertical products",
  "Each app inherits the same operating foundation, then adds industry-specific workflows",
  "The platform is built around real calls, jobs, estimates, reminders, and payments",
  "This architecture lets Field Agent AI launch faster without shipping generic software"
];

const services = [
  {
    title: "AI Front Office Systems",
    summary:
      "We design the customer-facing automation layer that answers calls, captures leads, qualifies requests, and routes every conversation into the right workflow.",
    outcomes: [
      "AI receptionist setup and call handling",
      "Missed-call text-back and lead recovery",
      "Voice AI agent development",
      "Website chat and instant inquiry capture"
    ]
  },
  {
    title: "Scheduling, Estimates, And Follow-Up",
    summary:
      "We automate the speed-critical work that usually breaks between the first contact and the booked job, including calendars, quoting flow, reminders, and persistent follow-up.",
    outcomes: [
      "Appointment scheduling automation",
      "Estimate delivery and follow-up sequences",
      "Customer reminders and status updates",
      "Reactivation campaigns for old leads"
    ]
  },
  {
    title: "CRM And Operational Automation",
    summary:
      "We connect your core systems so customer data, jobs, communication, payments, and team workflows stop living in disconnected tools and manual admin routines.",
    outcomes: [
      "CRM pipeline and lifecycle automation",
      "Job and crew workflow coordination",
      "SMS and email workflow design",
      "Custom dashboards and reporting views"
    ]
  },
  {
    title: "Integrations And Automation Stack",
    summary:
      "Field Agent AI implements the underlying infrastructure required to make automation reliable, measurable, and usable inside real service companies.",
    outcomes: [
      "Twilio phone and messaging setup",
      "Stripe, calendar, and booking integrations",
      "OpenAI workflow orchestration",
      "End-to-end business automation consulting"
    ]
  }
];

const serviceHighlights = [
  "Built around real service-business workflows, not generic chatbot demos",
  "Configured for your industry language, lead flow, and scheduling model",
  "Designed to reduce response time, admin overhead, and missed revenue",
  "Implemented as a connected operating system instead of one-off tools"
];

const industries = [
  "Landscaping",
  "Lawn Care",
  "Appliance Repair",
  "Pool Service",
  "Tree Service",
  "HVAC",
  "Plumbing",
  "Roofing",
  "Pest Control",
  "Cleaning",
  "Irrigation",
  "Pressure Washing"
];

const steps = [
  {
    number: "01",
    title: "Audit your workflow",
    copy:
      "We map where calls, leads, scheduling, and follow-up are leaking revenue."
  },
  {
    number: "02",
    title: "Deploy your automation stack",
    copy:
      "We configure the right AI systems for your business model, team structure, and service flow."
  },
  {
    number: "03",
    title: "Connect your tools",
    copy:
      "Phone, CRM, scheduling, messaging, payments, and reporting move into one operating layer."
  },
  {
    number: "04",
    title: "Optimize and scale",
    copy:
      "We tune response time, booking flow, and follow-up so the system gets stronger as volume grows."
  }
];

const deploymentPhases = [
  {
    phase: "Signal",
    timing: "Before launch",
    title: "Map the revenue leaks",
    copy: "A short remote discovery maps calls, missed-call behavior, calendars, estimates, teams, and the customer handoffs that need to stay connected."
  },
  {
    phase: "Shape",
    timing: "Remote configuration",
    title: "Build the office around the business",
    copy: "We configure the voice, intake questions, appointment rules, quote follow-up, messages, and escalation paths to sound and work like the client’s company."
  },
  {
    phase: "Switch On",
    timing: "Guided go-live",
    title: "Connect, test, and launch",
    copy: "Phone, calendar, CRM, messaging, and payment workflows are connected, tested against real scenarios, and released with the team in the loop."
  },
  {
    phase: "Compound",
    timing: "Ongoing optimization",
    title: "Turn activity into an advantage",
    copy: "Response patterns, booking outcomes, missed opportunities, and customer questions guide the next automation improvements as volume grows."
  }
];

const automationCore = ["Voice + SMS", "Scheduling", "CRM", "Quotes", "Payments", "Reviews"];

const expansionWaves = [
  { wave: "Now", title: "Proof categories", trades: "Landscaping · Appliance repair · Pool service · Tree service" },
  { wave: "Next", title: "Urgent-response trades", trades: "HVAC · Plumbing · Roofing · Pest control" },
  { wave: "Then", title: "Recurring & route-based", trades: "Irrigation · Cleaning · Pressure washing · Electrical" }
];

const roiStats = [
  { value: "24/7", label: "Lead capture coverage" },
  { value: "< 60s", label: "Ideal response speed" },
  { value: "1 Core", label: "Reusable automation platform" },
  { value: "4 Apps", label: "Current vertical products" }
];

const investorThesis = [
  {
    number: "01",
    title: "A focused wedge",
    copy: "Start with high-frequency service workflows where missed calls, slow response, and manual follow-up have an immediate cost."
  },
  {
    number: "02",
    title: "Repeatable deployment",
    copy: "Reuse the same automation core while configuring the language, intake, scheduling, and follow-up flows for each trade."
  },
  {
    number: "03",
    title: "Multiple paths to scale",
    copy: "Expand through direct implementations, vertical products, strategic partners, and a growing library of industry-specific workflows."
  }
];

const investorMilestones = [
  "Virtual Office Manager deployments for service businesses",
  "Four live vertical product concepts built on one shared core",
  "Expansion roadmap across additional high-volume home-service categories"
];

const heroSlides = [
  {
    eyebrow: "Official Company Website",
    title: "AI Operating Systems For The Businesses That Keep America Running.",
    copy:
      "Field Agent AI builds industry-specific AI office managers that answer calls, book jobs, create estimates, follow up with customers, and automate business operations from front office to field crew.",
    support: "Built for real-world service companies, not tech demos.",
    primaryLabel: "Book An AI Automation Consultation",
    primaryHref: "#consultation",
    secondaryLabel: "Explore Our Apps",
    secondaryHref: "#apps"
  },
  {
    eyebrow: "Most Popular Service",
    title: "Your Virtual Office Manager Never Clocks Out.",
    copy:
      "Remotely installed and configured around your business, our Virtual Office Manager captures every call, appointment request, quote, and follow-up opportunity—so your team can stay focused on the work in the field.",
    support: "Always on. Built around your workflow. Ready when your customers call.",
    primaryLabel: "Install My Virtual Office Manager",
    primaryHref: "#consultation",
    secondaryLabel: "See How It Works",
    secondaryHref: "#services"
  },
  {
    eyebrow: "The Field Agent AI Launch Grid™",
    title: "Remote deployment, made operational.",
    copy:
      "The Launch Grid is our signature deployment system for turning a Virtual Office Manager into a living part of your business—configured remotely, connected to your tools, and continuously sharpened around real customer activity.",
    support: "Signal. Shape. Switch On. Compound.",
    primaryLabel: "Explore The Launch Grid",
    primaryHref: "#deployment",
    secondaryLabel: "View Deployment Plan",
    secondaryHref: "#deployment"
  }
];

function SectionHeading({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

function AppShowcaseCard({ app }: { app: AppCard }) {
  return (
    <article className={`card app-card accent-${app.accent}`}>
      <div className="card-glow" />
      <p className="card-kicker">{app.market}</p>
      <h3>{app.name}</h3>
      <p>{app.summary}</p>
      <p className="app-positioning">{app.positioning}</p>
      <div className="app-meta-block">
        <strong>Shared platform core</strong>
        <ul className="tag-list">
          {app.sharedCore.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="app-meta-block">
        <strong>Industry-specific fit</strong>
        <ul className="tag-list">
          {app.industryFit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <ul className="tag-list">
        {app.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <a href="#consultation" className="text-link">
        Explore {app.name}
      </a>
    </article>
  );
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  const hero = heroSlides[activeHero];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveHero((currentHero) => (currentHero + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-backdrop" />
        <div className="hero-grid" />
        <header className="topbar">
          <a href="#" className="brand">
            <span className="brand-mark">FA</span>
            <span>
              Field Agent AI
              <strong> LLC</strong>
            </span>
          </a>
          <nav className="nav">
            <a href="#apps">Apps</a>
            <a href="#services">Services</a>
            <a href="#industries">Industries</a>
            <a href="#consultation" className="button button-ghost">
              Book Consultation
            </a>
          </nav>
        </header>

        <div className="hero-content container">
          <div className="hero-copy" key={activeHero}>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p className="hero-subcopy">{hero.copy}</p>
            <p className="hero-support">{hero.support}</p>
            <div className="cta-row">
              <a href={hero.primaryHref} className="button button-primary">
                {hero.primaryLabel}
              </a>
              <a href={hero.secondaryHref} className="button button-secondary">
                {hero.secondaryLabel}
              </a>
            </div>
            <div className="hero-pagination" aria-label="Hero slides">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={index === activeHero ? "is-active" : ""}
                  aria-label={`Show ${slide.eyebrow.toLowerCase()} slide`}
                  aria-pressed={index === activeHero}
                  onClick={() => setActiveHero(index)}
                />
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className={`command-center ${activeHero === 1 ? "virtual-office-center" : ""}`}>
              <div className="orbital orbital-one" />
              <div className="orbital orbital-two" />
              {activeHero === 0 ? (
                <>
                  <div className="dashboard-window">
                    <div className="window-header">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="dashboard-metrics">
                      <div><small>Captured Leads</small><strong>184</strong></div>
                      <div><small>Booked Jobs</small><strong>73</strong></div>
                      <div><small>Missed Calls Recovered</small><strong>91%</strong></div>
                    </div>
                    <div className="waveform" aria-hidden="true">
                      {Array.from({ length: 36 }).map((_, index) => (
                        <span key={index} style={{ animationDelay: `${index * 90}ms` }} />
                      ))}
                    </div>
                  </div>
                  <div className="floating-cards">
                    {apps.map((app, index) => (
                      <div key={app.name} className={`floating-app floating-${index + 1} accent-${app.accent}`}>
                        <strong>{app.name}</strong><span>{app.market}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : activeHero === 1 ? (
                <div className="virtual-office-window">
                  <div className="virtual-office-header">
                    <span className="status-dot" />
                    <div><small>Virtual Office Manager</small><strong>Always on duty</strong></div>
                    <span className="live-badge">LIVE</span>
                  </div>
                  <div className="office-activity">
                    <div><span className="activity-icon">☎</span><p><strong>Incoming call answered</strong><small>New service request captured</small></p><b>Now</b></div>
                    <div><span className="activity-icon calendar-icon">▣</span><p><strong>Appointment booked</strong><small>Tuesday · 10:30 AM</small></p><b>Done</b></div>
                    <div><span className="activity-icon quote-icon">$</span><p><strong>Quote follow-up sent</strong><small>Estimate #1048</small></p><b>Sent</b></div>
                  </div>
                  <div className="office-coverage"><span>24/7 customer coverage</span><strong>Nothing slips through.</strong></div>
                </div>
              ) : (
                <div className="launch-hero-window">
                  <div className="launch-hero-brand"><span>FAI</span><strong>LAUNCH<br />GRID</strong><i>™</i></div>
                  <p>Remote deployment system</p>
                  <div className="launch-hero-rings" aria-hidden="true"><span /><span /><span /></div>
                  <div className="launch-hero-hub"><small>VIRTUAL OFFICE</small><strong>LIVE</strong></div>
                  <div className="launch-hero-stages"><span>01 Signal</span><span>02 Shape</span><span>03 Switch On</span><span>04 Compound</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip container">
        {trustPoints.map((point) => (
          <div key={point} className="trust-pill">
            {point}
          </div>
        ))}
      </section>

      <section id="apps" className="section container">
        <SectionHeading
          eyebrow="App Ecosystem"
          title="One Automation Core. Multiple Industry-Specific Apps."
          copy="Field Agent AI develops vertical AI business systems for industries where missed calls, slow follow-up, weak scheduling, and manual office work cost real money. Each product inherits the same automation backbone, then gets tuned to the workflows, terminology, sales motion, and operational reality of its market."
        />
        <div className="ecosystem-intro">
          <div className="ecosystem-copy card">
            <p className="card-kicker">How The Ecosystem Works</p>
            <h3>Shared platform foundation. Vertical-specific execution.</h3>
            <p>
              HedgeBotCRM, ApplianceBot.net, PoolBotCRM, and TreeBotCRM are not
              disconnected products. They are purpose-built operating systems built
              on top of the same Field Agent AI platform, which means they share
              core automation capabilities while still matching the daily operating
              reality of each trade.
            </p>
            <ul className="stack-list compact">
              {appCoreCapabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card-grid four-up">
          {apps.map((app) => (
            <AppShowcaseCard key={app.name} app={app} />
          ))}
        </div>
        <div className="future-strip">
          <div>
            <p className="eyebrow">In Development</p>
            <h3>Coming ecosystem</h3>
            <p>
              The same automation core is expanding into additional service
              industries without pretending unfinished products are already live.
            </p>
          </div>
          <div className="future-grid">
            {futureApps.map((app) => (
              <span key={app}>{app}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-contrast">
        <div className="container split">
          <div>
            <SectionHeading
              eyebrow="The Problem"
              title="The Work That Slows Service Businesses Down Is Usually Office Work."
              copy="Missed calls turn into missed revenue. Slow estimates lose jobs. Manual scheduling creates bottlenecks. Weak follow-up leaves leads cold. Most service businesses are not losing because of field performance. They are losing because the front office cannot keep up."
            />
            <ul className="stack-list">
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
          <div className="comparison-panel">
            <div className="comparison before">
              <p className="panel-label">Before AI</p>
              <strong>Admin-heavy and reactive</strong>
              <span>Missed calls</span>
              <span>Manual follow-up</span>
              <span>Scattered tools</span>
            </div>
            <div className="comparison after">
              <p className="panel-label">After AI</p>
              <strong>Automated and response-driven</strong>
              <span>Instant lead capture</span>
              <span>Booked jobs faster</span>
              <span>Connected workflows</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split reverse">
          <div className="pipeline">
            <div className="pipeline-line" />
            {["Inbound Calls", "Lead Capture", "Scheduling", "Estimates", "Follow-up", "Reviews", "Payments"].map(
              (item) => (
                <div key={item} className="pipeline-node">
                  {item}
                </div>
              )
            )}
          </div>
          <div>
            <SectionHeading
              eyebrow="The Solution"
              title="AI Automation That Handles The Daily Work For You."
              copy="Field Agent AI installs practical automation systems that answer calls, capture leads, schedule work, send follow-ups, and keep your business moving without adding more office overhead."
            />
            <div className="feature-grid">
              {solutions.map((solution) => (
                <div key={solution} className="feature-tile">
                  {solution}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="deployment" className="section deployment-section">
        <div className="container">
          <SectionHeading
            eyebrow="The Field Agent AI Launch Grid™"
            title="A remote deployment system built to become operational."
            copy="The Launch Grid is the signature Field Agent AI method for making a Virtual Office Manager feel native to each service business—not bolted on. Every deployment starts with the same reliable core, then gets shaped around the trade, team, and customer journey."
          />

          <div className="launch-brand-bar">
            <div className="launch-brand-lockup"><span>FAI</span><strong>THE LAUNCH GRID<sup>™</sup></strong></div>
            <p>Signal → Shape → Switch On → Compound</p>
            <span className="launch-brand-descriptor">A Field Agent AI deployment system</span>
          </div>

          <div className="launch-grid">
            <div className="deployment-steps">
              {deploymentPhases.map((item, index) => (
                <article key={item.phase} className="deployment-step">
                  <div className="deployment-index"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
                  <div>
                    <p className="card-kicker">{item.phase} · {item.timing}</p>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="core-map">
              <div className="core-map-grid" aria-hidden="true" />
              <p className="core-map-label">The shared automation core</p>
              <div className="core-hub"><span>Field Agent AI</span><strong>Virtual Office<br />Manager</strong></div>
              <div className="core-nodes">
                {automationCore.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="core-map-footer"><span>Remote install</span><span>Trade-specific configuration</span><span>Continuous improvement</span></div>
            </div>
          </div>

          <div className="expansion-roadmap">
            <div className="expansion-intro"><p className="card-kicker">Expansion Roadmap</p><h3>One launch system. An increasingly valuable family of brands.</h3></div>
            <div className="expansion-waves">
              {expansionWaves.map((wave) => (
                <article key={wave.wave}>
                  <span>{wave.wave}</span><h4>{wave.title}</h4><p>{wave.trades}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-contrast">
        <div className="container">
          <SectionHeading
            eyebrow="Platform"
            title="Meet The Field Agent AI Platform."
            copy="Field Agent AI builds vertical AI operating systems by combining a reusable automation core with industry-specific workflows, language, customer journeys, and operating rules. The result is not a generic assistant. It is a business system designed to run the work that service companies deal with every day."
          />
          <div className="platform-layout">
            <div className="platform-intro card">
              <p className="card-kicker">Platform Architecture</p>
              <h3>One automation backbone. Multiple industry-specific operating systems.</h3>
              <p>
                Instead of rebuilding everything from scratch for every market,
                Field Agent AI uses a shared platform architecture for lead capture,
                communication, scheduling, estimates, payments, reviews, and
                reporting. Each vertical product then layers in the workflows,
                language, and job logic that make sense for that industry.
              </p>
              <ul className="stack-list compact">
                {platformPrinciples.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </div>

            <div className="layer-grid">
              {platformLayers.map((layer) => (
                <article key={layer.name} className="layer-card">
                  <h3>{layer.name}</h3>
                  <p>{layer.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Services"
          title="Complete AI Automation Services For Service Businesses."
          copy="Need more than software? Field Agent AI designs, installs, and connects complete AI automation systems for service companies that want faster response times, stronger follow-up, cleaner operations, and a front office that can scale without adding more administrative headcount."
        />
        <div id="services" className="services-layout">
          <div className="services-intro card">
            <p className="card-kicker">What We Implement</p>
            <h3>Field Agent AI acts like an automation partner, not just a software vendor.</h3>
            <p>
              We map your lead flow, customer communication, scheduling process,
              estimate process, and operational bottlenecks, then build the
              automation stack that keeps those workflows moving consistently.
            </p>
            <ul className="stack-list compact">
              {serviceHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <p className="card-kicker">Service Pillar</p>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul className="service-detail-list">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="center-cta">
          <a href="#consultation" className="button button-primary">
            Automate My Business
          </a>
        </div>
      </section>

      <section id="industries" className="section section-contrast">
        <div className="container">
          <SectionHeading
            eyebrow="Industries"
            title="Built To Expand Across The Trades."
            copy="Our automation framework adapts to the exact workflows of service businesses across home services, repair, maintenance, route-based operations, and field teams."
          />
          <div className="industry-grid">
            {industries.map((industry) => (
              <div key={industry} className="industry-tile">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="How It Works"
          title="How Field Agent AI Gets Deployed."
        />
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-contrast">
        <div className="container split">
          <div>
            <SectionHeading
              eyebrow="Voice AI"
              title="Your AI Receptionist Never Misses The Call."
              copy="From first ring to booked job, Field Agent AI can capture inbound demand, qualify the customer, route the conversation, and trigger the next step automatically."
            />
            <ul className="stack-list">
              <li>Answer calls instantly</li>
              <li>Capture customer details</li>
              <li>Recover missed calls by text</li>
              <li>Trigger scheduling and follow-up workflows</li>
            </ul>
          </div>
          <div className="voice-panel">
            <div className="voice-screen">
              <p className="panel-label">Live Call Flow</p>
              <strong>Lead to booking in one connected sequence</strong>
              <div className="waveform large" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    style={{ animationDelay: `${index * 110}ms` }}
                  />
                ))}
              </div>
              <div className="call-flow">
                <span>Call answered</span>
                <span>Info captured</span>
                <span>Job booked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split reverse">
          <div className="dashboard-stack">
            <div className="ui-card primary-ui">
              <small>Pipeline Overview</small>
              <strong>Appointments, leads, follow-up, and jobs in one view.</strong>
            </div>
            <div className="ui-card secondary-ui">
              <small>Automation Activity</small>
              <strong>Text-back, reminders, estimates, and review requests firing automatically.</strong>
            </div>
            <div className="ui-card tertiary-ui">
              <small>Response Metrics</small>
              <strong>Track speed-to-lead, booked jobs, and recovered revenue.</strong>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Dashboard Preview"
              title="One View Of The Work That Matters."
              copy="See leads, appointments, follow-up, estimates, messages, and pipeline activity in one intelligent operating layer built for service businesses."
            />
          </div>
        </div>
      </section>

      <section className="section section-contrast">
        <div className="container">
          <SectionHeading
            eyebrow="ROI"
            title="Recover Revenue. Reduce Admin Load. Respond Faster."
            copy="The right automation stack helps service businesses stop losing money to missed calls, delayed follow-up, and office bottlenecks."
          />
          <div className="stats-grid">
            {roiStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="partner-banner">
          <div>
            <p className="eyebrow">Growth Channels</p>
            <h2>Built For Growth, Partnerships, And Expansion.</h2>
            <p>
              Field Agent AI is building a scalable ecosystem of vertical AI
              operating systems. We welcome conversations with strategic partners,
              affiliates, resellers, and aligned investors.
            </p>
          </div>
          <div className="cta-row">
            <a href="#consultation" className="button button-secondary">
              Partner With Us
            </a>
            <a href="#investors" className="button button-ghost">
              Investor Overview
            </a>
          </div>
        </div>
      </section>

      <section id="investors" className="section investor-section">
        <div className="container investor-overview">
          <div className="investor-hero-copy">
            <p className="eyebrow">Investor Overview</p>
            <p className="investor-label">Field Agent AI, LLC · Private Company</p>
            <h2>Building the operating layer for the service economy.</h2>
            <p>
              Field Agent AI turns the work that overwhelms small and mid-sized
              service offices into connected, always-on systems. The opportunity
              is to own the workflow between the first customer call and a
              completed, paid job—then repeat that model trade by trade.
            </p>
            <div className="cta-row">
              <a href="#consultation" className="button button-primary">
                Request A Private Overview
              </a>
              <a href="#apps" className="button button-secondary">
                Explore The Platform
              </a>
            </div>
          </div>

          <div className="investor-signal-card" aria-label="Investment case">
            <div className="signal-card-top">
              <span>Investment case</span>
              <b>Early stage</b>
            </div>
            <div className="signal-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="signal-statement">
              <strong>One core platform.</strong>
              <span>Many service-business applications.</span>
            </div>
            <div className="signal-metrics">
              <div><strong>24/7</strong><span>Customer coverage</span></div>
              <div><strong>4</strong><span>Vertical products</span></div>
              <div><strong>1</strong><span>Automation backbone</span></div>
            </div>
          </div>
        </div>

        <div className="container investor-detail-grid">
          <div className="investor-thesis-card">
            <p className="card-kicker">The Thesis</p>
            <h3>A capital-efficient path from implementation to platform.</h3>
            <div className="thesis-list">
              {investorThesis.map((item) => (
                <article key={item.number}>
                  <span>{item.number}</span>
                  <div><h4>{item.title}</h4><p>{item.copy}</p></div>
                </article>
              ))}
            </div>
          </div>
          <div className="investor-roadmap-card">
            <p className="card-kicker">Why Now</p>
            <h3>Demand is already clear: service businesses need a front office that can keep up.</h3>
            <ul>
              {investorMilestones.map((milestone) => <li key={milestone}>{milestone}</li>)}
            </ul>
            <div className="investor-note">For qualified investors and strategic partners. This overview is informational and not an offer to sell securities.</div>
          </div>
        </div>
      </section>

      <section id="consultation" className="section consultation-section">
        <div className="container consultation-card">
          <div>
            <p className="eyebrow">Free AI Automation Audit</p>
            <h2>Ready To Put AI To Work In Your Business?</h2>
            <p>
              Book a free AI automation consultation and we&apos;ll map the exact
              workflows that can save time, recover missed revenue, and help your
              business respond faster.
            </p>
          </div>
          <form className="consultation-form">
            <input type="text" name="name" placeholder="Name" />
            <input type="text" name="company" placeholder="Company" />
            <input type="email" name="email" placeholder="Email" />
            <input type="tel" name="phone" placeholder="Phone" />
            <input type="text" name="industry" placeholder="Industry" />
            <textarea
              name="need"
              placeholder="Biggest automation need"
              rows={4}
            />
            <button type="submit" className="button button-primary">
              Book My Free AI Audit
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a href="#" className="brand footer-brand">
              <span className="brand-mark">FA</span>
              <span>Field Agent AI, LLC</span>
            </a>
            <p>
              Field Agent AI builds AI-powered operating systems for service
              businesses.
            </p>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#apps">Our Apps</a>
            <a href="#services">Services</a>
            <a href="#consultation">Book Consultation</a>
          </div>
          <div>
            <h3>Products</h3>
            {apps.map((app) => (
              <a key={app.name} href="#apps">
                {app.name}
              </a>
            ))}
          </div>
          <div>
            <h3>Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
