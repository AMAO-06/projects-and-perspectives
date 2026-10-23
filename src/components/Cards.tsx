import type { Project, Research, Certification } from "@/lib/content";
import { mediaUrl } from "@/lib/site-content";

export function CertItem({ c }: { c: Certification }) {
  return (
    <article className="rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{c.title}</h3>
        <div className="text-xs uppercase tracking-wider text-primary">{c.year}</div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{c.issuer}</p>
    </article>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
      {p.image && (
        <img
          src={mediaUrl(p.image)}
          alt={p.title}
          className="mb-4 h-44 w-full rounded-lg border object-cover"
        />
      )}
      <div className="mb-3 text-xs text-muted-foreground">{p.year}</div>
      <h3 className="text-xl font-semibold group-hover:text-primary">{p.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</span>
        ))}
      </div>
    </article>
  );
}

export function ResearchItem({ r }: { r: Research }) {
  return (
    <article className="border-l-2 border-primary pl-6">
      <div className="text-xs uppercase tracking-wider text-primary">{r.venue} · {r.year}</div>
      <h3 className="mt-1 text-xl font-semibold">{r.title}</h3>
      <p className="mt-2 text-muted-foreground">{r.abstract}</p>
    </article>
  );
}
