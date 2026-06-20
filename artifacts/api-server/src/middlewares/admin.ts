import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "./auth";

/**
 * Temporary admin check.
 * Replace with database roles later.
 */
const ADMIN_IDS = [1];

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const isAdmin =
    ADMIN_IDS.includes(
      req.user.id,
    );

  if (!isAdmin) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  next();
}