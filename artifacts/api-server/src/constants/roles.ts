export const ROLES = {
  USER: "user",
  SELLER: "seller",
  BUYER: "buyer",
  MODERATOR: "moderator",
  SUPPORT: "support",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  buyer: 0,
  seller: 1,
  support: 2,
  moderator: 3,
  admin: 4,
  superadmin: 5,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
