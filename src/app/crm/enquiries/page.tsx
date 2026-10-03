"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { OppRow } from "@/crm/components/parts";
import { EmptyState, Loading, PageHeader } from "@/crm/components/ui";
import { today } from "@/crm/dates";
import { isOpen, search } from "@/crm/selectors";
import { useCrm } from "@/crm/store";
import type { Opportunity } from "@/crm/types";

const FILTERS: { id: string; label: string; test: (o: Opportunity) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "new", label: "New", test: (o) => o.stage === "new" },
  { id: "open", label: "Open", test: isOpen },
  { id: "won", label: "Won", test: (o) => o.stage === "won" },
  { id: "lost", label: "Lost", test: (o) => o.stage === "lost" },
];

function EnquiriesView() {
  const s = useCrm();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  if (!s) return <Loading />;
  const show = FILTERS.find((f) => f.id === params.get("show")) ?? FILTERS[0];
  const pool = q.trim() ? search(s, q).opportunities : s.opportunities;
  const list = pool.filter(show.test).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const t = today();

  return (
    <>
      <PageHeader
        title="Enquiries"
        sub="Every enquiry, newest first — from the website, the phone, WhatsApp or a referral."
      />
      <div className="flex flex-wrap items-end gap-3">
        <nav className="crm-seg flex-1" aria-label="Filter enquiries">
          {FILTERS.map((f) => (
            <Link key={f.id} href={f.id === "all" ? "/crm/enquiries" : `/crm/enquiries?show=${f.id}`} aria-current={f.id === show.id ? "page" : undefined} replace scroll={false}>
              {f.label} <span className="crm-n">{s.opportunities.filter(f.test).length}</span>
            </Link>
          ))}
        </nav>
        <div className="w-full sm:w-72">
          <label htmlFor="enq-q" className="sr-only">
            Search enquiries
          </label>
          <input id="enq-q" type="search" className="crm-input" placeholder="Search name, phone, service…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <section className="crm-panel mt-4" aria-label="Enquiry list" aria-live="polite">
        {list.length === 0 ? (
          <EmptyState title={q.trim() ? "No enquiries match your search." : "No enquiries here yet."} />
        ) : (
          <ul>
            {list.map((o) => (
              <OppRow key={o.id} s={s} o={o} day={t} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EnquiriesView />
    </Suspense>
  );
}
