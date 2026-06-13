import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="container mx-auto px-6 max-w-7xl py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-lg">Студия разработки</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Разработка цифровых продуктов: сайты, боты, AI и автоматизация.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="font-medium mb-3">Навигация</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Главная</Link></li>
            <li><Link to="/cases" className="hover:text-foreground">Кейсы</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Контакты</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Вход для админа</Link></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-3 text-foreground">Контакты</h4>
          <p>odnpsk@gmail.com</p>
          <p>8-919-904-98-70</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} — все права защищены
      </div>
    </footer>
  );
}
