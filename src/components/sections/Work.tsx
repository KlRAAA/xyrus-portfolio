import { projects } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectRow } from "./ProjectRow";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="page-x py-24 md:py-36">
      <SectionHeading id="work-title" lines={["things i've built", "and tested."]} />
      <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
        {projects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
