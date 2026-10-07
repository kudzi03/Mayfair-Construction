import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { BuildShowcase } from "@/components/home/BuildShowcase";
import { ClientsSection } from "@/components/home/ClientsSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { EquipSection } from "@/components/home/EquipSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FromSite } from "@/components/home/FromSite";
import { HomeHero } from "@/components/home/HomeHero";
import { InstallSection } from "@/components/home/InstallSection";
import { PillarHeader } from "@/components/home/PillarHeader";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { SiteMarquee } from "@/components/home/SiteMarquee";
import { TrustSection } from "@/components/trust/TrustSection";
import { WorkSection } from "@/components/home/WorkSection";
import { media } from "@/content/media";
import { pillarById, servicesInPillar } from "@/content/services";
import { homeDescription, homeTitle, pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({ absoluteTitle: homeTitle, description: homeDescription, path: "/" });

export default function HomePage() {
  const build = servicesInPillar("build");

  return (
    <>
      <HomeHero />
      <FromSite />
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
          intro="The work that keeps homes, offices and commercial property in use — repaired, waterproofed, repainted, rewired, re-carpeted, re-planned and re-paved."
        />
        <BuildShowcase services={build} images={Object.fromEntries(build.map((s) => [s.media, media[s.media]]))} />
      </section>

      <InstallSection />
      <EquipSection />
      <SiteMarquee />
      <WorkSection />
      <TrustSection />
      <ClientsSection />
      <CoverageSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
