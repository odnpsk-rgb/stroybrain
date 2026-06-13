import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "./db";
import { sendContactNotification } from "./mail";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(3).max(50),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID();
    try {
      getDb()
        .prepare(
          `INSERT INTO contact_messages (id, name, email, phone, subject, message)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(id, data.name, data.email, data.phone, data.subject, data.message);
    } catch (error) {
      console.error("Failed to insert contact message:", error);
      throw new Error("Не удалось сохранить заявку. Попробуйте позже.");
    }

    try {
      await sendContactNotification(data);
    } catch (error) {
      // Заявка уже в базе — не блокируем пользователя из-за ошибки почты
      console.error("Failed to send contact email:", error);
    }

    return { success: true };
  });

export type { ContactMessage } from "./db";
