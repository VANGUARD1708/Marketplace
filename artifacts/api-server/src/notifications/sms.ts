import { logger } from "../lib/logger";

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_BASE = "https://api.ng.termii.com/api";
const FROM_NUMBER = process.env.SMS_FROM ?? "Vanguard";

export async function sendSms(to: string, message: string): Promise<boolean> {
  if (!TERMII_API_KEY) {
    logger.warn({ to, message: message.slice(0, 20) }, "[SMS] Termii not configured — skipping");
    return false;
  }

  try {
    const res = await fetch(`${TERMII_BASE}/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from: FROM_NUMBER,
        sms: message,
        type: "plain",
        api_key: TERMII_API_KEY,
        channel: "generic",
      }),
    });
    const data = await res.json() as { message_id?: string; message?: string };
    if (!data.message_id) {
      logger.error({ data, to }, "SMS send failed");
      return false;
    }
    logger.info({ to, messageId: data.message_id }, "SMS sent");
    return true;
  } catch (error) {
    logger.error({ error, to }, "SMS send error");
    return false;
  }
}

export function sendOtp(phone: string, otp: string): Promise<boolean> {
  return sendSms(phone, `Your Vanguard verification code is: ${otp}. Do not share this with anyone.`);
}

export function sendEscrowAlert(phone: string, amount: string): Promise<boolean> {
  return sendSms(phone, `Vanguard: Escrow of ${amount} has been funded. Check your app to confirm.`);
}

export function sendPaymentAlert(phone: string, amount: string, type: string): Promise<boolean> {
  return sendSms(phone, `Vanguard: ${type} of ${amount} processed on your account.`);
}
