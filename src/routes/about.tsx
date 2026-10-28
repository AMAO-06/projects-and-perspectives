import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { mediaUrl, siteContentQueryOptions } from "@/lib/site-content";
import { profile as fallbackProfile } from "@/lib/content";
import { Eyebrow } from "@/components/PageHead";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [
      { title: `About — ${fallbackProfile.name}` },
      { name: "description", content: `About ${fallbackProfile.name}, mechatronics engineer in ${fallbackProfile.location}.` },
      { property: "og:title", content: `About — ${fallbackProfile.name}` },
      { property: "og:description", content: `About ${fallbackProfile.name}, mechatronics engineer.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { profile } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <Eyebrow>04 — Profile</Eyebrow>
      <h1 className="mt-3 text-5xl font-bold">About me</h1>
      {profile.photo && (
        <img
          src={mediaUrl(profile.photo)}
          alt={profile.name}
          className="mt-8 h-44 w-44 rounded-full border object-cover"
        />
      )}
      <p className="mt-8 text-lg text-muted-foreground">
        I'm a {profile.title.toLowerCase()} based in {profile.location}. I love building systems where mechanical design,
        electronics and software meet — from robotic arms to smart sensors. I'm driven by solving real problems
        with practical, affordable engineering.
      </p>
      <h2 className="mt-14 text-2xl font-bold">Skills</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {profile.skills.map((s) => (
          <span key={s} className="frame rounded-lg border bg-card px-4 py-2 font-mono text-sm">{s}</span>
        ))}
      </div>
    </section>
  );
}
