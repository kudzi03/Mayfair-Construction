import Image from "next/image";
import { SheetLabel } from "@/components/ui/SheetLabel";
import { media } from "@/content/media";
import { projects, type Project, type ProjectShot } from "@/content/projects";
import { WorkVideo } from "./WorkVideo";

function Shot({ shot, sizes, tag }: { shot: ProjectShot; sizes: string; tag?: string }) {
  const m = media[shot.media];
  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden bg-concrete">
        <Image src={m.src} alt={m.alt} fill sizes={sizes} quality={75} className="object-cover" style={{ objectPosition: m.focus }} />
        {tag && <span className="mono absolute top-2 left-2 bg-ink px-2 py-1 text-bone">{tag}</span>}
      </div>
      {!tag && <figcaption className="mono mt-2 text-muted">{shot.caption}</figcaption>}
    </figure>
  );
}

/** One landscape photo across both columns, exactly as tall as a 4:5 pair beside it. */
function WideShot({ shot }: { shot: ProjectShot }) {
  const m = media[shot.media];
  return (
    <>
      <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[4/5]" />
      <figure className="relative col-span-2 col-start-1 row-start-1 overflow-hidden bg-concrete">
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 46vw, 92vw" quality={75} className="object-cover" style={{ objectPosition: m.focus }} />
        <span className="mono absolute top-2 left-2 bg-ink px-2 py-1 text-bone">{shot.caption}</span>
      </figure>
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

function Feature({ p }: { p: Project }) {
  const poster = p.video && media[p.video.poster];
  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:gap-10" aria-labelledby={`work-${p.id}`}>
      {p.video && poster && (
        <figure className="lg:col-span-5" data-reveal="up">
          <div className="relative mx-auto aspect-[4/5] overflow-hidden bg-graphite sm:aspect-[9/16] sm:max-h-[42rem] lg:max-h-none">
            <WorkVideo mp4={p.video.mp4} webm={p.video.webm} poster={poster.src.src} label={poster.alt} />
          </div>
          <figcaption className="mono mt-3 text-muted">{p.video.caption}</figcaption>
        </figure>
      )}
      <div className="lg:col-span-7">
        <p className="mono text-(--accent-text)">{p.trade}</p>
        <h3 id={`work-${p.id}`} className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {p.title}
        </h3>
        <p className="lead mt-4 max-w-2xl text-muted">{p.summary}</p>
        {p.ownerCaption && <OwnerCaption text={p.ownerCaption} />}
        <ol className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3" aria-label="From the site">
          {p.shots.map((s, i) => (
            <li key={s.media} data-reveal="up" style={{ "--d": (i % 3) * 90 } as React.CSSProperties}>
              <Shot shot={{ ...s, caption: `${String(i + 1).padStart(2, "0")} ${s.caption}` }} sizes="(min-width: 64rem) 18vw, (min-width: 40rem) 30vw, 46vw" />
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <article aria-labelledby={`work-${p.id}`}>
      <div className="grid grid-cols-2 gap-2">
        {p.shots.length === 1 ? (
          <WideShot shot={p.shots[0]} />
        ) : (
          p.shots.slice(0, 2).map((s) => <Shot key={s.media} shot={s} tag={s.caption} sizes="(min-width: 64rem) 15vw, (min-width: 48rem) 23vw, 46vw" />)
        )}
      </div>
      <p className="mono mt-5 text-(--accent-text)">{p.trade}</p>
      <h3 id={`work-${p.id}`} className="mt-2 text-2xl font-semibold tracking-tight">
        {p.title}
      </h3>
      <p className="mt-2 text-muted">{p.summary}</p>
      {p.ownerCaption && <OwnerCaption text={p.ownerCaption} />}
    </article>
  );
}

/** Mayfair's own photographed work. Renders only when `content/projects.ts` has entries. */
export function WorkSection() {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-paper py-24 md:py-36" data-sheet="Work" data-tone="light">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <SheetLabel name="Recent work" detail="From Mayfair’s sites" className="lg:col-span-3" />
          <div className="lg:col-span-9">
            <h2 id="work-title" className="display h-section" data-reveal="mask">
              Straight from site.
            </h2>
            <p className="lead mt-6 max-w-2xl text-muted">
              Photos and video sent in by Mayfair’s own crews — not illustrations, not stock. Quoted captions are
              Mayfair’s own words.
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <Feature p={lead} />
        </div>

        {rest.length > 0 && (
          <ul className="mt-16 grid gap-x-6 gap-y-14 border-t border-ink/12 pt-12 md:mt-24 md:grid-cols-2 md:pt-16 lg:grid-cols-3">
            {rest.map((p, i) => (
              <li key={p.id} data-reveal="up" style={{ "--d": (i % 3) * 120 } as React.CSSProperties}>
                <Card p={p} />
              </li>
            ))}
          </ul>
        )}

        <p className="mono mt-14 text-muted">Passers-by and number plates are blurred. Clients are not named.</p>
      </div>
    </section>
  );
}
