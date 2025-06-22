"use server";

import { cookies } from "next/headers";

// Retrieve auth token from cookies (SSR/CSR)
export async function getAuthToken(): Promise<string | null> {
  // Server-side: Access cookies using Next.js cookies()
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    return cookieStore.get("auth-token")?.value || null;
  }

  // Client-side: Parse document.cookie
  const cookieMatch = document.cookie.match(/(^|;) ?auth-token=([^;]+)/);
  return cookieMatch ? cookieMatch[2] : null;
}
