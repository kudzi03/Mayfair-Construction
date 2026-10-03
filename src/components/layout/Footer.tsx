import Link from "next/link";
import { ContactLink } from "@/components/contact/ContactLink";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { primaryNav } from "@/content/navigation";
import { pillars, servicesInPillar, servicePath } from "@/content/services";
import { channels } from "@/lib/contact";

export function Footer() {
  const c = channels();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer on-dark relative overflow-clip bg-ink text-bone">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 pt-20 pb-12 md:grid-cols-12 md:gap-12 md:pt-28">
        <div className="col-span-2 md:col-span-4">
          <p className="display text-[2.5rem]">{site.name}</p>
          <p className="mt-4 max-w-sm text-muted-dark">
            Construction, restoration, specialist installation and equipment hire. Based in {site.base.city}. Working
            across {site.base.country}.
          </p>
          <address className="mt-8 space-y-1 not-italic">
            <p className="mono text-muted-dark">Base</p>
            {site.contact.streetAddress && <p>{site.contact.streetAddress}</p>}
            <p>
              {site.base.city}, {site.base.country}
            </p>
            {site.contact.hours && <p className="text-muted-dark">{site.contact.hours}</p>}
          </address>
        </div>

        {pillars.map((p) => (
          <div key={p.id} className="md:col-span-2">
            <p className="mono mb-4 text-muted-dark">
              {p.number} — {p.name}
            </p>
            <ul className="space-y-0.5">
              {servicesInPillar(p.id).map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s.slug)} className="inline-flex min-h-10 items-center hover:text-ochre">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2">
          <p className="mono mb-4 text-muted-dark">Contact</p>
          <ul className="space-y-0.5">
            <li>
              <ContactLink channel="call" className="inline-flex min-h-10 items-center gap-2 text-left hover:text-ochre">
                <PhoneIcon size={16} /> {c.call.href ? c.call.display : "Call"}
              </ContactLink>
            </li>
            <li>
              <ContactLink channel="whatsapp" className="inline-flex min-h-10 items-center gap-2 text-left hover:text-ochre">
                <WhatsAppIcon size={16} /> WhatsApp
              </ContactLink>
            </li>
            <li>
              <ContactLink channel="email" className="inline-flex min-h-10 items-center gap-2 text-left hover:text-ochre">
                <MailIcon size={16} /> {c.email.href ? c.email.display : "Email"}
              </ContactLink>
            </li>
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="inline-flex min-h-10 items-center hover:text-ochre" rel="me noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav aria-label="Footer" className="container-x">
        <ul className="flex flex-wrap gap-x-6 border-t border-white/10 py-5">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="nav-link">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#quote" className="nav-link">
              Request a quote
            </Link>
          </li>
        </ul>
      </nav>

      {/* Decorative wordmark, drawn as SVG so it scales to the full width. */}
      <svg aria-hidden="true" viewBox="0 0 1000 250" className="pointer-events-none block w-full select-none">
        <text
          x="500"
          y="232"
          textAnchor="middle"
          textLength="980"
          lengthAdjust="spacingAndGlyphs"
          fill="rgb(255 255 255 / 0.06)"
          fontSize="320"
          fontWeight="600"
          letterSpacing="-12"
          style={{ fontStretch: "86%" }}
        >
          Mayfair
        </text>
      </svg>

      <div className="container-x relative flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-muted-dark md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.name}. {site.base.city}, {site.base.country}.
        </p>
        <p>
          {site.isDemo && <>Imagery on this site is representative or illustrated — none of it shows Mayfair projects. </>}
          <Link href="/credits" className="underline underline-offset-4 hover:text-bone">
            Image credits
          </Link>
          {site.isDemo && (
            <>
              <span className="mx-2 opacity-50">·</span>Demo by VelaBuilt
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
