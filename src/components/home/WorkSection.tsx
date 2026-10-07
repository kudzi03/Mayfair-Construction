import { SheetLabel } from "@/components/ui/SheetLabel";
import { WorkGallery } from "@/components/work/WorkLightbox";
import { galleryItems, PRIVACY_NOTE, WorkCard, WorkFeature } from "@/components/work/WorkParts";
import { WorkRail } from "@/components/work/WorkRail";
import { projects } from "@/content/projects";

/** Mayfair's own photographed work. Renders only when `content/projects.ts` has entries. */
export function WorkSection() {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="fan-section relative py-24 md:py-32" data-sheet="Work" data-tone="light">
      <WorkGallery items={galleryItems(projects)}>
        <div className="container-x">
          <SheetLabel name="Recent work" detail="From Mayfair’s sites" />
          <h2 id="work-title" className="display mt-5 text-[clamp(3.75rem,1.5rem+9vw,11rem)]" data-reveal="mask">
            Straight from site.
          </h2>
          <p className="lead mt-6 max-w-2xl text-muted">
            Photos and video sent in by Mayfair’s own crews — not illustrations, not stock. Quoted captions are Mayfair’s own words.
          </p>

          <div className="mt-14 md:mt-20">
            <WorkFeature p={lead} />
          </div>

          {rest.length > 0 && (
            <div className="mt-16 border-t border-ink/12 pt-10 md:mt-24 md:pt-14">
              <WorkRail label="More recent work">
                {rest.map((p) => (
                  <li key={p.id}>
                    <WorkCard p={p} />
                  </li>
                ))}
              </WorkRail>
            </div>
          )}

          <p className="mono mt-10 text-muted">{PRIVACY_NOTE}</p>
        </div>
      </WorkGallery>
    </section>
  );
}
