"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { serviceLabel, type StageId } from "../config";
import { today } from "../dates";
import { formatPhone } from "../format";
import { customerOf, followUps, search } from "../selectors";
import { resetDemo, syncInbox, useCrm } from "../store";
import { FollowUpDialog, NewEnquiryDialog, StageDialog } from "./dialogs";
import { BellIcon, BoardIcon, ListIcon, PeopleIcon, PlusIcon, SearchIcon, TodayIcon } from "./icons";
import { Dialog, StageBadge } from "./ui";
import { CrmUiContext, type CrmUi, type ToastLink } from "./uiContext";

const NAV = [
  { href: "/crm", label: "Today", icon: TodayIcon },
  { href: "/crm/follow-ups", label: "Follow-ups", icon: BellIcon },
  { href: "/crm/pipeline", label: "Pipeline", icon: BoardIcon },
  { href: "/crm/enquiries", label: "Enquiries", icon: ListIcon },
  { href: "/crm/customers", label: "Customers", icon: PeopleIcon },
];

const isActive = (path: string, href: string) => (href === "/crm" ? path === "/crm" : path.startsWith(href));

type Modal =
  | { kind: "new"; customerId?: string }
  | { kind: "search" }
  | { kind: "followUp"; id: string; mode: "reschedule" | "contacted" }
  | { kind: "stage"; id: string; stage: StageId }
  | null;

