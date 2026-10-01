import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ProjectImage } from "@/components/ui/ProjectImage";

export function ProjectRow({ project, reversed }: { project: Project; reversed: boolean }) {
  const { title, slug, status, period, pitch, bullets, stack, links, image, featured } = project;
  const primary = links[0];
  const shortTitle = title.split(":")[0];
  return (
    <article className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      {/* Duplicate of the primary link for pointer users; hidden from keyboard and screen readers. */}
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        className={cn(featured ? "lg:col-span-7" : "lg:col-span-6", reversed && "lg:order-2")}
      >
        <ProjectImage title={title} slug={slug} image={image} />
      </a>
      <div className={featured ? "lg:col-span-5" : "lg:col-span-6"}>
        <p className="text-sm text-sage">
          {status}, {period}
        </p>
        <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-bold tracking-[-0.025em] transition-transform duration-300 ease-soft group-hover:translate-x-1">
          {title}
        </h3>
        <p className="mt-3 max-w-[52ch] text-lg text-cream/90">{pitch}</p>
        <ul className="mt-5 max-w-[60ch] space-y-2.5 text-sage">
          {bullets.map((b) => (
            <li
              key={b}
              className="relative pl-5 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-matcha"
            >
              {b}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${shortTitle} tech stack`}>
          {stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </ul>
        <div className="mt-7 flex gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${shortTitle} ${l.label.toLowerCase()}`}
              className="group/link inline-flex items-center gap-1.5 font-semibold text-matcha transition-colors hover:text-matcha-light"
            >
              {l.label}
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
