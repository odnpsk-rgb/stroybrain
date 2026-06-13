import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Контакты" },
      { name: "description", content: "Оставьте заявку — обсудим ваш проект." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Введите имя").max(100),
  email: z.string().trim().email("Некорректный email").max(255),
  phone: z.string().trim().min(3, "Введите телефон").max(50),
  subject: z.string().trim().min(1, "Введите тему").max(200),
  message: z.string().trim().min(1, "Напишите сообщение").max(5000),
});

function ContactPage() {
  const send = useServerFn(submitContact);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await send({ data: parsed.data });
      toast.success("Сообщение отправлено! Мы свяжемся с вами в течение 24 часов.");
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-6 max-w-7xl py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-primary-glow">Связаться</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gradient">Обсудим ваш проект</h1>
        <p className="mt-4 text-muted-foreground">
          Заполните форму — мы вернёмся с предложением и оценкой в течение 24 часов.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-10">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border/60 bg-gradient-card p-6 md:p-8 shadow-card space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Имя" name="name" error={errors.name} />
            <Field label="Email" name="email" type="email" error={errors.email} />
            <Field label="Телефон" name="phone" type="tel" error={errors.phone} />
            <Field label="Тема сообщения" name="subject" error={errors.subject} />
          </div>
          <div>
            <label className="text-sm font-medium">Сообщение</label>
            <textarea
              name="message"
              rows={5}
              className="mt-2 w-full rounded-lg border border-border bg-input/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-smooth disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? "Отправляем..." : "Отправить заявку"} <Send className="h-4 w-4" />
          </button>
        </form>

        <aside className="space-y-4">
          <InfoBlock icon={Mail} title="Email" value="odnpsk@gmail.com" />
          <InfoBlock icon={Phone} title="Телефон" value="8-919-904-98-70" />
        </aside>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", error,
}: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function InfoBlock({ icon: Icon, title, value }: { icon: any; title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-5 flex items-start gap-3">
      <div className="grid place-items-center h-10 w-10 rounded-lg bg-gradient-primary/30">
        <Icon className="h-5 w-5 text-primary-glow" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-sm font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}
