import express, {
  type Express,
} from "express";
import path from "path";
import fs from "fs";

import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";

import {
  apiLimiter,
  authLimiter,
} from "./middlewares/rateLimit";

const app: Express =
  express();

/*
 * Reverse proxy support
 */
app.set(
  "trust proxy",
  1,
);

/*
 * Security headers
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/*
 * Logging
 */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method:
            req.method,
          url: req.url?.split(
            "?",
          )[0],
        };
      },

      res(res) {
        return {
          statusCode:
            res.statusCode,
        };
      },
    },
  }),
);

/*
 * CORS
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/*
 * Body parsers
 */
app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

/*
 * Global rate limiter
 */
app.use(
  "/api",
  apiLimiter,
);

/*
 * Authentication limiter
 */
app.use(
  "/api/auth",
  authLimiter,
);

/*
 * Ensure uploads directory exists at startup
 */
const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/*
 * API Routes
 */
app.use(
  "/api",
  router,
);

export default app;