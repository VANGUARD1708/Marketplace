export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET ?? "CHANGE_THIS_IN_PRODUCTION",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),

  session: {
    secret: process.env.SESSION_SECRET ?? "CHANGE_THIS_IN_PRODUCTION",
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },

  passwordPolicy: {
    minLength: 8,
    requireUppercase: false,
    requireNumber: false,
    requireSpecial: false,
  },

  otpExpiryMinutes: 10,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 30,
} as const;
