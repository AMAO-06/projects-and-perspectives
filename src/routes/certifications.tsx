import { createFileRoute } from "@tanstack/react-router";
import { profile, certifications } from "@/lib/content";
import { CertItem } from "@/components/Cards";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: `Certifications — ${profile.name}` },
      { name: "description", content: "Certifications, courses and professional credentials." },
      { property: "og:title", content: `Certifications — ${profile.name}` },
      { property: "og:description", content: "Certifications, courses and professional credentials." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold">Certifications</h1>
      <p className="mt-4 text-muted-foreground">Certificates, courses and professional credentials.</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {certifications.map((c) => <CertItem key={c.title} c={c} />)}
      </div>
    </section>
  ),
});
