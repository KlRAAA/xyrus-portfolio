import { stats } from "@/data/portfolio";
import { CountUp } from "@/components/motion/CountUp";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Numbers() {
  return (
    <section id="numbers" aria-labelledby="numbers-title" className="page-x py-24 md:py-36">
      <SectionHeading id="numbers-title" lines={["the numbers,", "from the projects."]} />
      <div className="mt-14 rounded-2xl border border-cream/10 bg-moss p-6 font-mono md:mt-20 md:p-10">
        <p className="text-sm text-sage" aria-hidden>
          $ npm test -- portfolio
        </p>
        <ul className="mt-6 divide-y divide-cream/10">
          {stats.map((s) => (
            <li
              key={s.label}
              className="grid grid-cols-[1.5rem_1fr] items-baseline gap-x-3 gap-y-1 py-5 md:grid-cols-[1.5rem_12rem_1fr] md:gap-x-6"
            >
              <span aria-hidden className="text-matcha">
                ✓
              </span>
              <span className="text-3xl text-cream md:text-5xl">
                <CountUp value={s.value} decimals={s.decimals} />
              </span>
              <span className="col-start-2 font-sans text-sage md:col-start-3">{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-matcha" aria-hidden>
          Tests: {stats.length} passed, {stats.length} total
        </p>
      </div>
    </section>
  );
}
