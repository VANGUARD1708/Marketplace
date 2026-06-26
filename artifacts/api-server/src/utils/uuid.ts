import { randomBytes } from "crypto";

export function generateUUID(): string {
  return randomBytes(16).toString("hex").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

export function generateRef(prefix = "VG"): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function generateOrderRef(): string {
  return generateRef("ORD");
}

export function generateEscrowRef(): string {
  return generateRef("ESC");
}

export function generateTxRef(): string {
  return generateRef("TXN");
}

export function generatePaymentRef(): string {
  return generateRef("PAY");
}
