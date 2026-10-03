"use client";

import Link from "next/link";
import { serviceLabel, sourceLabel, stageLabel } from "../config";
import { ago, today } from "../dates";
import { money } from "../format";
import { customerOf, followUpStatus, quoteSentAt } from "../selectors";
import type { CrmState, Opportunity } from "../types";
import { ChevronRight } from "./icons";
import { ContactButtons, DueBadge, SampleTag, StageBadge } from "./ui";
import { useCrmUi } from "./uiContext";

/** One line that explains why this opportunity is where it is. */
export function contextLine(s: CrmState, o: Opportunity, ref = today()) {
  if (o.stage === "new") return `New enquiry via ${sourceLabel(o.source)}, received ${ago(o.receivedAt, ref)}`;
  if (o.stage === "quote_sent") {
    const q = quoteSentAt(s, o);
    return q ? `Quote sent ${ago(q, ref)}` : "Quote sent";
  }
  if (o.stage === "on_hold") return `On hold. Last contact ${o.lastContactAt ? ago(o.lastContactAt, ref) : "not logged"}`;
  if (o.stage === "won" || o.stage === "lost") return `${stageLabel(o.stage)} ${o.closedAt ? ago(o.closedAt, ref) : ""}`;
  return `${stageLabel(o.stage)}. Last contact ${o.lastContactAt ? ago(o.lastContactAt, ref) : "not logged yet"}`;
}

/** A follow-up the owner can act on without opening anything. */
export function FollowUpItem({ s, o, day = today() }: { s: CrmState; o: Opportunity; day?: string }) {
  const ui = useCrmUi();
  const c = customerOf(s, o);
  const st = followUpStatus(o, day);
  return (
    <li className="crm-row px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <Link href={`/crm/enquiries/${o.id}`} className="group inline-flex max-w-full items-baseline gap-2">
            <span className="truncate text-[1.0625rem] font-semibold group-hover:underline">{c.name}</span>
            {c.company && <span className="crm-muted hidden truncate text-sm sm:inline">{c.company}</span>}
          </Link>
          <p className="mt-0.5 font-medium">
            {serviceLabel(o.service)}
            {o.location && <span className="crm-muted font-normal"> · {o.location}</span>}
          </p>
          <p className="crm-muted mt-0.5 text-sm">{contextLine(s, o, day)}</p>
        </div>
        <DueBadge o={o} day={day} />
      </div>
      <p className="mt-3 text-[0.9375rem]">
        <span className="crm-label mr-2">Next</span>
        <strong className="font-semibold">{st === "unscheduled" ? "No next step set" : o.nextAction || "Follow up"}</strong>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ContactButtons customer={c} compact />
        <button type="button" className="crm-btn crm-btn-sm crm-btn-dark" onClick={() => ui.followUp(o.id, "contacted")}>
          Mark contacted
        </button>
        <button type="button" className="crm-btn crm-btn-sm crm-btn-line" onClick={() => ui.followUp(o.id, "reschedule")}>
          {st === "unscheduled" ? "Set next step" : "Reschedule"}
        </button>
        <Link href={`/crm/enquiries/${o.id}`} className="crm-btn crm-btn-sm ml-auto px-2 underline-offset-4 hover:underline">
          Open <ChevronRight size={16} />
        </Link>
      </div>
    </li>
  );
}

/** Compact enquiry row for lists. */
export function OppRow({ s, o, showCustomer = true, day = today() }: { s: CrmState; o: Opportunity; showCustomer?: boolean; day?: string }) {
  const c = customerOf(s, o);
  return (
    <li className="crm-row">
      <Link href={`/crm/enquiries/${o.id}`} className="crm-rowlink grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]">
        <span className="min-w-0">
          <span className="block truncate font-semibold">{showCustomer ? c.name : serviceLabel(o.service)}</span>
          <span className="crm-muted block truncate text-sm">
            {showCustomer ? serviceLabel(o.service) : o.title ?? sourceLabel(o.source)}
            {o.location ? ` · ${o.location}` : ""}
          </span>
        </span>
        <span className="hidden min-w-0 md:block">
          <span className="crm-muted block truncate text-sm">{sourceLabel(o.source)}</span>
          <span className="block text-sm tabular-nums">{money(o.value)}</span>
        </span>
        <span className="justify-self-end md:justify-self-start">
          <StageBadge stage={o.stage} />
        </span>
        <span className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-self-end">
          <DueBadge o={o} day={day} />
          <SampleTag show={Boolean(o.sample)} />
        </span>
      </Link>
    </li>
  );
}

/** "Where do enquiries come from?" — counts, wins and won value. */
export function AttributionTable({
  title,
  rows,
  limit = 8,
}: {
  title: string;
  rows: { key: string; label: string; enquiries: number; won: number; wonValue: number }[];
  limit?: number;
}) {
  const max = Math.max(1, ...rows.map((r) => r.enquiries));
  return (
    <section className="crm-panel" aria-label={title}>
      <div className="crm-panel-head">
        <h2 className="crm-h2">{title}</h2>
        <span className="crm-label" aria-hidden="true">
          Enquiries / won
        </span>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">{title}: enquiries, won jobs and won value</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Enquiries</th>
            <th scope="col">Won</th>
            <th scope="col">Won value</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, limit).map((r) => (
            <tr key={r.key} className="crm-row">
              <th scope="row" className="px-4 py-2.5 text-left font-medium sm:px-5">
                {r.label}
                <div className="crm-bar mt-1.5" aria-hidden="true">
                  <span style={{ width: `${(r.enquiries / max) * 100}%` }} />
                  <span style={{ width: `${(r.won / max) * 100}%` }} />
                </div>
              </th>
              <td className="px-2 py-2.5 text-right tabular-nums">{r.enquiries}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--crm-green)]">{r.won}</td>
              <td className="crm-muted hidden px-4 py-2.5 text-right tabular-nums sm:table-cell sm:pr-5">{r.wonValue ? money(r.wonValue) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
