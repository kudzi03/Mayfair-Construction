import { getImageProps } from "next/image";
import Image from "next/image";
import { ScrollVar } from "@/components/motion/ScrollVar";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";
import { TALL_QUERY } from "@/content/reel";

/** A wide photo for wide screens and a tall one for phones, each with its own caption. */
const backdrop = {
  wide: { key: "houseRoofed" as MediaKey, caption: "Roofed, plastered and nearly done — a single-storey house on one of Mayfair’s sites." },
  tall: { key: "roofPonding" as MediaKey, caption: "Rainwater ponding on a flat roof, before Mayfair waterproofed it." },
};
const prints: { key: MediaKey; className: string; r: string; py: string }[] = [
  { key: "atmDelivery", className: "left-[6%] top-[12%] hidden md:block", r: "-7deg", py: "-140px" },
  { key: "floorLevelling", className: "right-[7%] bottom-[14%]", r: "6deg", py: "120px" },
];

/**
 * Interlude before Recent work: giant type sliding across one of Mayfair's
 * site photos, which lights up as it reaches the middle of the screen.
 */
export function SiteMarquee() {
  const wide = media[backdrop.wide.key];
  const tall = media[backdrop.tall.key];
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: tallSet },
  } = getImageProps({ ...common, src: tall.src });
  const {
    props: { style, ...img },
  } = getImageProps({ ...common, src: wide.src });

  return (
    <ScrollVar as="figure" className="marquee" data-tone="dark">
      <div className="marquee-bg" aria-hidden="true">
        <picture>
          <source media={TALL_QUERY} srcSet={tallSet} sizes="100vw" />
          <img
            {...img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ ...style, objectPosition: wide.focus }}
          />
        </picture>
      </div>
      <div className="marquee-shade" aria-hidden="true" />

      {prints.map((p) => (
        <div
          key={p.key}
          aria-hidden="true"
          className={`marquee-print ${p.className}`}
          style={{ "--r": p.r, "--py": p.py } as React.CSSProperties}
        >
          <div>
            <Image src={media[p.key].src} alt="" fill sizes="15vw" quality={60} className="object-cover" style={{ objectPosition: media[p.key].focus }} />
          </div>
        </div>
      ))}

      <div aria-hidden="true" className="relative z-[2]">
        <span className="marquee-row display" data-dir="left">
          Straight from site · Straight from site · Straight from site ·
        </span>
        <span className="marquee-row display" data-dir="right">
          {site.base.city} · {site.base.country} · {site.base.city} · {site.base.country} ·
        </span>
      </div>

      <figcaption className="container-x absolute inset-x-0 bottom-0 z-[2] pb-8 md:pb-10">
        <span className="mono block text-ochre">Mayfair site photo</span>
        <span className="only-wide">
          <span className="mt-2 block max-w-sm text-sm text-white/85">{backdrop.wide.caption}</span>
        </span>
        <span className="only-tall">
          <span className="mt-2 block max-w-[16rem] text-sm text-white/85">{backdrop.tall.caption}</span>
        </span>
      </figcaption>
    </ScrollVar>
  );
}
