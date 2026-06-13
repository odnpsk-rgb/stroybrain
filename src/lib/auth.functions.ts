import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSession,
  deleteSession,
  getSessionTokenFromCookie,
  isValidSession,
  verifyAdminCredentials,
} from "./auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    if (!verifyAdminCredentials(data.email, data.password)) {
      throw new Error("Неверный email или пароль");
    }

    const token = createSession();
    setCookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });

    return { success: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const token = getSessionTokenFromCookie();
  if (token) deleteSession(token);
  deleteCookie(SESSION_COOKIE, { path: "/" });
  return { success: true };
});

export const checkSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getSessionTokenFromCookie();
  return { authenticated: isValidSession(token) };
});
