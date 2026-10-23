import { createFileRoute } from "@tanstack/react-router";
import { profile, research } from "@/lib/content";
import { ResearchItem } from "@/components/Cards";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: `Research — ${profile.name}` },
      { name: "description", content: "Papers, thesis and research work in mechatronics and control." },
      { property: "og:title", content: `Research — ${profile.name}` },
      { property: "og:description", content: "Papers, thesis and research work in mechatronics and control." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold">Research</h1>
      <p className="mt-4 text-muted-foreground">Papers, thesis work and ongoing studies.</p>
      <div className="mt-12 space-y-12">
        {research.map((r) => <ResearchItem key={r.title} r={r} />)}
      </div>
    </section>
  ),
});
