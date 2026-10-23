import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { CertItem } from "@/components/Cards";

export const Route = createFileRoute("/certifications")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `Certifications — ${fallbackProfile.name}` },
      { name: "description", content: "Certifications, courses and professional credentials." },
      { property: "og:title", content: `Certifications — ${fallbackProfile.name}` },
      { property: "og:description", content: "Certifications, courses and professional credentials." },
    ],
  }),
  component: CertificationsPage,
});

function CertificationsPage() {
  const { certifications } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold">Certifications</h1>
      <p className="mt-4 text-muted-foreground">Certificates, courses and professional credentials.</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {certifications.map((c) => <CertItem key={`${c.title}-${c.issuer}`} c={c} />)}
      </div>
    </section>
  );
}
