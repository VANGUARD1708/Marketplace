import { PAYMENT_CONFIG } from "../config/payment";
import { generateTxRef } from "../utils/uuid";

const BASE = PAYMENT_CONFIG.stripe.baseUrl;

function headers() {
  return {
    Authorization: `Bearer ${PAYMENT_CONFIG.stripe.secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

function encodeBody(obj: Record<string, string | number | undefined>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

async function stripeRequest<T>(method: string, path: string, body?: Record<string, string | number | undefined>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? encodeBody(body) : undefined,
  });
  const data = await res.json() as T & { error?: { message: string } };
  if ("error" in data && data.error) throw new Error(data.error.message);
  return data;
}

export async function createPaymentIntent(amountCents: number, currency = "usd", metadata?: Record<string, string>) {
  const ref = generateTxRef();
  return stripeRequest<{ id: string; client_secret: string; status: string }>(
    "POST", "/payment_intents",
    { amount: amountCents, currency, "metadata[reference]": ref, ...metadata as Record<string, string> }
  );
}

export async function retrievePaymentIntent(id: string) {
  return stripeRequest<{ id: string; status: string; amount: number; currency: string }>(
    "GET", `/payment_intents/${id}`
  );
}

export async function createCustomer(email: string, name: string) {
  return stripeRequest<{ id: string; email: string; name: string }>(
    "POST", "/customers", { email, name }
  );
}

export async function createRefund(paymentIntentId: string, amountCents?: number) {
  return stripeRequest<{ id: string; status: string; amount: number }>(
    "POST", "/refunds",
    { payment_intent: paymentIntentId, ...(amountCents ? { amount: amountCents } : {}) }
  );
}

export async function createPayout(amountCents: number, currency = "usd", description?: string) {
  return stripeRequest<{ id: string; status: string; amount: number }>(
    "POST", "/payouts",
    { amount: amountCents, currency, description }
  );
}
