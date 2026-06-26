import { z } from "zod/v4";
import { WALLET } from "../constants/wallet";

export const depositSchema = z.object({
  amount: z.number().min(WALLET.MIN_DEPOSIT).max(WALLET.MAX_DEPOSIT),
  provider: z.enum(["paystack", "flutterwave", "stripe"]),
  callbackUrl: z.string().url().optional(),
});

export const withdrawalSchema = z.object({
  amount: z.number().min(WALLET.MIN_WITHDRAWAL).max(WALLET.MAX_WITHDRAWAL_DAILY),
  bankCode: z.string().min(3),
  accountNumber: z.string().min(10).max(10),
  accountName: z.string().min(2),
});

export const transferSchema = z.object({
  amount: z.number().positive(),
  recipientUserId: z.number().int().positive(),
  note: z.string().max(255).optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
