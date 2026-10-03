"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { ChevronLeft, NoteIcon } from "@/crm/components/icons";
import { contextLine } from "@/crm/components/parts";
import { ContactButtons, Dialog, DueBadge, Loading, NotFoundNote, PhoneText, SampleTag, StageBadge } from "@/crm/components/ui";
import { useCrmUi } from "@/crm/components/uiContext";
import {
  FLOW,
  SERVICES,
  SOURCES,
  TEAM,
  customerTypeLabel,
  serviceLabel,
  sourceLabel,
  stageLabel,
  type ServiceId,
  type SourceId,
} from "@/crm/config";
import { ago, dayOf, formatDay, formatLong, timeOf, today } from "@/crm/dates";
import { money } from "@/crm/format";
import { activitiesOf, customerOf, followUpStatus, isOpen } from "@/crm/selectors";
import { addNote, updateOpportunity, useCrm } from "@/crm/store";
import type { Opportunity } from "@/crm/types";

export default function EnquiryPage() {
  const { id } = useParams<{ id: string }>();
  const s = useCrm();
  const ui = useCrmUi();
  const [editing, setEditing] = useState(false);
  if (!s) return <Loading />;
  const o = s.opportunities.find((x) => x.id === id);
  if (!o) return <NotFoundNote what="Enquiry" back={{ href: "/crm/enquiries", label: "All enquiries" }} />;
  const c = customerOf(s, o);
  const t = today();
  const open = isOpen(o);
  const status = followUpStatus(o, t);
  const flowIndex = FLOW.indexOf(o.stage);
  const history = activitiesOf(s, [o.id]);

  return (
    <>
      <Link href="/crm/enquiries" className="crm-muted mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-semibold hover:text-ink">
        <ChevronLeft size={16} /> Enquiries
      </Link>

      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={o.stage} />
          <SampleTag show={Boolean(o.sample)} />
        </div>
        <h1 className="crm-h1 mt-3">
          <Link href={`/crm/customers/${c.id}`} className="hover:underline">
            {c.name}
          </Link>
        </h1>
        <p className="mt-2 text-lg font-medium">
          {serviceLabel(o.service)}
          {o.title && <span className="crm-muted font-normal"> — {o.title}</span>}
        </p>
        <p className="crm-muted mt-1 text-sm">
          {c.company && <>{c.company} · </>}
          Received {formatDay(dayOf(o.receivedAt), t)} via <strong className="text-ink">{sourceLabel(o.source)}</strong>
        </p>
        {/* Phones: call / WhatsApp straight away, before anything else. */}
        <div className="mt-4 lg:hidden">
          {c.phone && (
            <p className="crm-muted mb-2 text-sm">
              <PhoneText phone={c.phone} />
            </p>
          )}
          <ContactButtons customer={c} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)] lg:items-start">
        <div className="grid gap-5">
          {/* Next step — the thing that matters most. */}
          <section className="crm-panel p-4 sm:p-5" aria-labelledby="next-title">
            <h2 id="next-title" className="crm-label">
              Next step
            </h2>
            {open ? (
              <>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-xl font-semibold">{status === "unscheduled" ? "No next step set" : o.nextAction || "Follow up"}</p>
                  <DueBadge o={o} day={t} />
                </div>
                {o.nextFollowUp && <p className="crm-muted mt-1 text-sm">{formatLong(o.nextFollowUp)}</p>}
                <p className="crm-muted mt-1 text-sm">{contextLine(s, o, t)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="crm-btn crm-btn-dark" onClick={() => ui.followUp(o.id, "contacted")}>
                    Mark contacted
                  </button>
                  <button type="button" className="crm-btn crm-btn-line" onClick={() => ui.followUp(o.id, "reschedule")}>
                    {status === "unscheduled" ? "Set next step" : "Reschedule"}
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-2 text-lg font-semibold">
                {o.stage === "won" ? `Won ${o.closedAt ? `on ${formatDay(dayOf(o.closedAt), t)}` : ""} · ${money(o.value)}` : `Lost${o.lostReason ? `: ${o.lostReason}` : ""}`}
              </p>
            )}
          </section>

          {/* Stage */}
          <section className="crm-panel p-4 sm:p-5" aria-labelledby="stage-title">
            <h2 id="stage-title" className="crm-label">
              Stage
            </h2>
            <ol className="mt-3 grid gap-1.5 sm:grid-cols-5">
              {FLOW.map((st, i) => {
                const current = st === o.stage;
                const done = flowIndex > i || o.stage === "won";
                return (
                  <li key={st}>
                    <button
                      type="button"
                      className={`flex min-h-12 w-full items-center gap-2 border px-3 py-2 text-left text-sm font-semibold transition-colors sm:flex-col sm:items-start sm:gap-1 ${
                        current ? "border-ink bg-ink text-bone" : "border-[var(--crm-line-strong)] bg-white hover:border-ink"
                      }`}
                      aria-current={current ? "step" : undefined}
                      disabled={current}
                      onClick={() => ui.moveTo(o.id, st)}
                    >
                      <span className={`font-mono text-xs ${current ? "text-bone/70" : "crm-muted"}`}>
                        {done ? "✓" : String(i + 1).padStart(2, "0")}
                      </span>
                      {stageLabel(st)}
                      {current && <span className="sr-only">(current stage)</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.stage !== "on_hold" && (
                <button type="button" className="crm-btn crm-btn-sm crm-btn-line" onClick={() => ui.moveTo(o.id, "on_hold")}>
                  Put on hold
                </button>
              )}
              {o.stage !== "won" && (
                <button type="button" className="crm-btn crm-btn-sm crm-btn-line !border-[rgb(44_106_60/0.5)] !text-[var(--crm-green)]" onClick={() => ui.moveTo(o.id, "won")}>
                  Mark won
                </button>
              )}
              {o.stage !== "lost" && (
                <button type="button" className="crm-btn crm-btn-sm crm-btn-line" onClick={() => ui.moveTo(o.id, "lost")}>
                  Mark lost
                </button>
              )}
              {!open && (
                <button type="button" className="crm-btn crm-btn-sm crm-btn-line" onClick={() => ui.moveTo(o.id, "contacted")}>
                  Reopen
                </button>
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className="crm-panel p-4 sm:p-5" aria-labelledby="tl-title">
            <h2 id="tl-title" className="crm-label">
              Activity
            </h2>
            <NoteForm id={o.id} />
            <ol className="crm-timeline mt-5">
              {history.map((a) => (
                <li key={a.id} data-type={a.type}>
                  <p className="text-sm">
                    <span className="font-semibold">{formatDay(dayOf(a.at), t)}</span>
                    <span className="crm-muted"> · {timeOf(a.at)}</span>
                  </p>
                  <p className="mt-0.5 whitespace-pre-line">{a.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="grid gap-5">
          <section className="crm-panel hidden p-4 sm:p-5 lg:block" aria-labelledby="contact-title">
            <h2 id="contact-title" className="crm-label">
              Contact
            </h2>
            <p className="mt-2 font-semibold">{c.name}</p>
            <p className="crm-muted text-sm">
              <PhoneText phone={c.phone} />
              {c.email && <span className="block break-all">{c.email}</span>}
            </p>
            <div className="mt-3">
              <ContactButtons customer={c} />
            </div>
          </section>

          <section className="crm-panel p-4 sm:p-5" aria-labelledby="details-title">
            <div className="flex items-center justify-between">
              <h2 id="details-title" className="crm-label">
                Details
              </h2>
              <button type="button" className="crm-btn crm-btn-sm px-2 underline underline-offset-4" onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
            <dl className="mt-2 grid grid-cols-[8rem_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="crm-muted">Source</dt>
              <dd className="font-semibold">{sourceLabel(o.source)}</dd>
              <dt className="crm-muted">Estimated value</dt>
              <dd className="tabular-nums">{money(o.value)}</dd>
              <dt className="crm-muted">Location</dt>
              <dd>{o.location || "—"}</dd>
              <dt className="crm-muted">Customer type</dt>
              <dd>{customerTypeLabel(c.type)}</dd>
              <dt className="crm-muted">Assigned to</dt>
              <dd>{o.assignedTo || "Not assigned"}</dd>
              <dt className="crm-muted">Received</dt>
              <dd>{formatDay(dayOf(o.receivedAt), t)}, {ago(o.receivedAt, t)}</dd>
              <dt className="crm-muted">Last contact</dt>
              <dd>{o.lastContactAt ? `${formatDay(dayOf(o.lastContactAt), t)}, ${ago(o.lastContactAt, t)}` : "Not contacted yet"}</dd>
            </dl>
            {o.notes && (
              <div className="mt-4 border-t border-[var(--crm-line)] pt-3">
                <p className="crm-label">Notes</p>
                <p className="mt-1 text-sm whitespace-pre-line break-words">{o.notes}</p>
              </div>
            )}
          </section>
        </aside>
      </div>

      {editing && <EditDialog o={o} onClose={() => setEditing(false)} />}
    </>
  );
}

function NoteForm({ id }: { id: string }) {
  const [text, setText] = useState("");
  const fid = useId();
  const save = (e: FormEvent) => {
    e.preventDefault();
    addNote(id, text);
    setText("");
  };
  return (
    <form onSubmit={save} className="mt-3 flex flex-col gap-2 sm:flex-row">
      <label htmlFor={fid} className="sr-only">
        Add a note
      </label>
      <input id={fid} className="crm-input flex-1" placeholder="Add a note, e.g. “Sent photos of the board”" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" className="crm-btn crm-btn-line" disabled={!text.trim()}>
        <NoteIcon /> Add note
      </button>
    </form>
  );
}

function EditDialog({ o, onClose }: { o: Opportunity; onClose: () => void }) {
  const ids = { service: useId(), title: useId(), location: useId(), value: useId(), source: useId(), who: useId(), notes: useId() };
  const [f, setF] = useState({
    service: o.service,
    title: o.title ?? "",
    location: o.location ?? "",
    value: o.value != null ? String(o.value) : "",
    source: o.source,
    who: o.assignedTo ?? "",
    notes: o.notes ?? "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = f.value.replace(/[^\d.]/g, "");
    updateOpportunity(o.id, {
      service: f.service,
      title: f.title.trim() || undefined,
      location: f.location.trim() || undefined,
      value: v ? Math.round(Number(v)) : undefined,
      source: f.source,
      assignedTo: f.who || undefined,
      notes: f.notes.trim() || undefined,
    });
    onClose();
  };
  return (
    <Dialog
      open
      onClose={onClose}
      size="wide"
      title="Edit enquiry"
      footer={
        <>
          <button type="button" className="crm-btn crm-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="edit-form" className="crm-btn crm-btn-dark">
            Save
          </button>
        </>
      }
    >
      <form id="edit-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <div className="crm-field">
          <label htmlFor={ids.service}>Service</label>
          <select id={ids.service} className="crm-select" value={f.service} onChange={(e) => set("service", e.target.value as ServiceId)}>
            {SERVICES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
        <div className="crm-field">
          <label htmlFor={ids.source}>Source</label>
          <select id={ids.source} className="crm-select" value={f.source} onChange={(e) => set("source", e.target.value as SourceId)}>
            {SOURCES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
        <div className="crm-field sm:col-span-2">
          <label htmlFor={ids.title}>Short description</label>
          <input id={ids.title} className="crm-input" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Repaint four classrooms" />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.location}>Location</label>
          <input id={ids.location} className="crm-input" value={f.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.value}>Estimated value (P)</label>
          <input id={ids.value} className="crm-input" inputMode="numeric" value={f.value} onChange={(e) => set("value", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.who}>Assigned to</label>
          <select id={ids.who} className="crm-select" value={f.who} onChange={(e) => set("who", e.target.value)}>
            <option value="">Not assigned</option>
            {TEAM.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="crm-field sm:col-span-2">
          <label htmlFor={ids.notes}>Notes</label>
          <textarea id={ids.notes} className="crm-textarea" rows={4} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </form>
    </Dialog>
  );
}
