export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nexus_access_token");
}

export function getUser(): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("nexus_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("nexus_access_token");
  localStorage.removeItem("nexus_refresh_token");
  localStorage.removeItem("nexus_user");
}

export function updateUser(userData: Record<string, any>) {
  if (typeof window === "undefined") return;
  const currentUser = getUser() || {};
  localStorage.setItem("nexus_user", JSON.stringify({ ...currentUser, ...userData }));
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

/** Authenticated fetch wrapper that injects Bearer token */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<any> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Session expired. Redirecting to login...");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}
