import { PAYMENT_CONFIG } from "../config/payment";
import { generateTxRef } from "../utils/uuid";
import { toKobo } from "../utils/money";

const BASE = PAYMENT_CONFIG.paystack.baseUrl;

function headers() {
  return {
    Authorization: `Bearer ${PAYMENT_CONFIG.paystack.secretKey}`,
    "Content-Type": "application/json",
  };
}

async function paystackRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json() as { status: boolean; message: string; data: T };
  if (!data.status) throw new Error(data.message);
  return data.data;
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializePayment(
  email: string,
  amountNaira: number,
  callbackUrl?: string,
  metadata?: Record<string, unknown>
): Promise<InitializePaymentResult> {
  const reference = generateTxRef();
  const data = await paystackRequest<{ authorization_url: string; access_code: string; reference: string }>(
    "POST", "/transaction/initialize",
    {
      email,
      amount: toKobo(amountNaira),
      reference,
      callback_url: callbackUrl ?? PAYMENT_CONFIG.callbackUrl,
      metadata,
    }
  );
  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

export async function verifyPayment(reference: string) {
  return paystackRequest<{ amount: number; status: string; reference: string; currency: string }>(
    "GET", `/transaction/verify/${reference}`
  );
}

export async function listBanks(country = "nigeria") {
  return paystackRequest<{ id: number; name: string; code: string }[]>(
    "GET", `/bank?country=${country}&type=nuban&perPage=100`
  );
}

export async function resolveAccount(accountNumber: string, bankCode: string) {
  return paystackRequest<{ account_number: string; account_name: string }>(
    "GET", `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  );
}

export interface TransferRecipientResult {
  recipient_code: string;
  name: string;
  account_number: string;
}

export async function createTransferRecipient(
  name: string,
  accountNumber: string,
  bankCode: string
): Promise<TransferRecipientResult> {
  return paystackRequest<TransferRecipientResult>("POST", "/transferrecipient", {
    type: "nuban",
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN",
  });
}

export async function initiateTransfer(
  amount: number,
  recipientCode: string,
  reason = "Vanguard Payout"
) {
  const reference = generateTxRef();
  return paystackRequest("POST", "/transfer", {
    source: "balance",
    amount: toKobo(amount),
    recipient: recipientCode,
    reason,
    reference,
  });
}
