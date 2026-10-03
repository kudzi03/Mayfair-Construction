"use client";

import { useSyncExternalStore } from "react";
import { STAGE_NEXT, sourceLabel, stageLabel, type CustomerTypeId, type ServiceId, type SourceId, type StageId } from "./config";
import { addDays, formatDay, today } from "./dates";
import { money, phoneDigits } from "./format";
import { INBOX_KEY, clearInbox, readInbox, type WebsiteEnquiry } from "./inbox";
import { createSampleState } from "./seed";
import type { Activity, ActivityType, CrmState, Customer, Opportunity } from "./types";

/**
 * DEMO STORAGE: the CRM lives in this browser's localStorage. Each person
 * viewing the demo gets a private copy of the fictional sample data, and
 * nothing is shared or sent anywhere.
 *
 * Every write goes through the functions below, so swapping this module for
 * Supabase calls (see supabase/crm-schema.sql) leaves the UI untouched.
 */

const KEY = "mayfair-crm-demo:v1";

let state: CrmState | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const uid = (p: string) =>
  `${p}${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)}`;

function read(): CrmState {
  let s: CrmState | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CrmState;
      if (parsed?.version === 1 && Array.isArray(parsed.opportunities)) s = parsed;
    }
  } catch {
    /* storage blocked or corrupt: fall back to fresh sample data */
  }
  s ??= createSampleState();
  return absorbInbox(s);
}

function persist(s: CrmState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode: the demo still works for this visit */
  }
}

function commit(next: CrmState) {
  state = next;
  persist(next);
  emit();
}

export function getState(): CrmState {
  if (!state) {
    state = read();
    persist(state);
  }
  return state;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Another tab (e.g. the public website form) changed the data.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === INBOX_KEY) {
      state = read();
      persist(state);
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/** Pick up website submissions made in this tab since the CRM last loaded. */
export function syncInbox() {
  if (!readInbox().length) return;
  commit(absorbInbox(getState()));
}

/** null while rendering on the server / before hydration. */
export function useCrm(): CrmState | null {
  return useSyncExternalStore(subscribe, getState, () => null);
}

/* ------------------------------------------------------------------------ */

const activity = (opportunityId: string, type: ActivityType, text: string, at = new Date().toISOString()): Activity => ({
  id: uid("a"),
  opportunityId,
  at,
  type,
  text,
});

const updateOpp = (s: CrmState, id: string, patch: Partial<Opportunity>, ...log: Activity[]): CrmState => ({
  ...s,
  opportunities: s.opportunities.map((o) => (o.id === id ? { ...o, ...patch } : o)),
  activities: [...s.activities, ...log],
});

export const findCustomerByPhone = (s: CrmState, phone?: string) => {
  const d = phoneDigits(phone);
  return d ? s.customers.find((c) => phoneDigits(c.phone) === d) : undefined;
};

/* ------------------------------------------------------------------------ */

export type NewEnquiry = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  customerType?: CustomerTypeId;
  service: ServiceId;
  title?: string;
  source: SourceId;
  location?: string;
  value?: number;
  notes?: string;
  assignedTo?: string;
  /** Attach to this customer instead of matching by phone. */
  customerId?: string;
  receivedAt?: string;
  receivedText?: string;
};

function addEnquiry(s: CrmState, input: NewEnquiry): { state: CrmState; id: string; existing: boolean } {
  const now = input.receivedAt ?? new Date().toISOString();
  let existing = input.customerId ? s.customers.find((c) => c.id === input.customerId) : findCustomerByPhone(s, input.phone);
  let customers = s.customers;
  if (existing) {
    // Fill gaps on the existing customer, never overwrite what's there.
    const merged = {
      ...existing,
      email: existing.email || input.email,
      company: existing.company || input.company,
      phone: existing.phone || input.phone,
      type: existing.type === "unknown" && input.customerType ? input.customerType : existing.type,
    };
    customers = customers.map((c) => (c.id === existing!.id ? merged : c));
    existing = merged;
  } else {
    existing = {
      id: uid("c"),
      name: input.name.trim(),
      phone: input.phone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      company: input.company?.trim() || undefined,
      type: input.customerType ?? "unknown",
      createdAt: now,
    };
    customers = [...customers, existing];
  }

  const id = uid("o");
  const next = STAGE_NEXT.new!;
  const o: Opportunity = {
    id,
    customerId: existing.id,
    service: input.service,
    title: input.title?.trim() || undefined,
    location: input.location?.trim() || undefined,
    source: input.source,
    stage: "new",
    value: input.value,
    receivedAt: now,
    nextFollowUp: today(),
    nextAction: next.action,
    assignedTo: input.assignedTo,
    notes: input.notes?.trim() || undefined,
  };
  const wasKnown = Boolean(input.customerId || s.customers.some((c) => c.id === existing!.id));
  return {
    id,
    existing: wasKnown,
    state: {
      ...s,
      customers,
      opportunities: [...s.opportunities, o],
      activities: [
        ...s.activities,
        activity(id, "received", input.receivedText ?? `Enquiry received: ${sourceLabel(input.source)}`, now),
      ],
    },
  };
}

export function createEnquiry(input: NewEnquiry) {
  const r = addEnquiry(getState(), input);
  commit(r.state);
  return { id: r.id, existing: r.existing };
}

/* Website form submissions waiting in the demo inbox become New enquiries. */
const WEBSITE_SERVICE: Record<string, ServiceId> = {
  restoration: "restoration",
  painting: "painting",
  electrical: "electrical",
  carpeting: "carpeting",
  "office-partitioning": "office_partitioning",
  "atm-installation": "atm_installation",
  "ev-charging": "ev_charging",
};
const WEBSITE_EQUIPMENT: Record<string, ServiceId> = {
  Forklift: "forklift_hire",
  "Pallet jack": "pallet_jack_hire",
  "Concrete mixer": "concrete_mixer_hire",
  "Plate compactor": "plate_compactor_hire",
};

