import { queryOptions } from "@tanstack/react-query";
import { getSiteContent } from "./site-content.functions";
import type { Profile, Project, Research, Certification } from "./content";

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  research: Research[];
  certifications: Certification[];
};

export const SECTIONS = ["profile", "projects", "research", "certifications"] as const;
export type SectionName = (typeof SECTIONS)[number];

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
});

/** Photos live in private cloud storage and are served through /api/public/media. */
export function mediaUrl(path: string): string {
  return `/api/public/media?path=${encodeURIComponent(path)}`;
}

/** Cover photo first, then the gallery, without duplicates. */
export function photosOf(entry: { image?: string | undefined; gallery?: string[] | undefined } | undefined): string[] {
  if (!entry) return [];
  return Array.from(new Set([...(entry.image ? [entry.image] : []), ...(entry.gallery ?? [])]));
}

/** Zero-padded catalogue number, e.g. PRJ-01. */
export function entryCode(prefix: string, index: number): string {
  return `${prefix}-${String(index + 1).padStart(2, "0")}`;
}
