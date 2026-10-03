"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FollowUpItem } from "@/crm/components/parts";
import { EmptyState, Loading, PageHeader } from "@/crm/components/ui";
import { formatDay, today } from "@/crm/dates";
import { followUps, type FollowUpStatus } from "@/crm/selectors";
import { useCrm } from "@/crm/store";

const TABS: { id: FollowUpStatus; label: string; empty: [string, string] }[] = [
  { id: "overdue", label: "Overdue", empty: ["Nothing overdue.", "Every follow-up has been done or moved to a new date."] },
  { id: "today", label: "Today", empty: ["No follow-ups due today.", "You’re caught up."] },
  { id: "upcoming", label: "Upcoming", empty: ["Nothing scheduled ahead.", "Set a next follow-up on any open enquiry."] },
  { id: "hold", label: "On hold", empty: ["Nothing on hold.", "Parked enquiries wait here until their date, then return by themselves."] },
  { id: "unscheduled", label: "No next step", empty: ["Every open enquiry has a next step.", ""] },
];

function FollowUpsView() {
  const s = useCrm();
  const params = useSearchParams();
  if (!s) return <Loading />;
  const t = today();
  const f = followUps(s, t);
  const requested = params.get("tab") as FollowUpStatus | null;
  const active: FollowUpStatus = requested && f[requested] ? requested : f.overdue.length ? "overdue" : "today";
  const tab = TABS.find((x) => x.id === active)!;
  const list = f[active];
  const visibleTabs = TABS.filter((x) => x.id !== "unscheduled" || f.unscheduled.length > 0);

  return (
    <>
      <PageHeader
        title="Follow-ups"
        sub="Every open enquiry has a next date. Parked ones come back by themselves when it arrives."
      />
      <nav className="crm-seg" aria-label="Follow-up lists">
        {visibleTabs.map((x) => (
          <Link key={x.id} href={`/crm/follow-ups?tab=${x.id}`} aria-current={x.id === active ? "page" : undefined} replace scroll={false}>
            {x.label} <span className="crm-n">{f[x.id].length}</span>
          </Link>
        ))}
      </nav>

      <section className="crm-panel mt-4" aria-label={tab.label}>
        {active === "hold" && list.length > 0 && (
          <p className="crm-muted border-b border-[var(--crm-line)] px-4 py-3 text-sm sm:px-5">
            These don’t need anything now. Each returns to <strong className="text-ink">Today</strong> on its date — the next one on{" "}
            {formatDay(list[0].nextFollowUp!, t)}.
          </p>
        )}
        {list.length === 0 ? (
          <EmptyState title={tab.empty[0]} text={tab.empty[1] || undefined} />
        ) : (
          <ul>
            {list.map((o) => (
              <FollowUpItem key={o.id} s={s} o={o} day={t} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function FollowUpsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FollowUpsView />
    </Suspense>
  );
}
