import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "CHANGE_THIS_IN_PRODUCTION";

export interface AuthRequest
  extends Request {
  user?: {
    id: number;
  };
}

type JwtPayload = {
  userId: number;
};

/**
 * Requires the authenticated user to have isAdmin=true in the DB.
 * Must be used AFTER requireAuth (or combined into one chain: requireAuth, requireAdmin).
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.user.id),
    });
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Forbidden: admin only" });
    }
    return next();
  } catch {
    return res.status(500).json({ error: "Authorization check failed" });
  }
}

/**
 * Silently decodes the Bearer token if present; sets req.user but never rejects.
 * Use on public GET endpoints that want to personalize responses for logged-in users.
 */
export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      if (payload && typeof payload.userId === "number") {
        req.user = { id: payload.userId };
      }
    }
  } catch {
    // invalid token — treat as unauthenticated, continue
  }
  return next();
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void | Response {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (
      !authHeader.startsWith(
        "Bearer ",
      )
    ) {
      return res.status(401).json({
        error: "Invalid token format",
      });
    }

    const token =
      authHeader.slice(7);

    const payload = jwt.verify(
      token,
      JWT_SECRET,
    ) as JwtPayload;

    if (
      !payload ||
      typeof payload.userId !==
        "number"
    ) {
      return res.status(401).json({
        error: "Invalid token payload",
      });
    }

    req.user = {
      id: payload.userId,
    };

    return next();
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error,
    );

    return res.status(401).json({
      error: "Invalid token",
    });
  }
}