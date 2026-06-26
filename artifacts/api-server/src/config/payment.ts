export const PAYMENT_CONFIG = {
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
    publicKey: process.env.PAYSTACK_PUBLIC_KEY ?? "",
    baseUrl: "https://api.paystack.co",
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET ?? "",
  },

  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY ?? "",
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY ?? "",
    encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY ?? "",
    baseUrl: "https://api.flutterwave.com/v3",
    webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET ?? "",
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publicKey: process.env.STRIPE_PUBLIC_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    baseUrl: "https://api.stripe.com/v1",
  },

  defaultProvider: (process.env.DEFAULT_PAYMENT_PROVIDER ?? "paystack") as "paystack" | "flutterwave" | "stripe",
  currency: "NGN",
  callbackUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/payment/callback`,
} as const;
