import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "./auth";

export function requireOwnership(
  getOwnerId: (
    req: AuthRequest,
  ) => number,
) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const ownerId =
      getOwnerId(req);

    if (
      req.user.id !== ownerId
    ) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  };
}