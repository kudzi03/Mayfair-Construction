"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, Loading, PageHeader, PhoneText, SampleTag } from "@/crm/components/ui";
import { ago, today } from "@/crm/dates";
import { activitiesOf, isOpen, opportunitiesOf, search } from "@/crm/selectors";
import { useCrm } from "@/crm/store";

export default function CustomersPage() {
  const s = useCrm();
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    if (!s) return [];
    const pool = q.trim() ? search(s, q).customers : s.customers;
    return pool
      .map((c) => {
        const opps = opportunitiesOf(s, c);
        const last = activitiesOf(s, opps.map((o) => o.id))[0];
        return { c, open: opps.filter(isOpen).length, won: opps.filter((o) => o.stage === "won").length, last: last?.at ?? c.createdAt };
      })
      .sort((a, b) => b.last.localeCompare(a.last));
  }, [s, q]);
  if (!s) return <Loading />;
  const t = today();

  return (
    <>
      <PageHeader title="Customers" sub="One record per customer, with every enquiry they’ve made." />
      <div className="max-w-md">
        <label htmlFor="cust-q" className="sr-only">
          Search customers
        </label>
        <input id="cust-q" type="search" className="crm-input" placeholder="Search name, company or phone" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <section className="crm-panel mt-4" aria-label="Customer list" aria-live="polite">
        {rows.length === 0 ? (
          <EmptyState title="No customers match your search." text="Check the spelling, or search by phone number." />
        ) : (
          <ul>
            <li className="crm-label hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_5rem_4rem] gap-4 px-5 py-2.5 md:grid" aria-hidden="true">
              <span>Customer</span>
              <span>Phone</span>
              <span>Last activity</span>
              <span className="text-right">Open</span>
              <span className="text-right">Won</span>
            </li>
            {rows.map(({ c, open, won, last }) => (
              <li key={c.id} className="crm-row">
                <Link href={`/crm/customers/${c.id}`} className="crm-rowlink grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 px-4 py-3 sm:px-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_5rem_4rem]">
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold">{c.name}</span>
                      <SampleTag show={Boolean(c.sample)} />
                    </span>
                    {c.company && <span className="crm-muted block truncate text-sm">{c.company}</span>}
                  </span>
                  <span className="crm-muted hidden text-sm md:block">
                    <PhoneText phone={c.phone} />
                  </span>
                  <span className="crm-muted text-sm md:text-[0.9375rem]">{ago(last, t)}</span>
                  <span className="crm-muted text-sm md:text-right">
                    <span className="md:hidden">Open </span>
                    <span className="font-semibold text-ink tabular-nums">{open}</span>
                  </span>
                  <span className="crm-muted text-right text-sm">
                    <span className="md:hidden">Won </span>
                    <span className="font-semibold tabular-nums text-[var(--crm-green)]">{won}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
