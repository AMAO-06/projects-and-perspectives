import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { mediaUrl, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";

export const Route = createFileRoute("/projects/$projectId")({
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
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const photos = [
    ...(project?.image ? [project.image] : []),
    ...(project?.gallery ?? []),
  ];

  const close = useCallback(() => setViewerIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setViewerIndex((i) => (i === null || photos.length === 0 ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, close, step]);

  if (!project) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/projects" className="text-sm text-primary hover:underline">
        ← All projects
      </Link>
      <div className="mt-6 text-xs text-muted-foreground">{project.year}</div>
      <h1 className="mt-1 text-4xl font-bold md:text-5xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
            {t}
          </span>
        ))}
      </div>

      {photos.length > 0 ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((path, i) => (
            <button
              key={path}
              type="button"
              onClick={() => setViewerIndex(i)}
              className="group overflow-hidden rounded-xl border transition-all hover:border-primary hover:shadow-glow"
            >
              <img
                src={mediaUrl(path)}
                alt={`${project.title} photo ${i + 1}`}
                className="h-56 w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-muted-foreground">No photos for this project yet.</p>
      )}

      {viewerIndex !== null && photos[viewerIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} photo viewer`}
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close viewer"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border bg-card p-2 text-foreground transition-colors hover:border-primary"
          >
            <X className="h-5 w-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-4 rounded-full border bg-card p-2 text-foreground transition-colors hover:border-primary"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-4 rounded-full border bg-card p-2 text-foreground transition-colors hover:border-primary"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={mediaUrl(photos[viewerIndex])}
            alt={`${project.title} photo ${viewerIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg border object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-sm text-muted-foreground">
            {viewerIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
