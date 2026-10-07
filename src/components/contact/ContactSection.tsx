import Image from "next/image";
import { ContactLink } from "@/components/contact/ContactLink";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { ArrowUpRight, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { site } from "@/config/site";
import { media } from "@/content/media";
import type { ServiceSlug } from "@/content/services";
import { channels } from "@/lib/contact";

const icons = { call: PhoneIcon, whatsapp: WhatsAppIcon, email: MailIcon };

export function ContactSection({
  defaultService,
  defaultEquipment,
  sheet = "07",
  lines = ["Tell Mayfair", "about the job."],
}: {
  defaultService?: ServiceSlug;
  /** Equipment `singular` name to pre-select (equipment pages). */
  defaultEquipment?: string;
  sheet?: string;
  lines?: [string, string];
}) {
  const c = channels();
  const routes = [
    { ...c.whatsapp, note: "Easiest for photos and quick questions" },
    { ...c.call, note: "Talk it through" },
    { ...c.email, note: "For drawings and documents" },
  ];

  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      className="on-dark relative bg-ink pb-24 text-bone md:pb-32"
      data-tone="dark"
    >
      {/* One of Mayfair's own sites behind the sign-off. */}
      <div className="contact-band">
        <Image
          src={media.houseBlockwork.src}
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover"
          style={{ objectPosition: "60% 40%" }}
        />
        <div className="contact-band-shade" aria-hidden="true" />
        <div className="container-x relative z-10 flex h-full flex-col justify-end pb-2">
          <SheetLabel number={sheet} name="Contact" detail="Quote · Call · WhatsApp" />
          <h2 id="quote-title" className="display mt-6 text-[clamp(3.25rem,1.5rem+8.5vw,11rem)]">
            <span className="block" data-reveal="mask">
              {lines[0]}
            </span>
            <span className="block text-ochre" data-reveal="mask" style={{ "--d": 120 } as React.CSSProperties}>
              {lines[1]}
            </span>
          </h2>
        </div>
      </div>

      <div className="container-x relative">
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="lead max-w-md text-bone/85">
              Tell Mayfair what you need. A few lines and a phone number is enough to start — photos and measurements
              can follow.
            </p>
            <ul className="mt-10 border-b border-white/12">
              {routes.map((r) => {
                const Icon = icons[r.id];
                return (
                  <li key={r.id} className="border-t border-white/12">
                    <ContactLink
                      source="contact_section"
                      channel={r.id}
                      className="group flex min-h-20 w-full items-center gap-4 py-4 text-left"
                    >
                      <span className="flex size-11 flex-none items-center justify-center border border-white/25 transition-colors group-hover:border-ochre group-hover:bg-ochre group-hover:text-ink">
                        <Icon size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-lg font-semibold">{r.label}</span>
                        <span className="block text-sm text-muted-dark">{r.href ? r.display : r.note}</span>
                      </span>
                      <ArrowUpRight className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </ContactLink>
                  </li>
                );
              })}
            </ul>
            <p className="mono mt-8 text-muted-dark">
              {site.base.city} — working across {site.base.country}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-paper text-ink">
              <div className="border-b border-ink/12 px-5 py-3.5 sm:px-6 md:px-10">
                <p className="mono">Request a quote</p>
              </div>
              <EnquiryForm defaultService={defaultService} defaultEquipment={defaultEquipment} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
