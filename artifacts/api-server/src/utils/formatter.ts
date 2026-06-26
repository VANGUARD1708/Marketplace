export function truncate(text: string, maxLength: number, suffix = "…"): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trimEnd() + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => capitalize(word));
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(0, local.length - 2))}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d+)(\d{4})/, "$1****$3");
}

export function maskAccount(accountNumber: string): string {
  return `${"*".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function formatUsername(username: string): string {
  return username.startsWith("@") ? username : `@${username}`;
}

export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
