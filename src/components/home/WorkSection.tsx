import Image from "next/image";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { clientById } from "@/content/clients";
import { media } from "@/content/media";
import { projects, type Project } from "@/content/projects";
import { serviceBySlug } from "@/content/services";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const m = media[project.media];
  const service = serviceBySlug(project.service)!;
  const facts = [
    ["Location", project.location],
    ["Client", clientById(project.clientType).name],
    ["Scope", service.name],
    ["Completed", project.year],
  ] as const;

  return (
    <article className="flex h-full flex-col bg-paper ring-1 ring-ink/10" aria-labelledby={`project-${project.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-concrete">
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 92vw" quality={60} className="object-cover" />
        <span className="mono absolute top-4 left-4 bg-ink px-2 py-1 text-bone">P-{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 id={`project-${project.id}`} className="text-2xl font-semibold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2 text-muted">{project.summary}</p>
        <dl className="mt-auto grid grid-cols-2 gap-x-6 pt-5 text-[0.9375rem]">
          {facts.map(([label, value]) => (
            <div key={label} className="border-t border-ink/12 py-2.5">
              <dt className="mono text-muted">{label}</dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

/** Renders only when real projects exist in `content/projects.ts`. */
export function WorkSection() {
  if (projects.length === 0) return null;

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-bone py-24 md:py-36" data-sheet="Work" data-tone="light">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel name="Selected work" detail="Project record" className="lg:col-span-3" />
          <h2 id="work-title" className="display h-section lg:col-span-9" data-reveal="mask">
            Selected work.
          </h2>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.id} data-reveal="up" style={{ "--d": (i % 3) * 120 } as React.CSSProperties}>
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
