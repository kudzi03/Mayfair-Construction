import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { RepNote } from "@/components/ui/RepNote";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactLink } from "@/components/contact/ContactLink";
import { ContactSection } from "@/components/contact/ContactSection";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { ScrollVar } from "@/components/motion/ScrollVar";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import { TrustSection } from "@/components/trust/TrustSection";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { GalleryTrigger, WorkGallery } from "@/components/work/WorkLightbox";
import { galleryItems, PRIVACY_NOTE, WorkFeature } from "@/components/work/WorkParts";
import { site } from "@/config/site";
import { clientById } from "@/content/clients";
import { equipment } from "@/content/equipment";
import { media } from "@/content/media";
import { projectsFor } from "@/content/projects";
import { pillarById, serviceBySlug, servicePath, services, inSentence } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const dynamicParams = false;

/** Hero lines for a framed name: break after "&" ("Doors &" / "Floor Springs"), otherwise one word per line. */
const heroLines = (name: string) => {
  const [left, right] = name.split(" & ");
  return right ? [`${left} &`, right] : name.split(" ");
};

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[service]">): Promise<Metadata> {
  const service = serviceBySlug((await params).service);
  if (!service) return {};
  return pageMetadata({
    title: service.meta.title,
    description: service.meta.description,
    path: servicePath(service.slug),
    ownImage: true,
  });
}

