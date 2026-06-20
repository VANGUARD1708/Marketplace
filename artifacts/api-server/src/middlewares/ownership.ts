import type {
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import type {
  AuthRequest,
} from "./auth";

export function requireOwnership(
  getOwnerId: (
    req: AuthRequest,
  ) => number,
): RequestHandler {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const ownerId =
      getOwnerId(req);

    if (
      req.user.id !== ownerId
    ) {
      res.status(403).json({
        error: "Forbidden",
      });
      return;
    }

    next();
  };
}