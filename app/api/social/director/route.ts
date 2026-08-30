import { NextResponse } from 'next/server';
import type { DirectorBriefing } from '../../../../lib/social/types';

export async function GET(){
  const briefing:DirectorBriefing={
    generatedAt:new Date().toISOString(),
    primaryObjective:'Turn useful social content into qualified conversations while protecting brand quality.',
    observations:[
      'Problem/solution content is the current priority.',
      'Warm inbound conversations should be answered before creating net-new outreach.',
      'Promotional claims and pricing changes require human approval.'
    ],
    assignments:[
      {id:'a1',agent:'Researcher',objective:'Identify 5 high-intent customer questions for today',priority:'high',status:'queued',humanApprovalRequired:false},
      {id:'a2',agent:'Writer',objective:'Create platform-native drafts from the top 3 approved ideas',priority:'high',status:'queued',humanApprovalRequired:false},
      {id:'a3',agent:'Designer',objective:'Create one carousel brief and two branded visual concepts',priority:'normal',status:'queued',humanApprovalRequired:false},
      {id:'a4',agent:'Community Manager',objective:'Triage new comments and route sensitive replies',priority:'high',status:'running',humanApprovalRequired:false},
      {id:'a5',agent:'Lead Agent',objective:'Qualify warm DMs and create CRM opportunities',priority:'critical',status:'running',humanApprovalRequired:false},
      {id:'a6',agent:'Publisher',objective:'Publish approved queue at configured channel times',priority:'normal',status:'queued',humanApprovalRequired:true},
      {id:'a7',agent:'Analyst',objective:'Attribute social activity to leads, bookings and influenced pipeline',priority:'normal',status:'queued',humanApprovalRequired:false},
      {id:'a8',agent:'Optimizer',objective:'Update tomorrow recommendations from performance data',priority:'normal',status:'queued',humanApprovalRequired:false}
    ],
    approvalsRequired:2,
    qualifiedLeads:6,
    pipelineInfluenced:18420
  };
  return NextResponse.json(briefing,{headers:{'Cache-Control':'no-store'}});
}
