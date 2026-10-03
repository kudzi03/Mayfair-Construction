"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import {
  CUSTOMER_TYPES,
  LOST_REASONS,
  NEXT_ACTIONS,
  RESCHEDULE_CHOICES,
  SERVICES,
  SOURCES,
  STAGE_NEXT,
  TEAM,
  stageLabel,
  type CustomerTypeId,
  type ServiceId,
  type SourceId,
  type StageId,
} from "../config";
import { addDays, formatDay, formatLong, today } from "../dates";
import { money } from "../format";
import { customerOf } from "../selectors";
import {
  CONTACT_TEXT,
  changeStage,
  createEnquiry,
  findCustomerByPhone,
  logContact,
  setFollowUp,
  useCrm,
} from "../store";
import type { Opportunity } from "../types";
import { Dialog } from "./ui";
import { useCrmUi } from "./uiContext";

/* ---------------------------- date picker ---------------------------- */

function DatePick({
  value,
  onChange,
  choices = RESCHEDULE_CHOICES,
  label = "When?",
}: {
  value: string;
  onChange: (day: string) => void;
  choices?: { label: string; days: number }[];
  label?: string;
}) {
  const id = useId();
  const t = today();
  return (
    <fieldset className="crm-field">
      <legend>{label}</legend>
      <div className="crm-choices" role="group">
        {choices.map((c) => {
          const day = addDays(t, c.days);
          return (
            <button key={c.label} type="button" className="crm-choice" aria-pressed={value === day} onClick={() => onChange(day)}>
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          Or pick a date
        </label>
        <input
          id={id}
          type="date"
          className="crm-input w-auto"
          min={t}
          value={value}
          onChange={(e) => e.target.value && onChange(e.target.value)}
        />
      </div>
      {value && (
        <p className="crm-muted mt-2 text-sm" aria-live="polite">
          {formatLong(value)}
        </p>
      )}
    </fieldset>
  );
}

function ActionInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="crm-field">
      <label htmlFor={id}>Next action</label>
      <input id={id} className="crm-input" list={`${id}-l`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Call about the quote" />
      <datalist id={`${id}-l`}>
        {NEXT_ACTIONS.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
    </div>
  );
}

function NoteInput({ value, onChange, label = "Note", placeholder }: { value: string; onChange: (v: string) => void; label?: string; placeholder?: string }) {
  const id = useId();
  return (
    <div className="crm-field">
      <label htmlFor={id}>
        {label} <span className="crm-opt">(optional)</span>
      </label>
      <textarea id={id} className="crm-textarea" rows={2} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ---------------------------- follow-up ---------------------------- */

export function FollowUpDialog({ opp, mode, onClose }: { opp: Opportunity; mode: "reschedule" | "contacted"; onClose: () => void }) {
  const s = useCrm()!;
  const ui = useCrmUi();
  const c = customerOf(s, opp);
  const nextStage: StageId = mode === "contacted" && opp.stage === "new" ? "contacted" : opp.stage;
  const suggestion = STAGE_NEXT[nextStage];
  const [how, setHow] = useState<keyof typeof CONTACT_TEXT>("call");
  const [note, setNote] = useState("");
  const [day, setDay] = useState(mode === "contacted" && suggestion ? addDays(today(), Math.max(1, suggestion.inDays)) : "");
  const [action, setAction] = useState(
    mode === "contacted" ? (opp.stage === "new" ? suggestion?.action ?? "" : opp.nextAction ?? "") : opp.nextAction ?? "",
  );

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!day) return;
    if (mode === "contacted") logContact(opp.id, how, note);
    setFollowUp(opp.id, day, action.trim() || "Follow up");
    ui.toast(`${mode === "contacted" ? "Contact logged. " : ""}Next follow-up: ${formatDay(day)}.`);
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={mode === "contacted" ? `Contacted ${c.name}` : `Next follow-up — ${c.name}`}
      footer={
        <>
          <button type="button" className="crm-btn crm-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="fu-form" className="crm-btn crm-btn-dark" disabled={!day}>
            Save
          </button>
        </>
      }
    >
      <form id="fu-form" onSubmit={save} className="grid gap-5">
        {mode === "contacted" && (
          <>
            <fieldset className="crm-field">
              <legend>How?</legend>
              <div className="crm-choices">
                {(Object.keys(CONTACT_TEXT) as (keyof typeof CONTACT_TEXT)[]).map((k) => (
                  <label key={k} className="crm-choice">
                    <input type="radio" name="how" checked={how === k} onChange={() => setHow(k)} />
                    {k === "call" ? "Phone call" : k === "whatsapp" ? "WhatsApp" : k === "email" ? "Email" : "Site visit"}
                  </label>
                ))}
              </div>
            </fieldset>
            <NoteInput label="What did they say?" value={note} onChange={setNote} placeholder="e.g. Board meets on Friday, call Monday" />
          </>
        )}
        <DatePick value={day} onChange={setDay} label={mode === "contacted" ? "When should we follow up next?" : "Move the follow-up to"} />
        <ActionInput value={action} onChange={setAction} />
      </form>
    </Dialog>
  );
}

/* ---------------------------- stage change ---------------------------- */

const HOLD_CHOICES = [
  { label: "1 month", days: 30 },
  { label: "2 months", days: 61 },
  { label: "3 months", days: 91 },
  { label: "6 months", days: 182 },
];

export function StageDialog({ opp, stage, onClose }: { opp: Opportunity; stage: StageId; onClose: () => void }) {
  const s = useCrm()!;
  const ui = useCrmUi();
  const c = customerOf(s, opp);
  const suggestion = STAGE_NEXT[stage];
  const valueId = useId();
  const [day, setDay] = useState(stage === "on_hold" ? "" : suggestion ? addDays(today(), suggestion.inDays) : "");
  const [action, setAction] = useState(suggestion?.action ?? "");
  const [note, setNote] = useState("");
  const [value, setValue] = useState(opp.value != null ? String(opp.value) : "");
  const [reason, setReason] = useState("");

  const needsDate = stage !== "won" && stage !== "lost";
  const ok = needsDate ? Boolean(day) : stage === "lost" ? Boolean(reason) : true;

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const v = value.replace(/[^\d.]/g, "");
    changeStage(opp.id, stage, {
      followUp: needsDate ? day : undefined,
      action: action.trim() || "Follow up",
      value: stage === "won" && v ? Math.round(Number(v)) : undefined,
      lostReason: reason,
      note,
    });
    ui.toast(
      stage === "won"
        ? `Marked as won${v ? `: ${money(Number(v))}` : ""}.`
        : stage === "lost"
          ? "Marked as lost. The reason is saved for reporting."
          : `Moved to ${stageLabel(stage)}. Next follow-up: ${formatDay(day)}.`,
    );
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={stage === "won" ? `Won — ${c.name}` : stage === "lost" ? `Lost — ${c.name}` : `${stageLabel(stage)} — ${c.name}`}
      footer={
        <>
          <button type="button" className="crm-btn crm-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="stage-form" className="crm-btn crm-btn-dark" disabled={!ok}>
            {stage === "won" ? "Mark as won" : stage === "lost" ? "Mark as lost" : "Save"}
          </button>
        </>
      }
    >
      <form id="stage-form" onSubmit={save} className="grid gap-5">
        {stage === "won" && (
          <div className="crm-field">
            <label htmlFor={valueId}>
              Job value (P) <span className="crm-opt">(estimate is fine)</span>
            </label>
            <input id={valueId} className="crm-input" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 45000" />
          </div>
        )}
        {stage === "lost" && (
          <fieldset className="crm-field">
            <legend>Why was it lost?</legend>
            <div className="crm-choices">
              {LOST_REASONS.map((r) => (
                <label key={r} className="crm-choice">
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {needsDate && (
          <>
            {stage === "on_hold" && (
              <p className="crm-muted text-sm">
                It disappears from your follow-ups until this date, then comes back by itself.
              </p>
            )}
            <DatePick
              value={day}
              onChange={setDay}
              choices={stage === "on_hold" ? HOLD_CHOICES : RESCHEDULE_CHOICES}
              label={stage === "on_hold" ? "Contact them again on" : stage === "site_visit" ? "Site visit date" : "Next follow-up"}
            />
            <ActionInput value={action} onChange={setAction} />
          </>
        )}
        <NoteInput value={note} onChange={setNote} placeholder={stage === "on_hold" ? "e.g. Waiting for funding approval" : undefined} />
      </form>
    </Dialog>
  );
}

/* ---------------------------- new enquiry ---------------------------- */

export function NewEnquiryDialog({ customerId, onClose }: { customerId?: string; onClose: () => void }) {
  const s = useCrm()!;
  const ui = useCrmUi();
  const router = useRouter();
  const ids = { name: useId(), phone: useId(), service: useId(), notes: useId(), company: useId(), type: useId(), email: useId(), location: useId(), value: useId(), who: useId() };
  const forCustomer = customerId ? s.customers.find((c) => c.id === customerId) : undefined;
  const [f, setF] = useState({
    name: "",
    phone: "",
    service: "" as ServiceId | "",
    source: (customerId ? "repeat" : "phone") as SourceId,
    notes: "",
    company: "",
    type: "unknown" as CustomerTypeId,
    email: "",
    location: "",
    value: "",
    who: "",
  });
  const [tried, setTried] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const match = useMemo(() => (forCustomer ? undefined : findCustomerByPhone(s, f.phone)), [s, f.phone, forCustomer]);
  const nameOk = Boolean(forCustomer || f.name.trim().length >= 2);
  const ok = nameOk && Boolean(f.service);

  const save = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!ok) return;
    const v = f.value.replace(/[^\d.]/g, "");
    const r = createEnquiry({
      name: forCustomer?.name ?? f.name,
      phone: f.phone,
      email: f.email,
      company: f.company,
      customerType: f.type,
      service: f.service as ServiceId,
      source: f.source,
      notes: f.notes,
      location: f.location,
      value: v ? Math.round(Number(v)) : undefined,
      assignedTo: f.who || undefined,
      customerId: forCustomer?.id,
    });
    ui.toast(r.existing ? "Enquiry added to the existing customer." : "Enquiry added. Follow-up set for today.");
    onClose();
    router.push(`/crm/enquiries/${r.id}`);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      size="wide"
      title={forCustomer ? `New enquiry — ${forCustomer.name}` : "New enquiry"}
      footer={
        <>
          <button type="button" className="crm-btn crm-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="new-form" className="crm-btn crm-btn-primary">
            Save enquiry
          </button>
        </>
      }
    >
      <form id="new-form" onSubmit={save} className="grid gap-4" noValidate>
        <p className="crm-muted text-sm">Only the name and service are needed. Fill in the rest later.</p>
        {!forCustomer && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="crm-field">
              <label htmlFor={ids.name}>Customer name</label>
              <input
                id={ids.name}
                className="crm-input"
                data-autofocus
                autoComplete="off"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={tried && !nameOk}
                aria-describedby={tried && !nameOk ? `${ids.name}-e` : undefined}
              />
              {tried && !nameOk && (
                <p id={`${ids.name}-e`} className="mt-1 text-sm font-medium text-[var(--crm-red)]">
                  Enter a name.
                </p>
              )}
            </div>
            <div className="crm-field">
              <label htmlFor={ids.phone}>
                Phone / WhatsApp <span className="crm-opt">(optional)</span>
              </label>
              <input id={ids.phone} className="crm-input" type="tel" inputMode="tel" autoComplete="off" placeholder="+267" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              {match && (
                <p className="mt-1 text-sm" role="status">
                  Matches <strong>{match.name}</strong>. The enquiry will be added to their record.
                </p>
              )}
            </div>
          </div>
        )}
        <div className="crm-field">
          <label htmlFor={ids.service}>Service</label>
          <select
            id={ids.service}
            className="crm-select"
            value={f.service}
            onChange={(e) => set("service", e.target.value as ServiceId)}
            aria-invalid={tried && !f.service}
            aria-describedby={tried && !f.service ? `${ids.service}-e` : undefined}
          >
            <option value="">Choose a service</option>
            {["Build", "Install", "Equipment hire", "Other"].map((g) => (
              <optgroup key={g} label={g}>
                {SERVICES.filter((x) => x.group === g).map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {tried && !f.service && (
            <p id={`${ids.service}-e`} className="mt-1 text-sm font-medium text-[var(--crm-red)]">
              Choose the service, or Other.
            </p>
          )}
        </div>
        <fieldset className="crm-field">
          <legend>How did they get in touch?</legend>
          <div className="crm-choices">
            {SOURCES.map((x) => (
              <label key={x.id} className="crm-choice">
                <input type="radio" name="source" checked={f.source === x.id} onChange={() => set("source", x.id)} />
                {x.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="crm-field">
          <label htmlFor={ids.notes}>
            What do they need? <span className="crm-opt">(optional)</span>
          </label>
          <textarea id={ids.notes} className="crm-textarea" rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <details className="group border-t border-[var(--crm-line)] pt-3">
          <summary className="flex min-h-11 cursor-pointer items-center font-semibold">More details (optional)</summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {!forCustomer && (
              <>
                <div className="crm-field">
                  <label htmlFor={ids.company}>Company</label>
                  <input id={ids.company} className="crm-input" value={f.company} onChange={(e) => set("company", e.target.value)} />
                </div>
                <div className="crm-field">
                  <label htmlFor={ids.type}>Customer type</label>
                  <select id={ids.type} className="crm-select" value={f.type} onChange={(e) => set("type", e.target.value as CustomerTypeId)}>
                    {CUSTOMER_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="crm-field">
                  <label htmlFor={ids.email}>Email</label>
                  <input id={ids.email} className="crm-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </>
            )}
            <div className="crm-field">
              <label htmlFor={ids.location}>Project location</label>
              <input id={ids.location} className="crm-input" placeholder="Town or area" value={f.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="crm-field">
              <label htmlFor={ids.value}>Estimated value (P)</label>
              <input id={ids.value} className="crm-input" inputMode="numeric" value={f.value} onChange={(e) => set("value", e.target.value)} />
            </div>
            <div className="crm-field">
              <label htmlFor={ids.who}>Assigned to</label>
              <select id={ids.who} className="crm-select" value={f.who} onChange={(e) => set("who", e.target.value)}>
                <option value="">Not assigned</option>
                {TEAM.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </details>
      </form>
    </Dialog>
  );
}
