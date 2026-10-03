import { site } from "@/config/site";
import { ogAlt, ogSize, renderOg } from "@/lib/og";

export const alt = ogAlt("Construction, installation and equipment hire");
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: site.name,
    lines: ["From bare shell", "to open for business."],
    footer: `Based in ${site.base.city} · Working across ${site.base.country}`,
    image: "sequenceOpen",
  });
}
