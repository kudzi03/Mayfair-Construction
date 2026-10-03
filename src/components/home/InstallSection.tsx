import Image from "next/image";
import Link from "next/link";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import { RepNote } from "@/components/ui/RepNote";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { pillarById, servicePath, servicesInPillar } from "@/content/services";
import { PillarHeader } from "./PillarHeader";

/** Two full-bleed panels: the installation on the image, the scope underneath. */
export function InstallSection() {
  const pillar = pillarById("install");
  const items = servicesInPillar("install");

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="on-dark relative bg-ink pt-20 pb-20 text-bone md:pt-28 md:pb-24"
      data-tone="dark"
    >
      <PillarHeader
        pillar={pillar}
        titleId="install-title"
        count="2 services"
        intro="Specialist equipment, fitted on site. ATM installation and EV charging sit alongside Mayfair’s building and electrical services — so the wall, the power and the finish can be one enquiry."
      />

      <div className="mt-14 grid gap-px bg-white/10 md:mt-20 lg:grid-cols-2">
        {items.map((s, idx) => {
          const m = media[s.media];
          return (
            <article key={s.slug} className="install-panel flex flex-col bg-ink" aria-labelledby={`install-${s.slug}`}>
              <div className="install-figure relative aspect-[4/3] overflow-hidden lg:aspect-square" data-reveal="fade">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 64rem) 50vw, 100vw"
                  quality={60}
                  className="object-cover"
                  style={{ objectPosition: m.focus }}
                />
                <div className="install-shade" aria-hidden="true" />
                <RepNote media={m} className="absolute top-4 right-4 z-10" />
                <div className="absolute inset-x-0 bottom-0 z-10 px-(--gutter) pb-6 md:pb-10 lg:px-10">
                  <p className="mono text-ochre">02.{idx + 1}</p>
                  <h3 id={`install-${s.slug}`} className="display mt-3 text-[clamp(2.75rem,1.8rem+4vw,6rem)]">
                    {s.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-(--gutter) pt-8 pb-12 lg:px-10 lg:pb-14">
                <p className="mono text-muted-dark">
                  For {s.clients.slice(0, 3).map((c) => clientById(c).name.toLowerCase()).join(" · ")}
                </p>
                <p className="lead mt-4 max-w-xl text-bone/90">{s.summary}</p>
                <ol className="mt-8 grid border-t border-white/12 sm:grid-cols-2 sm:gap-x-8">
                  {s.scope.map((item, i) => (
                    <li key={item.title} className="flex items-baseline gap-4 border-b border-white/12 py-3">
                      <span className="mono text-muted-dark">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-medium">{item.title}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-10">
                  <QuoteLink service={s.slug} className="btn btn-primary">
                    Plan an installation <ArrowRight />
                  </QuoteLink>
                  <Link href={servicePath(s.slug)} className="link-arrow">
                    {s.name} in detail <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
