import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  profilesTable,
  walletsTable,
  trustScoresTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

import {
  hashPassword,
  verifyPassword,
  createAccessToken,
} from "../lib/auth";

const router = Router();

/**
 * POST /api/auth/register
 /
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      username,
      password,
    } = req.body;

    if (
      !email ||
      !username ||
      !password
    ) {
      return res.status(400).json({
        error:
          "Email, username and password are required",
      });
    }

    const existingUser =
      await db.query.usersTable.findFirst({
        where: eq(
          usersTable.email,
          email,
        ),
      });

    if (existingUser) {
      return res.status(409).json({
        error:
          "Email already exists",
      });
    }

    const passwordHash =
      await hashPassword(
        password,
      );

    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        username,
        passwordHash,
      })
      .returning();

    await db
      .insert(profilesTable)
      .values({
        userId: user.id,
        displayName:
          username,
      });

    await db
      .insert(walletsTable)
      .values({
        userId: user.id,
      });

    await db
      .insert(
        trustScoresTable,
      )
      .values({
        userId: user.id,
        score: "50",
      });

    const token =
      createAccessToken(
        user.id,
      );

    return res
      .status(201)
      .json({
        success: true,
        token,
        user: {
          id: user.id,
          email:
            user.email,
          username:
            user.username,
        },
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Registration failed",
    });
  }
});

/*
 * POST /api/auth/login
 /
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await db.query.usersTable.findFirst({
        where: eq(
          usersTable.email,
          email,
        ),
      });

    if (!user) {
      return res.status(401).json({
        error:
          "Invalid credentials",
      });
    }

    const validPassword =
      await verifyPassword(
        user.passwordHash ??
          "",
        password,
      );

    if (!validPassword) {
      return res.status(401).json({
        error:
          "Invalid credentials",
      });
    }

    const token =
      createAccessToken(
        user.id,
      );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email:
          user.email,
        username:
          user.username,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Login failed",
    });
  }
});

/*
 * GET /api/auth/me
 /
router.get(
  "/me",
  async (_req, res) => {
    return res.json({
      message:
        "JWT session endpoint not implemented yet",
    });
  },
);

/*
 * POST /api/auth/logout
 /
router.post(
  "/logout",
  async (_req, res) => {
    return res.json({
      success: true,
    });
  },
);

/*
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  async (_req, res) => {
    return res.json({
      message:
        "Refresh token system not implemented yet",
    });
  },
);

export default router;