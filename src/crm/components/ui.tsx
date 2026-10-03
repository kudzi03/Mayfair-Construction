"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { stageLabel, type StageId } from "../config";
import { formatDay, relativeDue, today } from "../dates";
import { formatPhone, telHref, whatsappHref } from "../format";
import { followUpStatus, type FollowUpStatus } from "../selectors";
import type { Customer, Opportunity } from "../types";
import { AlertCircle, CalendarIcon, CheckCircle, ClockIcon, PauseIcon } from "./icons";
import { useCrmUi } from "./uiContext";

/* ---------------------------- dialog ---------------------------- */

/** Native <dialog>: focus trap, Esc and inert background come from the browser. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size,
  describedBy,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "wide";
  describedBy?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // showModal() focuses the first button (Close); prefer the field marked for it.
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="crm-dialog"
      data-size={size}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <div className="crm-dialog-head">
            <h2 id={titleId} className="crm-h2">
              {title}
            </h2>
            <button type="button" className="crm-icon-btn hover:bg-black/5" onClick={onClose} aria-label="Close">
              <CloseIcon size={20} />
            </button>
          </div>
          <div className="crm-dialog-body">{children}</div>
          {footer && <div className="crm-dialog-foot">{footer}</div>}
        </>
      )}
    </dialog>
  );
}

/* ---------------------------- badges ---------------------------- */

export function StageBadge({ stage }: { stage: StageId }) {
  return (
    <span className="crm-stage" data-stage={stage}>
      {stageLabel(stage)}
    </span>
  );
}

const dueIcon: Record<FollowUpStatus, ReactNode> = {
  overdue: <AlertCircle size={14} />,
  today: <ClockIcon size={14} />,
  upcoming: <CalendarIcon size={14} />,
  hold: <PauseIcon size={14} />,
  unscheduled: <AlertCircle size={14} />,
};

/** Follow-up state in words + icon, never colour alone. */
export function DueBadge({ o, day = today() }: { o: Opportunity; day?: string }) {
  const st = followUpStatus(o, day);
  if (!st) {
    return o.stage === "won" ? (
      <span className="crm-due" style={{ color: "var(--crm-green)" }}>
        <CheckCircle size={14} /> Won
      </span>
    ) : null;
  }
  const text =
    st === "unscheduled"
      ? "No next step"
      : st === "hold"
        ? `Back ${formatDay(o.nextFollowUp!, day)}`
        : relativeDue(o.nextFollowUp!, day);
  return (
    <span className="crm-due" data-status={st}>
      {dueIcon[st]} {text}
    </span>
  );
}

export const SampleTag = ({ show = true }: { show?: boolean }) =>
  show ? (
    <span className="crm-sample" title="Fictional demo record">
      Sample
    </span>
  ) : null;

/* ---------------------------- contact ---------------------------- */

/**
 * Call / WhatsApp open the phone's own apps — nothing is sent automatically.
 * Sample records have fictional numbers, so they explain instead of dialling.
 */
export function ContactButtons({ customer, compact }: { customer: Customer; compact?: boolean }) {
  const ui = useCrmUi();
  const tel = telHref(customer.phone);
  const wa = whatsappHref(customer.phone);
  const cls = compact ? "crm-btn crm-btn-sm" : "crm-btn";
  const sampleNote = () => ui.toast("Sample record: this number is fictional, so nothing was dialled.");
  if (!customer.phone && !customer.email) return <p className="crm-muted text-sm">No phone number yet.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {tel &&
        (customer.sample ? (
          <button type="button" className={`${cls} crm-btn-call`} onClick={sampleNote}>
            <PhoneIcon size={17} /> Call
          </button>
        ) : (
          <a href={tel} className={`${cls} crm-btn-call`}>
            <PhoneIcon size={17} /> Call
          </a>
        ))}
      {wa &&
        (customer.sample ? (
          <button type="button" className={`${cls} crm-btn-wa`} onClick={sampleNote}>
            <WhatsAppIcon size={17} /> WhatsApp
          </button>
        ) : (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${cls} crm-btn-wa`}>
            <WhatsAppIcon size={17} /> WhatsApp
          </a>
        ))}
      {!compact &&
        customer.email &&
        (customer.sample ? (
          <button type="button" className={`${cls} crm-btn-line`} onClick={sampleNote}>
            <MailIcon size={17} /> Email
          </button>
        ) : (
          <a href={`mailto:${customer.email}`} className={`${cls} crm-btn-line`}>
            <MailIcon size={17} /> Email
          </a>
        ))}
    </div>
  );
}

export const PhoneText = ({ phone }: { phone?: string }) => (phone ? <span className="tabular-nums">{formatPhone(phone)}</span> : null);

/* ---------------------------- layout bits ---------------------------- */

export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-7">
      <div className="min-w-0">
        <h1 className="crm-h1">{title}</h1>
        {sub && <p className="crm-muted mt-1.5">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center">
      <CheckCircle size={28} className="mx-auto text-[var(--crm-green)]" />
      <p className="mt-3 font-semibold">{title}</p>
      {text && <p className="crm-muted mx-auto mt-1 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading CRM…</span>
      <div className="crm-skel h-10 w-48" />
      <div className="crm-skel mt-6 h-24" />
      <div className="crm-skel mt-4 h-64" />
    </div>
  );
}

export function NotFoundNote({ what, back }: { what: string; back: { href: string; label: string } }) {
  return (
    <div className="crm-panel p-8 text-center">
      <p className="font-semibold">{what} not found.</p>
      <p className="crm-muted mt-1 text-sm">It may have been removed when the demo data was reset.</p>
      <Link href={back.href} className="crm-btn crm-btn-line mt-4">
        {back.label}
      </Link>
    </div>
  );
}
