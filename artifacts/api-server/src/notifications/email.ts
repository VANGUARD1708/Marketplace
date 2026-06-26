import { APP_CONFIG } from "../config/app";
import { logger } from "../lib/logger";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL ?? `noreply@vanguard.ng`;
const FROM_NAME = process.env.FROM_NAME ?? "Vanguard";

export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn({ to: opts.to, subject: opts.subject }, "[EMAIL] SMTP not configured — skipping send");
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: opts.from ?? `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    logger.info({ to: opts.to, subject: opts.subject }, "Email sent");
    return true;
  } catch (error) {
    logger.error({ error, to: opts.to }, "Email send failed");
    return false;
  }
}

export function escrowFundedEmail(sellerEmail: string, amount: string, buyerName: string) {
  return sendEmail({
    to: sellerEmail,
    subject: "Escrow Funded — Vanguard",
    html: `<p>Hi,</p><p>${buyerName} has funded an escrow of <strong>${amount}</strong>. Log in to confirm the order.</p><p>— Vanguard Team</p>`,
    text: `${buyerName} has funded an escrow of ${amount}. Log in to confirm.`,
  });
}

export function escrowReleasedEmail(sellerEmail: string, amount: string) {
  return sendEmail({
    to: sellerEmail,
    subject: "Payment Released — Vanguard",
    html: `<p>Hi,</p><p>Your escrow payment of <strong>${amount}</strong> has been released to your wallet.</p><p>— Vanguard Team</p>`,
    text: `Your escrow payment of ${amount} has been released.`,
  });
}

export function welcomeEmail(email: string, username: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Vanguard",
    html: `<p>Hi @${username},</p><p>Welcome to <strong>Vanguard</strong> — the trusted marketplace. Complete your profile and start trading safely.</p><p>— Vanguard Team</p>`,
    text: `Welcome to Vanguard, @${username}! Complete your profile and start trading safely.`,
  });
}

export function verificationApprovedEmail(email: string) {
  return sendEmail({
    to: email,
    subject: "Verification Approved — Vanguard",
    html: `<p>Your identity verification has been approved. Your trust score has been updated.</p>`,
    text: `Your identity verification has been approved.`,
  });
}
