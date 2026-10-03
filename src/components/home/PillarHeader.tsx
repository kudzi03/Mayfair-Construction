import { SheetLabel } from "@/components/ui/SheetLabel";
import type { Pillar } from "@/content/services";

/** Editorial section header for a pillar: label, title, intro. */
export function PillarHeader({
  pillar,
  titleId,
  count,
  intro,
}: {
  pillar: Pillar;
  titleId: string;
  count: string;
  intro: string;
}) {
  return (
    <header className="container-x">
      <div className="hairline-t grid gap-6 pt-6 lg:grid-cols-12">
        <SheetLabel number={pillar.number} name={pillar.name} detail={count} className="lg:col-span-3" />
        <div className="lg:col-span-9">
          <h2 id={titleId} className="display h-section" data-reveal="up">
            {pillar.title}
          </h2>
          <p className="lead mt-6 max-w-2xl opacity-85" data-reveal="up" style={{ "--d": 120 } as React.CSSProperties}>
            {intro}
          </p>
        </div>
      </div>
    </header>
  );
}
