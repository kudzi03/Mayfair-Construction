import { CLOSED, SERVICES, SOURCES, type ServiceId, type SourceId } from "./config";
import { daysBetween, dayOf, today } from "./dates";
import { phoneDigits } from "./format";
import type { Activity, CrmState, Customer, Opportunity } from "./types";

export const isOpen = (o: Opportunity) => !CLOSED.includes(o.stage);

export type FollowUpStatus = "overdue" | "today" | "upcoming" | "hold" | "unscheduled";

/**
 * The follow-up rule in one place: an open opportunity is overdue, due today,
 * upcoming or parked (on hold) — and anything parked comes back to "today"
 * on its date automatically. An open opportunity with no date is flagged.
 */
export function followUpStatus(o: Opportunity, ref = today()): FollowUpStatus | null {
  if (!isOpen(o)) return null;
  if (!o.nextFollowUp) return "unscheduled";
  const n = daysBetween(ref, o.nextFollowUp);
  if (n < 0) return "overdue";
  if (n === 0) return "today";
  return o.stage === "on_hold" ? "hold" : "upcoming";
}

const byDue = (a: Opportunity, b: Opportunity) => (a.nextFollowUp ?? "").localeCompare(b.nextFollowUp ?? "");

export function followUps(s: CrmState, ref = today()) {
  const groups: Record<FollowUpStatus, Opportunity[]> = { overdue: [], today: [], upcoming: [], hold: [], unscheduled: [] };
  for (const o of s.opportunities) {
    const st = followUpStatus(o, ref);
    if (st) groups[st].push(o);
  }
  for (const k of Object.keys(groups) as FollowUpStatus[]) groups[k].sort(byDue);
  return groups;
}

export function metrics(s: CrmState, ref = today()) {
  const open = s.opportunities.filter(isOpen);
  const f = followUps(s, ref);
  const won = s.opportunities.filter((o) => o.stage === "won");
  const lost = s.opportunities.filter((o) => o.stage === "lost");
  const recentWon = won.filter((o) => o.closedAt && daysBetween(dayOf(o.closedAt), ref) <= 90);
  const decided = [...won, ...lost].filter((o) => o.closedAt);
  const avgDays = decided.length
    ? Math.round(decided.reduce((t, o) => t + daysBetween(dayOf(o.receivedAt), dayOf(o.closedAt!)), 0) / decided.length)
    : null;
  return {
    newCount: open.filter((o) => o.stage === "new").length,
    dueToday: f.today.length,
    overdue: f.overdue.length,
    quotesAwaiting: open.filter((o) => o.stage === "quote_sent").length,
    openValue: open.filter((o) => o.stage !== "on_hold").reduce((t, o) => t + (o.value ?? 0), 0),
    onHoldValue: open.filter((o) => o.stage === "on_hold").reduce((t, o) => t + (o.value ?? 0), 0),
    wonValue: recentWon.reduce((t, o) => t + (o.value ?? 0), 0),
    wonCount: won.length,
    lostCount: lost.length,
    avgDaysToDecision: avgDays,
  };
}

export const customerOf = (s: CrmState, o: Opportunity) => s.customers.find((c) => c.id === o.customerId)!;
export const opportunitiesOf = (s: CrmState, c: Customer) => s.opportunities.filter((o) => o.customerId === c.id);
export const activitiesOf = (s: CrmState, opportunityIds: string[]) =>
  s.activities.filter((a) => opportunityIds.includes(a.opportunityId)).sort((a, b) => b.at.localeCompare(a.at));

export const lastActivity = (s: CrmState, o: Opportunity): Activity | undefined =>
  s.activities.filter((a) => a.opportunityId === o.id).sort((a, b) => b.at.localeCompare(a.at))[0];

/** The most recent "Quote sent" note, for "Quote sent 7 days ago". */
export const quoteSentAt = (s: CrmState, o: Opportunity) =>
  s.activities
    .filter((a) => a.opportunityId === o.id && a.type === "quote")
    .sort((a, b) => b.at.localeCompare(a.at))[0]?.at;

/* ---------------------------- search ---------------------------- */

const norm = (t?: string) => (t ?? "").toLowerCase();

export function search(s: CrmState, q: string) {
  const term = norm(q).trim();
  if (!term) return { customers: [] as Customer[], opportunities: [] as Opportunity[] };
  const digits = term.replace(/\D/g, "");
  const matchCustomer = (c: Customer) =>
    norm(c.name).includes(term) ||
    norm(c.company).includes(term) ||
    norm(c.email).includes(term) ||
    (digits.length >= 3 && phoneDigits(c.phone).includes(digits));
  const customers = s.customers.filter(matchCustomer).slice(0, 8);
  const opportunities = s.opportunities
    .filter((o) => {
      const c = customerOf(s, o);
      const svc = SERVICES.find((x) => x.id === o.service)?.label;
      return (
        matchCustomer(c) || norm(svc).includes(term) || norm(o.title).includes(term) || norm(o.location).includes(term)
      );
    })
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, 10);
  return { customers, opportunities };
}

/* ---------------------------- attribution ---------------------------- */

type Row<K> = { key: K; label: string; enquiries: number; won: number; wonValue: number };

function tally<K extends string>(s: CrmState, keyOf: (o: Opportunity) => K, labels: readonly { id: K; label: string }[]) {
  const rows = new Map<K, Row<K>>();
  for (const o of s.opportunities) {
    const k = keyOf(o);
    const r = rows.get(k) ?? { key: k, label: labels.find((l) => l.id === k)?.label ?? k, enquiries: 0, won: 0, wonValue: 0 };
    r.enquiries++;
    if (o.stage === "won") {
      r.won++;
      r.wonValue += o.value ?? 0;
    }
    rows.set(k, r);
  }
  return [...rows.values()].sort((a, b) => b.enquiries - a.enquiries || b.won - a.won);
}

export const bySource = (s: CrmState) => tally<SourceId>(s, (o) => o.source, SOURCES);
export const byService = (s: CrmState) => tally<ServiceId>(s, (o) => o.service, SERVICES);
