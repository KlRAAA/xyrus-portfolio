import { iconColorOnInk } from "@/lib/color";
import { techIcons, type IconDef, type TechIconKey } from "@/lib/tech-icons";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TechIcon({ name, icon }: { name: string; icon: TechIconKey }) {
  const def: IconDef = techIcons[icon];
  return (
    <li
      className="group/icon relative flex size-14 items-center justify-center rounded-xl border border-cream/10 bg-moss text-sage/70 transition duration-200 ease-out hover:-translate-y-1 hover:border-cream/20 hover:text-(--brand) hover:duration-300"
      style={{ "--brand": iconColorOnInk(def.hex) } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-7" {...(def.stroke ? strokeProps : { fill: "currentColor" })}>
        <path d={def.stroke ?? def.path} />
      </svg>
      <span className="sr-only">{name}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-9 left-1/2 z-10 -translate-x-1/2 -translate-y-1 rounded-md bg-cream px-2 py-1 text-xs whitespace-nowrap text-ink opacity-0 transition duration-200 group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
      >
        {name}
      </span>
    </li>
  );
}
