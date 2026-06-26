import { logger } from "./logger";

type SmsResult = { success: boolean; messageId?: string; error?: string };

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return "+234" + digits.slice(1);
  if (digits.startsWith("234")) return "+" + digits;
  if (digits.startsWith("07") || digits.startsWith("08") || digits.startsWith("09")) return "+234" + digits.slice(1);
  return "+" + digits;
}

async function send(to: string, message: string): Promise<SmsResult> {
  const phone = sanitizePhone(to);

  if (process.env.NODE_ENV !== "production") {
    logger.info({ to: phone, message }, "[SMS] Would send SMS (dev mode — not actually sent)");
    return { success: true, messageId: `sms-dev-${Date.now()}` };
  }

  logger.warn({ to: phone }, "[SMS] SMS provider not configured");
  return { success: false, error: "SMS provider not configured" };
}

export const sms = {
  send,

  async sendOtp(phone: string, code: string): Promise<SmsResult> {
    return send(phone, `Your Vanguard verification code is: ${code}. Valid for 10 minutes. Do not share this code.`);
  },

  async sendWelcome(phone: string, username: string): Promise<SmsResult> {
    return send(phone, `Welcome to Vanguard, ${username}! Your trusted marketplace is ready. Buy & sell with confidence.`);
  },

  async sendEscrowCreated(phone: string, amount: string, orderId: number): Promise<SmsResult> {
    return send(phone, `Vanguard: Escrow of ₦${amount} created for Order #${orderId}. Funds held securely until delivery confirmed.`);
  },

  async sendOrderUpdate(phone: string, orderId: number, status: string): Promise<SmsResult> {
    const statusMessages: Record<string, string> = {
      confirmed: "Your order has been confirmed by the seller.",
      shipped: "Your order is on the way!",
      delivered: "Your order has been delivered. Confirm receipt to release payment.",
      cancelled: "Your order has been cancelled. Escrow refund will be processed.",
    };
    const message = statusMessages[status] ?? `Order #${orderId} status: ${status}`;
    return send(phone, `Vanguard Order #${orderId}: ${message}`);
  },

  async sendGuardianAlert(phone: string, message: string): Promise<SmsResult> {
    return send(phone, `Vanguard Guardian Alert: ${message}`);
  },
};

export default sms;
