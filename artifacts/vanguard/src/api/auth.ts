import { apiFetch } from "@/lib/api";

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { email: string; username: string; password: string }
export interface AuthResult { token: string; user: { id: number; email: string; username: string; role?: string } }

export const authApi = {
  login: (data: LoginPayload) =>
    apiFetch<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  register: (data: RegisterPayload) =>
    apiFetch<AuthResult>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  me: () =>
    apiFetch<AuthResult["user"]>("/auth/me"),

  logout: () =>
    apiFetch<void>("/auth/logout", { method: "POST" }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ success: boolean }>("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),
};
