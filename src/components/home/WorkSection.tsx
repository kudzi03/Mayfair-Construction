import { SheetLabel } from "@/components/ui/SheetLabel";
import { WorkGallery } from "@/components/work/WorkLightbox";
import { galleryItems, PRIVACY_NOTE, WorkCard, WorkFeature } from "@/components/work/WorkParts";
import { projects } from "@/content/projects";

/** Mayfair's own photographed work. Renders only when `content/projects.ts` has entries. */
export function WorkSection() {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-paper py-24 md:py-36" data-sheet="Work" data-tone="light">
      <WorkGallery items={galleryItems(projects)}>
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12">
            <SheetLabel name="Recent work" detail="From Mayfair’s sites" className="lg:col-span-3" />
            <div className="lg:col-span-9">
              <h2 id="work-title" className="display h-section" data-reveal="mask">
                Straight from site.
              </h2>
              <p className="lead mt-6 max-w-2xl text-muted">
                Photos and video sent in by Mayfair’s own crews — not illustrations, not stock. Quoted captions are Mayfair’s own words.
              </p>
            </div>
          </div>

          <div className="mt-14 md:mt-20">
            <WorkFeature p={lead} />
          </div>

          {rest.length > 0 && (
            <ul className="mt-16 grid gap-x-6 gap-y-14 border-t border-ink/12 pt-12 md:mt-24 md:grid-cols-2 md:pt-16 lg:grid-cols-3">
              {rest.map((p, i) => (
                <li key={p.id} data-reveal="up" style={{ "--d": (i % 3) * 120 } as React.CSSProperties}>
                  <WorkCard p={p} />
                </li>
              ))}
            </ul>
          )}

          <p className="mono mt-14 text-muted">{PRIVACY_NOTE}</p>
        </div>
      </WorkGallery>
    </section>
  );
}
