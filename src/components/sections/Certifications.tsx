import { certifications } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="page-x py-24 md:py-36">
      <SectionHeading id="certifications-title" lines={["certified,", "and still learning."]} />
      <ul className="mt-14 md:mt-20">
        {certifications.map((c) => (
          <li
            key={c.name}
            className="grid gap-1 border-t border-cream/10 py-6 last:border-b md:grid-cols-[1fr_16rem_4rem] md:items-baseline md:gap-8"
          >
            <span className="text-xl font-semibold tracking-[-0.01em]">{c.name}</span>
            <span className="text-sage">{c.issuer}</span>
            <span className="font-mono text-sm text-sage md:text-right">{c.year}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
