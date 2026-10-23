import { createFileRoute } from "@tanstack/react-router";
import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/Cards";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Projects — ${profile.name}` },
      { name: "description", content: "Robotics, embedded systems and automation projects." },
      { property: "og:title", content: `Projects — ${profile.name}` },
      { property: "og:description", content: "Robotics, embedded systems and automation projects." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-5xl font-bold">Projects</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Things I've designed, built and tested.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.title} p={p} />)}
      </div>
    </section>
  ),
});
