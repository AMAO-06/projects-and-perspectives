import { Link } from "@tanstack/react-router";
import { profile } from "@/lib/content";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/research", label: "Research" },
  { to: "/certifications", label: "Certifications" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-bold">
          {profile.name.split(" ")[0]}<span className="text-primary">.</span>
        </Link>
        <div className="flex gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {profile.name} · {profile.title}
    </footer>
  );
}
