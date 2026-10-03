import Image from "next/image";
import { ScrollVar } from "@/components/motion/ScrollVar";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";

/** Layered photo collage; each frame drifts at its own depth as the page scrolls. */
const items: { key: MediaKey; className: string; depth: number; sizes: string }[] = [
  { key: "painting", className: "left-0 top-[8%] w-[38%] aspect-[4/3]", depth: 10, sizes: "(min-width: 64rem) 36vw, 44vw" },
  { key: "officePartitioning", className: "left-[42%] top-0 w-[30%] aspect-[4/5]", depth: 22, sizes: "(min-width: 64rem) 28vw, 34vw" },
  { key: "electrical", className: "right-0 top-[16%] w-[24%] aspect-[3/4]", depth: 14, sizes: "(min-width: 64rem) 22vw, 28vw" },
  { key: "carpeting", className: "left-[8%] bottom-0 w-[26%] aspect-[4/3]", depth: 28, sizes: "(min-width: 64rem) 24vw, 30vw" },
  { key: "evCharging", className: "left-[38%] bottom-[4%] w-[34%] aspect-[16/10]", depth: 6, sizes: "(min-width: 64rem) 32vw, 38vw" },
];

export function Collage() {
  return (
    <ScrollVar className="collage relative mt-16 aspect-[4/3] md:mt-24 md:aspect-[16/8]" aria-hidden="true">
      {items.map((item) => {
        const m = media[item.key];
        return (
          <div
            key={item.key}
            className={`collage-item absolute overflow-hidden bg-concrete ${item.className}`}
            style={{ "--depth": item.depth } as React.CSSProperties}
          >
            <Image src={m.src} alt="" fill sizes={item.sizes} quality={60} className="object-cover" />
          </div>
        );
      })}
      {site.isDemo && <p className="rep-note absolute right-0 bottom-0">Representative images</p>}
    </ScrollVar>
  );
}
