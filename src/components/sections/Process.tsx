"use client";
import { motion, useReducedMotion } from "motion/react";
import { processSteps } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const reduce = useReducedMotion();
  return (
    <section id="process" aria-labelledby="process-title" className="page-x py-24 md:py-36">
      <SectionHeading id="process-title" lines={["how a feature gets", "from idea to shipped."]} />
      <div className="relative mt-16 md:mt-20">
        {/* The connecting line: vertical on small screens, horizontal from lg. */}
        <motion.span
          aria-hidden
          className="absolute top-0 bottom-0 left-[0.6rem] w-px origin-top bg-matcha/50 lg:top-[0.6rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
          initial={reduce ? false : { scaleX: 0, scaleY: 0 }}
          whileInView={{ scaleX: 1, scaleY: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.2, ease }}
        />
        <ol className="grid gap-10 lg:grid-cols-5 lg:gap-8">
          {processSteps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative pl-10 lg:pt-12 lg:pl-0"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.15 + i * 0.18 }}
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
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
