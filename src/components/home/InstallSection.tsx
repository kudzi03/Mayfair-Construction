import Image from "next/image";
import { RepNote } from "@/components/ui/RepNote";
import Link from "next/link";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { pillarById, servicePath, servicesInPillar } from "@/content/services";
import { PillarHeader } from "./PillarHeader";

export function InstallSection() {
  const pillar = pillarById("install");
  const items = servicesInPillar("install");

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="on-dark relative bg-ink pt-20 pb-20 text-bone md:pt-28 md:pb-32"
      data-sheet="02 — Install"
      data-tone="dark"
    >
      <PillarHeader
        pillar={pillar}
        titleId="install-title"
        count="2 services"
        intro="Specialist equipment, fitted on site. ATM installation and EV charging sit alongside Mayfair’s building and electrical services — so the wall, the power and the finish can be one enquiry."
      />

      <div className="container-x mt-14 grid gap-px bg-white/10 md:mt-20 lg:grid-cols-2">
        {items.map((s, idx) => {
          const m = media[s.media];
          return (
            <article key={s.slug} className="install-panel flex flex-col bg-ink lg:p-0" aria-labelledby={`install-${s.slug}`}>
              <div className="install-figure relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/3.4]" data-reveal="fade">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 64rem) 46vw, 100vw"
                  quality={60}
                  className="object-cover"
                  style={{ objectPosition: m.focus }}
                />
                <p className="mono absolute top-5 left-5 z-10 text-bone">
                  02.{idx + 1}
                </p>
                <RepNote media={m} className="absolute right-4 bottom-4 z-10" />
              </div>

              <div className="flex flex-1 flex-col pt-8 pb-12 lg:px-10 lg:pb-14">
                <h3 id={`install-${s.slug}`} className="display text-[clamp(2.75rem,2rem+3.5vw,5rem)]">
                  {s.name}
                </h3>
                <p className="mono mt-4 text-muted-dark">
                  For {s.clients.slice(0, 3).map((c) => clientById(c).name.toLowerCase()).join(" · ")}
                </p>
                <p className="lead mt-5 max-w-xl text-bone/90">{s.summary}</p>
                <ol className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {s.scope.map((item, i) => (
                    <li key={item.title} className="flex gap-4 border-t border-white/12 pt-3">
                      <span className="mono pt-1 text-muted-dark">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-semibold">{item.title}</span>
                        <span className="mt-1 block text-[0.9375rem] leading-snug text-muted-dark">{item.text}</span>
                      </span>
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
