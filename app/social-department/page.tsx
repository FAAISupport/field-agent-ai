import styles from './page.module.css';

const agents = [
  ['Director','Coordinates strategy, goals, approvals and daily execution'],
  ['Researcher','Finds timely topics, competitor moves and audience questions'],
  ['Strategist','Builds campaign themes and 30/60/90-day plans'],
  ['Writer','Creates platform-specific hooks, captions and CTAs'],
  ['Designer','Creates branded graphics, carousels and creative briefs'],
  ['Publisher','Schedules content and manages retry-safe publishing'],
  ['Community Manager','Classifies comments and prepares safe responses'],
  ['DM Agent','Handles routine inbound messages and routes exceptions'],
  ['Lead Agent','Qualifies prospects and creates CRM opportunities'],
  ['Analyst','Measures engagement, pipeline and attributed revenue'],
  ['Optimizer','Feeds performance back into the Brand Brain'],
];

const queue = [
  { platform:'Facebook', title:'3 reasons missed calls cost service businesses revenue', time:'9:00 AM', state:'Ready' },
  { platform:'Instagram', title:'Carousel: What an AI office handles while you work', time:'11:30 AM', state:'Approval' },
  { platform:'LinkedIn', title:'Why automation should be measured by outcomes', time:'1:00 PM', state:'Ready' },
  { platform:'Google', title:'Field Agent AI Virtual Office update', time:'3:30 PM', state:'Drafting' },
];

const activity = [
  ['Lead Agent','Qualified a website visitor from a social DM','2m'],
  ['Writer','Generated 4 channel-specific variants','8m'],
  ['Community Manager','Flagged 2 conversations for human review','14m'],
  ['Optimizer','Raised local-service education content priority','31m'],
];

export default function SocialDepartmentPage(){
  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}><span>FA</span><div><strong>Field Agent AI</strong><small>Virtual Office</small></div></div>
      <nav>
        <a className={styles.active}>Social Department</a>
        <a>Content Calendar</a><a>Creative Studio</a><a>Inbox & DMs</a><a>Lead Pipeline</a><a>Analytics</a><a>Brand Brain</a><a>Automations</a><a>Settings</a>
      </nav>
      <div className={styles.autopilot}><span className={styles.dot}/><div><strong>Autopilot online</strong><small>11 agents operating</small></div></div>
    </aside>

    <section className={styles.content}>
      <header className={styles.header}><div><p>FIELD AGENT AI / SOCIAL DEPARTMENT</p><h1>Your autonomous social team</h1><span>Plan, create, publish, engage, capture leads and improve — continuously.</span></div><div className={styles.headerActions}><button className={styles.secondary}>Generate report</button><button>Run Director now</button></div></header>

      <div className={styles.metrics}>
        {[['Posts this month','28','+12%'],['Qualified social leads','19','+27%'],['Appointments attributed','7','+3'],['Pipeline influenced','$18,420','+21%']].map(([k,v,c])=><article key={k}><span>{k}</span><strong>{v}</strong><em>{c}</em></article>)}
      </div>

      <div className={styles.grid2}>
        <article className={styles.panel}>
          <div className={styles.panelTitle}><div><p>TODAY'S COMMAND CENTER</p><h2>Director briefing</h2></div><span className={styles.live}>LIVE</span></div>
          <div className={styles.brief}><strong>Primary objective</strong><p>Turn educational content into qualified conversations for Field Agent AI Virtual Office while increasing local-business authority.</p></div>
          <div className={styles.briefGrid}><div><span>Best signal</span><strong>Problem/solution posts</strong><small>2.4× more profile visits</small></div><div><span>Needs attention</span><strong>2 warm conversations</strong><small>Human review recommended</small></div></div>
          <button className={styles.full}>Open morning assignment report</button>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitle}><div><p>CONTENT ENGINE</p><h2>Today's publishing queue</h2></div><button className={styles.linkButton}>View calendar</button></div>
          <div className={styles.queue}>{queue.map(item=><div className={styles.queueRow} key={item.platform}><div className={styles.platform}>{item.platform[0]}</div><div><strong>{item.title}</strong><small>{item.platform} · {item.time}</small></div><span className={`${styles.state} ${item.state==='Approval'?styles.warn:''}`}>{item.state}</span></div>)}</div>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelTitle}><div><p>AI WORKFORCE</p><h2>Agent assignments</h2></div><span className={styles.muted}>Updated continuously</span></div>
        <div className={styles.agentGrid}>{agents.map(([name,job],i)=><div className={styles.agent} key={name}><span className={styles.avatar}>{String(i+1).padStart(2,'0')}</span><div><strong>{name}</strong><p>{job}</p></div><span className={styles.online}>Active</span></div>)}</div>
      </article>

      <div className={styles.grid2}>
        <article className={styles.panel}><div className={styles.panelTitle}><div><p>OPPORTUNITY INBOX</p><h2>Revenue conversations</h2></div><span className={styles.badge}>6 open</span></div>
          <div className={styles.opportunity}><strong>Facebook DM · Local contractor</strong><p>Asked about missed-call recovery and wants pricing.</p><div><span>Lead score 91</span><button>Open conversation</button></div></div>
          <div className={styles.opportunity}><strong>Instagram comment · Home services owner</strong><p>Requested a demo after seeing the AI receptionist post.</p><div><span>Lead score 84</span><button>Open conversation</button></div></div>
        </article>
        <article className={styles.panel}><div className={styles.panelTitle}><div><p>AGENT ACTIVITY</p><h2>What the office is doing</h2></div></div>
          <div className={styles.activity}>{activity.map(([a,x,t])=><div key={x}><span className={styles.activityDot}/><p><strong>{a}</strong>{x}</p><small>{t}</small></div>)}</div>
        </article>
      </div>
    </section>
  </main>
}
