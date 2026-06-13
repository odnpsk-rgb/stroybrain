import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Building2, Cpu, LineChart, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { CaseDemoLink } from "@/components/case-demo-link";
import { cases } from "@/lib/cases";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Сайты, боты и AI-решения под ключ" },
      {
        name: "description",
        content:
          "Разрабатываем цифровые продукты, которые приносят клиентов и экономят время команды.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Bot, label: "Telegram-боты и автоматизация" },
  { icon: Building2, label: "Корпоративные сайты" },
  { icon: LineChart, label: "CRM-интеграции и аналитика" },
  { icon: Cpu, label: "AI-ассистенты на базе GPT" },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            width={1600}
            height={1024}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
              Студия разработки полного цикла
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] text-gradient">
              Цифровые продукты, которые работают на результат
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Создаём сайты, Telegram-ботов, CRM-автоматизации и AI-ассистенты для бизнеса.
              От первой идеи до запуска и поддержки.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-smooth"
              >
                Обсудить проект <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cases"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-surface transition-smooth"
              >
                Посмотреть кейсы
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl border border-border/60 bg-surface/40 backdrop-blur p-4 hover:border-primary/50 hover:bg-surface/70 transition-smooth"
                >
                  <f.icon className="h-5 w-5 text-primary-glow" />
                  <p className="mt-3 text-sm">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="container mx-auto px-6 max-w-7xl py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-glow">Кейсы</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Что мы делаем</h2>
          </div>
          <Link to="/cases" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Все кейсы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <div
              key={c.slug}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card shadow-card hover:shadow-glow hover:-translate-y-1 transition-smooth ${
                i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
            >
              <Link to="/cases/$slug" params={{ slug: c.slug }} className="block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary-glow group-hover:gap-2 transition-smooth">
                    Подробнее <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
              {c.demoUrl && (
                <div className="px-6 pb-6 pt-0">
                  <CaseDemoLink url={c.demoUrl} label={c.demoLabel} variant="inline" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-10 md:p-16 text-center shadow-card">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">Готовы начать проект?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Расскажите о задаче — предложим решение и оценим бюджет в течение 24 часов.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-smooth"
            >
              Перейти к форме <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
