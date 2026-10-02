import { ScrollVar } from "@/components/motion/ScrollVar";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { media } from "@/content/media";
import { pillars, services, servicePath } from "@/content/services";
import { TradesExplorer, type TradePillar, type TradeSlice } from "./TradesExplorer";

const statement =
  "The builder waits on the electrician, the painter waits on the builder, and you wait on all of them. Mayfair takes the wall, the power and the finish as one job — one quote and one number to call.";

/** Statement that lights word by word as it scrolls through, then the trades as image slices. */
export function TradesSection() {
  const words = statement.split(" ");

  const countIn = (id: string) => services.filter((s) => s.pillar === id).length;
  const pillarRows: TradePillar[] = pillars.map((p, i) => ({
    id: p.id,
    number: p.number,
    name: p.name,
    title: p.title,
    first: pillars.slice(0, i).reduce((sum, q) => sum + countIn(q.id), 0),
    count: countIn(p.id),
  }));

  // Services in pillar order, so each pillar's slices sit together.
  const slices: TradeSlice[] = pillars.flatMap((p) =>
    services
      .filter((s) => s.pillar === p.id)
      .map((s) => ({
        slug: s.slug,
        name: s.name,
        pillar: p.name,
        pillarNumber: p.number,
        summary: s.summary,
        href: servicePath(s.slug),
        src: media[s.media].src,
        alt: media[s.media].alt,
      })),
  );

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative bg-paper pt-24 pb-24 md:pt-36 md:pb-32"
      data-sheet="Index — Services"
      data-tone="light"
    >
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel name="Index" detail="Services" className="lg:col-span-3" />
          <div className="lg:col-span-9">
            <h2 id="services-title" className="display h-section" data-reveal="blur">
              Most jobs go wrong between the trades<span className="text-ochre">.</span>
            </h2>
            <ScrollVar
              as="p"
              className="lit-words statement mt-10 max-w-4xl md:mt-14"
              style={{ "--n": words.length } as React.CSSProperties}
            >
              {words.map((w, i) => (
                <span key={i} style={{ "--w": i } as React.CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </ScrollVar>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <TradesExplorer slices={slices} pillars={pillarRows} />
        </div>
      </div>
    </section>
  );
}
