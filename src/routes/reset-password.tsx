import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Alaran Mashkur" },
      { name: "description", content: "Reset your portfolio owner password." },
      { property: "og:title", content: "Set a new password — Alaran Mashkur" },
      { property: "og:description", content: "Recover access to Alaran Mashkur's portfolio editor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    // Auth consumes and removes the hash while establishing the recovery session.
    // Remember the link before initialization, rather than rechecking it on submit.
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const recoveryLink = hash.get("type") === "recovery";
    const linkError = hash.get("error_description");
    async function validateRecovery() {
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (!active) return;
        const valid = !authError && Boolean(data.user);
        setRecoveryReady(valid);
        setChecking(false);
        if (!valid) setError("This reset link has expired. Please request a new one.");
      } catch {
        if (!active) return;
        setChecking(false);
        setError("We couldn't verify your reset link. Please request a new one.");
      }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Keep auth requests outside the auth callback to avoid locking the client.
        setTimeout(() => { if (active) void validateRecovery(); }, 0);
      } else if (event === "SIGNED_OUT") {
        setRecoveryReady(false);
      }
    });
    if (linkError) {
      setError("This reset link has expired or has already been used. Please request a new one.");
      setChecking(false);
    } else if (recoveryLink) {
      void validateRecovery();
    } else {
      setChecking(false);
      setError("Open the reset link from your email, or request a new one.");
    }
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recoveryReady) {
      setError("Open a valid reset link from your email before updating your password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setDone(true);
        setRecoveryReady(false);
      }
    } catch {
      setError("Your password couldn't be updated. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-6 py-24">
      <h1 className="text-3xl font-bold">Set a new password</h1>
      {done ? (
        <>
          <p className="mt-4 text-muted-foreground">Your password has been updated.</p>
          <a href="/auth" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">
            Sign in
          </a>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy || checking || !recoveryReady}>
              {checking ? "Checking reset link…" : busy ? "Saving…" : "Update password"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            <a href="/auth" className="hover:text-primary">
              Back to sign in
            </a>
          </p>
        </>
      )}
    </section>
  );
}