export function CrmShell({ children }: { children: ReactNode }) {
  const s = useCrm();
  const path = usePathname();
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState<{ text: string; link?: ToastLink; key: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((text: string, link?: ToastLink) => {
    window.clearTimeout(timer.current);
    setToast({ text, link, key: Date.now() });
    timer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  const ui = useMemo<CrmUi>(
    () => ({
      newEnquiry: (o) => setModal({ kind: "new", customerId: o?.customerId }),
      openSearch: () => setModal({ kind: "search" }),
      toast: showToast,
      followUp: (id, mode = "reschedule") => setModal({ kind: "followUp", id, mode }),
      moveTo: (id, stage) => setModal({ kind: "stage", id, stage }),
    }),
    [showToast],
  );

  useEffect(() => syncInbox(), []);

  // "/" or Ctrl/⌘+K opens search; "n" starts a new enquiry.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setModal({ kind: "search" });
      } else if (e.key === "n" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setModal((m) => m ?? { kind: "new" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const due = s ? (() => {
    const f = followUps(s, today());
    return f.overdue.length + f.today.length;
  })() : 0;

  const close = () => setModal(null);
  const opp = s && modal && "id" in modal ? s.opportunities.find((o) => o.id === modal.id) : undefined;

  return (
    <CrmUiContext.Provider value={ui}>
      <div className="crm">
        <a href="#crm-main" className="skip-link">
          Skip to content
        </a>

        {/* Desktop sidebar */}
        <aside className="crm-side" aria-label="CRM">
          <div className="px-5 pt-5 pb-6">
            <Link href="/crm" className="block">
              <span className="display block text-[1.6rem] leading-none tracking-[-0.02em]">Mayfair</span>
              <span className="crm-label mt-1 block !text-[rgb(235_229_218/0.65)]">Enquiries &amp; follow-ups</span>
            </Link>
          </div>
          <div className="grid gap-2 px-4">
            <button type="button" className="crm-btn crm-btn-primary w-full" onClick={() => ui.newEnquiry()}>
              <PlusIcon size={18} /> New enquiry
            </button>
            <button
              type="button"
              className="flex min-h-11 w-full items-center gap-2 rounded-[3px] border border-white/15 px-3 text-left text-sm text-bone/75 hover:border-white/35"
              onClick={() => ui.openSearch()}
            >
              <SearchIcon size={17} /> Search
              <kbd className="ml-auto font-mono text-xs text-bone/50">/</kbd>
            </button>
          </div>
          <nav className="crm-nav mt-6" aria-label="CRM sections">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined}>
                <Icon size={19} /> {label}
                {href === "/crm/follow-ups" && due > 0 && (
                  <span className="crm-count" aria-label={`${due} due`}>
                    {due}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-bone/65">
            <p>
              <strong className="text-bone">Demo.</strong> Fictional sample data, stored only in this browser.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              <Link href="/" className="underline underline-offset-2 hover:text-bone">
                Website
              </Link>
              <ResetButton onDone={() => showToast("Demo data reset.")} className="underline underline-offset-2 hover:text-bone" />
            </div>
          </div>
        </aside>

        <div className="crm-body">
          <div className="crm-demo" role="note">
            <span className="min-w-0 flex-1">
              <strong>Demo CRM</strong>
              <span className="hidden sm:inline"> · Fictional sample data, stored only in this browser. Not real Mayfair customers.</span>
              <span className="sm:hidden"> · Sample data only</span>
            </span>
            <ResetButton onDone={() => showToast("Demo data reset.")} />
          </div>

          {/* Mobile top bar */}
          <header className="crm-top">
            <Link href="/crm" className="mr-auto flex items-baseline gap-2">
              <span className="display text-[1.35rem] leading-none">Mayfair</span>
              <span className="crm-label !text-[rgb(235_229_218/0.6)]">CRM</span>
            </Link>
            <button type="button" className="crm-icon-btn" onClick={() => ui.openSearch()} aria-label="Search">
              <SearchIcon size={21} />
            </button>
            <button type="button" className="crm-btn crm-btn-primary crm-btn-sm !min-h-10" onClick={() => ui.newEnquiry()}>
              <PlusIcon size={17} /> New
            </button>
          </header>

          <main id="crm-main" tabIndex={-1} className="crm-main outline-none">
            <div className="crm-page">{children}</div>
          </main>
        </div>

        {/* Mobile tab bar */}
        <nav className="crm-tabs" aria-label="CRM sections">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined}>
              <Icon size={21} />
              {label}
              {href === "/crm/follow-ups" && due > 0 && (
                <span className="crm-count" aria-label={`${due} due`}>
                  {due}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div aria-live="polite" role="status">
          {toast && (
            <div key={toast.key} className="crm-toast">
              <span>{toast.text}</span>
              {toast.link && <Link href={toast.link.href}>{toast.link.label}</Link>}
            </div>
          )}
        </div>

        {s && modal?.kind === "new" && <NewEnquiryDialog customerId={modal.customerId} onClose={close} />}
        {s && modal?.kind === "search" && <SearchDialog onClose={close} />}
        {opp && modal?.kind === "followUp" && <FollowUpDialog opp={opp} mode={modal.mode} onClose={close} />}
        {opp && modal?.kind === "stage" && <StageDialog opp={opp} stage={modal.stage} onClose={close} />}
      </div>
    </CrmUiContext.Provider>
  );
}

function ResetButton({ onDone, className = "" }: { onDone: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (window.confirm("Reset the demo? This removes your test enquiries and restores the sample data.")) {
          resetDemo();
          onDone();
        }
      }}
    >
      Reset demo
    </button>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const s = useCrm()!;
  const router = useRouter();
  const [q, setQ] = useState("");
  const r = useMemo(() => search(s, q), [s, q]);
  const first = r.opportunities[0] ? `/crm/enquiries/${r.opportunities[0].id}` : r.customers[0] ? `/crm/customers/${r.customers[0].id}` : null;
  const go = (href: string) => {
    onClose();
    router.push(href);
  };
  const empty = q.trim() && !r.customers.length && !r.opportunities.length;

  return (
    <Dialog open onClose={onClose} title="Search" size="wide">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (first) go(first);
        }}
      >
        <label htmlFor="crm-q" className="sr-only">
          Search customers, companies, phone numbers or enquiries
        </label>
        <input
          id="crm-q"
          className="crm-input"
          type="search"
          data-autofocus
          autoComplete="off"
          placeholder="Name, company, phone or service"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      <div className="mt-4 min-h-24" aria-live="polite">
        {!q.trim() && <p className="crm-muted text-sm">Try “Kabelo”, “partitioning” or “71 000”.</p>}
        {empty && <p className="crm-muted text-sm">No customers or enquiries match “{q.trim()}”.</p>}
        {r.opportunities.length > 0 && (
          <section aria-label="Enquiries">
            <h3 className="crm-label mb-1">Enquiries</h3>
            <ul>
              {r.opportunities.map((o) => {
                const c = customerOf(s, o);
                return (
                  <li key={o.id} className="crm-row">
                    <Link href={`/crm/enquiries/${o.id}`} onClick={onClose} className="crm-rowlink flex min-h-12 items-center gap-3 px-1 py-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{c.name}</span>
                        <span className="crm-muted block truncate text-sm">
                          {serviceLabel(o.service)}
                          {o.location ? ` · ${o.location}` : ""}
                        </span>
                      </span>
                      <StageBadge stage={o.stage} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        {r.customers.length > 0 && (
          <section aria-label="Customers" className="mt-4">
            <h3 className="crm-label mb-1">Customers</h3>
            <ul>
              {r.customers.map((c) => (
                <li key={c.id} className="crm-row">
                  <Link href={`/crm/customers/${c.id}`} onClick={onClose} className="crm-rowlink flex min-h-12 items-center gap-3 px-1 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{c.name}</span>
                      <span className="crm-muted block truncate text-sm">{[c.company, formatPhone(c.phone)].filter(Boolean).join(" · ")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Dialog>
  );
}
