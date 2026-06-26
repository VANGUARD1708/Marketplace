const PREFIX = "vanguard_";

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* silent */
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

export const TOKEN_KEY = "token";

export function getToken(): string | null {
  return localStorage.getItem("vanguard_token");
}

export function setToken(token: string): void {
  localStorage.setItem("vanguard_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("vanguard_token");
}
