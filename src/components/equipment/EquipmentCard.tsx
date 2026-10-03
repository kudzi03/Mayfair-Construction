import Image from "next/image";
import { RepNote } from "@/components/ui/RepNote";
import { ContactLink } from "@/components/contact/ContactLink";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import Link from "next/link";
import { equipmentHref, hasOwnPage, type Equipment } from "@/content/equipment";
import { media } from "@/content/media";

/**
 * One hire category. Specs render only once real figures are added to
 * `equipment.ts`, so the card never shows filler.
 */
export function EquipmentCard({
  item,
  headingLevel = "h3",
  hireHeading = false,
}: {
  item: Equipment;
  headingLevel?: "h2" | "h3";
  /** On the hire page, name the card by what people search for: "Forklift hire". */
  hireHeading?: boolean;
}) {
  const m = media[item.media];
  const Heading = headingLevel;

  return (
    <article
      id={item.id}
      className="eq-card group flex h-full scroll-mt-28 flex-col bg-paper ring-1 ring-ink/10"
      aria-labelledby={`eq-${item.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#9c9184]">
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 44vw, 80vw"
          quality={60}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: m.focus }}
        />
        <RepNote media={m} className="absolute right-2 bottom-2" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mono text-muted">{item.category}</p>
        <Heading id={`eq-${item.id}`} className="display mt-2 text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]">
          {hasOwnPage(item) ? (
            <Link href={equipmentHref(item)} className="hover:text-(--accent-text)">
              {hireHeading ? `${item.singular} hire` : item.name}
            </Link>
          ) : hireHeading ? (
            `${item.singular} hire`
          ) : (
            item.name
          )}
        </Heading>
        <p className="mt-3 text-[0.9375rem] leading-snug text-muted">{item.use}</p>
        {item.specs.length > 0 && (
          <dl className="mt-5 text-[0.9375rem]">
            {item.specs.map((spec) => (
              <div key={spec.label} className="spec-row">
                <dt className="mono pt-0.5 text-muted">{spec.label}</dt>
                <dd className="font-semibold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 sm:pt-6">
          <QuoteLink service="equipment-hire" equipment={item.singular} className="btn btn-dark btn-sm">
            Check availability <ArrowRight size={16} />
          </QuoteLink>
          <ContactLink
            source="equipment_card"
            channel="whatsapp"
            message={`Hello Mayfair, is a ${item.singular.toLowerCase()} available for hire?`}
            className="btn btn-outline btn-sm btn-square"
            ariaLabel={`Ask about ${item.name.toLowerCase()} on WhatsApp`}
          >
            <WhatsAppIcon size={18} />
          </ContactLink>
        </div>
      </div>
    </article>
  );
}
