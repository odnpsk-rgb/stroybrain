import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/cases", label: "Кейсы" },
  { to: "/contact", label: "Контакты" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth",
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border/60"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="На главную">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg">Студия разработки</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-smooth rounded-md"
              activeProps={{ className: "text-foreground bg-secondary/60" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-smooth"
          >
            Обсудить проект
          </Link>
        </nav>

        <button
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md hover:bg-secondary/60"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                activeProps={{ className: "text-foreground bg-secondary/60" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
