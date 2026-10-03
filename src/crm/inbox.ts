/**
 * Website → CRM hand-off for the DEMO.
 *
 * The public enquiry form drops a submission here (this browser's
 * localStorage); the CRM picks it up as a New enquiry the next time it reads
 * its data, or straight away if a CRM tab is already open. Nothing leaves
 * the device, so the public site never writes to a shared database.
 *
 * Production: the form POSTs to a server route that validates the payload
 * and calls the `submit_enquiry` function in supabase/crm-schema.sql.
 * This file and its call in EnquiryForm are then removed.
 */

export const INBOX_KEY = "mayfair-crm-demo:inbox";

export type WebsiteEnquiry = {
  id: string;
  receivedAt: string;
  name: string;
  phone: string;
  email?: string;
  /** Website service slug, e.g. "office-partitioning", or "not-sure". */
  service: string;
  equipment?: string;
  location?: string;
  message?: string;
  reply: "call" | "whatsapp" | "email";
  page?: string;
};

export function readInbox(): WebsiteEnquiry[] {
  try {
    const raw = localStorage.getItem(INBOX_KEY);
    const list = raw ? (JSON.parse(raw) as WebsiteEnquiry[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function clearInbox() {
  try {
    localStorage.removeItem(INBOX_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** Returns false if this browser blocks storage (the demo hand-off then can't happen). */
export function queueWebsiteEnquiry(e: Omit<WebsiteEnquiry, "id" | "receivedAt">): boolean {
  try {
    const list = readInbox();
    list.push({ ...e, id: `web-${Date.now().toString(36)}`, receivedAt: new Date().toISOString() });
    localStorage.setItem(INBOX_KEY, JSON.stringify(list.slice(-50)));
    return true;
  } catch {
    return false;
  }
}
