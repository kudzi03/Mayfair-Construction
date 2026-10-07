import Image from "next/image";
import { AfterLoad } from "@/components/motion/AfterLoad";
import { ScrollVar } from "@/components/motion/ScrollVar";
import { ArrowRight } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";

/** Mayfair's own photos, fanned out behind the type. Later cards sit on top. */
const fan: MediaKey[] = ["roofPrimer", "doorNew", "lockersAfter", "atmBreakthrough", "pavingRelay", "roofCrew"];

/**
 * Where each card starts (x, y, r) and how far it travels across the section
 * (dx, dy, dr) as the page scrolls. Percentages are of the card's own size.
 */
const path = (i: number) => ({
  "--x": `${-95 + i * 16}%`,
  "--y": `${i % 2 ? -5 : 6}%`,
  "--r": `${-12 + i * 4}deg`,
  "--dx": `${60 + i * 12}%`,
  "--dy": `${i % 2 ? 3 : -3}%`,
  "--dr": `${8 - i * 2.5}deg`,
});

/** The three pillars in big type over a sweep of real site photos, with the short who-what-where. */
export function FromSite() {
  return (
    <ScrollVar
      as="section"
      id="intro"
      aria-labelledby="fan-title"
      className="fan-section pt-20 pb-20 md:pt-28 md:pb-28 lg:pt-32 lg:pb-36"
      data-tone="light"
    >
      <div className="container-x relative">
        <p className="mono text-(--accent-text)">From Mayfair’s sites</p>
        <h2 id="fan-title" className="fan-title display mt-5">
          <span className="fan-grad block">Build.</span> <span className="fan-grad block">Install.</span>{" "}
          <span className="fan-solid block">Equip.</span>
        </h2>

        <div className="fan-stack" aria-hidden="true">
          <AfterLoad>
            {fan.map((key, i) => (
              <div key={key} className="fan-card" style={path(i) as React.CSSProperties}>
                <Image
                  src={media[key].src}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 28vw, 70vw"
                  quality={60}
                  className="object-cover"
                  style={{ objectPosition: media[key].focus }}
                />
              </div>
            ))}
          </AfterLoad>
        </div>

        <div className="glass-card relative z-[3] mt-10 max-w-md p-6 sm:p-8 lg:-mt-8">
          <p className="text-lg leading-snug">
            {site.name} is a contractor based in {site.base.city}, working across {site.base.country}. We repair, refit
            and finish buildings, install ATMs, EV chargers and air conditioning, and hire out site equipment — for
            homeowners, property managers, developers, businesses and banks.
          </p>
          <p className="mono mt-4 text-muted">Photos from Mayfair’s own sites</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#services" className="btn btn-dark">
              Our services <ArrowRight />
            </a>
            <a href="#work" className="link-arrow">
              See the work <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </ScrollVar>
  );
}
