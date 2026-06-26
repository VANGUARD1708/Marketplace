import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  profilesTable,
  walletsTable,
  trustScoresTable,
  refreshTokensTable,
  verificationRequestsTable,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

import {
  hashPassword,
  verifyPassword,
  createAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
} from "../lib/auth";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Email, username and password are required",
      });
    }

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({ email, username, passwordHash })
      .returning();

    await db.insert(profilesTable).values({ userId: user.id, displayName: username });
    await db.insert(walletsTable).values({ userId: user.id });
    await db.insert(trustScoresTable).values({ userId: user.id, score: "50" });

    const accessToken = createAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await verifyPassword(user.passwordHash ?? "", password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
});

/**
 * GET /api/auth/me
 */
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.userId, userId),
    });

    const trustScore = await db.query.trustScoresTable.findFirst({
      where: eq(trustScoresTable.userId, userId),
    });

    const allVerifications = await db.query.verificationRequestsTable.findMany({
      where: eq(verificationRequestsTable.userId, userId),
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });

    const approvedVerif = allVerifications.find((v) => v.status === "approved");
    const latestVerif = allVerifications[0];

    let verificationStatus = "unverified";
    let verificationType: string | null = null;

    if (approvedVerif) {
      verificationStatus = "approved";
      verificationType = approvedVerif.type;
    } else if (latestVerif) {
      verificationStatus = latestVerif.status;
      verificationType = latestVerif.type;
    }

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile: profile ?? null,
      trustScore: trustScore ? Number(trustScore.score) : 50,
      verificationStatus,
      verificationType,
      verifications: allVerifications.map((v) => ({
        id: v.id,
        type: v.type,
        status: v.status,
        submittedAt: v.submittedAt,
        reviewedAt: v.reviewedAt,
        reviewNotes: v.reviewNotes,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * POST /api/auth/refresh
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const stored = await db.query.refreshTokensTable.findFirst({
      where: eq(refreshTokensTable.tokenHash, tokenHash),
    });

    if (!stored) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    if (stored.revoked) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    if (new Date() > stored.expiresAt) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    await db
      .update(refreshTokensTable)
      .set({ revoked: true })
      .where(eq(refreshTokensTable.id, stored.id));

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const expiresAt = getRefreshTokenExpiry();

    await db.insert(refreshTokensTable).values({
      userId: stored.userId,
      tokenHash: newTokenHash,
      expiresAt,
    });

    const accessToken = createAccessToken(stored.userId);

    return res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Token refresh failed" });
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      await db
        .update(refreshTokensTable)
        .set({ revoked: true })
        .where(eq(refreshTokensTable.tokenHash, tokenHash));
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
