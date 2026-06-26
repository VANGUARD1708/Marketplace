export const tokens = {
  colors: {
    primary: "hsl(var(--primary))",
    primaryForeground: "hsl(var(--primary-foreground))",
    secondary: "hsl(var(--secondary))",
    secondaryForeground: "hsl(var(--secondary-foreground))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    card: "hsl(var(--card))",
    cardForeground: "hsl(var(--card-foreground))",
    destructive: "hsl(var(--destructive))",
    accent: "hsl(var(--accent))",
    ring: "hsl(var(--ring))",
    trust: {
      risky: "#ef4444",
      moderate: "#f59e0b",
      trusted: "#3b82f6",
      elite: "#10b981",
    },
  },

  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
  },

  spacing: {
    containerMaxWidth: "42rem",
    headerHeight: "3.5rem",
    navHeight: "4rem",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  animation: {
    fast: "150ms ease",
    base: "200ms ease",
    slow: "300ms ease",
    spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export type TrustLevel = "risky" | "moderate" | "trusted" | "elite";

export function getTrustColor(score: number): string {
  if (score >= 80) return tokens.colors.trust.elite;
  if (score >= 60) return tokens.colors.trust.trusted;
  if (score >= 40) return tokens.colors.trust.moderate;
  return tokens.colors.trust.risky;
}

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 80) return "elite";
  if (score >= 60) return "trusted";
  if (score >= 40) return "moderate";
  return "risky";
}
