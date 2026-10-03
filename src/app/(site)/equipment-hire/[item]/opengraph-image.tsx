import { site } from "@/config/site";
import { equipmentBySlug, equipmentWithPages } from "@/content/equipment";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `Equipment hire — ${site.name}, ${site.base.city}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return equipmentWithPages().map((e) => ({ item: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ item: string }> }) {
  const item = equipmentBySlug((await params).item)!;
  return renderOg({
    eyebrow: `${site.name} / Equipment hire`,
    lines: [item.singular, "hire"],
    footer: `${site.base.city} · Check availability online`,
    image: item.media,
  });
}
