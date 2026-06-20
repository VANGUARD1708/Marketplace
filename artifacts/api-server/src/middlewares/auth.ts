import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "CHANGE_THIS_IN_PRODUCTION";

export interface AuthRequest
  extends Request {
  user?: {
    id: number;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const token =
      authHeader.replace(
        "Bearer ",
        "",
      );

    const payload = jwt.verify(
      token,
      JWT_SECRET,
    ) as {
      userId: number;
    };

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}