// app/utils/authUtils.ts
// No "use client" here so it can be imported from server files too.
import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'access_token';

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  // Server-side: read from cookies
  try {
    return cookies().get(ACCESS_TOKEN_KEY)?.value ?? null;
  } catch {
    return null; // not in a request context
  }
}

export function getAuthHeader(): string {
  const token = getAccessToken();
  if (!token) throw new Error('Authentication required: No access token found.');
  return `Bearer ${token}`;
}

// Client-only helpers
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    // also mirror into a cookie so server can read it
    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
  }
}

export function removeAccessToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    document.cookie = `${ACCESS_TOKEN_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
  }
}
