import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, publications, authors, notifications, quickLoginCodes, adminCodes, InsertPublication, InsertAuthor, InsertNotification, InsertQuickLoginCode, InsertAdminCode } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Publications
export async function createPublication(data: InsertPublication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(publications).values(data);
}

export async function getPublishedPublications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(publications).where(eq(publications.status, "published"));
}

export async function getFeaturedPublications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(publications).where(
    and(eq(publications.featured, true), eq(publications.status, "published"))
  );
}

export async function getPublicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(publications).where(eq(publications.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePublication(id: number, data: Partial<InsertPublication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(publications).set(data).where(eq(publications.id, id));
}

// Authors
export async function createAuthor(data: InsertAuthor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(authors).values(data);
}

export async function getAuthorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAuthors() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(authors);
}

// Quick Login Codes
export async function createQuickLoginCode(userId: number, code: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(quickLoginCodes).values({ userId, code, expiresAt });
}

export async function getQuickLoginCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quickLoginCodes).where(eq(quickLoginCodes.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Admin Codes
export async function createAdminCode(code: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(adminCodes).values({ code, userId, isActive: true });
}

export async function getAdminCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminCodes).where(
    and(eq(adminCodes.code, code), eq(adminCodes.isActive, true))
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminCodesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(adminCodes).where(eq(adminCodes.userId, userId));
}

// Notifications
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(notifications).values(data);
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}


