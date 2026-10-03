import type { CustomerTypeId, ServiceId, SourceId, StageId } from "./config";

/**
 * Three records are enough for V1:
 * - a Customer can have many Opportunities (Kabelo's painting job today,
 *   his electrical enquiry next year),
 * - each Opportunity carries its own next follow-up (date + action),
 * - Activities are the timeline.
 * The same shape maps 1:1 to supabase/crm-schema.sql for production.
 */

export type Customer = {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  type: CustomerTypeId;
  createdAt: string;
  /** Fictional demo record. */
  sample?: boolean;
};

export type Opportunity = {
  id: string;
  customerId: string;
  service: ServiceId;
  /** Short description, e.g. "Exterior repaint, 4-bedroom house". */
  title?: string;
  location?: string;
  source: SourceId;
  stage: StageId;
  /** Estimated value in BWP. */
  value?: number;
  receivedAt: string;
  lastContactAt?: string;
  /** Local date, YYYY-MM-DD. Every open opportunity should have one. */
  nextFollowUp?: string;
  nextAction?: string;
  assignedTo?: string;
  notes?: string;
  closedAt?: string;
  lostReason?: string;
  sample?: boolean;
};

export type ActivityType =
  | "received"
  | "call"
  | "whatsapp"
  | "email"
  | "visit"
  | "quote"
  | "stage"
  | "followup"
  | "note"
  | "won"
  | "lost";

export type Activity = {
  id: string;
  opportunityId: string;
  at: string;
  type: ActivityType;
  text: string;
};

export type CrmState = {
  version: 1;
  seededOn: string;
  customers: Customer[];
  opportunities: Opportunity[];
  activities: Activity[];
};
