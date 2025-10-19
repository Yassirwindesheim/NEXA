"use client";

// app/utils/auth.client.ts
// Client-only helpers used by login/logout UI.
// Mirrors the token into a cookie so the server can read it on SSR.
// (LocalStorage is optional here; keep it if you also do client-side fetches.)

const ACCESS_TOKEN_KEY = "access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  // Optional mirror in localStorage for client-only calls
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Persist for 30 days; SameSite Lax; Path root
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; Max-Age=2592000; Path=/; SameSite=Lax`;
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
}

// Handy for client-only fetches
export function getAuthHeader(): string {
  const t = getAccessToken();
  if (!t) throw new Error("Authentication required: No access token found.");
  return `Bearer ${t}`;
}
