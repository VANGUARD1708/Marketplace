const API_BASE = "/api";

export function getToken(): string | null {
  try { return localStorage.getItem("vanguard_token"); } catch { return null; }
}
export function setToken(token: string) {
  try { localStorage.setItem("vanguard_token", token); } catch {}
}
export function clearToken() {
  try { localStorage.removeItem("vanguard_token"); } catch {}
}

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
