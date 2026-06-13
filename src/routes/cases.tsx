import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CaseDemoLink } from "@/components/case-demo-link";
import { cases } from "@/lib/cases";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Кейсы" },
      { name: "description", content: "Истории наших проектов: боты, сайты, CRM и AI." },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  return (
    <section className="container mx-auto px-6 max-w-7xl py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-primary-glow">Портфолио</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gradient">Наши кейсы</h1>
        <p className="mt-4 text-muted-foreground">
          Подборка проектов, в которых мы решали реальные бизнес-задачи — от автоматизации до AI.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {cases.map((c) => (
          <div
            key={c.slug}
            className="group rounded-2xl border border-border/60 bg-gradient-card overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition-smooth"
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
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 text-muted-foreground">{c.short}</p>
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
  );
}
