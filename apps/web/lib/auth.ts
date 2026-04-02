export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vanguard_access_token");
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization_id: string;
  avatar?: string;
  role?: string;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("vanguard_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("vanguard_access_token");
  localStorage.removeItem("vanguard_refresh_token");
  localStorage.removeItem("vanguard_user");
}

export function updateUser(userData: Partial<User>) {
  if (typeof window === "undefined") return;
  const currentUser = getUser() || {} as User;
  localStorage.setItem("vanguard_user", JSON.stringify({ ...currentUser, ...userData }));
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

/** Authenticated fetch wrapper that injects Bearer token */
export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
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
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Redirecting to login...");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}
