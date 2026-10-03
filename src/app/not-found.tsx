import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArrowRight } from "@/components/ui/Icon";
import { pillars, servicesInPillar, servicePath } from "@/content/services";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <section
          className="on-dark blueprint bg-ink pt-[calc(var(--header-h)+5rem)] pb-24 text-bone"
          aria-labelledby="nf-title"
        >
          <div className="container-x">
            <p className="mono text-ochre">404 — Not on the drawings</p>
            <h1 id="nf-title" className="display mt-4 text-[clamp(4rem,2rem+10vw,12rem)]">
              Page not found.
            </h1>
            <p className="lead mt-6 max-w-xl text-bone/85">That page doesn’t exist. These do:</p>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.id}>
                  <p className="mono text-muted-dark">
                    {p.number} — {p.name}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {servicesInPillar(p.id).map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={servicePath(s.slug)}
                          className="inline-flex min-h-11 items-center text-lg hover:text-ochre"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/" className="btn btn-primary mt-14">
              Back to the home page <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
