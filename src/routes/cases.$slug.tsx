import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { CaseDemoLink } from "@/components/case-demo-link";
import { getCase, cases, type CaseStudy } from "@/lib/cases";

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const c = getCase(params.slug);
    if (!c) throw notFound();
    return { caseStudy: c };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.caseStudy.title} — Кейсы` },
          { name: "description", content: loaderData.caseStudy.short },
          { property: "og:title", content: loaderData.caseStudy.title },
          { property: "og:description", content: loaderData.caseStudy.short },
          { property: "og:image", content: loaderData.caseStudy.image },
        ]
      : [],
  }),
  component: CaseDetail,
});

function CaseDetail() {
  const { caseStudy: c } = Route.useLoaderData() as { caseStudy: CaseStudy };
  const idx = cases.findIndex((x) => x.slug === c.slug);
  const next = cases[(idx + 1) % cases.length];

  return (
    <article>
      <div className="container mx-auto px-6 max-w-5xl pt-12">
        <Link to="/cases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Все кейсы
        </Link>
      </div>

      <header className="container mx-auto px-6 max-w-5xl pt-8 pb-12">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {c.tags.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gradient">{c.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{c.short}</p>

        {c.demoUrl && (
          <CaseDemoLink url={c.demoUrl} label={c.demoLabel} className="mt-6" />
        )}

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Meta label="Клиент" value={c.client} />
          <Meta label="Срок" value={c.duration} />
          <Meta label="Стек" value={c.stack.join(", ")} />
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-border/60 shadow-card">
          <img src={c.image} alt={c.title} width={1200} height={800} className="w-full" />
        </div>
        {c.demoUrl && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Живой демо-проект</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Откройте Telegram-бота и задайте вопрос по базе знаний.
              </p>
            </div>
            <CaseDemoLink url={c.demoUrl} label={c.demoLabel} />
          </div>
        )}
      </div>

      <section className="container mx-auto px-6 max-w-5xl py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Задача</h2>
          <p className="text-muted-foreground leading-relaxed">{c.challenge}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Решение</h2>
          <ul className="space-y-3">
            {c.solution.map((s) => (
              <li key={s} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {c.workflow && c.workflow.length > 0 && (
        <section className="container mx-auto px-6 max-w-5xl pb-16">
          <h2 className="text-2xl font-bold mb-2">Как работает RAG-система</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Ассистент ускоряет работу технической поддержки в 5 раз: за счёт кеширования
            запросов среднее время ответа уменьшается вдвое.
          </p>
          <ol className="space-y-3">
            {c.workflow.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-border/60 bg-surface/40 px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="container mx-auto px-6 max-w-5xl pb-16">
        <h2 className="text-2xl font-bold mb-6">Результаты</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {c.results.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card"
            >
              <div className="text-3xl font-bold text-gradient">{r.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-5xl pb-24">
        <div className="rounded-3xl border border-border/60 bg-gradient-card p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 shadow-card">
          <div>
            <h3 className="text-2xl font-bold">Похожая задача?</h3>
            <p className="text-muted-foreground mt-1">Расскажите, и мы предложим решение.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-smooth"
            >
              Обсудить <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/cases/$slug"
              params={{ slug: next.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm hover:bg-surface transition-smooth"
            >
              Следующий кейс
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
