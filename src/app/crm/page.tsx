"use client";

import Link from "next/link";
import { AttributionTable, FollowUpItem, OppRow } from "@/crm/components/parts";
import { EmptyState, Loading, PageHeader } from "@/crm/components/ui";
import { BOARD, stageLabel } from "@/crm/config";
import { formatLong, today } from "@/crm/dates";
import { money, moneyShort } from "@/crm/format";
import { bySource, byService, followUps, isOpen, metrics } from "@/crm/selectors";
import { useCrm } from "@/crm/store";

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export default function CrmToday() {
  const s = useCrm();
  if (!s) return <Loading />;

  const t = today();
  const f = followUps(s, t);
  const m = metrics(s, t);
  const due = [...f.overdue, ...f.today];
  const shown = due.slice(0, 6);
  const recent = [...s.opportunities].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, 5);
  const open = s.opportunities.filter(isOpen);
  const stageRows = BOARD.map((id) => {
    const list = open.filter((o) => o.stage === id);
    return { id, n: list.length, value: list.reduce((v, o) => v + (o.value ?? 0), 0) };
  });
  const maxStage = Math.max(1, ...stageRows.map((r) => r.n));

  const summary = [
    f.overdue.length && plural(f.overdue.length, "follow-up") + " overdue",
    f.today.length && `${f.today.length} due today`,
    f.unscheduled.length && `${plural(f.unscheduled.length, "enquiry", "enquiries")} without a next step`,
  ].filter(Boolean);

  const kpis = [
    { label: "New enquiries", n: String(m.newCount), href: "/crm/enquiries?show=new" },
    { label: "Due today", n: String(m.dueToday), href: "/crm/follow-ups?tab=today" },
    { label: "Overdue", n: String(m.overdue), href: "/crm/follow-ups?tab=overdue", alert: m.overdue > 0 },
    { label: "Quotes awaiting reply", n: String(m.quotesAwaiting), href: "/crm/pipeline" },
    { label: "Open pipeline", n: moneyShort(m.openValue), href: "/crm/pipeline", title: money(m.openValue) },
    { label: "Won, last 90 days", n: moneyShort(m.wonValue), href: "/crm/pipeline?view=won", title: money(m.wonValue) },
  ];

  return (
    <>
      <PageHeader
        title="Today"
        sub={
          <>
            {formatLong(t)} · <span className="crm-sample align-middle">Sample data</span>
          </>
        }
      />

      {/* What needs doing — first, before any numbers. */}
      <section className="crm-panel" aria-labelledby="attention-title">
        <div className="crm-panel-head flex-wrap">
          <div>
            <h2 id="attention-title" className="crm-h2">
              Needs attention
            </h2>
            <p className="crm-muted text-sm">{summary.length ? summary.join(" · ") : "Nothing waiting on you."}</p>
          </div>
          {due.length > 0 && (
            <Link href="/crm/follow-ups" className="text-sm font-semibold underline underline-offset-4">
              All follow-ups
            </Link>
          )}
        </div>
        {due.length === 0 && f.unscheduled.length === 0 ? (
          <EmptyState title="You’re caught up." text="No follow-ups are due today and nothing is overdue." />
        ) : (
          <ul>
            {shown.map((o) => (
              <FollowUpItem key={o.id} s={s} o={o} day={t} />
            ))}
            {f.unscheduled.map((o) => (
              <FollowUpItem key={o.id} s={s} o={o} day={t} />
            ))}
          </ul>
        )}
        {due.length > shown.length && (
          <Link href="/crm/follow-ups" className="crm-row flex min-h-12 items-center justify-center text-sm font-semibold hover:bg-[#faf8f4]">
            {due.length - shown.length} more due — see all follow-ups
          </Link>
        )}
      </section>

      <h2 className="sr-only">Numbers</h2>
      <div className="crm-kpis mt-6">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="crm-kpi" data-alert={k.alert ? "true" : undefined} title={k.title}>
            <span className="crm-label">{k.label}</span>
            <span className="crm-kpi-n">{k.n}</span>
          </Link>
        ))}
      </div>
      <p className="crm-muted mt-2 text-xs">Values are estimates in Botswana pula, from fictional sample data.</p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="crm-panel" aria-labelledby="recent-title">
          <div className="crm-panel-head">
            <h2 id="recent-title" className="crm-h2">
              Recent enquiries
            </h2>
            <Link href="/crm/enquiries" className="text-sm font-semibold underline underline-offset-4">
              All enquiries
            </Link>
          </div>
          <ul>
            {recent.map((o) => (
              <OppRow key={o.id} s={s} o={o} day={t} />
            ))}
          </ul>
        </section>

        <section className="crm-panel" aria-labelledby="pipe-title">
          <div className="crm-panel-head">
            <h2 id="pipe-title" className="crm-h2">
              Pipeline
            </h2>
            <Link href="/crm/pipeline" className="text-sm font-semibold underline underline-offset-4">
              Open board
            </Link>
          </div>
          <ul className="px-4 py-2 sm:px-5">
            {stageRows.map((r) => (
              <li key={r.id} className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3 py-2 text-sm">
                <span className="font-medium">{stageLabel(r.id)}</span>
                <span className="crm-bar" aria-hidden="true">
                  <span style={{ width: `${(r.n / maxStage) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">
                  {r.n} <span className="crm-muted">· {r.value ? moneyShort(r.value) : "—"}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="crm-muted border-t border-[var(--crm-line)] px-4 py-3 text-sm sm:px-5">
            {m.wonCount} won · {m.lostCount} lost
            {m.avgDaysToDecision != null && <> · {m.avgDaysToDecision} days from enquiry to decision, on average</>}
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttributionTable title="Where enquiries come from" rows={bySource(s)} />
        <AttributionTable title="What people ask for" rows={byService(s)} limit={6} />
      </div>
    </>
  );
}
