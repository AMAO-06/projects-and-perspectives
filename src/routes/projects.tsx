import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { ProjectCard } from "@/components/Cards";

export const Route = createFileRoute("/projects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `Projects — ${fallbackProfile.name}` },
      { name: "description", content: "Robotics, embedded systems and automation projects." },
      { property: "og:title", content: `Projects — ${fallbackProfile.name}` },
      { property: "og:description", content: "Robotics, embedded systems and automation projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { profile, projects } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-5xl font-bold">Projects</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Things I've designed, built and tested.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => <ProjectCard key={`${p.title}-${p.year}`} p={p} />)}
      </div>
    </section>
  );
}
