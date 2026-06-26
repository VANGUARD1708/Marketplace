import { z } from "zod/v4";

export const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  coverPhotoUrl: z.string().url().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const addMemberSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(["admin", "member", "viewer"]).default("member"),
});

export const updateMemberSchema = z.object({
  role: z.enum(["admin", "member", "viewer"]),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
