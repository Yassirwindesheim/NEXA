// app/utils/auth.server.ts
// Server-only helpers to read auth from cookies for SSR / Server Components / Route Handlers.
import "server-only";
import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "access_token";

export function getAccessToken(): string | null {
  return cookies().get(ACCESS_TOKEN_KEY)?.value ?? null;
}

export function getAuthHeader(): string {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Authentication required: No access token found.");
  }
  return `Bearer ${token}`;
}
