import Image from "next/image";
import { about } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-matcha-milk text-ink">
      <div className="page-x grid gap-12 pt-24 md:pt-36 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 lg:pb-36">
          <SectionHeading id="about-title" lines={about.headline} />
          <div className="mt-10 max-w-[62ch] space-y-5 text-lg text-ink/85">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-ink/15 pt-8 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-matcha-deep">{f.label}</dt>
                <dd className="mt-1 font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-sm self-end lg:col-span-5 lg:max-w-[34rem]">
          <Image
            src="/images/about.png"
            alt="Xyrus Dimacali in a hockey jersey, looking to the side"
            width={500}
            height={745}
            sizes="(max-width: 1024px) 384px, 544px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
