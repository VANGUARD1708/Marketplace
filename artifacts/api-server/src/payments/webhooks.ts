import type { Request, Response } from "express";
import crypto from "crypto";
import { PAYMENT_CONFIG } from "../config/payment";
import { db } from "@workspace/db";
import { transactionsTable, walletsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { WALLET } from "../constants/wallet";
import { logger } from "../lib/logger";

function verifyPaystackSignature(body: string, signature: string): boolean {
  const hash = crypto.createHmac("sha512", PAYMENT_CONFIG.paystack.webhookSecret).update(body).digest("hex");
  return hash === signature;
}

function verifyFlutterwaveSignature(body: string, signature: string): boolean {
  const hash = crypto.createHmac("sha256", PAYMENT_CONFIG.flutterwave.webhookSecret).update(body).digest("hex");
  return hash === signature;
}

export async function handlePaystackWebhook(req: Request, res: Response) {
  const signature = req.headers["x-paystack-signature"] as string;
  const rawBody = JSON.stringify(req.body);

  if (!verifyPaystackSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body as { event: string; data: { reference: string; amount: number; status: string } };
  logger.info({ event, reference: data?.reference }, "Paystack webhook received");

  try {
    if (event === "charge.success") {
      const tx = await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.reference, data.reference),
      });
      if (tx && tx.status === WALLET.TRANSACTION_STATUS.PENDING) {
        await db.update(transactionsTable)
          .set({ status: WALLET.TRANSACTION_STATUS.COMPLETED })
          .where(eq(transactionsTable.id, tx.id));

        const wallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.id, tx.walletId) });
        if (wallet) {
          await db.update(walletsTable)
            .set({ availableBalance: String(parseFloat(wallet.availableBalance) + parseFloat(tx.amount)) })
            .where(eq(walletsTable.id, wallet.id));
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error({ error, event }, "Paystack webhook processing error");
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

export async function handleFlutterwaveWebhook(req: Request, res: Response) {
  const signature = req.headers["verif-hash"] as string;
  if (signature !== PAYMENT_CONFIG.flutterwave.webhookSecret) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body as { event: string; data: { tx_ref: string; amount: number; status: string } };
  logger.info({ event, txRef: data?.tx_ref }, "Flutterwave webhook received");

  try {
    if (event === "charge.completed" && data.status === "successful") {
      const tx = await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.reference, data.tx_ref),
      });
      if (tx && tx.status === WALLET.TRANSACTION_STATUS.PENDING) {
        await db.update(transactionsTable)
          .set({ status: WALLET.TRANSACTION_STATUS.COMPLETED })
          .where(eq(transactionsTable.id, tx.id));

        const wallet = await db.query.walletsTable.findFirst({ where: eq(walletsTable.id, tx.walletId) });
        if (wallet) {
          await db.update(walletsTable)
            .set({ availableBalance: String(parseFloat(wallet.availableBalance) + parseFloat(tx.amount)) })
            .where(eq(walletsTable.id, wallet.id));
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error({ error, event }, "Flutterwave webhook processing error");
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
