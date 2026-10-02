import Image from "next/image";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { projectFields, projects, type Project } from "@/content/projects";
import { serviceBySlug } from "@/content/services";

function Dossier({ project, index, large }: { project: Project; index: number; large?: boolean }) {
  const m = media[project.media];
  const service = serviceBySlug(project.service)!;
  const num = `P-${String(index + 1).padStart(2, "0")}`;

  const values: Record<(typeof projectFields)[number], string | null> =
    project.status === "published"
      ? {
          Project: project.title,
          Location: project.location,
          "Client type": clientById(project.clientType).name,
          Scope: service.name,
          Completed: project.year,
        }
      : { Project: null, Location: null, "Client type": null, Scope: service.name, Completed: null };

  return (
    <article className="dossier group flex h-full flex-col bg-paper ring-1 ring-ink/10" aria-label={`${num}: ${service.name} project`}>
      <div className={`dossier-img relative overflow-hidden bg-concrete ${large ? "aspect-[4/3] lg:aspect-auto lg:min-h-96 lg:flex-1" : "aspect-[16/9]"}`}>
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes={large ? "(min-width: 64rem) 56vw, 100vw" : "(min-width: 64rem) 38vw, 100vw"}
          quality={60}
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className="mono flex-none bg-ink px-2 py-1 whitespace-nowrap text-bone">{num}</span>
          {project.status === "slot" && <span className="rep-note text-right">Representative image — not a Mayfair project</span>}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 p-5 text-[0.9375rem] md:p-6">
        {projectFields.map((field) => (
          <div key={field} className={`border-t border-ink/12 py-2.5 ${field === "Project" ? "col-span-2" : ""}`}>
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
    </article>
  );
}

export function WorkSection() {
  const [lead, ...rest] = projects;
  const hasPublished = projects.some((p) => p.status === "published");

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="grid-light relative bg-paper py-24 md:py-36"
      data-sheet="06 — Work"
      data-tone="light"
    >
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel number="06" name="Selected work" detail="Project record" className="lg:col-span-3" />
          <div className="lg:col-span-9">
            <h2 id="work-title" className="display h-section" data-reveal="mask">
              {hasPublished ? "Selected work." : "The record starts here."}
            </h2>
            {!hasPublished && (
              <p className="lead mt-6 max-w-2xl text-muted">
                This is where Mayfair’s finished projects will be shown — photographed, located and described. The
                frames below show the format using representative images. None of them are Mayfair projects.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:flex lg:flex-col" data-reveal="up">
            <Dossier project={lead} index={0} large />
          </div>
          <div className="grid gap-5 lg:col-span-5">
            {rest.map((p, i) => (
              <div key={p.id} data-reveal="up" style={{ "--d": (i + 1) * 120 } as React.CSSProperties}>
                <Dossier project={p} index={i + 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
