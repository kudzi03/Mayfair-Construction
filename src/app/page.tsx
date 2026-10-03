import { ContactSection } from "@/components/contact/ContactSection";
import { BuildShowcase } from "@/components/home/BuildShowcase";
import { ClientsSection } from "@/components/home/ClientsSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { EquipSection } from "@/components/home/EquipSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSequence } from "@/components/home/HeroSequence";
import { InstallSection } from "@/components/home/InstallSection";
import { PillarHeader } from "@/components/home/PillarHeader";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { WorkSection } from "@/components/home/WorkSection";
import { pillarById, servicesInPillar } from "@/content/services";

export default function HomePage() {
  const build = servicesInPillar("build");

  return (
    <>
      <HeroSequence />
      <ServiceIndex />

      <section
        id="build"
        aria-labelledby="build-title"
        className="relative bg-paper pt-20 pb-12 md:pt-28 md:pb-20"
        data-sheet="01 — Build"
        data-tone="light"
      >
        <PillarHeader
          pillar={pillarById("build")}
          titleId="build-title"
          count={`${build.length} services`}
          intro="The work that keeps homes, offices and commercial property in use — repaired, repainted, rewired, re-carpeted and re-planned."
        />
        <BuildShowcase services={build} />
      </section>

      <InstallSection />
      <EquipSection />
      <ClientsSection />
      <CoverageSection />
      <WorkSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
