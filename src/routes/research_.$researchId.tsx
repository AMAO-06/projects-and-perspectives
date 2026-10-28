import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { entryCode, photosOf, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { PhotoGallery } from "@/components/PhotoGallery";

export const Route = createFileRoute("/research_/$researchId")({
  loader: async ({ context, params }) => {
    const content = await context.queryClient.ensureQueryData(siteContentQueryOptions);
    const index = Number(params.researchId);
    if (!Number.isInteger(index) || index < 0 || index >= content.research.length) {
      throw notFound();
    }
    return content;
  },
  head: ({ loaderData, params }) => {
    const item = loaderData?.research[Number(params.researchId)];
    const title = item ? `${item.title} — ${fallbackProfile.name}` : `Research — ${fallbackProfile.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: item?.abstract ?? "Research details and photos." },
        { property: "og:title", content: title },
        { property: "og:description", content: item?.abstract ?? "Research details and photos." },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ResearchDetailPage,
});

function ResearchDetailPage() {
  const { researchId } = Route.useParams();
  const { research } = useSuspenseQuery(siteContentQueryOptions).data;
  const item = research[Number(researchId)];
  if (!item) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/research" className="font-mono text-xs uppercase tracking-wider text-primary hover:underline">
        ← All research
      </Link>
      <div className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {entryCode("RSH", Number(researchId))} · {item.venue} · <span className="text-primary">{item.year}</span>
      </div>
      <h1 className="mt-1 text-4xl font-bold md:text-5xl">{item.title}</h1>
      <p className="mt-6 max-w-2xl whitespace-pre-line text-lg text-muted-foreground">{item.abstract}</p>
      <PhotoGallery photos={photosOf(item)} title={item.title} />
    </section>
  );
}
