import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  Link,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Возможно, она была перемещена или никогда не существовала.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-smooth"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-smooth"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Разработка сайтов, ботов и AI-решений" },
      {
        name: "description",
        content:
          "Студия разработки цифровых продуктов: корпоративные сайты, Telegram-боты, автоматизация CRM и AI-ассистенты.",
      },
      { property: "og:title", content: "Разработка сайтов, ботов и AI-решений" },
      {
        property: "og:description",
        content:
          "Студия разработки цифровых продуктов: корпоративные сайты, Telegram-боты, автоматизация CRM и AI-ассистенты.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Разработка сайтов, ботов и AI-решений" },
      {
        name: "twitter:description",
        content:
          "Студия разработки цифровых продуктов: корпоративные сайты, Telegram-боты, автоматизация CRM и AI-ассистенты.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f0390e84-2332-428d-b89b-ec2c7571f275/id-preview-684e8e56--390affa1-494a-4f28-9419-7d9c62b6bec8.lovable.app-1779127717141.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f0390e84-2332-428d-b89b-ec2c7571f275/id-preview-684e8e56--390affa1-494a-4f28-9419-7d9c62b6bec8.lovable.app-1779127717141.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <SiteHeader />
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
