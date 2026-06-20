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

type JwtPayload = {
  userId: number;
};

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