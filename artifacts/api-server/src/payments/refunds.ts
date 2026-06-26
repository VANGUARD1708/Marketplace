import { db } from "@workspace/db";
import { transactionsTable, walletsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { generateTxRef } from "../utils/uuid";
import { WALLET } from "../constants/wallet";

export interface RefundRequest {
  transactionId: number;
  amount?: number;
  reason: string;
  requestedById: number;
}

export async function processRefund(req: RefundRequest) {
  const tx = await db.query.transactionsTable.findFirst({
    where: eq(transactionsTable.id, req.transactionId),
  });
  if (!tx) throw new Error("Transaction not found");
  if (tx.status !== WALLET.TRANSACTION_STATUS.COMPLETED) throw new Error("Only completed transactions can be refunded");

  const refundAmount = req.amount ?? parseFloat(tx.amount);
  if (refundAmount > parseFloat(tx.amount)) throw new Error("Refund amount exceeds transaction amount");

  const reference = generateTxRef();

  const [refundTx] = await db.insert(transactionsTable).values({
    walletId: tx.walletId,
    type: WALLET.TRANSACTION_TYPES.REFUND,
    amount: String(refundAmount),
    fee: "0",
    reference,
    status: WALLET.TRANSACTION_STATUS.COMPLETED,
    metadata: { originalTxId: req.transactionId, reason: req.reason },
  }).returning();

  const wallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.id, tx.walletId) });
  if (wallet) {
    await db.update(walletsTable)
      .set({ availableBalance: String(parseFloat(wallet.availableBalance) + refundAmount) })
      .where(eq(walletsTable.id, wallet.id));
  }

  return { success: true, refundTransaction: refundTx };
}
