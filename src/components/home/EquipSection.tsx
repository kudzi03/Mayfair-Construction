import { equipment } from "@/content/equipment";
import { pillarById } from "@/content/services";
import { EquipmentRail } from "./EquipmentRail";
import { PillarHeader } from "./PillarHeader";

export function EquipSection() {
  return (
    <section
      id="equip"
      aria-labelledby="equip-title"
      className="relative bg-concrete pt-20 pb-16 md:pt-28 md:pb-24"
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
      <div className="mt-12 md:mt-16">
        <EquipmentRail items={equipment} />
      </div>
    </section>
  );
}
