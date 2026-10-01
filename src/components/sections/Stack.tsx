import { stackGroups } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="page-x py-24 md:py-36">
      <SectionHeading id="stack-title" lines={["the tools", "i reach for."]} />
      <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-x-16">
        {stackGroups.map((g) => (
          <div key={g.title}>
            <h3 className="text-lg font-semibold">{g.title}</h3>
            <ul className="mt-5 flex flex-wrap gap-3">
              {g.items.map((t) => (
                <TechIcon key={t.name} name={t.name} icon={t.icon} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
