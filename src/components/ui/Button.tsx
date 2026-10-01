import { cn } from "@/lib/cn";
import { ArrowDown, ArrowUpRight } from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: "external" | "download" | "none";
  external?: boolean;
  download?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", icon = "external", external, download, className }: Props) {
  const primary = variant === "primary";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-semibold",
        "transition duration-200 ease-out hover:-translate-y-0.5 hover:duration-300 focus-visible:-translate-y-0.5",
        primary
          ? "bg-matcha-deep text-cream hover:text-ink hover:shadow-[0_12px_32px_-12px_rgb(127_163_90/0.7)] focus-visible:text-ink"
          : "border border-cream/25 text-cream hover:border-matcha focus-visible:border-matcha",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full transition-transform duration-200 ease-out group-hover:translate-x-0 group-hover:duration-300 group-focus-visible:translate-x-0",
          primary ? "bg-gradient-to-r from-matcha to-matcha-light" : "bg-matcha/15",
        )}
      />
      <span className="relative">{children}</span>
      {icon === "external" && (
        <ArrowUpRight className="relative size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
      {icon === "download" && (
        <ArrowDown className="relative size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
      )}
    </a>
  );
}
