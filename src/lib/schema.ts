import { site } from "@/config/site";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { equipment, equipmentHref, type Equipment } from "@/content/equipment";
import { services, servicePath, type Service } from "@/content/services";

/**
 * Structured data built only from confirmed facts. Optional properties
 * (telephone, email, street address, sameAs) appear automatically once they
 * are set in `src/config/site.ts`. Nothing is inferred or invented.
 */

const businessId = `${site.url}/#business`;

const sameAs = () =>
  [site.business.googleBusinessProfileUrl, ...site.social.map((s) => s.href)].filter((u): u is string => Boolean(u));

export function businessSchema() {
  const { phone, email, streetAddress } = site.contact;
  const links = sameAs();
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": businessId,
    name: site.name,
    ...(site.business.legalName ? { legalName: site.business.legalName } : {}),
    url: site.url,
    description: site.description,
    // One of Mayfair's own site photos (a crew torching down roof membrane), not an illustration.
    image: `${site.url}${media.roofMembrane.src.src}`,
    ...(site.logo ? { logo: `${site.url}${site.logo.src}` } : {}),
    address: {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      addressLocality: site.base.city,
      addressCountry: site.base.countryCode,
    },
    areaServed: { "@type": "Country", name: site.base.country },
    knowsAbout: services.map((s) => s.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${site.url}${servicePath(s.slug)}` },
      })),
    },
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(phone || email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            areaServed: site.base.countryCode,
            ...(phone ? { telephone: phone } : {}),
            ...(email ? { email } : {}),
          },
        }
      : {}),
    ...(links.length ? { sameAs: links } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": businessId },
    inLanguage: "en-BW",
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.meta.description,
    url: `${site.url}${servicePath(service.slug)}`,
    provider: { "@id": businessId },
    areaServed: { "@type": "Country", name: site.base.country },
    audience: service.clients.map((id) => ({ "@type": "Audience", audienceType: clientById(id).name })),
    ...(service.slug === "equipment-hire"
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Equipment for hire",
            itemListElement: equipment.map(hireOffer),
          },
        }
      : {}),
  };
}

/** A machine offered for hire (GoodRelations LeaseOut). No prices until Mayfair publishes them. */
const hireOffer = (e: Equipment) => ({
  "@type": "Offer",
  businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
  url: `${site.url}${equipmentHref(e)}`,
  itemOffered: { "@type": "Product", name: e.singular, category: e.category, description: e.use },
});

export function equipmentHireSchema(e: Equipment) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${e.singular} hire`,
    serviceType: "Equipment hire",
    description: e.use,
    url: `${site.url}${equipmentHref(e)}`,
    provider: { "@id": businessId },
    areaServed: { "@type": "City", name: site.base.city },
    offers: hireOffer(e),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
