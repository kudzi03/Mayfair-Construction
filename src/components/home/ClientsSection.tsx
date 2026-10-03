import { SheetLabel } from "@/components/ui/SheetLabel";
import { ClientPicker } from "./ClientPicker";

export function ClientsSection() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="relative bg-bone py-20 md:py-32"
      data-sheet="04 — Clients"
      data-tone="light"
    >
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel number="04" name="Clients" detail="Who Mayfair works with" className="lg:col-span-3" />
          <div className="lg:col-span-9">
            <h2 id="clients-title" className="display h-section" data-reveal="mask">
              From homeowners to banks.
            </h2>
            <p className="lead mt-6 max-w-2xl text-muted">
              Mayfair works for individuals and organisations. Pick the one that sounds like you.
            </p>
          </div>
        </div>
        <ClientPicker />
      </div>
    </section>
  );
}
