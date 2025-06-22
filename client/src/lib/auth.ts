export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function isTokenValid(token: string): boolean {
  if (!token) return false;
  // Rely on backend to validate token via API calls
  return true; // Assume valid unless API rejects it
}

export function getTokenFromRequest(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=");
        return [name, decodeURIComponent(value)];
      })
    );
    return cookies["auth-token"] || null;
  }

  return null;
}

// Set auth token in cookies (client-side or server-side response)
export function setAuthToken(token: string) {
  if (typeof window === "undefined") return; // Handled by middleware or server
  document.cookie = `auth-token=${token}; path=/; max-age=${
    60 * 60 * 24 * 7
  }; samesite=strict`;
}

// Remove auth token from cookies
export function removeAuthToken() {
  if (typeof window === "undefined") return; // Handled by middleware or server
  document.cookie = `auth-token=; path=/; max-age=0; samesite=strict`;
}
