import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  updateUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));
import { ResetPassword } from "@/routes/reset-password";

describe("Password recovery", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.history.replaceState({}, "", "/reset-password");
    auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    auth.updateUser.mockResolvedValue({ error: null });
  });
  afterEach(cleanup);

  it("updates the password after auth consumes the recovery hash", async () => {
    window.history.replaceState({}, "", "/reset-password#type=recovery");
    auth.getUser.mockImplementation(async () => {
      window.history.replaceState({}, "", "/reset-password");
      return { data: { user: { id: "owner" } }, error: null };
    });
    render(<ResetPassword />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Update password" })).toBeEnabled());
    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "Test-only-password-42" } });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));
    await waitFor(() => expect(auth.updateUser).toHaveBeenCalledWith({ password: "Test-only-password-42" }));
    expect(auth.updateUser.mock.calls[0]?.[0]).not.toHaveProperty("current_password");
  });

  it("accepts a PASSWORD_RECOVERY event when the hash is already removed", async () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
    render(<ResetPassword />);
    auth.onAuthStateChange.mock.calls[0]?.[0]("PASSWORD_RECOVERY");
    await waitFor(() => expect(screen.getByRole("button", { name: "Update password" })).toBeEnabled());
  });

  it("does not allow an ordinary signed-in session without a recovery link", () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
    render(<ResetPassword />);
    expect(screen.getByRole("button", { name: "Update password" })).toBeDisabled();
    expect(auth.updateUser).not.toHaveBeenCalled();
  });

  it("does not allow an expired recovery link with no verified user", async () => {
    window.history.replaceState({}, "", "/reset-password#type=recovery");
    auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error("expired") });
    render(<ResetPassword />);
    await waitFor(() => expect(auth.getUser).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Update password" })).toBeDisabled();
    expect(auth.updateUser).not.toHaveBeenCalled();
  });
});