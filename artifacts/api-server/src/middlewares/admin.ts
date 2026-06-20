import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "./auth";

/**
 * Temporary admin IDs.
 * Replace with database roles/permissions later.
 */
const ADMIN_IDS = new Set<number>([
  1,
]);

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void | Response {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const isAdmin = ADMIN_IDS.has(
    req.user.id,
  );

  if (!isAdmin) {
    return res.status(403).json({
      error: "Forbidden",
      message:
        "Administrator access required",
    });
  }

  return next();
}

/**
 * Helper for future role checks.
 */
export function isAdmin(
  userId: number,
): boolean {
  return ADMIN_IDS.has(userId);
}