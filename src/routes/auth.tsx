import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign in — Alaran Mashkur" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: AuthPage,
});

function safeRedirect(to: string | undefined): string {
  return to && to.startsWith("/") && !to.startsWith("//") ? to : "/admin";
}

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Reset link sent — check your inbox.");
          setMode("signin");
        }
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
        } else if (!data.session) {
          toast.success("Account created — check your email to confirm, then sign in.");
          setMode("signin");
        } else {
          await navigate({ to: safeRedirect(redirect) });
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        await navigate({ to: safeRedirect(redirect) });
      }
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<typeof mode, string> = {
    signin: "Sign in",
    signup: "Create your admin account",
    forgot: "Reset your password",
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-6 py-24">
      <h1 className="text-3xl font-bold">{titles[mode]}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "forgot"
          ? "Enter your email and we'll send you a reset link."
          : "This area is for the site owner to edit content and upload photos."}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        {mode !== "forgot" && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "forgot" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        {mode === "signin" && (
          <>
            <button type="button" className="block hover:text-primary" onClick={() => setMode("forgot")}>
              Forgot your password?
            </button>
            <button type="button" className="block hover:text-primary" onClick={() => setMode("signup")}>
              Don't have an account? Create one
            </button>
          </>
        )}
        {mode !== "signin" && (
          <button type="button" className="block hover:text-primary" onClick={() => setMode("signin")}>
            ← Back to sign in
          </button>
        )}
      </div>
    </section>
  );
}
