import { getImageProps } from "next/image";
import { ContactLink } from "@/components/contact/ContactLink";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { media } from "@/content/media";
import { reel, TALL_QUERY } from "@/content/reel";
import { servicePath } from "@/content/services";
import { channels } from "@/lib/contact";
import { HeroReel, type ReelFrame } from "./HeroReel";

/** Image props for each reel pair, worked out here so the browser only receives URLs. */
const frames = (): ReelFrame[] =>
  reel.map((slide) => {
    const wide = media[slide.wide.media];
    const tall = media[slide.tall.media];
    const common = { alt: "", sizes: "100vw", quality: 75 };
    const {
      props: { srcSet: tallSrcSet },
    } = getImageProps({ ...common, src: tall.src });
    const {
      props: { src, srcSet, sizes, width, height },
    } = getImageProps({ ...common, src: wide.src });
    return {
      key: slide.wide.media,
      img: { src, srcSet, sizes, width, height },
      tallSrcSet,
      tallQuery: TALL_QUERY,
      focus: wide.focus,
      focusTall: tall.focus,
      wide: { label: slide.wide.label, href: slide.wide.service && servicePath(slide.wide.service) },
      tall: { label: slide.tall.label, href: slide.tall.service && servicePath(slide.tall.service) },
    };
  });

/**
 * Full-screen opener: Mayfair's own site photos in a slow reel behind the
 * name, what Mayfair does and the ways to get in touch.
 */
export function HomeHero() {
  const call = channels().call;
  return (
    <HeroReel frames={frames()}>
      <div className="reel-content container-x">
        <h1 id="hero-title">
          <span className="reel-name display">{site.name}</span>{" "}
          <span className="mono mt-4 block text-bone/85">
            Construction company · {site.base.city}, {site.base.country}
          </span>
        </h1>
        <p className="reel-line mt-4">
          Restoration, waterproofing, fit-out, electrical, air conditioning, ATM and EV charger installation, and equipment
          hire — for homes, businesses and banks across {site.base.country}.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
          <a href="#quote" className="btn btn-primary col-span-2">
            Request a quote <ArrowRight />
          </a>
          <ContactLink
            channel="whatsapp"
            source="home_hero"
            message="Hello Mayfair, I found you online and I’d like to talk about a job."
            className="btn btn-light"
          >
            <WhatsAppIcon /> WhatsApp
          </ContactLink>
          <ContactLink channel="call" source="home_hero" className="btn btn-light">
            <PhoneIcon size={16} /> {call.href ? call.display : "Call"}
          </ContactLink>
          <a href="#work" className="btn btn-light hidden sm:inline-flex">
            See the work
          </a>
        </div>
      </div>
    </HeroReel>
  );
}
