import { site } from "@/config/site";
import { pillarById, serviceBySlug, services } from "@/content/services";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${site.name} — service in ${site.base.city} and across ${site.base.country}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ service: string }> }) {
  const service = serviceBySlug((await params).service)!;
  const words = service.name.split(" ");
  const lines = words.length > 1 ? [words.slice(0, -1).join(" "), words.at(-1)!] : words;

  return renderOg({
    eyebrow: `${site.name} / ${pillarById(service.pillar).title}`,
    lines,
    footer: `${site.base.city} · Working across ${site.base.country}`,
    image: service.media,
  });
}
