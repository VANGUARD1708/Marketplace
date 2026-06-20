import argon2 from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "CHANGE_THIS_IN_PRODUCTION";

export async function hashPassword(
  password: string,
) {
  return argon2.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string,
) {
  return argon2.verify(
    hash,
    password,
  );
}

export function createAccessToken(
  userId: number,
) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
}

export function verifyAccessToken(
  token: string,
) {
  return jwt.verify(
    token,
    JWT_SECRET,
  ) as {
    userId: number;
  };
}