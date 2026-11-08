export const SESSION_COOKIE = "laundyku_user";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Dipakai di client (LoginForm, AccountMenu)
export function setSessionCookie(name: string, remember: boolean) {
  const maxAge = remember ? `; max-age=${THIRTY_DAYS}` : "";
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(name)}; path=/; SameSite=Lax${maxAge}`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function displayNameFromIdentifier(identifier: string) {
  const base = identifier.includes("@") ? identifier.split("@")[0] : "Pelanggan";
  return base.charAt(0).toUpperCase() + base.slice(1);
}