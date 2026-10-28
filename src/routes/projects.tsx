import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { ProjectCard } from "@/components/Cards";
import { PageHead } from "@/components/PageHead";

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
  const { projects } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <PageHead eyebrow="01 — Projects" title="Projects" blurb="Things I've designed, built and tested." />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={`${p.title}-${p.year}`} p={p} index={i} />)}
      </div>
    </section>
  );
}
