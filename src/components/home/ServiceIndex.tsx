import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icon";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { equipment } from "@/content/equipment";
import type { MediaKey } from "@/content/media";
import { pillars, servicesInPillar, servicePath } from "@/content/services";
import { IndexPreview } from "./IndexPreview";

type Row = { key: string; num: string; name: string; summary: string; href: string; preview: MediaKey };

const rowsFor = (pillarId: (typeof pillars)[number]["id"], number: string): Row[] => {
  if (pillarId === "equip") {
    return equipment.map((e, i) => ({
      key: e.id,
      num: `${number}.${i + 1}`,
      name: e.name,
      summary: e.category,
      href: `${servicePath("equipment-hire")}#${e.id}`,
      preview: e.media,
    }));
  }
  return servicesInPillar(pillarId).map((s, i) => ({
    key: s.slug,
    num: `${number}.${i + 1}`,
    name: s.name,
    summary: s.summary,
    href: servicePath(s.slug),
    preview: s.media,
  }));
};

export function ServiceIndex() {
  const groups = pillars.map((p) => ({ pillar: p, rows: rowsFor(p.id, p.number) }));
  const previewKeys = [...new Set(groups.flatMap((g) => g.rows.map((r) => r.preview)))];

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="grid-light relative bg-bone pt-24 pb-20 md:pt-36 md:pb-28"
      data-sheet="Index"
      data-tone="light"
    >
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SheetLabel name="Index" detail="Services" />
            <h2 id="services-title" className="display h-section mt-6" data-reveal="mask">
              Three lines of work.
            </h2>
          </div>
          <p className="statement lg:col-span-9 lg:pt-10" data-reveal="up">
            Mayfair Construction is a Gaborone-based contractor. We take on building and property work, install
            specialist infrastructure, and hire out equipment — for homeowners, property managers, developers,
            businesses and banks, anywhere in Botswana.
          </p>
        </div>

        <IndexPreview keys={previewKeys}>
          <div className="mt-16 grid gap-14 md:mt-24">
            {groups.map(({ pillar, rows }) => (
              <div key={pillar.id} className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h3 className="lg:sticky lg:top-28">
                    <span className="mono block text-(--accent-text)">{pillar.number}</span>
                    <span className="display mt-2 block text-[2.75rem]">{pillar.name}</span>
                    <span className="mt-1 block text-muted">{pillar.title}</span>
                  </h3>
                </div>
                <ul className="lg:col-span-9">
                  {rows.map((r, i) => (
                    <li key={r.key} data-reveal="up" style={{ "--d": i * 60 } as React.CSSProperties}>
                      <Link href={r.href} className="index-row isolate" data-preview={r.preview}>
                        <span className="mono self-start pt-3 opacity-60 md:pt-4">{r.num}</span>
                        <span className="index-name display">{r.name}</span>
                        <span className="hidden text-[0.9375rem] leading-snug opacity-75 md:block">{r.summary}</span>
                        <span className="index-arrow justify-self-end">
                          <ArrowRight size={22} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </IndexPreview>
      </div>
    </section>
  );
}
