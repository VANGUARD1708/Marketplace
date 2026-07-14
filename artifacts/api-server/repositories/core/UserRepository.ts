import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
} from "drizzle-orm";

import {
  db,
  usersTable,
  type InsertUser,
  type User,
} from "@workspace/db";

export class UserRepository {
  /**
   * Create a new user
   */
  async create(data: InsertUser): Promise<User> {
    const [user] = await db
      .insert(usersTable)
      .values(data)
      .returning();

    return user;
  }

  /**
   * Find user by primary key
   */
  async findById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  }

  /**
   * Find multiple users by IDs
   */
  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    return db
      .select()
      .from(usersTable)
      .where(inArray(usersTable.id, ids));
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return user ?? null;
  }

  /**
   * Find active user by email
   */
  async findByEmailAndActive(
    email: string,
  ): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          eq(usersTable.isActive, true),
        ),
      )
      .limit(1);

    return user ?? null;
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    return user ?? null;
  }

  /**
   * Login helper
   */
  async findByEmailOrUsername(
    value: string,
  ): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, value),
          eq(usersTable.username, value),
        ),
      )
      .limit(1);

    return user ?? null;
  }

  /**
   * Get every user
   */
  async findAll(): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Search users
   */
  async search(keyword: string): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(
        or(
          ilike(usersTable.username, `%${keyword}%`),
          ilike(usersTable.email, `%${keyword}%`),
        ),
      )
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Active users
   */
  async findActive(): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isActive, true))
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Inactive users
   */
  async findInactive(): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isActive, false))
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Check email availability
   */
  async emailExists(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }

  /**
   * Check username availability
   */
  async usernameExists(username: string): Promise<boolean> {
    return (await this.findByUsername(username)) !== null;
  }

  /**
   * Update user
   */
  async update(
    id: number,
    data: Partial<InsertUser>,
  ): Promise<User | null> {
    const [user] = await db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user ?? null;
  }

  /**
   * Activate account
   */
  async activate(id: number): Promise<User | null> {
    return this.update(id, {
      isActive: true,
    });
  }

  /**
   * Deactivate account
   */
  async deactivate(id: number): Promise<User | null> {
    return this.update(id, {
      isActive: false,
    });
  }

  /**
   * Delete account
   */
  async delete(id: number): Promise<void> {
    await db
      .delete(usersTable)
      .where(eq(usersTable.id, id));
  }

  /**
   * Total users
   */
  async count(): Promise<number> {
    const [result] = await db
      .select({
        total: count(),
      })
      .from(usersTable);

    return result.total;
  }

  /**
   * Find administrators
   */
  async findAdmins(): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isAdmin, true))
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Find normal users
   */
  async findRegularUsers(): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isAdmin, false))
      .orderBy(desc(usersTable.createdAt));
  }

  /**
   * Promote user to admin
   */
  async makeAdmin(id: number): Promise<User | null> {
    return this.update(id, {
      isAdmin: true,
    });
  }

  /**
   * Remove admin privileges
   */
  async removeAdmin(id: number): Promise<User | null> {
    return this.update(id, {
      isAdmin: false,
    });
  }

  /**
   * Update password hash
   */
  async updatePassword(
    id: number,
    passwordHash: string,
  ): Promise<User | null> {
    return this.update(id, {
      passwordHash,
    });
  }

  /**
   * Paginated users
   */
  async paginate(
    limit: number,
    offset: number,
  ): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Latest registered users
   */
  async latest(limit = 10): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit);
  }

  /**
   * Bulk activate users
   */
  async activateMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;

    await db
      .update(usersTable)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(inArray(usersTable.id, ids));
  }

  /**
   * Bulk deactivate users
   */
  async deactivateMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;

    await db
      .update(usersTable)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(inArray(usersTable.id, ids));
  }

  /**
   * Bulk delete users
   */
  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;

    await db
      .delete(usersTable)
      .where(inArray(usersTable.id, ids));
  }

  /**
   * User exists by ID
   */
  async exists(id: number): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: number): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    return this.update(id, {
      isActive: !user.isActive,
    });
  }

  /**
   * Get dashboard statistics
   */
  async statistics() {
    const total = await this.count();
    const active = await this.findActive();
    const inactive = await this.findInactive();
    const admins = await this.findAdmins();

    return {
      totalUsers: total,
      activeUsers: active.length,
      inactiveUsers: inactive.length,
      administrators: admins.length,
    };
  }