import { site } from "@/config/site";
import { clientTypes } from "@/content/clients";
import { equipment } from "@/content/equipment";
import { pillars, servicePath, servicesInPillar } from "@/content/services";

export const dynamic = "force-static";

/**
 * Plain-text summary of who Mayfair is, what it does and where — generated
 * from the same content as the pages, so it never drifts from the site.
 */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `- Base: ${site.base.city}, ${site.base.country}`,
    `- Service area: anywhere in ${site.base.country}`,
    `- Works with: ${clientTypes.map((c) => c.name.toLowerCase()).join(", ")}`,
    "",
    ...pillars.flatMap((p) => [
      `## ${p.name} — ${p.title}`,
      "",
      ...servicesInPillar(p.id).map((s) => `- [${s.name}](${site.url}${servicePath(s.slug)}): ${s.summary}`),
      "",
    ]),
    "## Equipment for hire",
    "",
    ...equipment.map((e) => `- ${e.name}: ${e.use}`),
    "",
    "## Contact",
    "",
    `- Request a quote: ${site.url}/#quote`,
    ...(site.contact.phone ? [`- Phone: ${site.contact.phone}`] : []),
    ...(site.contact.whatsapp ? [`- WhatsApp: ${site.contact.whatsapp}`] : []),
    ...(site.contact.email ? [`- Email: ${site.contact.email}`] : []),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(site.allowIndexing ? {} : { "X-Robots-Tag": "noindex" }),
    },
  });
}
