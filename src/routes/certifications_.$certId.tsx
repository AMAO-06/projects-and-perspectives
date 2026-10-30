import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { entryCode, photosOf, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { PhotoGallery } from "@/components/PhotoGallery";

export const Route = createFileRoute("/certifications_/$certId")({
  loader: async ({ context, params }) => {
    const content = await context.queryClient.ensureQueryData(siteContentQueryOptions);
    const index = Number(params.certId);
    if (!Number.isInteger(index) || index < 0 || index >= content.certifications.length) {
      throw notFound();
    }
    return content;
  },
  head: ({ loaderData, params }) => {
    const cert = loaderData?.certifications[Number(params.certId)];
    const title = cert ? `${cert.title} — ${fallbackProfile.name}` : `Certification — ${fallbackProfile.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: cert ? `${cert.title}, issued by ${cert.issuer} (${cert.year}).` : "Certification details." },
        { property: "og:title", content: title },
        { property: "og:description", content: cert ? `${cert.title}, issued by ${cert.issuer} (${cert.year}).` : "Certification details." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CertDetailPage,
});

function CertDetailPage() {
  const { certId } = Route.useParams();
  const { certifications } = useSuspenseQuery(siteContentQueryOptions).data;
  const cert = certifications[Number(certId)];
  if (!cert) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/certifications" className="font-mono text-xs uppercase tracking-wider text-primary hover:underline">
        ← All certifications
      </Link>
      <div className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {entryCode("CRT", Number(certId))} · <span className="text-primary">{cert.year}</span>
      </div>
      <h1 className="mt-1 text-4xl font-bold md:text-5xl">{cert.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">Issued by {cert.issuer}</p>
      <PhotoGallery photos={photosOf(cert)} title={cert.title} />
    </section>
  );
}
