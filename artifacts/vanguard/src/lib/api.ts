const API_BASE = "/api";

export function getToken(): string | null {
  try { return localStorage.getItem("vanguard_token"); } catch { return null; }
}
export function setToken(token: string) {
  try { localStorage.setItem("vanguard_token", token); } catch {}
}
export function clearToken() {
  try {
    localStorage.removeItem("vanguard_token");
    localStorage.removeItem("vanguard_refresh_token");
  } catch {}
}

export function getRefreshToken(): string | null {
  try { return localStorage.getItem("vanguard_refresh_token"); } catch { return null; }
}
export function setRefreshToken(token: string) {
  try { localStorage.setItem("vanguard_refresh_token", token); } catch {}
}

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && path !== "/auth/refresh" && path !== "/auth/login") {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json() as { accessToken: string; refreshToken: string };
          setToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          const retryHeaders: Record<string, string> = {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${data.accessToken}`,
            ...(options?.headers as Record<string, string>),
          };
          const retry = await fetch(`${API_BASE}${path}`, { ...options, headers: retryHeaders });
          if (retry.ok) return retry.json() as Promise<T>;
        }
      } catch {}
    }
    clearToken();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiUpload<T = unknown>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
