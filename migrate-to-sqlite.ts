import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import * as fs from 'fs';

// Definir el esquema para SQLite
const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  openId: text('openId').notNull().unique(),
  name: text('name'),
  email: text('email'),
  loginMethod: text('loginMethod'),
  role: text('role').default('user').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).defaultNow().notNull(),
  lastSignedIn: integer('lastSignedIn', { mode: 'timestamp' }).defaultNow().notNull(),
});

const publications = sqliteTable('publications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featured: integer('featured', { mode: 'boolean' }).default(false).notNull(),
  authorIds: text('authorIds').notNull(),
  createdBy: integer('createdBy').notNull(),
  status: text('status').default('draft').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).defaultNow().notNull(),
});

const authors = sqliteTable('authors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  bio: text('bio'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).defaultNow().notNull(),
});

async function main() {
  const sqlite = new Database('local.db');
  const db = drizzle(sqlite);

  // Crear tablas manualmente para simplificar
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openId TEXT NOT NULL UNIQUE,
      name TEXT,
      email TEXT,
      loginMethod TEXT,
      role TEXT DEFAULT 'user' NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      lastSignedIn INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      featured INTEGER DEFAULT 0 NOT NULL,
      authorIds TEXT NOT NULL,
      createdBy INTEGER NOT NULL,
      status TEXT DEFAULT 'draft' NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT,
      createdAt INTEGER NOT NULL
    );
  `);

  console.log('Base de datos SQLite inicializada.');

  // Insertar datos de prueba
  const authorId = sqlite.prepare('INSERT INTO authors (name, bio, createdAt) VALUES (?, ?, ?)').run(
    'Admin Manus',
    'Administrador del sistema',
    Date.now()
  ).lastInsertRowid;

  sqlite.prepare('INSERT INTO publications (title, content, excerpt, featured, authorIds, createdBy, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    'Bienvenidos a La Nota+',
    'Este es el primer artículo publicado en el portal de derechos humanos.',
    'Breve introducción al portal.',
    1,
    JSON.stringify([authorId]),
    1,
    'published',
    Date.now(),
    Date.now()
  );

  console.log('Datos de prueba insertados.');
}

main().catch(console.error);
