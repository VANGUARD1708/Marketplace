import { db } from "@workspace/db";
import { escrowsTable, walletsTable, transactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ESCROW } from "../constants/escrow";
import { WALLET } from "../constants/wallet";
import { generateEscrowRef } from "../utils/uuid";
import { calculateFee, formatAmount } from "../utils/money";
import { autoReleaseDate } from "../utils/dates";

export async function createEscrow(opts: {
  buyerId: number;
  sellerId: number;
  amount: number;
  listingId?: number;
  description?: string;
  autoReleaseDays?: number;
}) {
  const fee = calculateFee(opts.amount, WALLET.ESCROW_FEE_RATE);
  const reference = generateEscrowRef();

  const buyerWallet = await db.query.walletsTable.findFirst({
    where: eq(walletsTable.userId, opts.buyerId),
  });
  if (!buyerWallet) throw new Error("Buyer wallet not found");
  if (parseFloat(buyerWallet.availableBalance) < opts.amount + fee) {
    throw new Error(`Insufficient balance. Required: ${formatAmount(opts.amount + fee)}`);
  }

  const [escrow] = await db.insert(escrowsTable).values({
    buyerId: opts.buyerId,
    sellerId: opts.sellerId,
    listingId: opts.listingId,
    amount: String(opts.amount),
    fee: String(fee),
    status: ESCROW.STATUS.FUNDED,
    reference,
    autoReleaseAt: autoReleaseDate(opts.autoReleaseDays ?? ESCROW.AUTO_RELEASE_DAYS),
  }).returning();

  await db.update(walletsTable)
    .set({
      availableBalance: String(parseFloat(buyerWallet.availableBalance) - opts.amount - fee),
      escrowBalance: String(parseFloat(buyerWallet.escrowBalance ?? "0") + opts.amount),
    })
    .where(eq(walletsTable.userId, opts.buyerId));

  return escrow;
}

export async function releaseEscrow(escrowId: number, releasedBy = "buyer_confirmed") {
  const escrow = await db.query.escrowsTable.findFirst({ where: eq(escrowsTable.id, escrowId) });
  if (!escrow) throw new Error("Escrow not found");
  if (escrow.status !== ESCROW.STATUS.FUNDED) throw new Error(`Cannot release escrow in status: ${escrow.status}`);

  const sellerWallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.userId, escrow.sellerId) });
  if (!sellerWallet) throw new Error("Seller wallet not found");

  const netAmount = parseFloat(escrow.amount) - parseFloat(escrow.fee);

  await db.update(escrowsTable)
    .set({ status: ESCROW.STATUS.RELEASED, releasedAt: new Date(), releaseCondition: releasedBy })
    .where(eq(escrowsTable.id, escrowId));

  await db.update(walletsTable)
    .set({ availableBalance: String(parseFloat(sellerWallet.availableBalance) + netAmount) })
    .where(eq(walletsTable.userId, escrow.sellerId));

  return { success: true, escrowId, netAmount };
}

export async function refundEscrow(escrowId: number, reason = "buyer_request") {
  const escrow = await db.query.escrowsTable.findFirst({ where: eq(escrowsTable.id, escrowId) });
  if (!escrow) throw new Error("Escrow not found");
  if (!([ESCROW.STATUS.FUNDED, ESCROW.STATUS.DISPUTED] as string[]).includes(escrow.status)) {
    throw new Error(`Cannot refund escrow in status: ${escrow.status}`);
  }

  const buyerWallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.userId, escrow.buyerId) });
  if (!buyerWallet) throw new Error("Buyer wallet not found");

  await db.update(escrowsTable)
    .set({ status: ESCROW.STATUS.REFUNDED, refundedAt: new Date() })
    .where(eq(escrowsTable.id, escrowId));

  await db.update(walletsTable)
    .set({
      availableBalance: String(parseFloat(buyerWallet.availableBalance) + parseFloat(escrow.amount)),
      escrowBalance: String(Math.max(0, parseFloat(buyerWallet.escrowBalance ?? "0") - parseFloat(escrow.amount))),
    })
    .where(eq(walletsTable.userId, escrow.buyerId));

  return { success: true, escrowId, refundedAmount: escrow.amount, reason };
}

export async function disputeEscrow(escrowId: number, raisedById: number, reason: string) {
  const escrow = await db.query.escrowsTable.findFirst({ where: eq(escrowsTable.id, escrowId) });
  if (!escrow) throw new Error("Escrow not found");
  if (escrow.status !== ESCROW.STATUS.FUNDED) throw new Error("Can only dispute funded escrows");

  const [updated] = await db.update(escrowsTable)
    .set({ status: ESCROW.STATUS.DISPUTED, disputeReason: reason, disputedAt: new Date() })
    .where(eq(escrowsTable.id, escrowId))
    .returning();

  return updated;
}
