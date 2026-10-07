import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icon";
import { media } from "@/content/media";
import type { Project, ProjectShot } from "@/content/projects";
import { serviceBySlug, servicePath } from "@/content/services";
import type { GalleryItem } from "./WorkLightbox";
import { GalleryTrigger } from "./WorkLightbox";
import { WorkVideo } from "./WorkVideo";

/** Every photo in these projects, in page order, for the viewer. */
export const galleryItems = (list: Project[]): GalleryItem[] =>
  list.flatMap((p) =>
    p.shots.map((s) => ({ id: s.media, src: media[s.media].src, alt: media[s.media].alt, caption: s.caption, project: p.title })),
  );

function Shot({ shot, sizes, tag, label }: { shot: ProjectShot; sizes: string; tag?: string; label?: string }) {
  const m = media[shot.media];
  return (
    <figure>
      <GalleryTrigger id={shot.media} label={shot.caption} className="relative aspect-[4/5] bg-concrete">
        <Image src={m.src} alt={m.alt} fill sizes={sizes} quality={75} className="object-cover" style={{ objectPosition: m.focus }} />
        {tag && <span className="mono absolute top-2 left-2 bg-ink px-2 py-1 text-bone">{tag}</span>}
      </GalleryTrigger>
      {!tag && <figcaption className="mono mt-2 text-muted">{label ?? shot.caption}</figcaption>}
    </figure>
  );
}

/** One landscape photo across both columns, exactly as tall as a 4:5 pair beside it. */
function WideShot({ shot }: { shot: ProjectShot }) {
  const m = media[shot.media];
  return (
    <>
      <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[4/5]" />
      <GalleryTrigger id={shot.media} label={shot.caption} className="relative col-span-2 col-start-1 row-start-1 bg-concrete">
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 46vw, 92vw"
          quality={75}
          className="object-cover"
          style={{ objectPosition: m.focus }}
        />
        <span className="mono absolute top-2 left-2 bg-ink px-2 py-1 text-bone">{shot.caption}</span>
      </GalleryTrigger>
    </>
  );
}

function OwnerCaption({ text }: { text: string }) {
  return (
    <p className="mt-4 border-l-2 border-ochre pl-3 text-[0.9375rem] text-muted">
      “{text}”<span className="mono mt-1 block">Mayfair’s caption</span>
    </p>
  );
}

/** The service name, or the project's own label when no service page covers the work. */
const categoryOf = (p: Project) => (p.service ? serviceBySlug(p.service)!.name : (p.label ?? "Recent work"));

function ServiceLink({ p }: { p: Project }) {
  if (!p.service) return null;
  const s = serviceBySlug(p.service)!;
  return (
    <Link href={servicePath(s.slug)} className="link-arrow mt-5">
      {s.name} service <ArrowRight size={16} />
    </Link>
  );
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * A project told in full: the site clip (if any) beside the story and every
 * photo. Without a clip, the story sits left and the photos right.
 */
export function WorkFeature({ p, linkService = true }: { p: Project; linkService?: boolean }) {
  const poster = p.video && media[p.video.poster];
  const story = (
    <>
      <p className="mono text-(--accent-text)">{categoryOf(p)}</p>
      <h3 id={`work-${p.id}`} className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {p.title}
      </h3>
      <p className="lead mt-4 max-w-2xl text-muted">{p.summary}</p>
      {p.ownerCaption && <OwnerCaption text={p.ownerCaption} />}
      {linkService && <ServiceLink p={p} />}
    </>
  );
  const shots = (cols: string, sizes: string) => (
    <ol className={`grid grid-cols-2 gap-x-3 gap-y-5 ${cols}`} aria-label="From the site">
      {p.shots.map((s, i) => (
        <li key={s.media} data-reveal="up" style={{ "--d": (i % 3) * 90 } as React.CSSProperties}>
          <Shot shot={s} label={`${pad(i)} ${s.caption}`} sizes={sizes} />
        </li>
      ))}
    </ol>
  );

  if (!p.video || !poster) {
    return (
      <article className="grid gap-10 lg:grid-cols-12" aria-labelledby={`work-${p.id}`}>
        <div className="lg:col-span-5">{story}</div>
        <div className="lg:col-span-7">{shots("", "(min-width: 64rem) 28vw, 46vw")}</div>
      </article>
    );
  }

  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:gap-10" aria-labelledby={`work-${p.id}`}>
      <figure className="lg:col-span-5" data-reveal="up">
        <div className="relative mx-auto aspect-[4/5] overflow-hidden bg-graphite sm:aspect-[9/16] sm:max-h-[42rem] lg:max-h-none">
          <WorkVideo mp4={p.video.mp4} webm={p.video.webm} poster={poster.src.src} label={poster.alt} />
        </div>
        <figcaption className="mono mt-3 text-muted">{p.video.caption}</figcaption>
      </figure>
      <div className="lg:col-span-7">
        {story}
        <div className="mt-8">{shots("sm:grid-cols-3", "(min-width: 64rem) 18vw, (min-width: 40rem) 30vw, 46vw")}</div>
      </div>
    </article>
  );
}

/** A project as a compact card: two photos, the story, a link to the service. */
export function WorkCard({ p }: { p: Project }) {
  return (
    <article aria-labelledby={`work-${p.id}`}>
      <div className="grid grid-cols-2 gap-2">
        {p.shots.length === 1 ? (
          <WideShot shot={p.shots[0]} />
        ) : (
          p.shots
            .slice(0, 2)
            .map((s) => <Shot key={s.media} shot={s} tag={s.caption} sizes="(min-width: 64rem) 15vw, (min-width: 48rem) 23vw, 46vw" />)
        )}
      </div>
      <p className="mono mt-5 text-(--accent-text)">{categoryOf(p)}</p>
      <h3 id={`work-${p.id}`} className="mt-2 text-2xl font-semibold tracking-tight">
        {p.title}
      </h3>
      <p className="mt-2 text-muted">{p.summary}</p>
      {p.ownerCaption && <OwnerCaption text={p.ownerCaption} />}
      <ServiceLink p={p} />
    </article>
  );
}

export const PRIVACY_NOTE = "Clients are not named. Bystanders, number plates and client branding are cropped out or too small to identify.";
