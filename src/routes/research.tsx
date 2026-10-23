import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { ResearchItem } from "@/components/Cards";

export const Route = createFileRoute("/research")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `Research — ${fallbackProfile.name}` },
      { name: "description", content: "Papers, thesis and research work in mechatronics and control." },
      { property: "og:title", content: `Research — ${fallbackProfile.name}` },
      { property: "og:description", content: "Papers, thesis and research work in mechatronics and control." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const { research } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold">Research</h1>
      <p className="mt-4 text-muted-foreground">Papers, thesis work and ongoing studies.</p>
      <div className="mt-12 space-y-12">
        {research.map((r) => <ResearchItem key={`${r.title}-${r.year}`} r={r} />)}
      </div>
    </section>
  );
}
