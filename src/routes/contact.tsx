import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${profile.name}` },
      { name: "description", content: `Get in touch with ${profile.name} for collaborations and roles.` },
      { property: "og:title", content: `Contact — ${profile.name}` },
      { property: "og:description", content: `Get in touch with ${profile.name}.` },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold md:text-6xl">Let's build <span className="text-gradient">something</span></h1>
      <p className="mx-auto mt-6 max-w-lg text-muted-foreground">Open to internships, roles, research collaborations and freelance projects.</p>
      <a href={`mailto:${profile.email}`} className="mt-10 inline-block rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">
        {profile.email}
      </a>
    </section>
  ),
});
