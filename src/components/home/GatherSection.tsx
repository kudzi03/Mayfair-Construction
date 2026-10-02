import Image from "next/image";
import { CountUp } from "@/components/motion/CountUp";
import { PinnedProgress } from "@/components/motion/PinnedProgress";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";
import { pillars, services } from "@/content/services";

/** Scattered tiles: offset from centre (x in vw, y in svh), width in vw, tilt in degrees. */
const tiles: { key: MediaKey; x: number; y: number; w: number; r: number }[] = [
  { key: "restoration", x: -35, y: -22, w: 15, r: -3 },
  { key: "painting", x: -13, y: -31, w: 12, r: 2 },
  { key: "electricalPanel", x: 14, y: -29, w: 13, r: -2 },
  { key: "forklift", x: 36, y: -19, w: 16, r: 3 },
  { key: "carpeting", x: -38, y: 17, w: 14, r: 2 },
  { key: "officePartitioning", x: -15, y: 29, w: 15, r: -2 },
  { key: "evCharging", x: 15, y: 30, w: 12, r: 2 },
  { key: "atmInstallation", x: 36, y: 21, w: 14, r: -3 },
];

/** Botswana's land area (km²) — the whole country is in Mayfair's working area. */
const BOTSWANA_KM2 = 581730;

const stats = [
  { value: services.length, label: "Services", detail: "From a repaint to an ATM install" },
  { value: pillars.length, label: "Lines of work", detail: "Build, install, equip" },
  { value: BOTSWANA_KM2, label: "km² of Botswana", detail: "Based in Gaborone, working anywhere" },
  { value: 1, label: "Number to call", detail: "One contractor across the trades" },
];

/**
 * The trades gather into one picture. Pinned: eight service photographs
 * collapse into the centre, the centre frame opens to full screen, and the
 * figures count up over it. Static fallback: the full image with the figures.
 */
export function GatherSection() {
  const hero = media.gaborone;

  return (
    <PinnedProgress
      className="gather"
      aria-labelledby="gather-title"
      data-sheet="Gaborone — Botswana"
      data-tone="light"
      data-sheet-quiet
    >
      <div className="gather-sticky">
        <div className="gather-intro container-x">
          <p className="mono text-muted">
            {services.length} services <span className="mx-1.5 text-ochre">/</span> one contractor
          </p>
          <h2 id="gather-title" className="display gather-title mt-4">
            Every trade the job needs<span className="text-ochre">.</span>
          </h2>
        </div>

        <div className="gather-tiles" aria-hidden="true">
          {tiles.map((t) => (
            <div
              key={t.key}
              className="gather-tile"
              style={{ "--x": t.x, "--y": t.y, "--w": t.w, "--r": t.r } as React.CSSProperties}
            >
              <Image src={media[t.key].src} alt="" fill sizes="(min-width: 48rem) 16vw, 30vw" quality={60} className="object-cover" />
            </div>
          ))}
        </div>

        <div className="gather-hero on-dark">
          <Image src={hero.src} alt={hero.alt} fill sizes="100vw" quality={75} loading="eager" className="gather-hero-img object-cover" />
          <div className="gather-hero-shade" aria-hidden="true" />
          {site.isDemo && hero.representative && <p className="rep-note gather-rep">Representative image</p>}

          <div className="gather-stats container-x">
            <p className="mono text-bone/75">
              Based in {site.base.city} <span className="mx-1.5 text-ochre">/</span> working across {site.base.country}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/20 pt-6 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.label} className="gather-stat" style={{ "--i": i } as React.CSSProperties}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="gather-num display block">
                      <CountUp value={s.value} at={0.74} duration={s.value > 1000 ? 2200 : 1200} />
                    </span>
                    <span className="mt-2 block font-semibold text-bone" aria-hidden="true">
                      {s.label}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] leading-snug text-bone/70">{s.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </PinnedProgress>
  );
}
