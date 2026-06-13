import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSessionTokenFromCookie, isValidSession } from "@/lib/auth";
import { getDb, readContactMessages } from "@/lib/db";

function assertAdminSession() {
  const token = getSessionTokenFromCookie();
  if (!isValidSession(token)) {
    throw new Error("Unauthorized");
  }
}

export const getAdminData = createServerFn({ method: "POST" }).handler(async () => {
  const token = getSessionTokenFromCookie();
  if (!isValidSession(token)) {
    return { authenticated: false as const, messages: [] };
  }

  return {
    authenticated: true as const,
    messages: readContactMessages(),
  };
});

export const listMessages = createServerFn({ method: "POST" }).handler(async () => {
  assertAdminSession();
  return { messages: readContactMessages() };
});

export const markMessageRead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), is_read: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    assertAdminSession();
    const result = getDb()
      .prepare("UPDATE contact_messages SET is_read = ? WHERE id = ?")
      .run(data.is_read ? 1 : 0, data.id);
    if (result.changes === 0) throw new Error("Message not found");
    return { success: true };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    assertAdminSession();
    const result = getDb().prepare("DELETE FROM contact_messages WHERE id = ?").run(data.id);
    if (result.changes === 0) throw new Error("Message not found");
    return { success: true };
  });
