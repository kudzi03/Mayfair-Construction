import { ScrollVar } from "@/components/motion/ScrollVar";
import { SheetLabel } from "@/components/ui/SheetLabel";
import type { Pillar } from "@/content/services";

/** Oversized pillar word ("BUILD") that drifts sideways with scroll, plus the sheet title row. */
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
    <header className="relative">
      <ScrollVar className="overflow-clip" aria-hidden="true">
        <p
          className="pillar-word display -ml-[0.04em]"
          data-reveal="mask"
          style={{ "--chars": pillar.number.length + pillar.name.length } as React.CSSProperties}
        >
          <span className="pillar-num mr-[0.08em]">{pillar.number}</span>
          {pillar.name}
        </p>
      </ScrollVar>
      <div className="container-x">
        <div className="hairline-t grid gap-6 pt-5 md:grid-cols-12">
          <SheetLabel number={pillar.number} name={pillar.name} detail={count} className="md:col-span-3" />
          <h2 id={titleId} className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight md:col-span-4">
            {pillar.title}
          </h2>
          <p className="max-w-xl text-[1.0625rem] opacity-80 md:col-span-5">{intro}</p>
        </div>
      </div>
    </header>
  );
}
