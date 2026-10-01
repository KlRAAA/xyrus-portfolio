import { cn } from "@/lib/cn";

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-matcha/30 bg-ink/60 px-4 py-2 text-sm text-cream backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex size-2.5" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-matcha motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
        <span className="relative size-2.5 rounded-full bg-matcha" />
      </span>
      {children}
    </p>
  );
}
