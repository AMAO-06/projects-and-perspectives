import { Link } from "@tanstack/react-router";
import { Images } from "lucide-react";
import type { Project, Research, Certification } from "@/lib/content";
import { entryCode, mediaUrl, photosOf } from "@/lib/site-content";

function PhotoCount({ count }: { count: number }) {
  if (count < 2) return null;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
      <Images className="h-3 w-3" /> {count}
    </span>
  );
}

export function CertItem({ c, index }: { c: Certification; index: number }) {
  const photos = photosOf(c);
  const cover = photos[0];
  return (
    <Link to="/certifications/$certId" params={{ certId: String(index) }} className="block">
      <article className="frame group h-full rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
          <span className="text-muted-foreground">{entryCode("CRT", index)}</span>
          <span className="text-primary">{c.year}</span>
        </div>
        {cover && (
          <img src={mediaUrl(cover)} alt={c.title} className="mb-4 h-36 w-full rounded-lg border object-cover" loading="lazy" />
        )}
        <h3 className="text-lg font-semibold group-hover:text-primary">{c.title}</h3>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{c.issuer}</p>
          <PhotoCount count={photos.length} />
        </div>
      </article>
    </Link>
  );
}

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  const photos = photosOf(p);
  const cover = photos[0];
  return (
    <Link to="/projects/$projectId" params={{ projectId: String(index) }} className="block">
      <article className="frame group h-full rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
          <span className="text-muted-foreground">{entryCode("PRJ", index)}</span>
          <span className="flex items-center gap-3">
            <PhotoCount count={photos.length} />
            <span className="text-primary">{p.year}</span>
          </span>
        </div>
        {cover && (
          <img src={mediaUrl(cover)} alt={p.title} className="mb-4 h-44 w-full rounded-lg border object-cover" loading="lazy" />
        )}
        <h3 className="text-xl font-semibold group-hover:text-primary">{p.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded border bg-secondary px-2.5 py-1 font-mono text-[11px] text-secondary-foreground">{t}</span>
          ))}
        </div>
      </article>
    </Link>
  );
}

export function ResearchItem({ r, index }: { r: Research; index: number }) {
  const photos = photosOf(r);
  const cover = photos[0];
  return (
    <Link to="/research/$researchId" params={{ researchId: String(index) }} className="block">
      <article className="group flex gap-6 border-l-2 border-primary pl-6 transition-colors hover:border-accent">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11px] uppercase tracking-widest text-primary">
            {entryCode("RSH", index)} · {r.venue} · {r.year}
          </div>
          <h3 className="mt-1 text-xl font-semibold group-hover:text-primary">{r.title}</h3>
          <p className="mt-2 text-muted-foreground">{r.abstract}</p>
          <div className="mt-3 flex items-center gap-3 font-mono text-xs text-primary">
            <span>Read more →</span>
            <PhotoCount count={photos.length} />
          </div>
        </div>
        {cover && (
          <img src={mediaUrl(cover)} alt="" className="hidden h-28 w-40 shrink-0 rounded-lg border object-cover sm:block" loading="lazy" />
        )}
      </article>
    </Link>
  );
}
