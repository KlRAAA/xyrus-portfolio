"use client";
import { processSteps } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { useInViewOnce } from "@/lib/use-in-view-once";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <section id="process" aria-labelledby="process-title" className="page-x py-24 md:py-36">
      <SectionHeading id="process-title" lines={["how a feature gets", "from idea to shipped."]} />
      <div ref={ref} className="relative mt-16 md:mt-20">
        {/* The connecting line: vertical on small screens, horizontal from lg. Draws once in view. */}
        <span
          aria-hidden
          className={cn(
            "absolute top-0 bottom-0 left-[0.6rem] w-px origin-top bg-matcha/50 transition-transform duration-[1200ms] ease-soft motion-reduce:transition-none",
            "lg:top-[0.6rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left",
            inView ? "scale-100" : "scale-y-0 lg:scale-x-0 lg:scale-y-100 motion-reduce:scale-100",
          )}
        />
        <ol className="grid gap-10 lg:grid-cols-5 lg:gap-8">
          {processSteps.map((s, i) => (
            <li
              key={s.title}
              style={{ transitionDelay: `${150 + i * 180}ms` }}
              className={cn(
                "relative pl-10 transition duration-[600ms] ease-soft motion-reduce:transition-none lg:pt-12 lg:pl-0",
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
              )}
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 flex size-5 items-center justify-center rounded-full bg-ink ring-1 ring-matcha"
              >
                <span className="size-1.5 rounded-full bg-matcha" />
              </span>
              <span className="font-mono text-sm text-matcha">{i + 1}</span>
              <h3 className="mt-1 text-2xl font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 max-w-[30ch] text-sage">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
