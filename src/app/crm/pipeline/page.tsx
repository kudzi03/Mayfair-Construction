"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type DragEvent } from "react";
import { DueBadge, EmptyState, Loading, PageHeader, StageBadge } from "@/crm/components/ui";
import { useCrmUi } from "@/crm/components/uiContext";
import { BOARD, STAGES, serviceLabel, sourceLabel, stageLabel, type StageId } from "@/crm/config";
import { dayOf, formatDay, today } from "@/crm/dates";
import { money, moneyShort } from "@/crm/format";
import { customerOf } from "@/crm/selectors";
import { useCrm } from "@/crm/store";
import type { CrmState, Opportunity } from "@/crm/types";

function Card({ s, o, onDragStart, onDragEnd, dragging }: { s: CrmState; o: Opportunity; onDragStart: () => void; onDragEnd: () => void; dragging: boolean }) {
  const ui = useCrmUi();
  const c = customerOf(s, o);
  return (
    <li
      className="crm-card"
      draggable
      data-dragging={dragging}
      onDragStart={(e: DragEvent) => {
        e.dataTransfer.setData("text/plain", o.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <Link href={`/crm/enquiries/${o.id}`} className="block font-semibold leading-snug hover:underline">
        {c.name}
      </Link>
      {c.company && <p className="crm-muted truncate text-xs">{c.company}</p>}
      <p className="mt-1 text-sm font-medium">{serviceLabel(o.service)}</p>
      {o.location && <p className="crm-muted truncate text-sm">{o.location}</p>}
      <div className="mt-2 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold tabular-nums">{money(o.value)}</span>
        <span className="crm-muted truncate text-xs">{sourceLabel(o.source)}</span>
      </div>
      <div className="mt-2">
        <DueBadge o={o} />
      </div>
      <div className="mt-2">
        <label className="block">
          <span className="sr-only">Move {c.name} to stage</span>
          <select
            className="crm-select !min-h-10 !py-1 !pr-7 !pl-2 text-sm"
            value=""
            onChange={(e) => e.target.value && ui.moveTo(o.id, e.target.value as StageId)}
          >
            <option value="">Move…</option>
            {STAGES.filter((st) => st.id !== o.stage).map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  );
}

function Board({ s }: { s: CrmState }) {
  const ui = useCrmUi();
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<StageId | null>(null);

  const drop = (stage: StageId) => (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setOver(null);
    setDragId(null);
    const o = s.opportunities.find((x) => x.id === id);
    if (o && o.stage !== stage) ui.moveTo(id, stage);
  };
  const zone = (stage: StageId) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (over !== stage) setOver(stage);
    },
    onDragLeave: () => setOver((v) => (v === stage ? null : v)),
    onDrop: drop(stage),
    "data-over": over === stage,
  });

  return (
    <>
      <p className="crm-muted mb-3 hidden text-sm lg:block">Drag a card to another stage, or use “Move…” on the card.</p>
      {/* Phones and tablets: the board scrolls sideways, so offer a jump list. */}
      <nav className="crm-choices mb-3 flex-nowrap overflow-x-auto pb-1 lg:hidden" aria-label="Jump to stage">
        {BOARD.map((stage) => (
          <a key={stage} href={`#col-${stage}`} className="crm-choice shrink-0">
            {stageLabel(stage)} <span className="crm-muted ml-1.5 font-mono text-xs">{s.opportunities.filter((o) => o.stage === stage).length}</span>
          </a>
        ))}
      </nav>
      <div className="crm-board" role="list" aria-label="Pipeline stages">
        {BOARD.map((stage) => {
          const list = s.opportunities
            .filter((o) => o.stage === stage)
            .sort((a, b) => (a.nextFollowUp ?? "9999").localeCompare(b.nextFollowUp ?? "9999"));
          const total = list.reduce((v, o) => v + (o.value ?? 0), 0);
          return (
            <section key={stage} id={`col-${stage}`} role="listitem" className="crm-col scroll-mt-32" aria-label={`${stageLabel(stage)}, ${list.length}`} {...zone(stage)}>
              <header className="flex items-baseline justify-between gap-2 px-3 pt-3 pb-2">
                <h2 className="text-sm font-bold">
                  {stageLabel(stage)} <span className="crm-muted font-mono font-normal">{list.length}</span>
                </h2>
                <span className="crm-muted text-xs tabular-nums">{total ? moneyShort(total) : ""}</span>
              </header>
              <ul className="flex flex-1 flex-col gap-2 px-2 pb-2">
                {list.length === 0 && <li className="crm-muted px-2 py-6 text-center text-sm">Nothing here</li>}
                {list.map((o) => (
                  <Card key={o.id} s={s} o={o} dragging={dragId === o.id} onDragStart={() => setDragId(o.id)} onDragEnd={() => { setDragId(null); setOver(null); }} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {dragId && (
        <div className="mt-3 hidden gap-3 lg:grid lg:grid-cols-2" aria-hidden="true">
          {(["won", "lost"] as const).map((st) => (
            <div key={st} className="crm-col !min-h-20 items-center justify-center border-dashed !border-[var(--crm-line-strong)] font-semibold" {...zone(st)}>
              Drop here: {stageLabel(st)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Closed({ s, stage }: { s: CrmState; stage: "won" | "lost" }) {
  const list = s.opportunities.filter((o) => o.stage === stage).sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""));
  const total = list.reduce((v, o) => v + (o.value ?? 0), 0);
  if (!list.length) return <section className="crm-panel"><EmptyState title={`No ${stage} enquiries yet.`} /></section>;
  return (
    <section className="crm-panel" aria-label={stageLabel(stage)}>
      <div className="crm-panel-head">
        <p className="crm-h2">
          {list.length} {stage} · {money(total)}
        </p>
        <span className="crm-sample">Sample data</span>
      </div>
      <ul>
        {list.map((o) => {
          const c = customerOf(s, o);
          return (
            <li key={o.id} className="crm-row">
              <Link href={`/crm/enquiries/${o.id}`} className="crm-rowlink grid gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:px-5">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="crm-muted block truncate text-sm">
                    {serviceLabel(o.service)}
                    {o.location ? ` · ${o.location}` : ""}
                  </span>
                </span>
                <span className="crm-muted text-sm">
                  From {sourceLabel(o.source)}
                  {stage === "lost" && o.lostReason && (
                    <>
                      <br />
                      Reason: <span className="text-ink">{o.lostReason}</span>
                    </>
                  )}
                </span>
                <span className="text-sm sm:text-right">
                  <span className="block font-semibold tabular-nums">{money(o.value)}</span>
                  <span className="crm-muted">{o.closedAt ? formatDay(dayOf(o.closedAt), today()) : ""}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PipelineView() {
  const s = useCrm();
  const params = useSearchParams();
  if (!s) return <Loading />;
  const view = (params.get("view") as "won" | "lost" | null) ?? "open";
  const counts = {
    open: s.opportunities.filter((o) => BOARD.includes(o.stage)).length,
    won: s.opportunities.filter((o) => o.stage === "won").length,
    lost: s.opportunities.filter((o) => o.stage === "lost").length,
  };
  return (
    <>
      <PageHeader title="Pipeline" sub="Where every enquiry stands, from first contact to a decision." />
      <nav className="crm-seg mb-4" aria-label="Pipeline views">
        {(["open", "won", "lost"] as const).map((v) => (
          <Link key={v} href={v === "open" ? "/crm/pipeline" : `/crm/pipeline?view=${v}`} aria-current={view === v ? "page" : undefined} replace scroll={false}>
            {v === "open" ? "Open" : stageLabel(v)} <span className="crm-n">{counts[v]}</span>
          </Link>
        ))}
      </nav>
      {view === "open" ? <Board s={s} /> : <Closed s={s} stage={view} />}
      {view === "open" && (
        <p className="crm-muted mt-2 text-xs">
          <StageBadge stage="on_hold" /> enquiries are parked with a return date and don’t count towards the open pipeline value on Today.
        </p>
      )}
    </>
  );
}

export default function PipelinePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PipelineView />
    </Suspense>
  );
}
