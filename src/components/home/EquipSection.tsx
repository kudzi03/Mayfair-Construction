import { QuoteLink } from "@/components/contact/QuoteLink";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { ArrowRight } from "@/components/ui/Icon";
import { equipment } from "@/content/equipment";
import { pillarById } from "@/content/services";
import { PillarHeader } from "./PillarHeader";

export function EquipSection() {
  return (
    <section
      id="equip"
      aria-labelledby="equip-title"
      className="relative bg-concrete pt-20 pb-20 md:pt-28 md:pb-28"
      data-sheet="03 — Equip"
      data-sheet-quiet
      data-tone="light"
    >
      <PillarHeader
        pillar={pillarById("equip")}
        titleId="equip-title"
        count={`${equipment.length} categories`}
        intro="Some jobs need a contractor. Others need a machine for a few days. Hire forklifts, pallet jacks, concrete mixers and plate compactors from Mayfair."
      />
      <div className="container-x mt-12 md:mt-16">
        <ul className="eq-grid" aria-label="Equipment available for hire">
          {equipment.map((item, i) => (
            <li key={item.id} data-reveal="up" style={{ "--d": i * 80 } as React.CSSProperties}>
              <EquipmentCard item={item} index={i} />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-5 bg-ink p-6 text-bone sm:flex-row sm:items-center sm:justify-between md:mt-5 md:px-8">
          <p className="max-w-xl text-lg leading-snug">
            <span className="mono mr-3 text-ochre">Something else?</span>
            These four are what’s listed today. Ask about other site equipment.
          </p>
          <QuoteLink service="equipment-hire" className="btn btn-primary btn-sm self-start sm:self-auto">
            Ask about equipment <ArrowRight size={16} />
          </QuoteLink>
        </div>
      </div>
    </section>
  );
}
