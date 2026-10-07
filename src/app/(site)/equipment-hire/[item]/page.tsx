import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactLink } from "@/components/contact/ContactLink";
import { ContactSection } from "@/components/contact/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import { RepNote } from "@/components/ui/RepNote";
import { site } from "@/config/site";
import { equipment, equipmentBySlug, equipmentHref, equipmentWithPages, hasOwnPage } from "@/content/equipment";
import { media } from "@/content/media";
import { serviceBySlug, servicePath } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, equipmentHireSchema } from "@/lib/schema";

/**
 * One machine's hire page, e.g. /equipment-hire/forklifts. Only machines with
 * real specs and hire notes in equipment.ts are built; every other URL 404s,
 * so no thin placeholder page is ever published.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return equipmentWithPages().map((e) => ({ item: e.slug }));
}

const load = async (params: Promise<{ item: string }>) => {
  const item = equipmentBySlug((await params).item);
  return item && hasOwnPage(item) ? item : null;
};

export async function generateMetadata({ params }: PageProps<"/equipment-hire/[item]">): Promise<Metadata> {
  const item = await load(params);
  if (!item) return {};
  return pageMetadata({
    title: `${item.singular} Hire in ${site.base.city}`,
    description: `${item.singular} hire from ${site.name} in ${site.base.city}. ${item.use} Check availability for your dates and site.`,
    path: equipmentHref(item),
    ownImage: true,
  });
}

export default async function EquipmentPage({ params }: PageProps<"/equipment-hire/[item]">) {
  const item = await load(params);
  if (!item) notFound();

  const hire = serviceBySlug("equipment-hire")!;
  const m = media[item.media];
  const others = equipment.filter((e) => e.id !== item.id);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: hire.name, path: servicePath(hire.slug) },
    { name: `${item.singular} hire`, path: equipmentHref(item) },
  ];

  return (
    <>
      <JsonLd data={[equipmentHireSchema(item), breadcrumbSchema(crumbs)]} />

      <section
        className="on-dark bg-ink pt-[calc(var(--header-h)+1.5rem)] pb-16 text-bone md:pb-24"
        aria-labelledby="eq-title"
        data-tone="dark"
        data-hero
      >
        <div className="container-x">
          <nav aria-label="Breadcrumb">
            <ol className="mono flex flex-wrap items-center gap-2 text-bone/75">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-ochre">
                      /
                    </span>
                  )}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.path} className="hover:text-bone">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-bone">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="mono text-ochre">{item.category}</p>
              <h1 id="eq-title" className="display mt-4 text-[clamp(3rem,1.5rem+6vw,7rem)]">
                {item.singular} hire
                <span className="mt-4 block text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium tracking-normal normal-case">
                  in {site.base.city}
                </span>
              </h1>
              <p className="lead mt-6 max-w-xl text-bone/90">{item.page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#quote" className="btn btn-primary">
                  Check availability <ArrowRight />
                </a>
                <ContactLink
                  channel="whatsapp"
                  source="equipment_hero"
                  message={`Hello Mayfair, is a ${item.singular.toLowerCase()} available for hire?`}
                  className="btn btn-light"
                >
                  <WhatsAppIcon /> WhatsApp
                </ContactLink>
              </div>
            </div>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-[#9c9184] lg:col-span-6">
              <Image src={m.src} alt={m.alt} fill preload quality={75} sizes="(min-width: 64rem) 46vw, 92vw" className="object-cover" />
              <RepNote media={m} className="absolute right-3 bottom-3" />
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="specs-title" className="bg-paper py-20 md:py-28" data-tone="light">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="specs-title" className="display text-[clamp(2.5rem,1.8rem+2.5vw,4rem)]">
              Specifications
            </h2>
            <dl className="mt-8 text-lg">
              {item.specs.map((spec) => (
                <div key={spec.label} className="spec-row">
                  <dt className="mono pt-1 text-muted">{spec.label}</dt>
                  <dd className="font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="display text-[clamp(2.5rem,1.8rem+2.5vw,4rem)]">Hire details</h2>
            <ul className="mt-8">
              {item.page.hireNotes.map((note) => (
                <li key={note} className="border-t border-ink/15 py-4 text-lg">
                  {note}
                </li>
              ))}
            </ul>
            <h3 className="mono mt-12 text-muted">For a quick answer, send</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {hire.quoteChecklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-title" className="bg-concrete py-16 md:py-20" data-tone="light">
        <div className="container-x">
          <h2 id="more-title" className="mono text-muted">
            Also for hire
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {others.map((e) => (
              <li key={e.id}>
                <Link href={equipmentHref(e)} className="link-arrow text-xl font-semibold">
                  {e.singular} hire <ArrowRight size={18} />
                </Link>
              </li>
            ))}
            <li>
              <Link href={servicePath(hire.slug)} className="link-arrow text-xl font-semibold">
                All equipment hire <ArrowRight size={18} />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <ContactSection
        defaultService="equipment-hire"
        defaultEquipment={item.singular}
        sheet="03"
        lines={["Check availability:", `${item.singular.toLowerCase()} hire.`]}
      />
    </>
  );
}
