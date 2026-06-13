import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/auth.functions";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Вход" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const doLogin = useServerFn(login);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    if (!email || password.length < 6) {
      toast.error("Введите email и пароль (от 6 символов)");
      return;
    }
    setLoading(true);
    try {
      await doLogin({ data: { email, password } });
      toast.success("Вход выполнен");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-6 max-w-md py-24">
      <div className="rounded-2xl border border-border/60 bg-gradient-card p-8 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid place-items-center h-10 w-10 rounded-lg bg-gradient-primary shadow-glow">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Вход</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Админ-панель. Учётные данные задаются в переменных окружения сервера.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Пароль</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-smooth disabled:opacity-60"
          >
            {loading ? "..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
}
