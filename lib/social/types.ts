export type SocialPlatform = 'facebook'|'instagram'|'linkedin'|'google_business'|'x'|'tiktok'|'youtube';
export type OperatingMode = 'autopilot'|'approval'|'hybrid';
export type ContentStatus = 'idea'|'drafting'|'review'|'approved'|'scheduled'|'published'|'failed';
export type ConversationClass = 'lead'|'customer'|'support'|'spam'|'sales_opportunity'|'human_review';

export interface BrandBrain {
  organizationId:string;
  businessName:string;
  website?:string;
  voice:string[];
  audiences:string[];
  offers:string[];
  callsToAction:string[];
  prohibitedClaims:string[];
  serviceAreas:string[];
  goals:string[];
  operatingMode:OperatingMode;
}

export interface AgentAssignment {
  id:string;
  agent:string;
  objective:string;
  priority:'low'|'normal'|'high'|'critical';
  status:'queued'|'running'|'blocked'|'complete';
  humanApprovalRequired:boolean;
}

export interface ContentItem {
  id:string;
  organizationId:string;
  platform:SocialPlatform;
  title:string;
  body:string;
  callToAction?:string;
  status:ContentStatus;
  scheduledFor?:string;
  campaignId?:string;
}

export interface SocialConversation {
  id:string;
  organizationId:string;
  platform:SocialPlatform;
  classification:ConversationClass;
  leadScore?:number;
  requiresHuman:boolean;
  lastMessageAt:string;
}

export interface DirectorBriefing {
  generatedAt:string;
  primaryObjective:string;
  observations:string[];
  assignments:AgentAssignment[];
  approvalsRequired:number;
  qualifiedLeads:number;
  pipelineInfluenced:number;
}
