import { JsonLd } from "@/components/seo/JsonLd";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { faqs } from "@/content/faq";
import { faqSchema } from "@/lib/schema";

/** Native <details> accordions: keyboard and screen-reader friendly with no JavaScript. */
export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-paper py-20 md:py-32" data-sheet="06 — FAQ" data-tone="light">
      <JsonLd data={faqSchema(faqs)} />
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SheetLabel number="06" name="FAQ" detail="Before you ask" />
          <h2 id="faq-title" className="display mt-6 text-[clamp(2.75rem,1.8rem+3.5vw,5rem)]" data-reveal="up">
            Questions, answered.
          </h2>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => (
            <details key={f.q} className="faq group" name="faq" open={i === 0}>
              <summary className="faq-q">
                <span>{f.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p className="faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
