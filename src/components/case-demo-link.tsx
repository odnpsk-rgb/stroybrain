import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type CaseDemoLinkProps = {
  url: string;
  label?: string;
  className?: string;
  variant?: "button" | "inline";
};

export function CaseDemoLink({ url, label, className, variant = "button" }: CaseDemoLinkProps) {
  const text = label ?? url;

  if (variant === "inline") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline",
          className,
        )}
      >
        {text}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-smooth",
        className,
      )}
    >
      Попробовать бота
      <ExternalLink className="h-4 w-4" />
      <span className="opacity-90">{text}</span>
    </a>
  );
}
