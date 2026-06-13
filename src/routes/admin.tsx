import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, MailOpen, Trash2, LogOut, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { ContactMessage } from "@/lib/db";
import { logout } from "@/lib/auth.functions";
import { getAdminData, markMessageRead, deleteMessage } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Админ-панель" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchAdmin = useServerFn(getAdminData);
  const doLogout = useServerFn(logout);
  const doMark = useServerFn(markMessageRead);
  const doDelete = useServerFn(deleteMessage);

  const admin = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => fetchAdmin(),
    retry: 1,
  });

  useEffect(() => {
    if (admin.isSuccess && !admin.data.authenticated) {
      navigate({ to: "/login" });
    }
  }, [admin.isSuccess, admin.data, navigate]);

  const handleLogout = async () => {
    await doLogout();
    navigate({ to: "/login" });
  };

  if (admin.isLoading || (admin.isSuccess && !admin.data.authenticated)) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-glow" />
      </div>
    );
  }

  if (admin.isError) {
    return (
      <div className="container mx-auto px-6 max-w-lg py-24 text-center">
        <h1 className="text-xl font-semibold">Не удалось загрузить заявки</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {admin.error instanceof Error ? admin.error.message : "Ошибка сервера"}
        </p>
        <button
          onClick={() => admin.refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface transition-smooth"
        >
          <RefreshCw className="h-4 w-4" /> Повторить
        </button>
      </div>
    );
  }

  const list = admin.data?.messages ?? [];
  const unread = list.filter((m) => !m.is_read).length;

  const toggleRead = async (id: string, current: boolean) => {
    try {
      await doMark({ data: { id, is_read: !current } });
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    } catch {
      toast.error("Не удалось обновить");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    try {
      await doDelete({ data: { id } });
      toast.success("Заявка удалена");
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  return (
    <section className="container mx-auto px-6 max-w-7xl py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary-glow">Админ-панель</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Обращения</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Всего: {list.length} · Непрочитанных: {unread}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => admin.refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface transition-smooth"
          >
            <RefreshCw className="h-4 w-4" /> Обновить
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface transition-smooth"
          >
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-card shadow-card overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Пока нет обращений</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-border/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3">Имя</th>
                  <th className="px-4 py-3">Контакты</th>
                  <th className="px-4 py-3">Тема и сообщение</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3 w-32 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m: ContactMessage) => (
                  <tr
                    key={m.id}
                    className={`border-b border-border/30 hover:bg-surface/40 transition-smooth ${!m.is_read ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-4 py-4 align-top">
                      {m.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary-glow" />
                      )}
                    </td>
                    <td className="px-4 py-4 align-top font-medium">{m.name}</td>
                    <td className="px-4 py-4 align-top text-muted-foreground">
                      <div>{m.email}</div>
                      <div className="text-xs">{m.phone}</div>
                    </td>
                    <td className="px-4 py-4 align-top max-w-md">
                      <div className="font-medium">{m.subject}</div>
                      <div className="text-muted-foreground text-xs mt-1 line-clamp-3 whitespace-pre-wrap">
                        {m.message}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(m.created_at).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => toggleRead(m.id, m.is_read)}
                          title={m.is_read ? "Отметить непрочитанным" : "Отметить прочитанным"}
                          className="p-2 rounded-md hover:bg-secondary transition-smooth"
                        >
                          <Check
                            className={`h-4 w-4 ${m.is_read ? "text-muted-foreground" : "text-primary-glow"}`}
                          />
                        </button>
                        <button
                          onClick={() => remove(m.id)}
                          title="Удалить"
                          className="p-2 rounded-md hover:bg-destructive/20 hover:text-destructive transition-smooth"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
