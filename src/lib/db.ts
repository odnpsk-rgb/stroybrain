import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

let db: DatabaseSync | undefined;

function getProjectRoot() {
  // Works in dev (src/lib/db.ts). In production bundle, fall back to cwd.
  const fromModule = path.resolve(fileURLToPath(import.meta.url), "../../..");
  if (fs.existsSync(path.join(fromModule, "package.json"))) {
    return fromModule;
  }
  return process.cwd();
}

export function getDbPath() {
  const configured = process.env.DATABASE_PATH;
  const root = getProjectRoot();
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.resolve(root, configured);
  }
  return path.join(root, "data", "app.db");
}

function initSchema(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      expires_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  `);
}

export function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

export function readContactMessages(): ContactMessage[] {
  const rows = getDb()
    .prepare("SELECT * FROM contact_messages ORDER BY created_at DESC")
    .all() as Record<string, unknown>[];
  return rows.map(rowToMessage);
}

export function rowToMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    subject: String(row.subject),
    message: String(row.message),
    is_read: Number(row.is_read) === 1,
    created_at: String(row.created_at),
  };
}
