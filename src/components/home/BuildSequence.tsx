import Image from "next/image";
import { ContactLink } from "@/components/contact/ContactLink";
import { PinnedProgress } from "@/components/motion/PinnedProgress";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { buildSequenceAlt, buildStages, buildStaticIndex } from "@/content/build-sequence";
import { formatCoord } from "@/content/coverage";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home hero. The section is tall and its stage pins; scrolling builds the
 * same plot from bare ground to a lit handover. Frame opacity, the camera
 * push and the stage ticks are all CSS driven by `--p`. Reduced motion or no
 * JS: a normal-height hero showing the finished building.
 */
export function BuildSequence() {
  const total = buildStages.length;

  return (
    <PinnedProgress
      steps={total}
      className="seq on-dark"
      data-hero
      aria-labelledby="hero-title"
      data-sheet="00 — Gaborone, Botswana"
      data-tone="dark"
      style={{ "--n": total } as React.CSSProperties}
    >
      <div className="seq-sticky">
        <div className="seq-media">
          {buildStages.map((stage, i) => (
            <Image
              key={stage.id}
              src={stage.src}
              alt={i === buildStaticIndex ? buildSequenceAlt : ""}
              aria-hidden={i === buildStaticIndex ? undefined : true}
              fill
              sizes="100vw"
              quality={75}
              priority={i === 0 || i === buildStaticIndex}
              fetchPriority={i === 0 || i === buildStaticIndex ? "high" : "low"}
              loading="eager"
              className="seq-frame"
              data-static={i === buildStaticIndex || undefined}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="seq-shade" aria-hidden="true" />

        <div className="seq-content container-x">
          <div className="hero-fade flex items-center justify-between gap-4 text-bone/80" style={{ "--delay": "100ms" } as React.CSSProperties}>
            <p className="mono">
              {site.name} <span className="mx-1.5 text-ochre">/</span> {site.base.city}, {site.base.country}
            </p>
            <p className="mono hidden md:block">{formatCoord(site.base.lat, site.base.lon)}</p>
          </div>
          <div className="hero-rule mt-4 h-px bg-white/25" aria-hidden="true" />
          <p className="rep-note hero-fade mt-3 self-end" style={{ "--delay": "1100ms" } as React.CSSProperties}>
            Illustration — not a Mayfair project
          </p>

          <div className="seq-bottom mt-auto grid items-end gap-x-10 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 id="hero-title" className="seq-title display">
                <span className="sr-only">{site.name} — building, installation and equipment hire in Gaborone. </span>
                <span className="line">
                  <span style={{ "--i": 0 } as React.CSSProperties}>From bare ground</span>
                </span>
                <span className="line">
                  <span style={{ "--i": 1 } as React.CSSProperties}>
                    to handover<span className="text-ochre">.</span>
                  </span>
                </span>
              </h1>
              <p className="hero-fade lead mt-5 hidden max-w-lg text-bone/90 sm:block" style={{ "--delay": "650ms" } as React.CSSProperties}>
                Building work, restoration, electrical and office fit-out. ATM and EV charger installation. Equipment
                hire. Based in Gaborone, working anywhere in Botswana.
              </p>
              <div className="hero-fade mt-6 flex flex-wrap gap-3" style={{ "--delay": "800ms" } as React.CSSProperties}>
                <a href="#quote" className="btn btn-primary">
                  Request a quote <ArrowRight />
                </a>
                <ContactLink
                  channel="whatsapp"
                  className="btn btn-light"
                  message="Hello Mayfair, I found you online and I’d like to talk about a job."
                >
                  <WhatsAppIcon /> WhatsApp
                </ContactLink>
              </div>
            </div>

            <div className="seq-panel hero-fade lg:col-span-5 lg:col-start-8" style={{ "--delay": "900ms" } as React.CSSProperties}>
              <div className="seq-ticks" aria-hidden="true">
                {buildStages.map((stage, i) => (
                  <span key={stage.id} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </div>
              <ol className="seq-stages mt-4" aria-label="Construction stages">
                {buildStages.map((stage, i) => (
                  <li key={stage.id} data-step-item={i} data-on={i === 0 || undefined}>
                    <p className="mono text-bone/70">
                      Stage <span className="text-ochre">{pad(i + 1)}</span> / {pad(total)}
                    </p>
                    <h2 className="seq-stage-title display mt-2">{stage.title}</h2>
                    <p className="mt-2 max-w-sm text-[0.9375rem] leading-snug text-bone/85">{stage.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <p className="seq-cue mono" aria-hidden="true">
          Scroll to build
        </p>
      </div>
    </PinnedProgress>
  );
}
