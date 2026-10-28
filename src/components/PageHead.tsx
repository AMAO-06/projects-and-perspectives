import type { ReactNode } from "react";

/** Mono "// 01 — LABEL" eyebrow used above headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{`// ${children}`}</div>;
}

/** Page heading with a faded circuit-board strip behind it. */
export function PageHead({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <div className="relative">
      <div className="bg-circuit mask-fade-b pointer-events-none absolute -inset-x-6 -top-20 bottom-[-1rem] opacity-70" aria-hidden="true" />
      <div className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 text-5xl font-bold">{title}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{blurb}</p>
        <div className="mt-6 flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
        </div>
      </div>
    </div>
  );
}
