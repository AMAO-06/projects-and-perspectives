import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${profile.name}` },
      { name: "description", content: `About ${profile.name}, mechatronics engineer in ${profile.location}.` },
      { property: "og:title", content: `About — ${profile.name}` },
      { property: "og:description", content: `About ${profile.name}, mechatronics engineer.` },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold">About me</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        I'm a mechatronics engineer based in {profile.location}. I love building systems where mechanical design,
        electronics and software meet — from robotic arms to smart sensors. I'm driven by solving real problems
        with practical, affordable engineering.
      </p>
      <h2 className="mt-14 text-2xl font-bold">Skills</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {profile.skills.map((s) => (
          <span key={s} className="rounded-lg border bg-card px-4 py-2 text-sm">{s}</span>
        ))}
      </div>
    </section>
  ),
});
