import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set a new password — Alaran Mashkur" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isRecoveryLink = () =>
    typeof window !== "undefined" && window.location.hash.includes("type=recovery");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isRecoveryLink()) {
      setError("This link isn't a valid password reset link.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
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
