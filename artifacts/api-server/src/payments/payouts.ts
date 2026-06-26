import { db } from "@workspace/db";
import { walletsTable, transactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { WALLET } from "../constants/wallet";
import { generateTxRef } from "../utils/uuid";
import { initiateTransfer } from "./paystack";

export interface PayoutRequest {
  userId: number;
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export async function requestPayout(req: PayoutRequest) {
  if (req.amount < WALLET.MIN_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is ${WALLET.CURRENCY_SYMBOL}${WALLET.MIN_WITHDRAWAL}`);
  }
  if (req.amount > WALLET.MAX_WITHDRAWAL_DAILY) {
    throw new Error(`Maximum daily withdrawal is ${WALLET.CURRENCY_SYMBOL}${WALLET.MAX_WITHDRAWAL_DAILY.toLocaleString()}`);
  }

  const wallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.userId, req.userId) });
  if (!wallet) throw new Error("Wallet not found");

  const totalDeducted = req.amount + WALLET.WITHDRAWAL_FEE;
  if (parseFloat(wallet.availableBalance) < totalDeducted) {
    throw new Error(`Insufficient balance. Available: ${WALLET.CURRENCY_SYMBOL}${parseFloat(wallet.availableBalance).toLocaleString()}`);
  }

  const reference = generateTxRef();

  const [tx] = await db.insert(transactionsTable).values({
    walletId: wallet.id,
    type: WALLET.TRANSACTION_TYPES.WITHDRAWAL,
    amount: String(req.amount),
    fee: String(WALLET.WITHDRAWAL_FEE),
    reference,
    status: WALLET.TRANSACTION_STATUS.PENDING,
    metadata: { bankCode: req.bankCode, accountNumber: req.accountNumber, accountName: req.accountName },
  }).returning();

  await db.update(walletsTable)
    .set({ availableBalance: String(parseFloat(wallet.availableBalance) - totalDeducted) })
    .where(eq(walletsTable.id, wallet.id));

  return { success: true, transaction: tx, reference };
}
