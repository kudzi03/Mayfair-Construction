import Link from "next/link";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { clientTypes } from "@/content/clients";
import { serviceBySlug, servicePath } from "@/content/services";

export function ClientsSection() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="relative bg-bone py-24 md:py-36"
      data-sheet="04 — Clients"
      data-tone="light"
    >
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel number="04" name="Clients" detail="Who Mayfair works with" className="lg:col-span-3" />
          <div className="lg:col-span-9">
            <h2 id="clients-title" className="display h-section" data-reveal="blur">
              From one room to a bank branch.
            </h2>
            <p className="lead mt-6 max-w-2xl text-muted">
              Mayfair works for individuals and organisations. Find yourself below and see the services that usually
              matter to you.
            </p>
          </div>
        </div>

        <ul className="clients-list mt-16 md:mt-24">
          {clientTypes.map((client, i) => (
            <li
              key={client.id}
              className="client-row grid gap-x-10 gap-y-4 border-t border-ink/15 py-8 md:py-10 lg:grid-cols-12"
              data-reveal="blur"
              style={{ "--d": (i % 2) * 90 } as React.CSSProperties}
            >
              <p className="mono pt-2 text-(--accent-text) lg:col-span-1">04.{i + 1}</p>
              <h3 className="client-name display lg:col-span-6">{client.name}</h3>
              <div className="lg:col-span-5 lg:pt-3">
                <p className="text-lg leading-snug">{client.line}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Services for ${client.name.toLowerCase()}`}>
                  {client.services.map((slug) => (
                    <li key={slug}>
                      <Link href={servicePath(slug)} className="chip">
                        {serviceBySlug(slug)!.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
