import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "CHANGE_THIS_IN_PRODUCTION";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "CHANGE_REFRESH_IN_PRODUCTION";

export type AccessTokenPayload = { userId: number; type: "access" };
export type RefreshTokenPayload = { userId: number; type: "refresh" };

export function signAccessToken(userId: number): string {
  return jwt.sign({ userId, type: "access" } satisfies AccessTokenPayload, JWT_SECRET, { expiresIn: "1d" });
}

export function signRefreshToken(userId: number): string {
  return jwt.sign({ userId, type: "refresh" } satisfies RefreshTokenPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.decode(token) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
