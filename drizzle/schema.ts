import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de códigos de inicio rápido (quick login codes)
 * Permite a usuarios iniciar sesión rápidamente sin contraseña
 */
export const quickLoginCodes = mysqlTable("quickLoginCodes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuickLoginCode = typeof quickLoginCodes.$inferSelect;
export type InsertQuickLoginCode = typeof quickLoginCodes.$inferInsert;

/**
 * Tabla de códigos de administrador
 * Cada administrador tiene códigos únicos para iniciar sesión
 */
export const adminCodes = mysqlTable("adminCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  userId: int("userId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminCode = typeof adminCodes.$inferSelect;
export type InsertAdminCode = typeof adminCodes.$inferInsert;

/**
 * Tabla de autores
 * Información de los autores de publicaciones
 */
export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

/**
 * Tabla de publicaciones
 * Artículos y contenido del portal
 */
export const publications = mysqlTable("publications", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: longtext("content").notNull(),
  excerpt: text("excerpt"),
  featured: boolean("featured").default(false).notNull(),
  authorIds: text("authorIds").notNull(), // JSON array of author IDs
  createdBy: int("createdBy").notNull(), // User ID who created
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

/**
 * Tabla de notificaciones
 * Notificaciones para administradores sobre nuevas publicaciones
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["new_publication", "publication_deleted", "publication_featured"]).notNull(),
  publicationId: int("publicationId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => (({
  publications: many(publications),
  notifications: many(notifications),
  quickLoginCodes: many(quickLoginCodes),
  adminCodes: many(adminCodes),
})));

export const publicationsRelations = relations(publications, ({ one }) => (({
  creator: one(users, {
    fields: [publications.createdBy],
    references: [users.id],
  }),
})));

export const notificationsRelations = relations(notifications, ({ one }) => (({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
})));
