import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { entryCode, photosOf, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { PhotoGallery } from "@/components/PhotoGallery";

export const Route = createFileRoute("/projects_/$projectId")({
  loader: async ({ context, params }) => {
    const content = await context.queryClient.ensureQueryData(siteContentQueryOptions);
    const index = Number(params.projectId);
    if (!Number.isInteger(index) || index < 0 || index >= content.projects.length) {
      throw notFound();
    }
    return content;
  },
  head: ({ loaderData, params }) => {
    const project = loaderData?.projects[Number(params.projectId)];
    const title = project ? `${project.title} — ${fallbackProfile.name}` : `Project — ${fallbackProfile.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: project?.summary ?? "Project details and photo gallery." },
        { property: "og:title", content: title },
        { property: "og:description", content: project?.summary ?? "Project details and photo gallery." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { projects } = useSuspenseQuery(siteContentQueryOptions).data;
  const project = projects[Number(projectId)];
  if (!project) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-primary hover:underline">
        ← All projects
      </Link>
      <div className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {entryCode("PRJ", Number(projectId))} · <span className="text-primary">{project.year}</span>
      </div>
      <h1 className="mt-1 text-4xl font-bold md:text-5xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded border bg-secondary px-2.5 py-1 font-mono text-[11px] text-secondary-foreground">
            {t}
          </span>
        ))}
      </div>
      <PhotoGallery photos={photosOf(project)} title={project.title} />
    </section>
  );
}
