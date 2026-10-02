import Image from "next/image";
import Link from "next/link";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { pillarById, servicePath, servicesInPillar, type ServiceSlug } from "@/content/services";
import { PillarHeader } from "./PillarHeader";

type Callout = { x: number; y: number; lx: number; ly: number; label: string };

/** Drafting callouts over each install image (percent coordinates, 4:5 frame). */
const callouts: Partial<Record<ServiceSlug, Callout[]>> = {
  "atm-installation": [
    { x: 52, y: 22, lx: 78, ly: 10, label: "A — Placement" },
    { x: 70, y: 52, lx: 88, ly: 40, label: "B — Power" },
    { x: 40, y: 88, lx: 10, ly: 74, label: "C — Make good" },
  ],
  "ev-charging": [
    { x: 46, y: 40, lx: 12, ly: 14, label: "A — Mounting" },
    { x: 48, y: 66, lx: 80, ly: 58, label: "B — Connection" },
    { x: 30, y: 88, lx: 62, ly: 86, label: "C — Handover" },
  ],
};

const steps = [
  { title: "Brief", text: "Send the site, the unit and the deadline." },
  { title: "Site check", text: "Power, position and access looked at before pricing." },
  { title: "Install", text: "Prepared, fitted and connected." },
  { title: "Handover", text: "Tested, cleaned up and handed over." },
];

function Annotation({ items }: { items: Callout[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-sky" aria-hidden="true">
      <svg className="annot absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        <rect className="draw" pathLength={1} x="4" y="4" width="92" height="92" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="1" />
        {items.map((c, i) => (
          <g key={c.label} style={{ "--d": 200 + i * 220 } as React.CSSProperties}>
            <path className="draw" pathLength={1} d={`M${c.x} ${c.y} L${c.lx} ${c.ly}`} stroke="currentColor" strokeWidth="1" />
            <circle cx={c.x} cy={c.y} r="1" fill="currentColor" />
          </g>
        ))}
      </svg>
      {items.map((c) => (
        <span
          key={c.label}
          className="mono absolute bg-ink/80 px-1.5 py-1 text-[0.625rem] text-sky"
          style={{
            left: `${c.lx}%`,
            top: `${c.ly}%`,
            transform: `translate(${c.lx > 50 ? "-100%" : "0"}, -50%)`,
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

export function InstallSection() {
  const pillar = pillarById("install");
  const items = servicesInPillar("install");

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="blueprint on-dark relative bg-ink pt-20 pb-24 text-bone md:pt-28 md:pb-32"
      data-sheet="02 — Install"
      data-tone="dark"
    >
      <PillarHeader
        pillar={pillar}
        titleId="install-title"
        count="2 services"
        intro="Banks and businesses need infrastructure fitted on site and finished clean. ATM installations and EV charging systems sit alongside Mayfair’s building and electrical work — so the wall, the power and the finish are one job."
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
                <Annotation items={callouts[s.slug] ?? []} />
                <p className="mono absolute top-5 left-5 z-10 text-bone">
                  02.{idx + 1}
                </p>
                {site.isDemo && <p className="rep-note absolute right-4 bottom-4 z-10">Representative image</p>}
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
                      <span className="mono pt-1 text-sky">{String.fromCharCode(65 + i)}</span>
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

      <div className="container-x mt-16 md:mt-24">
        <h3 className="mono text-muted-dark">How an installation runs</h3>
        <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative" data-reveal="up" style={{ "--d": i * 120 } as React.CSSProperties}>
              <div className="flex items-center gap-3">
                <span className="flex size-9 flex-none items-center justify-center border border-sky/60 font-mono text-sm text-sky">
                  {i + 1}
                </span>
                <span className="h-px flex-1 bg-sky/30" aria-hidden="true" />
              </div>
              <p className="mt-4 text-xl font-semibold">{step.title}</p>
              <p className="mt-1 text-muted-dark">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
