import { capabilities } from "@/data/portfolio";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="page-x py-24 md:py-36">
      <SectionHeading id="capabilities-title" lines={["what i do,", "and what i use to do it."]} />
      <div className="mt-16 md:mt-20">
        {capabilities.map((c) => (
          <div key={c.title} className="grid gap-4 border-t border-cream/10 py-8 md:grid-cols-12 md:gap-10 md:py-10">
            <h3 className="text-2xl leading-tight font-bold tracking-[-0.02em] md:col-span-5 md:text-3xl">{c.title}</h3>
            <div className="md:col-span-7">
              <p className="max-w-[56ch] text-sage">{c.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${c.title} tools`}>
                {c.tools.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
