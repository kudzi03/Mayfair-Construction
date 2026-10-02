import Image from "next/image";
import { PinnedProgress } from "@/components/motion/PinnedProgress";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { projectFields, projects, type Project } from "@/content/projects";
import { serviceBySlug } from "@/content/services";

const num = (i: number) => `P-${String(i + 1).padStart(2, "0")}`;

function fieldValues(project: Project): Record<(typeof projectFields)[number], string | null> {
  const service = serviceBySlug(project.service)!;
  return project.status === "published"
    ? {
        Project: project.title,
        Location: project.location,
        "Client type": clientById(project.clientType).name,
        Scope: service.name,
        Completed: project.year,
      }
    : { Project: null, Location: null, "Client type": null, Scope: service.name, Completed: null };
}

/**
 * Project record as a 3D ring. Pinned: scrolling turns the ring one card at a
 * time and the record for the front card shows below it. Static fallback: a
 * plain grid of the same cards.
 */
export function WorkSection() {
  const hasPublished = projects.some((p) => p.status === "published");
  const total = projects.length;

  return (
    <PinnedProgress
      id="work"
      steps={total}
      className="work"
      aria-labelledby="work-title"
      data-sheet="06 — Work"
      data-tone="light"
      style={{ "--n": total } as React.CSSProperties}
    >
      <div className="work-sticky">
        <div className="work-backdrop" aria-hidden="true">
          <Image src={media.buildFinished.src} alt="" fill sizes="100vw" quality={60} className="object-cover" />
        </div>

        <div className="work-head container-x">
          <SheetLabel number="06" name="Selected work" detail="Project record" className="justify-center" />
          <h2 id="work-title" className="display work-title mt-4" data-reveal="blur">
            {hasPublished ? "Selected work." : "The record starts here."}
          </h2>
          {!hasPublished && (
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-snug text-muted md:text-base">
              Mayfair’s finished projects will be shown here — photographed, located and described. These frames show the
              format with representative images. None of them are Mayfair projects.
            </p>
          )}
        </div>

        <div className="work-stage">
          <ul className="work-ring">
            {projects.map((p, i) => {
              const m = media[p.media];
              const service = serviceBySlug(p.service)!;
              return (
                <li key={p.id} className="work-card" style={{ "--i": i } as React.CSSProperties}>
                  <Image src={m.src} alt={m.alt} fill sizes="(min-width: 48rem) 20rem, 50vw" quality={60} loading="eager" className="object-cover" />
                  <span className="work-card-shade" aria-hidden="true" />
                  <span className="mono absolute top-3 left-3 bg-ink px-2 py-1 text-bone">{num(i)}</span>
                  <span className="absolute inset-x-0 bottom-0 p-4 text-bone">
                    <span className="display block text-[1.75rem] leading-none">
                      {p.status === "published" ? p.title : service.name}
                    </span>
                    {p.status === "slot" && <span className="mono mt-2 block text-[0.625rem] text-bone/75">Representative image</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <ol className="work-details container-x" aria-label="Project record">
          {projects.map((p, i) => {
            const values = fieldValues(p);
            return (
              <li key={p.id} data-step-item={i} data-on={i === 0 || undefined}>
                <p className="mono text-center text-muted">
                  {num(i)} <span className="mx-1.5 opacity-40">/</span>{" "}
                  {p.status === "slot" ? "Representative image — not a Mayfair project" : "Mayfair project"}
                </p>
                <dl className="mx-auto mt-3 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-5">
                  {projectFields.map((field) => (
                    <div key={field} className="border-t border-ink/15 pt-2">
                      <dt className="mono text-muted">{field}</dt>
                      <dd className="mt-1 font-semibold">
                        {values[field] ?? (
                          <span className="pending">
                            <span className="sr-only">To be supplied</span>
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ol>
      </div>
    </PinnedProgress>
  );
}
