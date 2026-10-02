import { getImageProps } from "next/image";
import { ContactLink } from "@/components/contact/ContactLink";
import { HeroCrosshair } from "@/components/motion/HeroCrosshair";
import { ScrollVar } from "@/components/motion/ScrollVar";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { formatCoord } from "@/content/coverage";
import { media } from "@/content/media";

const words = ["Build.", "Restore.", "Install.", "Equip."];

const facts = [
  { label: "Base", value: "Gaborone" },
  { label: "Coverage", value: "All of Botswana" },
  { label: "For", value: "Homes · Property · Business · Banks" },
];

export function Hero() {
  const img = media.heroStructure;
  // Art direction: a portrait crop for tall screens, so phones get a sharp image
  // rather than an upscaled slice of the landscape frame.
  const common = { alt: img.alt, quality: 60, loading: "eager" as const, fetchPriority: "high" as const };
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ ...common, src: img.src, sizes: "(max-aspect-ratio: 3/2) 140vw, 100vw" });
  const { props: tall } = getImageProps({ ...common, src: media.heroStructurePortrait.src, sizes: "150vw" });

  return (
    <ScrollVar
      as="section"
      mode="exit"
      className="hero on-dark"
      aria-labelledby="hero-title"
      data-sheet="00 — Gaborone, Botswana"
      data-tone="dark"
    >
      <div className="hero-media">
        <picture>
          <source media="(min-aspect-ratio: 1/1)" srcSet={wideSrcSet} sizes="(max-aspect-ratio: 3/2) 140vw, 100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...tall} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: img.focus }} />
        </picture>
      </div>
      <div className="hero-shade" />
      <div className="blueprint pointer-events-none absolute inset-0 -z-[1] opacity-60" aria-hidden="true" />
      <HeroCrosshair />

      <div className="hero-content container-x relative flex flex-1 flex-col pt-[calc(var(--header-h)+1.5rem)] pb-6 md:pt-[calc(var(--header-h)+2.5rem)]">
        <div className="hero-fade flex items-center justify-between gap-4 text-bone/80" style={{ "--delay": "100ms" } as React.CSSProperties}>
          <p className="mono">
            {site.name} <span className="mx-1.5 text-ochre">/</span> {site.base.city}, {site.base.country}
          </p>
          <p className="mono hidden md:block">{formatCoord(site.base.lat, site.base.lon)}</p>
        </div>
        <div className="hero-rule mt-4 h-px bg-white/25" aria-hidden="true" />
        {site.isDemo && img.representative && (
          <p className="rep-note hero-fade mt-3 self-end" style={{ "--delay": "1100ms" } as React.CSSProperties}>
            Representative image
          </p>
        )}

        <div className="mt-auto grid items-end gap-x-10 gap-y-8 pt-10 lg:grid-cols-12">
          <h1 id="hero-title" className="hero-words display lg:col-span-7 xl:col-span-8">
            <span className="sr-only">{site.name}: </span>
            {words.map((w, i) => (
              <span key={w} className="line">
                <span style={{ "--i": i } as React.CSSProperties}>
                  {w.slice(0, -1)}
                  <span className="text-ochre">.</span>
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-fade lg:col-span-5 lg:pb-3 xl:col-span-4" style={{ "--delay": "650ms" } as React.CSSProperties}>
            <p className="lead max-w-md text-bone">
              Building work, restoration, electrical and office fit-out. ATM and EV charger installation. Equipment
              hire. Based in Gaborone, working anywhere in Botswana.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
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
            <a href="#services" className="link-arrow mt-4 text-bone/90">
              Explore services <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <dl
          className="hero-fade mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/20 pt-4 md:grid-cols-4"
          style={{ "--delay": "900ms" } as React.CSSProperties}
        >
          {facts.map((f) => (
            <div key={f.label} className={f.label === "For" ? "col-span-2" : ""}>
              <dt className="mono text-bone/70">{f.label}</dt>
              <dd className="mt-1 text-[0.9375rem] font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ScrollVar>
  );
}
