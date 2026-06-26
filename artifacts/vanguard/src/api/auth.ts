import { apiFetch, setToken, setRefreshToken, getRefreshToken } from "@/lib/api";

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { email: string; username: string; password: string }

export interface AuthUser { id: number; email: string; username: string; role?: string }

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface MeResult {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  profile: Record<string, unknown> | null;
  trustScore: number;
  verificationStatus: string;
  verificationType: string | null;
}

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResult> => {
    const res = await apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    return res;
  },

  register: async (data: RegisterPayload): Promise<AuthResult> => {
    const res = await apiFetch<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    return res;
  },

  me: () => apiFetch<MeResult>("/auth/me"),

  logout: () =>
    apiFetch<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ success: boolean }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
