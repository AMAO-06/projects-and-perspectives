import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile, type Profile } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `Contact — ${fallbackProfile.name}` },
      { name: "description", content: `Get in touch with ${fallbackProfile.name} for collaborations and roles.` },
      { property: "og:title", content: `Contact — ${fallbackProfile.name}` },
      { property: "og:description", content: `Get in touch with ${fallbackProfile.name}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function link(v: string) {
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function contactLinks(p: Profile) {
  const out: { label: string; value: string; href: string }[] = [];
  if (p.phone) out.push({ label: "Phone", value: p.phone, href: `tel:${p.phone.replace(/\s/g, "")}` });
  if (p.whatsapp) out.push({ label: "WhatsApp", value: p.whatsapp, href: `https://wa.me/${p.whatsapp.replace(/\D/g, "")}` });
  const socials: [keyof Profile, string][] = [["linkedin", "LinkedIn"], ["github", "GitHub"], ["twitter", "X / Twitter"], ["instagram", "Instagram"], ["facebook", "Facebook"]];
  for (const [k, label] of socials) {
    const v = p[k];
    if (typeof v === "string" && v.trim()) out.push({ label, value: v.replace(/^https?:\/\/(www\.)?/i, ""), href: link(v.trim()) });
  }
  return out;
}

function ContactPage() {
  const { profile } = useSuspenseQuery(siteContentQueryOptions).data;
  const items = contactLinks(profile);
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold md:text-6xl">Let's build <span className="text-gradient">something</span></h1>
      <p className="mx-auto mt-6 max-w-lg text-muted-foreground">Open to internships, roles, research collaborations and freelance projects.</p>
      <a href={`mailto:${profile.email}`} className="mt-10 inline-block break-all rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">
        {profile.email}
      </a>
      {items.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
          {items.map((i) => (
            <a key={i.label} href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="frame rounded-lg border bg-card px-5 py-4 transition-colors hover:border-primary">
              <span className="block font-mono text-xs uppercase tracking-wider text-primary">{i.label}</span>
              <span className="mt-1 block truncate text-sm">{i.value}</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
