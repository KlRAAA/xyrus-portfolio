import { cn } from "@/lib/cn";

export function SectionHeading({ id, lines, className }: { id: string; lines: [string, string]; className?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "max-w-[18ch] text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.035em] wdth-85",
        className,
      )}
    >
      <span className="block">{lines[0]}</span>
      <span className="block">{lines[1]}</span>
    </h2>
  );
}
