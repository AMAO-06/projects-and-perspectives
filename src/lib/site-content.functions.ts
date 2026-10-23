import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  profile,
  projects,
  research,
  certifications,
  type Profile,
  type Project,
  type Research,
  type Certification,
} from "./content";
import type { SectionName, SiteContent } from "./site-content";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    // Opaque sb_ keys aren't JWTs; send apikey, not the default bearer.
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function fallback(): SiteContent {
  return { profile, projects, research, certifications };
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const client = publicClient();
  if (!client) return fallback();
  try {
    const { data, error } = await client.from("site_content").select("section, data");
    if (error || !data) return fallback();
    const map = new Map(
      (data as { section: string; data: unknown }[]).map((row) => [row.section, row.data]),
    );
    return {
      profile: { ...profile, ...(map.get("profile") as Partial<Profile> | undefined) },
      projects: (map.get("projects") as Project[] | undefined) ?? projects,
      research: (map.get("research") as Research[] | undefined) ?? research,
      certifications: (map.get("certifications") as Certification[] | undefined) ?? certifications,
    };
  } catch {
    return fallback();
  }
});

export const saveSiteSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { section: SectionName; data: unknown }) => {
    if (!["profile", "projects", "research", "certifications"].includes(input?.section)) {
      throw new Error("Invalid section");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Only the site owner can edit content");

    const { error } = await context.supabase
      .from("site_content")
      .upsert({ section: data.section, data: data.data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
