import { getCookie } from "@tanstack/react-start/server";
import { getDb } from "./db";

const SESSION_COOKIE = "nordic_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export { SESSION_COOKIE, SESSION_TTL_MS };

export function cleanupExpiredSessions() {
  getDb().prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
}

export function createSession(): string {
  cleanupExpiredSessions();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  getDb().prepare("INSERT INTO sessions (token, expires_at) VALUES (?, ?)").run(token, expiresAt);
  return token;
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  cleanupExpiredSessions();
  const row = getDb()
    .prepare("SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')")
    .get(token);
  return !!row;
}

export function getSessionTokenFromCookie(): string | undefined {
  return getCookie(SESSION_COOKIE);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials not configured (ADMIN_EMAIL, ADMIN_PASSWORD)");
  }
  return email === adminEmail && password === adminPassword;
}
