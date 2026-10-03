import { SheetLabel } from "@/components/ui/SheetLabel";
import type { ServiceSlug } from "@/content/services";
import { clientNames, credentials, reviews, testimonials } from "@/content/trust";

/**
 * Credentials, client words and public reviews — rendered only from real
 * entries in content/trust.ts. With nothing confirmed yet, it renders nothing.
 * On a service page, quotes about that service come first.
 */
export function TrustSection({ service }: { service?: ServiceSlug }) {
  const first = <T extends { service?: ServiceSlug }>(list: T[]) =>
    service ? [...list.filter((x) => x.service === service), ...list.filter((x) => x.service !== service)] : list;
  const quotes = [
    ...first(testimonials).map((t) => ({ key: t.quote, quote: t.quote, by: t.role ? `${t.name}, ${t.role}` : t.name, url: undefined })),
    ...first(reviews).map((r) => ({ key: r.url, quote: r.quote, by: `${r.author} — ${r.source} review`, url: r.url })),
  ].slice(0, 3);

  if (!quotes.length && !credentials.length && !clientNames.length) return null;

  return (
    <section aria-labelledby="trust-title" className="bg-bone py-20 md:py-28" data-tone="light">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SheetLabel name="Proof" detail="Clients and credentials" />
          <h2 id="trust-title" className="display mt-6 text-[clamp(2.5rem,1.8rem+2.5vw,4rem)]">
            {quotes.length ? "What clients say" : "Credentials"}
          </h2>
        </div>
        <div className="lg:col-span-9">
          {quotes.length > 0 && (
            <ul className="grid gap-8 md:grid-cols-3">
              {quotes.map((q) => (
                <li key={q.key} className="border-t border-ink/15 pt-5">
                  <blockquote>
                    <p className="text-lg leading-snug">“{q.quote}”</p>
                    <footer className="mono mt-4 text-muted">
                      {q.url ? (
                        <a href={q.url} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                          {q.by}
                        </a>
                      ) : (
                        q.by
                      )}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          )}
          {credentials.length > 0 && (
            <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {credentials.map((c) => (
                <div key={c.label} className="spec-row">
                  <dt className="mono pt-0.5 text-muted">{c.label}</dt>
                  <dd className="font-semibold">
                    {c.value}
                    {c.issuer && <span className="font-normal text-muted"> — {c.issuer}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {clientNames.length > 0 && (
            <p className="mt-10 text-muted">
              <span className="mono mr-3">Worked for</span>
              {clientNames.map((c) => c.name).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
