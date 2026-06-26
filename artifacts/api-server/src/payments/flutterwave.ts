import { PAYMENT_CONFIG } from "../config/payment";
import { generateTxRef } from "../utils/uuid";

const BASE = PAYMENT_CONFIG.flutterwave.baseUrl;

function headers() {
  return {
    Authorization: `Bearer ${PAYMENT_CONFIG.flutterwave.secretKey}`,
    "Content-Type": "application/json",
  };
}

async function flwRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json() as { status: string; message: string; data: T };
  if (data.status !== "success") throw new Error(data.message);
  return data.data;
}

export async function initializePayment(opts: {
  amount: number;
  currency?: string;
  email: string;
  name: string;
  phone?: string;
  callbackUrl?: string;
  meta?: Record<string, unknown>;
}) {
  const txRef = generateTxRef();
  const data = await flwRequest<{ link: string }>("POST", "/payments", {
    tx_ref: txRef,
    amount: opts.amount,
    currency: opts.currency ?? "NGN",
    redirect_url: opts.callbackUrl ?? PAYMENT_CONFIG.callbackUrl,
    customer: { email: opts.email, name: opts.name, phonenumber: opts.phone },
    meta: opts.meta,
  });
  return { paymentLink: data.link, txRef };
}

export async function verifyPayment(transactionId: string) {
  return flwRequest<{ amount: number; status: string; currency: string; tx_ref: string }>(
    "GET", `/transactions/${transactionId}/verify`
  );
}

export async function listBanks(country = "NG") {
  return flwRequest<{ id: number; code: string; name: string }[]>("GET", `/banks/${country}`);
}

export async function resolveAccount(accountNumber: string, bankCode: string) {
  return flwRequest<{ account_number: string; account_name: string }>(
    "POST", "/accounts/resolve",
    { account_number: accountNumber, account_bank: bankCode }
  );
}

export async function initiateTransfer(opts: {
  amount: number;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  narration?: string;
  currency?: string;
}) {
  const reference = generateTxRef();
  return flwRequest("POST", "/transfers", {
    account_bank: opts.bankCode,
    account_number: opts.accountNumber,
    amount: opts.amount,
    currency: opts.currency ?? "NGN",
    narration: opts.narration ?? "Vanguard Payout",
    beneficiary_name: opts.accountName,
    reference,
  });
}
