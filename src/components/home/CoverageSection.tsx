import Image from "next/image";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { site } from "@/config/site";
import { distanceFromBase, formatCoord, towns } from "@/content/coverage";
import { media } from "@/content/media";
import { CoverageMap } from "./CoverageMap";

export function CoverageSection() {
  const gabs = media.gaborone;
  const sorted = [...towns].sort((a, b) => distanceFromBase(a.lat, a.lon) - distanceFromBase(b.lat, b.lon));

  return (
    <section
      id="coverage"
      aria-labelledby="coverage-title"
      className="on-dark relative overflow-clip bg-ink py-24 text-bone md:py-36"
      data-sheet="05 — Coverage"
      data-tone="dark"
    >
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SheetLabel number="05" name="Coverage" detail="Across Botswana" />
          <h2 id="coverage-title" className="display h-section mt-6" data-reveal="mask">
            Based in Gaborone. Working across Botswana.
          </h2>
          <p className="lead mt-6 max-w-lg text-bone/85">
            Mayfair operates from Gaborone and takes on work anywhere in the country — from a repaint in the capital to an
            installation in Maun or Kasane.
          </p>
        </div>

        <div className="lg:col-span-7 lg:row-span-2 lg:pl-6">
          <div className="lg:sticky lg:top-28">
            <CoverageMap />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="grid grid-cols-[minmax(0,7rem)_1fr] gap-5 sm:grid-cols-[minmax(0,9rem)_1fr]">
            <figure className="relative aspect-[3/4] overflow-hidden bg-graphite">
              <Image
                src={gabs.src}
                alt={gabs.alt}
                fill
                sizes="144px"
                quality={60}
                className="object-cover grayscale"
              />
            </figure>
            <div className="flex flex-col justify-between border-t border-white/15 pt-3">
              <div>
                <p className="mono text-ochre">Base</p>
                <p className="mt-2 text-2xl font-semibold">
                  {site.base.city}, {site.base.country}
                </p>
                <p className="mono mt-2 text-muted-dark">{formatCoord(site.base.lat, site.base.lon)}</p>
              </div>
              <p className="mt-4 text-sm text-muted-dark">Gaborone skyline.</p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mono text-muted-dark">Distance from base — straight line</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-8 text-[0.9375rem]">
              {sorted.map((t) => (
                <div key={t.name} className="flex justify-between gap-3 border-t border-white/10 py-2.5">
                  <dt>{t.name}</dt>
                  <dd className="font-mono text-sky">{distanceFromBase(t.lat, t.lon)} km</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted-dark">
              Reference towns for scale. Mayfair has one base, in Gaborone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
