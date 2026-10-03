"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { ChevronLeft, PlusIcon } from "@/crm/components/icons";
import { OppRow } from "@/crm/components/parts";
import { ContactButtons, Dialog, Loading, NotFoundNote, PhoneText, SampleTag } from "@/crm/components/ui";
import { useCrmUi } from "@/crm/components/uiContext";
import { CUSTOMER_TYPES, customerTypeLabel, serviceLabel, type CustomerTypeId } from "@/crm/config";
import { dayOf, formatDay, today } from "@/crm/dates";
import { money } from "@/crm/format";
import { activitiesOf, isOpen, opportunitiesOf } from "@/crm/selectors";
import { updateCustomer, useCrm } from "@/crm/store";
import type { Customer } from "@/crm/types";

export default function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const s = useCrm();
  const ui = useCrmUi();
  const [editing, setEditing] = useState(false);
  if (!s) return <Loading />;
  const c = s.customers.find((x) => x.id === id);
  if (!c) return <NotFoundNote what="Customer" back={{ href: "/crm/customers", label: "All customers" }} />;
  const t = today();
  const opps = opportunitiesOf(s, c).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const current = opps.filter(isOpen);
  const past = opps.filter((o) => !isOpen(o));
  const wonValue = past.filter((o) => o.stage === "won").reduce((v, o) => v + (o.value ?? 0), 0);
  const history = activitiesOf(s, opps.map((o) => o.id)).slice(0, 25);
  const oppById = new Map(opps.map((o) => [o.id, o]));

  return (
    <>
      <Link href="/crm/customers" className="crm-muted mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-semibold hover:text-ink">
        <ChevronLeft size={16} /> Customers
      </Link>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <SampleTag show={Boolean(c.sample)} />
          <h1 className="crm-h1 mt-2 break-words">{c.name}</h1>
          <p className="crm-muted mt-1">
            {[c.company, customerTypeLabel(c.type)].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => ui.newEnquiry({ customerId: c.id })}>
          <PlusIcon size={18} /> New enquiry for {c.name.split(" ")[0]}
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)] lg:items-start">
        <div className="grid gap-5">
          <section className="crm-panel" aria-labelledby="cur-title">
            <div className="crm-panel-head">
              <h2 id="cur-title" className="crm-h2">
                Current enquiries
              </h2>
              <span className="crm-muted text-sm">{current.length}</span>
            </div>
            {current.length ? (
              <ul>
                {current.map((o) => (
                  <OppRow key={o.id} s={s} o={o} showCustomer={false} day={t} />
                ))}
              </ul>
            ) : (
              <p className="crm-muted px-5 py-6 text-sm">Nothing open for this customer.</p>
            )}
          </section>
          <section className="crm-panel" aria-labelledby="past-title">
            <div className="crm-panel-head">
              <h2 id="past-title" className="crm-h2">
                Past enquiries
              </h2>
              <span className="crm-muted text-sm">{wonValue ? `Won ${money(wonValue)}` : past.length}</span>
            </div>
            {past.length ? (
              <ul>
                {past.map((o) => (
                  <OppRow key={o.id} s={s} o={o} showCustomer={false} day={t} />
                ))}
              </ul>
            ) : (
              <p className="crm-muted px-5 py-6 text-sm">No past work yet.</p>
            )}
          </section>
          <section className="crm-panel p-4 sm:p-5" aria-labelledby="hist-title">
            <h2 id="hist-title" className="crm-label">
              History
            </h2>
            <ol className="crm-timeline mt-4">
              {history.map((a) => (
                <li key={a.id} data-type={a.type}>
                  <p className="text-sm">
                    <span className="font-semibold">{formatDay(dayOf(a.at), t)}</span>
                    <span className="crm-muted"> · {serviceLabel(oppById.get(a.opportunityId)!.service)}</span>
                  </p>
                  <p className="mt-0.5">{a.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="crm-panel p-4 sm:p-5" aria-labelledby="cd-title">
          <div className="flex items-center justify-between">
            <h2 id="cd-title" className="crm-label">
              Contact details
            </h2>
            <button type="button" className="crm-btn crm-btn-sm px-2 underline underline-offset-4" onClick={() => setEditing(true)}>
              Edit
            </button>
          </div>
          <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2 text-sm">
            <dt className="crm-muted">Phone</dt>
            <dd>{c.phone ? <PhoneText phone={c.phone} /> : "—"}</dd>
            <dt className="crm-muted">Email</dt>
            <dd className="break-all">{c.email || "—"}</dd>
            <dt className="crm-muted">Company</dt>
            <dd>{c.company || "—"}</dd>
            <dt className="crm-muted">Type</dt>
            <dd>{customerTypeLabel(c.type)}</dd>
            <dt className="crm-muted">Since</dt>
            <dd>{formatDay(dayOf(c.createdAt), t)}</dd>
          </dl>
          <div className="mt-4">
            <ContactButtons customer={c} />
          </div>
        </aside>
      </div>
      {editing && <EditCustomer c={c} onClose={() => setEditing(false)} />}
    </>
  );
}

function EditCustomer({ c, onClose }: { c: Customer; onClose: () => void }) {
  const ids = { name: useId(), phone: useId(), email: useId(), company: useId(), type: useId() };
  const [f, setF] = useState({ name: c.name, phone: c.phone ?? "", email: c.email ?? "", company: c.company ?? "", type: c.type });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return;
    updateCustomer(c.id, {
      name: f.name.trim(),
      phone: f.phone.trim() || undefined,
      email: f.email.trim() || undefined,
      company: f.company.trim() || undefined,
      type: f.type,
    });
    onClose();
  };
  return (
    <Dialog
      open
      onClose={onClose}
      title="Edit contact details"
      footer={
        <>
          <button type="button" className="crm-btn crm-btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="cust-form" className="crm-btn crm-btn-dark">
            Save
          </button>
        </>
      }
    >
      <form id="cust-form" onSubmit={save} className="grid gap-4">
        <div className="crm-field">
          <label htmlFor={ids.name}>Name</label>
          <input id={ids.name} className="crm-input" required minLength={2} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.phone}>Phone / WhatsApp</label>
          <input id={ids.phone} className="crm-input" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.email}>Email</label>
          <input id={ids.email} className="crm-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.company}>Company</label>
          <input id={ids.company} className="crm-input" value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div className="crm-field">
          <label htmlFor={ids.type}>Customer type</label>
          <select id={ids.type} className="crm-select" value={f.type} onChange={(e) => set("type", e.target.value as CustomerTypeId)}>
            {CUSTOMER_TYPES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Dialog>
  );
}
