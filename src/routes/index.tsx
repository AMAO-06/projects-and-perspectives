import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { mediaUrl, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { ProjectCard, ResearchItem } from "@/components/Cards";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `${fallbackProfile.name} — Mechatronics Engineer` },
      { name: "description", content: fallbackProfile.tagline },
      { property: "og:title", content: `${fallbackProfile.name} — Mechatronics Engineer` },
      { property: "og:description", content: fallbackProfile.tagline },
    ],
  }),
  component: Index,
});

function Index() {
  const { profile, projects, research } = useSuspenseQuery(siteContentQueryOptions).data;
  const heroSrc = profile.heroImage ? mediaUrl(profile.heroImage) : hero;

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={heroSrc} alt="Featured work" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-44">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">{profile.title} · {profile.location}</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{profile.tagline}</p>
          <div className="mt-8 flex gap-4">
            <Link to="/projects" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">View projects</Link>
            <Link to="/contact" className="rounded-lg border px-6 py-3 font-medium transition-colors hover:border-primary hover:text-primary">Get in touch</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold md:text-4xl">Featured projects</h2>
          <Link to="/projects" className="text-sm text-primary hover:underline">All projects →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => <ProjectCard key={`${p.title}-${p.year}`} p={p} />)}
        </div>
      </section>

      <section className="grid-lines border-y">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold md:text-4xl">Latest research</h2>
            <Link to="/research" className="text-sm text-primary hover:underline">All research →</Link>
          </div>
          <div className="space-y-10">
            {research.slice(0, 2).map((r) => <ResearchItem key={`${r.title}-${r.year}`} r={r} />)}
          </div>
        </div>
      </section>
    </>
  );
}