export default async function ServicePage({ params }: PageProps<"/[service]">) {
  const service = serviceBySlug((await params).service);
  if (!service) notFound();

  const pillar = pillarById(service.pillar);
  const hero = media[service.media];
  const isHire = service.slug === "equipment-hire";
  const heroTail = service.heroTail ?? `in ${site.base.city} and across ${site.base.country}`;
  const related = service.related.map((slug) => serviceBySlug(slug)!);
  const clients = service.clients.map(clientById);
  const n = (i: number) => String(i + 1).padStart(2, "0");
  // Mayfair's own photos are phone-sized: show them framed, near their own size, not stretched full-bleed.
  const framed = !hero.representative;
  const work = projectsFor(service.slug);
  const shots = work.flatMap((p) => p.shots);
  const captionOf = (key: string) => shots.find((s) => s.media === key)?.caption ?? "Site photo";

  return (
    <WorkGallery items={galleryItems(work)}>
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: service.name, path: servicePath(service.slug) },
          ]),
        ]}
      />

      {/* Hero */}
      <ScrollVar
        as="section"
        mode="exit"
        className="hero on-dark min-h-[88svh]!"
        aria-labelledby="service-title"
        data-sheet={`${pillar.number} — ${service.name}`}
        data-tone="dark"
        data-hero
      >
        {!framed && (
          <>
            <div className="hero-media">
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                preload
                quality={60}
                sizes="(max-aspect-ratio: 3/4) 160vw, (max-aspect-ratio: 3/2) 140vw, 100vw"
                className="object-cover"
                style={{ objectPosition: hero.focus }}
              />
            </div>
            <div className="hero-shade" />
          </>
        )}

        <div className="hero-content container-x relative flex flex-1 flex-col pt-[calc(var(--header-h)+1.5rem)] pb-10 md:pt-[calc(var(--header-h)+2.5rem)] md:pb-14">
          <nav aria-label="Breadcrumb" className="hero-fade" style={{ "--delay": "100ms" } as React.CSSProperties}>
            <ol className="mono flex flex-wrap items-center gap-2 text-bone/75">
              <li>
                <Link href="/" className="hover:text-bone">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-ochre">
                /
              </li>
              <li>
                <Link href={`/#${pillar.id}`} className="hover:text-bone">
                  {pillar.number} {pillar.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-ochre">
                /
              </li>
              <li aria-current="page" className="text-bone">
                {service.name}
              </li>
            </ol>
          </nav>
          <div className="hero-rule mt-4 h-px bg-white/25" aria-hidden="true" />
          <RepNote media={hero} className="hero-fade mt-3 self-end" />

          {framed ? (
            <div className="mt-auto grid items-end gap-x-12 gap-y-10 pt-12 lg:grid-cols-12">
              <div className={service.heroPair ? "lg:col-span-6" : "lg:col-span-7"}>
                <h1 id="service-title">
                  <span className="hero-words display block text-[clamp(3rem,1rem+6.2vw,7.25rem)]!">
                    {heroLines(service.name).map((line, i) => (
                      <Fragment key={line}>
                        {i > 0 && " "}
                        <span className="line">
                          <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
                        </span>
                      </Fragment>
                    ))}
                  </span>{" "}
                  <span
                    className="hero-fade mt-5 block text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium"
                    style={{ "--delay": "500ms" } as React.CSSProperties}
                  >
                    {heroTail}
                  </span>
                </h1>
                <div className="hero-fade mt-8 max-w-xl" style={{ "--delay": "650ms" } as React.CSSProperties}>
                  <p className="lead text-bone">{service.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#quote" className="btn btn-primary">
                      Request a quote <ArrowRight />
                    </a>
                    <ContactLink
                      source="service_hero"
                      channel="whatsapp"
                      message={`Hello Mayfair, I’d like to ask about ${inSentence(service.name)}.`}
                      className="btn btn-light"
                    >
                      <WhatsAppIcon /> WhatsApp
                    </ContactLink>
                  </div>
                </div>
              </div>
              {service.heroPair ? (
                <div className="hero-fade grid grid-cols-2 gap-3 lg:col-span-6" style={{ "--delay": "300ms" } as React.CSSProperties}>
                  {service.heroPair.map((key, i) => {
                    const m = media[key];
                    return (
                      <figure key={key} className={i === 1 ? "lg:-mb-6" : "lg:mb-6"}>
                        <GalleryTrigger id={key} label={captionOf(key)} className="relative aspect-[4/5] bg-graphite">
                          <Image
                            src={m.src}
                            alt={m.alt}
                            fill
                            preload={i === 0}
                            quality={75}
                            sizes="(min-width: 64rem) 22vw, 46vw"
                            className="object-cover"
                            style={{ objectPosition: m.focus }}
                          />
                          <span className="mono absolute top-2 left-2 bg-ink px-2 py-1 text-bone">{captionOf(key)}</span>
                        </GalleryTrigger>
                      </figure>
                    );
                  })}
                  <p className="mono col-span-2 mt-1 text-bone/70 lg:mt-7 lg:text-right">Mayfair site photos</p>
                </div>
              ) : (
                <figure className="hero-fade lg:col-span-5" style={{ "--delay": "300ms" } as React.CSSProperties}>
                  <div
                    className="hero-photo relative overflow-hidden bg-graphite"
                    style={{ "--w": hero.src.width, "--h": hero.src.height } as React.CSSProperties}
                  >
                    <Image
                      src={hero.src}
                      alt={hero.alt}
                      fill
                      preload
                      quality={75}
                      sizes={`(min-width: 64rem) min(36vw, ${hero.src.width}px), min(92vw, ${hero.src.width}px)`}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mono mt-3 text-bone/70 lg:text-right">Mayfair site photo</figcaption>
                </figure>
              )}
            </div>
          ) : (
            <div className="mt-auto grid items-end gap-x-10 gap-y-8 pt-16 lg:grid-cols-12">
              <h1 id="service-title" className="lg:col-span-8">
                <span className="hero-words display block text-[clamp(3.5rem,1.5rem+9vw,10.5rem)]!">
                  {service.name.split(" ").map((word, i) => (
                    <Fragment key={`${i}-${word}`}>
                      {i > 0 && " "}
                      <span className="line">
                        <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
                      </span>
                    </Fragment>
                  ))}
                </span>{" "}
                <span
                  className="hero-fade mt-5 block text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium"
                  style={{ "--delay": "500ms" } as React.CSSProperties}
                >
                  {heroTail}
                </span>
              </h1>
              <div className="hero-fade lg:col-span-4" style={{ "--delay": "650ms" } as React.CSSProperties}>
                <p className="lead text-bone">{service.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#quote" className="btn btn-primary">
                    {isHire ? "Check availability" : "Request a quote"} <ArrowRight />
                  </a>
                  <ContactLink
                    source="service_hero"
                    channel="whatsapp"
                    message={`Hello Mayfair, I’d like to ask about ${inSentence(service.name)}.`}
                    className="btn btn-light"
                  >
                    <WhatsAppIcon /> WhatsApp
                  </ContactLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollVar>

      {/* Overview + scope */}
      <section
        aria-labelledby="scope-title"
        className="bg-paper py-20 md:py-32"
        data-sheet={`${pillar.number} — ${service.name}: scope`}
        data-tone="light"
      >
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <SheetLabel number={pillar.number} name={pillar.name} detail={pillar.title} className="lg:col-span-3" />
          <p className="statement lg:col-span-9" data-reveal="up">
            {service.intro}
          </p>
        </div>

        <div className="container-x mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="scope-title" className="display text-[clamp(2.5rem,1.8rem+2.5vw,4rem)]">
              {isHire ? "Equipment for hire" : "What the work covers"}
            </h2>
          </div>

          {isHire ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-9 lg:gap-5">
              {equipment.map((eq) => (
                <li key={eq.id} data-reveal="up">
                  <EquipmentCard item={eq} hireHeading />
                </li>
              ))}
            </ul>
          ) : (
            <ol className="lg:col-span-9 lg:grid lg:grid-cols-2 lg:gap-x-10">
              {service.scope.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/15 py-6" data-reveal="up">
                  <span className="mono pt-1.5 text-(--accent-text)">{n(i)}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Mayfair's own photos of this kind of work */}
      {work.length > 0 && (
        <section aria-labelledby="site-title" className="bg-bone py-20 md:py-32" data-sheet={`${pillar.number} — From site`} data-tone="light">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <SheetLabel name="From site" detail="Mayfair’s own photos" className="lg:col-span-3" />
              <h2 id="site-title" className="display text-[clamp(2.5rem,1.8rem+2.5vw,4rem)] lg:col-span-9" data-reveal="up">
                {isHire ? "The machines" : `Recent ${inSentence(service.name)} work`}
              </h2>
            </div>
            {work.map((p) => (
              <div key={p.id} className="mt-12 md:mt-16">
                <WorkFeature p={p} linkService={false} />
              </div>
            ))}
            <p className="mono mt-14 text-muted">{PRIVACY_NOTE}</p>
          </div>
        </section>
      )}

      {/* Who it's for */}
      <section
        aria-labelledby="for-title"
        className={`${work.length > 0 ? "bg-paper" : "bg-bone"} py-20 md:py-28`}
        data-sheet={`${pillar.number} — Who it’s for`}
        data-tone="light"
      >
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="for-title" className="display text-[clamp(2.5rem,1.8rem+2.5vw,4rem)]">
              Who it’s for
            </h2>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
            {clients.map((c) => (
              <li key={c.id} className="border-t border-ink/15 py-6">
                <h3 className="text-xl font-semibold">{c.name}</h3>
                <p className="mt-2 text-muted">{c.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TrustSection service={service.slug} />

      {/* Quote checklist */}
      <section
        aria-labelledby="checklist-title"
        className="bg-concrete py-20 md:py-28"
        data-sheet={`${pillar.number} — Quote checklist`}
        data-tone="light"
      >
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SheetLabel name="Checklist" detail="For an accurate quote" />
            <h2 id="checklist-title" className="display mt-6 text-[clamp(2.75rem,1.8rem+3.5vw,5.5rem)]">
              What to send
            </h2>
            <p className="lead mt-5 max-w-md text-muted">
              The more Mayfair knows up front, the closer the first quote. You don’t need all of it to start.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="btn btn-dark">
                Use the form <ArrowRight />
              </a>
              <ContactLink
                source="quote_checklist"
                channel="whatsapp"
                message={`Hello Mayfair, I’d like a quote for ${inSentence(service.name)}. I’ll send photos and details here.`}
                className="btn btn-outline"
              >
                <WhatsAppIcon /> Send photos on WhatsApp
              </ContactLink>
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {service.quoteChecklist.map((item, i) => (
              <li
                key={item}
                className="flex gap-5 border-t border-ink/20 py-4 text-lg"
                data-reveal="up"
                style={{ "--d": i * 60 } as React.CSSProperties}
              >
                <span className="mono pt-1.5 text-muted">{n(i)}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Coverage + related */}
      <section
        aria-labelledby="related-title"
        className="on-dark bg-ink py-20 text-bone md:py-28"
        data-sheet={`${pillar.number} — Related`}
        data-tone="dark"
      >
        <div className="container-x">
          <div className="grid gap-6 border-b border-white/12 pb-12 md:grid-cols-12">
            <p className="mono text-ochre md:col-span-3">Coverage</p>
            <p className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-tight font-medium md:col-span-9">
              {isHire ? (
                <>Mayfair is based in {site.base.city}. Need equipment further afield? Ask about your site. </>
              ) : (
                <>
                  Based in {site.base.city}, working across {site.base.country}. Tell Mayfair where the site is.{" "}
                </>
              )}
              <Link href="/#coverage" className="text-ochre underline decoration-1 underline-offset-4">
                See the map
              </Link>
            </p>
          </div>

          <h2 id="related-title" className="mono mt-12 text-muted-dark">
            Often needed alongside
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r) => {
              const m = media[r.media];
              return (
                <li key={r.slug}>
                  <Link href={servicePath(r.slug)} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                      <Image
                        src={m.src}
                        alt=""
                        fill
                        sizes="(min-width: 48rem) 30vw, 92vw"
                        quality={60}
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                      <RepNote media={m} className="absolute right-3 bottom-3" />
                    </div>
                    <p className="display mt-4 flex items-center justify-between text-4xl">
                      {r.name}
                      <ArrowRight size={22} className="text-ochre" />
                    </p>
                    <p className="mt-1 text-muted-dark">{r.summary}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactSection defaultService={service.slug} sheet={pillar.number} lines={["Get a quote for", `${service.name}.`]} />
    </WorkGallery>
  );
}
