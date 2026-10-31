import { Link } from "@tanstack/react-router";
import { useOwnerSession } from "@/lib/owner-session";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/site-content";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/research", label: "Research" },
  { to: "/certifications", label: "Certs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { profile } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold">
          <span className="animate-led h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          {profile.name.split(" ")[0]}
        </Link>
        <div className="flex gap-4 overflow-x-auto font-mono text-xs uppercase tracking-wider sm:gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <OwnerLink />
        </div>
      </nav>
    </header>
  );
}

function OwnerLink() {
  const ownerSignedIn = useOwnerSession();
  return (
    <Link
      to={ownerSignedIn ? "/admin" : "/auth"}
      search={{ redirect: undefined }}
      className="whitespace-nowrap text-primary transition-colors hover:underline"
    >
      {ownerSignedIn ? "Edit portfolio" : "Owner sign in"}
    </Link>
  );
}

export function SiteFooter() {
  const { profile } = useSuspenseQuery(siteContentQueryOptions).data;
  return (
    <footer className="border-t py-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
      <span className="animate-led mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" aria-hidden="true" />
      © {new Date().getFullYear()} {profile.name} · {profile.title}
    </footer>
  );
}
