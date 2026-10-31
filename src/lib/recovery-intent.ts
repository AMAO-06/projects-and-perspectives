// The auth client initializes (and strips the URL hash) before the reset page mounts,
// so an inline script in the page shell records the recovery link first.
export const RECOVERY_KEY = "pw-recovery";
export const RECOVERY_ERROR_KEY = "pw-recovery-error";

export const recoveryCaptureScript = `(function(){try{if(location.pathname!=="/reset-password")return;var h=new URLSearchParams(location.hash.slice(1));if(h.get("error_description")||h.get("error_code")){sessionStorage.setItem("${RECOVERY_ERROR_KEY}","1");sessionStorage.removeItem("${RECOVERY_KEY}");}else if(h.get("type")==="recovery"){sessionStorage.setItem("${RECOVERY_KEY}","1");sessionStorage.removeItem("${RECOVERY_ERROR_KEY}");}}catch(e){}})();`;

function read(key: string) {
  try { return sessionStorage.getItem(key) === "1"; } catch { return false; }
}

export function readRecoveryIntent() {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const hashError = Boolean(hash.get("error_description") || hash.get("error_code"));
  const hashRecovery = hash.get("type") === "recovery";
  return {
    linkError: hashError || (!hashRecovery && read(RECOVERY_ERROR_KEY)),
    recoveryLink: hashRecovery || read(RECOVERY_KEY),
  };
}

export function clearRecoveryIntent() {
  try {
    sessionStorage.removeItem(RECOVERY_KEY);
    sessionStorage.removeItem(RECOVERY_ERROR_KEY);
  } catch { /* storage unavailable */ }
}

/** True when the access token was issued by a password-recovery link. */
export function tokenIsRecovery(accessToken: string | undefined) {
  if (!accessToken) return false;
  try {
    const part = accessToken.split(".")[1] ?? "";
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    return Array.isArray(json.amr) && json.amr.some((m: { method?: string }) => m?.method === "recovery");
  } catch {
    return false;
  }
}
