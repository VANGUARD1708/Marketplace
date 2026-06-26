import { z } from "zod/v4";
import { ESCROW } from "../constants/escrow";

export const createEscrowSchema = z.object({
  sellerId: z.number().int().positive(),
  listingId: z.number().int().positive().optional(),
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  autoReleaseDays: z.number().int().min(1).max(30).default(14),
});

export const escrowActionSchema = z.object({
  action: z.enum(["fund", "release", "refund", "dispute", "cancel"]),
  reason: z.string().max(500).optional(),
});

export const disputeEscrowSchema = z.object({
  reason: z.enum(ESCROW.DISPUTE_REASONS as [string, ...string[]]),
  description: z.string().min(10).max(1000),
  evidence: z.string().url().array().max(5).optional(),
});

export type CreateEscrowInput = z.infer<typeof createEscrowSchema>;
export type DisputeEscrowInput = z.infer<typeof disputeEscrowSchema>;
