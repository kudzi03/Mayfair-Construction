/**
 * Mayfair CRM — every list the CRM uses lives here, so the workflow can be
 * reshaped after discovery with the owner without touching the UI.
 *
 * This is a DEMO workflow. It is a sensible starting point, not a record of
 * how Mayfair currently sells.
 */

export const STAGES = [
  { id: "new", label: "New enquiry", short: "New" },
  { id: "contacted", label: "Contacted", short: "Contacted" },
  { id: "site_visit", label: "Site visit", short: "Site visit" },
  { id: "quote_preparing", label: "Quote preparing", short: "Preparing quote" },
  { id: "quote_sent", label: "Quote sent", short: "Quote sent" },
  { id: "on_hold", label: "On hold", short: "On hold" },
  { id: "won", label: "Won", short: "Won" },
  { id: "lost", label: "Lost", short: "Lost" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

/** The forward path shown as steps on an enquiry. */
export const FLOW: StageId[] = ["new", "contacted", "site_visit", "quote_preparing", "quote_sent"];
/** Columns on the pipeline board. Won and lost live in their own view. */
export const BOARD: StageId[] = [...FLOW, "on_hold"];
export const CLOSED: StageId[] = ["won", "lost"];

export const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)!.label;

/** What usually happens next after moving into a stage (pre-filled, always editable). */
export const STAGE_NEXT: Partial<Record<StageId, { action: string; inDays: number }>> = {
  new: { action: "Contact customer", inDays: 0 },
  contacted: { action: "Schedule site visit", inDays: 2 },
  site_visit: { action: "Site visit", inDays: 3 },
  quote_preparing: { action: "Send quote", inDays: 3 },
  quote_sent: { action: "Follow up on quote", inDays: 7 },
  on_hold: { action: "Contact again", inDays: 30 },
};

export const SERVICES = [
  { id: "restoration", label: "Restoration", group: "Build" },
  { id: "waterproofing", label: "Waterproofing", group: "Build" },
  { id: "painting", label: "Painting", group: "Build" },
  { id: "electrical", label: "Electrical", group: "Build" },
  { id: "carpeting", label: "Carpeting", group: "Build" },
  { id: "office_partitioning", label: "Office Partitioning", group: "Build" },
  { id: "paving", label: "Paving", group: "Build" },
  { id: "atm_installation", label: "ATM Installation", group: "Install" },
  { id: "ev_charging", label: "EV Charging", group: "Install" },
  { id: "doors", label: "Doors & Floor Springs", group: "Install" },
  { id: "joinery", label: "Joinery", group: "Install" },
  { id: "forklift_hire", label: "Forklift Hire", group: "Equipment hire" },
  { id: "pallet_jack_hire", label: "Pallet Jack Hire", group: "Equipment hire" },
  { id: "concrete_mixer_hire", label: "Concrete Mixer Hire", group: "Equipment hire" },
  { id: "plate_compactor_hire", label: "Plate Compactor Hire", group: "Equipment hire" },
  { id: "other", label: "Other", group: "Other" },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
export const serviceLabel = (id: ServiceId) => SERVICES.find((s) => s.id === id)?.label ?? "Other";

/**
 * Where an enquiry came from. "Website" means the website enquiry form; in
 * production it should also record the landing page and UTM tags so organic
 * search, Google Ads and Google Business Profile visits can be told apart.
 */
export const SOURCES = [
  { id: "website", label: "Website" },
  { id: "google_business", label: "Google Business Profile" },
  { id: "google_ads", label: "Google Ads" },
  { id: "facebook", label: "Facebook" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "phone", label: "Phone call" },
  { id: "referral", label: "Referral" },
  { id: "repeat", label: "Repeat customer" },
  { id: "walk_in", label: "Walk-in / direct" },
  { id: "other", label: "Other" },
] as const;

export type SourceId = (typeof SOURCES)[number]["id"];
export const sourceLabel = (id: SourceId) => SOURCES.find((s) => s.id === id)?.label ?? "Other";

export const CUSTOMER_TYPES = [
  { id: "homeowner", label: "Homeowner / individual" },
  { id: "property_manager", label: "Property manager" },
  { id: "developer", label: "Property developer" },
  { id: "company", label: "Company" },
  { id: "bank", label: "Bank / financial institution" },
  { id: "unknown", label: "Not set" },
] as const;

export type CustomerTypeId = (typeof CUSTOMER_TYPES)[number]["id"];
export const customerTypeLabel = (id: CustomerTypeId) => CUSTOMER_TYPES.find((t) => t.id === id)?.label ?? "Not set";

/** Suggestions for "next action" — free text is always allowed too. */
export const NEXT_ACTIONS = [
  "Contact customer",
  "Call customer",
  "WhatsApp customer",
  "Schedule site visit",
  "Site visit",
  "Send quote",
  "Follow up on quote",
  "Check decision",
  "Confirm hire dates",
  "Contact again",
];

/** Demo roles only. Real names come from Mayfair. */
export const TEAM = ["Owner", "Office", "Site team"];

export const LOST_REASONS = [
  "Price",
  "Chose another contractor",
  "Project cancelled",
  "No response",
  "Timing",
  "Other",
];

/** Quick follow-up choices, in days from today. */
export const RESCHEDULE_CHOICES = [
  { label: "Tomorrow", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 91 },
];

export const CURRENCY_PREFIX = "P";
