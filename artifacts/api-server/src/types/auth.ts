import type { Role } from "../constants/roles";

export interface TokenPayload {
  userId: number;
  role?: Role;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<AuthUser, "role"> & { role?: Role };
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
