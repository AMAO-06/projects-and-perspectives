import { createFileRoute } from "@tanstack/react-router";

/**
 * Public photo proxy: images uploaded by the admin live in a private storage
 * bucket and are served here so visitors can see them on the public site.
 * Read access to the bucket is enforced by the database's read policy.
 */
export const Route = createFileRoute("/api/public/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const path = new URL(request.url).searchParams.get("path");
        if (!path || path.startsWith("/") || path.includes("..") || path.includes("\\")) {
          return new Response("Invalid path", { status: 400 });
        }
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return new Response("Not configured", { status: 500 });

        const res = await fetch(`${url}/storage/v1/object/media/${path}`, {
          headers: { apikey: key },
        });
        if (!res.ok) return new Response("Not found", { status: 404 });

        const headers = new Headers();
        headers.set("content-type", res.headers.get("content-type") ?? "application/octet-stream");
        headers.set("cache-control", "public, max-age=86400, stale-while-revalidate=604800");
        return new Response(res.body, { status: 200, headers });
      },
    },
  },
});
