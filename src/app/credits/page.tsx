import type { Metadata } from "next";
import Image from "next/image";
import { media } from "@/content/media";

export const metadata: Metadata = {
  title: "Image Credits",
  description: "Sources and licences for the photography, map data and typefaces used on this site.",
  alternates: { canonical: "/credits" },
  openGraph: { title: "Image Credits | Mayfair Construction", url: "/credits" },
};

export default function CreditsPage() {
  // One entry per source photo (crops of the same photo share a credit).
  const items = [...new Map(Object.values(media).map((m) => [m.credit.url ?? m.alt, m])).values()];

  return (
    <section className="bg-paper pt-[calc(var(--header-h)+4rem)] pb-24" aria-labelledby="credits-title" data-sheet="Credits" data-tone="light">
      <div className="container-x">
        <p className="mono text-muted">Credits</p>
        <h1 id="credits-title" className="display h-section mt-4">
          Image credits
        </h1>
        <p className="lead mt-6 max-w-2xl text-muted">
          Photographs on this site are representative stock images used under the Pexels License. The building in the
          opening sequence and the ATM installation scene are AI-generated illustrations made for this demo. None of these images show Mayfair
          Construction’s projects, staff or equipment; they will be replaced with Mayfair’s own photography.
        </p>

        <ul className="mt-14 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.credit.url ?? m.alt}>
              <div className="relative aspect-[4/3] overflow-hidden bg-concrete">
                <Image src={m.src} alt="" fill sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 45vw, 92vw" quality={60} className="object-cover" />
              </div>
              <p className="mt-3 text-[0.9375rem] leading-snug">{m.alt}</p>
              {m.credit.url ? (
                <a href={m.credit.url} className="mono mt-2 inline-block text-(--accent-text) underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                  {m.credit.source}
                </a>
              ) : (
                <p className="mono mt-2 text-muted">{m.credit.source}</p>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-8 border-t border-ink/15 pt-10 md:grid-cols-3">
          <div>
            <h2 className="font-semibold">Map data</h2>
            <p className="mt-2 text-muted">
              Botswana outline from Natural Earth (public domain). Town positions are approximate; distances are
              straight-line.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Typefaces</h2>
            <p className="mt-2 text-muted">Archivo and IBM Plex Mono, both under the SIL Open Font License.</p>
          </div>
          <div>
            <h2 className="font-semibold">Pexels License</h2>
            <p className="mt-2 text-muted">
              Free to use, attribution not required.{" "}
              <a href="https://www.pexels.com/license/" className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                pexels.com/license
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
