import { z } from "zod/v4";

export const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  email: z.email().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
