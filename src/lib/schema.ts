import { site } from "@/config/site";
import { clientById } from "@/content/clients";
import { services, servicePath, type Service } from "@/content/services";

/**
 * Structured data built only from confirmed facts. Optional properties
 * (telephone, email, street address, sameAs) appear automatically once they
 * are set in `src/config/site.ts`. Nothing is inferred or invented.
 */

const businessId = `${site.url}/#business`;

export function businessSchema() {
  const { phone, email, streetAddress } = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": businessId,
    name: site.name,
    url: site.url,
    description: site.description,
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
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
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