function absorbInbox(s: CrmState): CrmState {
  const inbox = readInbox();
  if (!inbox.length) return s;
  let next = s;
  for (const e of inbox as WebsiteEnquiry[]) {
    const service =
      e.service === "equipment-hire" ? (e.equipment && WEBSITE_EQUIPMENT[e.equipment]) || "other" : WEBSITE_SERVICE[e.service] ?? "other";
    const reply = e.reply === "call" ? "a phone call" : e.reply === "whatsapp" ? "WhatsApp" : "email";
    const notes = [e.message, `Prefers a reply by ${reply}.`].filter(Boolean).join("\n\n");
    next = addEnquiry(next, {
      name: e.name,
      phone: e.phone,
      email: e.email,
      service,
      title: e.equipment ? `${e.equipment} hire` : undefined,
      source: "website",
      location: e.location,
      notes,
      receivedAt: e.receivedAt,
      receivedText: `Enquiry received via the website form${e.page ? ` (${e.page})` : ""}`,
    }).state;
  }
  clearInbox();
  return next;
}

/* ------------------------------------------------------------------------ */

export type StageChange = {
  /** New follow-up date (YYYY-MM-DD); null clears it. */
  followUp?: string | null;
  action?: string;
  value?: number;
  lostReason?: string;
  note?: string;
};

export function changeStage(id: string, stage: StageId, opts: StageChange = {}) {
  const s = getState();
  const o = s.opportunities.find((x) => x.id === id);
  if (!o) return;
  const now = new Date().toISOString();
  const closed = stage === "won" || stage === "lost";
  const patch: Partial<Opportunity> = { stage };
  const log: Activity[] = [];

  if (closed) {
    patch.closedAt = now;
    patch.nextFollowUp = undefined;
    patch.nextAction = undefined;
    if (opts.value != null) patch.value = opts.value;
    if (stage === "lost") patch.lostReason = opts.lostReason || "Other";
    log.push(
      activity(
        id,
        stage,
        stage === "won"
          ? `Won${(opts.value ?? o.value) != null ? `: ${money(opts.value ?? o.value)}` : ""}`
          : `Lost: ${patch.lostReason}`,
      ),
    );
  } else {
    patch.closedAt = undefined;
    patch.lostReason = undefined;
    if (o.stage === "new" && stage !== "new") patch.lastContactAt = o.lastContactAt ?? now;
    log.push(activity(id, "stage", `Moved to ${stageLabel(stage)}`));
    if (opts.followUp !== undefined) {
      patch.nextFollowUp = opts.followUp ?? undefined;
      patch.nextAction = opts.followUp ? opts.action : undefined;
      if (opts.followUp) log.push(activity(id, "followup", `Next: ${opts.action || "Follow up"} on ${formatDay(opts.followUp)}`));
    }
  }
  if (opts.note?.trim()) log.push(activity(id, "note", opts.note.trim()));
  commit(updateOpp(s, id, patch, ...log));
}

export function setFollowUp(id: string, day: string | null, action?: string) {
  const s = getState();
  commit(
    updateOpp(
      s,
      id,
      { nextFollowUp: day ?? undefined, nextAction: day ? action : undefined },
      activity(id, "followup", day ? `Next: ${action || "Follow up"} on ${formatDay(day)}` : "Follow-up cleared"),
    ),
  );
}

export const CONTACT_TEXT: Record<"call" | "whatsapp" | "email" | "visit", string> = {
  call: "Called customer",
  whatsapp: "WhatsApp sent",
  email: "Email sent",
  visit: "Site visit done",
};

/** Logs a contact; a brand-new enquiry becomes Contacted. */
export function logContact(id: string, type: keyof typeof CONTACT_TEXT, text?: string) {
  const s = getState();
  const o = s.opportunities.find((x) => x.id === id);
  if (!o) return;
  const now = new Date().toISOString();
  const log = [activity(id, type, text?.trim() || CONTACT_TEXT[type], now)];
  const patch: Partial<Opportunity> = { lastContactAt: now };
  if (o.stage === "new") {
    patch.stage = "contacted";
    log.push(activity(id, "stage", "Moved to Contacted", now));
  }
  commit(updateOpp(s, id, patch, ...log));
}

export function addNote(id: string, text: string) {
  if (!text.trim()) return;
  commit(updateOpp(getState(), id, {}, activity(id, "note", text.trim())));
}

export function updateOpportunity(id: string, patch: Partial<Opportunity>) {
  const s = getState();
  const o = s.opportunities.find((x) => x.id === id);
  if (!o) return;
  const changes: string[] = [];
  if (patch.value !== undefined && patch.value !== o.value) changes.push(`estimate ${money(patch.value)}`);
  if (patch.source && patch.source !== o.source) changes.push(`source ${sourceLabel(patch.source)}`);
  commit(updateOpp(s, id, patch, ...(changes.length ? [activity(id, "note", `Updated ${changes.join(", ")}`)] : [])));
}

export function updateCustomer(id: string, patch: Partial<Customer>) {
  const s = getState();
  commit({ ...s, customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
}

export function resetDemo() {
  clearInbox();
  commit(createSampleState());
}

/** Suggested follow-up for a stage, from config. */
export const suggestedFollowUp = (stage: StageId) => {
  const n = STAGE_NEXT[stage];
  return n ? { day: addDays(today(), n.inDays), action: n.action } : null;
};
