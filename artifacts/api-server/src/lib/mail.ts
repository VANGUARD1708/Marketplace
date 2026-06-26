import { logger } from "./logger";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

type MailResult = { success: boolean; messageId?: string; error?: string };

const FROM_DEFAULT = process.env.MAIL_FROM ?? "noreply@vanguard.ng";

async function send(options: MailOptions): Promise<MailResult> {
  const { to, subject, html, text, from = FROM_DEFAULT } = options;

  if (process.env.NODE_ENV !== "production") {
    logger.info({ to, subject, from }, "[MAIL] Would send email (dev mode — not actually sent)");
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  logger.warn({ to, subject }, "[MAIL] No mail provider configured");
  return { success: false, error: "Mail provider not configured" };
}

export const mail = {
  send,

  async sendWelcome(to: string, username: string): Promise<MailResult> {
    return send({
      to,
      subject: "Welcome to Vanguard — Nigeria's Trusted Marketplace",
      html: `<h1>Welcome, ${username}!</h1><p>Your account is ready. Start exploring verified sellers and trusted deals.</p>`,
      text: `Welcome, ${username}! Your Vanguard account is ready.`,
    });
  },

  async sendOtp(to: string, code: string, purpose: string): Promise<MailResult> {
    return send({
      to,
      subject: `Your Vanguard verification code: ${code}`,
      html: `<h2>Your verification code</h2><p>Use this code to ${purpose}:</p><h1 style="letter-spacing:8px;font-size:36px">${code}</h1><p>This code expires in 10 minutes.</p>`,
      text: `Your Vanguard ${purpose} code is: ${code}. Expires in 10 minutes.`,
    });
  },

  async sendPasswordReset(to: string, resetUrl: string): Promise<MailResult> {
    return send({
      to,
      subject: "Reset your Vanguard password",
      html: `<h2>Password Reset</h2><p>Click the link below to reset your password. This link expires in 1 hour.</p><a href="${resetUrl}">Reset Password</a>`,
      text: `Reset your password: ${resetUrl}`,
    });
  },

  async sendEscrowCreated(to: string, amount: string, orderId: number): Promise<MailResult> {
    return send({
      to,
      subject: `Escrow Created — ₦${amount} held securely for Order #${orderId}`,
      html: `<h2>Escrow Created</h2><p>₦${amount} has been held in escrow for Order #${orderId}. Funds will be released once you confirm delivery.</p>`,
      text: `Escrow of ₦${amount} created for Order #${orderId}.`,
    });
  },

  async sendVerificationApproved(to: string, verType: string): Promise<MailResult> {
    return send({
      to,
      subject: `Vanguard Verification Approved — ${verType}`,
      html: `<h2>Verification Approved! 🎉</h2><p>Your ${verType} verification has been approved. Your trust score has been updated.</p>`,
      text: `Your ${verType} verification on Vanguard has been approved!`,
    });
  },
};

export default mail;
