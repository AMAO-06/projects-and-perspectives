import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mediaUrl, siteContentQueryOptions, type SectionName, type SiteContent } from "@/lib/site-content";
import { saveSiteSection } from "@/lib/site-content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQueryOptions),
  head: () => ({
    meta: [{ title: "Admin — Alaran Mashkur" }],
  }),
  component: AdminPage,
});

async function uploadPhoto(file: File): Promise<string | null> {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) {
    toast.error(error.message);
    return null;
  }
  return path;
}

function AdminPage() {
  const { data } = useSuspenseQuery(siteContentQueryOptions);
  const [draft, setDraft] = useState<SiteContent>(() => data);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [saving, setSaving] = useState<SectionName | null>(null);
  const queryClient = useQueryClient();
  const saveFn = useServerFn(saveSiteSection);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setAdmin(false);
        return;
      }
      const { data: role } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      setAdmin(Boolean(role));
    })();
  }, []);

  const setProfile = (patch: Partial<SiteContent["profile"]>) =>
    setDraft((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  const setProjects = (list: SiteContent["projects"]) => setDraft((d) => ({ ...d, projects: list }));
  const setResearch = (list: SiteContent["research"]) => setDraft((d) => ({ ...d, research: list }));
  const setCertifications = (list: SiteContent["certifications"]) =>
    setDraft((d) => ({ ...d, certifications: list }));

  function updateList<K extends "projects" | "research" | "certifications">(
    section: K,
    index: number,
    patch: Partial<SiteContent[K][number]>,
  ) {
    setDraft((d) => ({
      ...d,
      [section]: (d[section] as SiteContent[K]).map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  async function save(section: SectionName) {
    setSaving(section);
    try {
      await saveFn({ data: { section, data: draft[section] } });
      toast.success("Saved — your site is updated.");
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(null);
    }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  }

  if (admin === false) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">No admin access</h1>
        <p className="mt-4 text-muted-foreground">
          This account isn't the site owner, so it can't edit content.
        </p>
        <Button variant="outline" className="mt-8" onClick={signOut}>
          Sign out
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Edit your site</h1>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Changes go live on the public site as soon as you press Save.
      </p>

      <div className="mt-10 space-y-8">
        <SectionCard title="Profile & photos" section="profile" onSave={save} saving={saving}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={draft.profile.name} onChange={(v) => setProfile({ name: v })} />
            <Field label="Title" value={draft.profile.title} onChange={(v) => setProfile({ title: v })} />
            <Field label="Location" value={draft.profile.location} onChange={(v) => setProfile({ location: v })} />
            <Field label="Email" value={draft.profile.email} onChange={(v) => setProfile({ email: v })} />
          </div>
          <AreaField
            label="Tagline (shown on the home page)"
            value={draft.profile.tagline}
            onChange={(v) => setProfile({ tagline: v })}
          />
          <Field
            label="Skills (comma-separated)"
            value={draft.profile.skills.join(", ")}
            onChange={(v) => setProfile({ skills: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoPicker
              label="Your photo (About page)"
              path={draft.profile.photo}
              onPicked={(p) => setProfile({ photo: p })}
            />
            <PhotoPicker
              label="Home page hero image"
              path={draft.profile.heroImage}
              onPicked={(p) => setProfile({ heroImage: p })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Projects" section="projects" onSave={save} saving={saving}>
          {draft.projects.map((p, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={p.title} onChange={(v) => updateList("projects", i, { title: v })} />
                <Field label="Year" value={p.year} onChange={(v) => updateList("projects", i, { year: v })} />
              </div>
              <AreaField label="Summary" value={p.summary} onChange={(v) => updateList("projects", i, { summary: v })} />
              <Field
                label="Tags (comma-separated)"
                value={p.tags.join(", ")}
                onChange={(v) =>
                  updateList("projects", i, { tags: v.split(",").map((s) => s.trim()).filter(Boolean) })
                }
              />
              <PhotoPicker
                 label="Project photo (card cover)"
                path={p.image}
                onPicked={(path) => updateList("projects", i, { image: path })}
              />
              <GalleryPicker
                paths={p.gallery ?? []}
                onChange={(gallery) => updateList("projects", i, { gallery })}
              />
              <Button variant="outline" size="sm" onClick={() => setProjects(draft.projects.filter((_, j) => j !== i))}>
                Remove project
              </Button>
            </div>
          ))}
          <Button size="sm" onClick={() => setProjects([...draft.projects, { title: "", summary: "", tags: [], year: "" }])}>
            + Add project
          </Button>
        </SectionCard>

        <SectionCard title="Research" section="research" onSave={save} saving={saving}>
          {draft.research.map((r, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={r.title} onChange={(v) => updateList("research", i, { title: v })} />
                <Field label="Venue" value={r.venue} onChange={(v) => updateList("research", i, { venue: v })} />
              </div>
              <Field label="Year" value={r.year} onChange={(v) => updateList("research", i, { year: v })} />
              <AreaField label="Abstract" value={r.abstract} onChange={(v) => updateList("research", i, { abstract: v })} />
              <Button variant="outline" size="sm" onClick={() => setResearch(draft.research.filter((_, j) => j !== i))}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            onClick={() => setResearch([...draft.research, { title: "", venue: "", year: "", abstract: "" }])}
          >
            + Add research item
          </Button>
        </SectionCard>

        <SectionCard title="Certifications" section="certifications" onSave={save} saving={saving}>
          {draft.certifications.map((c, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Title" value={c.title} onChange={(v) => updateList("certifications", i, { title: v })} />
                <Field label="Issuer" value={c.issuer} onChange={(v) => updateList("certifications", i, { issuer: v })} />
                <Field label="Year" value={c.year} onChange={(v) => updateList("certifications", i, { year: v })} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCertifications(draft.certifications.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            onClick={() => setCertifications([...draft.certifications, { title: "", issuer: "", year: "" }])}
          >
            + Add certification
          </Button>
        </SectionCard>
      </div>
    </section>
  );
}

function SectionCard({
  title,
  section,
  onSave,
  saving,
  children,
}: {
  title: string;
  section: SectionName;
  onSave: (s: SectionName) => void;
  saving: SectionName | null;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={() => onSave(section)} disabled={saving !== null}>
          {saving === section ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function AreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PhotoPicker({
  label,
  path,
  onPicked,
}: {
  label: string;
  path?: string | undefined;
  onPicked: (path: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {path && <img src={mediaUrl(path)} alt="" className="h-12 w-12 rounded-lg border object-cover" />}
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const newPath = await uploadPhoto(file);
            if (newPath) onPicked(newPath);
            e.target.value = "";
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">Uploading saves it to your media library — press Save to apply.</p>
    </div>
  );
}
