import Image from "next/image";
import { site } from "@/data/portfolio";
import { Pill } from "@/components/ui/Pill";

export function Hero() {
  return (
    <section id="top" className="relative isolate flex h-svh min-h-[640px] flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_42%,rgb(63_90_46/0.5),transparent_72%)]"
      />

      <h1 className="pointer-events-none absolute inset-x-0 top-[19svh] text-center md:top-[16svh] lg:top-[11svh]">
        <span
          aria-hidden
          className="intro-rise block bg-gradient-to-b from-matcha-light/85 via-matcha/75 to-matcha-deep/60 bg-clip-text text-[min(30vw,34rem)] leading-[0.8] font-extrabold tracking-[-0.045em] text-transparent wdth-75 [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] lg:text-[min(34vw,40rem)]"
        >
          {site.displayName}
        </span>
        <span className="sr-only">
          {site.shortName}, {site.role.toLowerCase()}
        </span>
      </h1>

      {/* Phones: lifted so the head overlaps the name and the tagline sits below the face.
          Desktop: scaled up with the shoulders running off the bottom edge for a closer crop. */}
      <div className="pointer-events-none absolute bottom-[21svh] left-1/2 w-[118vw] -translate-x-1/2 md:bottom-0 md:w-[min(100vw,80svh,780px)] lg:-bottom-[18svh] lg:w-[min(118vw,108svh,1180px)]">
        {/* Soft shadow cast onto the name. A gradient, not a filter: filters on a large image delay first paint. */}
        <div
          aria-hidden
          className="absolute inset-x-[14%] top-[4%] bottom-[18%] translate-y-[5%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.55),transparent)]"
        />
        <div className="intro-portrait relative aspect-square [mask-image:linear-gradient(to_bottom,black_72%,transparent)] md:[mask-image:none]">
          <Image
            src="/images/portrait.png"
            alt="Portrait of Xyrus Dimacali"
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 768px) 118vw, (max-width: 1024px) 780px, 1180px"
            className="object-contain object-bottom"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t md:h-[42%] lg:h-[32%] from-ink via-ink/85 to-transparent"
      />

      <div className="page-x relative w-full pt-20 md:pt-24">
        <div className="flex justify-end">
          <Pill className="intro-fade">{site.availability}</Pill>
        </div>
      </div>

      <div className="page-x relative mt-auto grid w-full gap-6 pb-8 md:pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <p className="max-w-[18ch] text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em] wdth-85">
          {site.tagline.map((line, i) => (
            <span key={line} className="intro-line block" style={{ "--i": i } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </p>
        <div className="intro-fade flex items-end justify-between gap-6 text-sm text-sage lg:flex-col lg:items-end">
          <p className="max-w-[28ch] lg:text-right">{site.location}</p>
          <a href="#work" className="inline-flex items-center gap-1.5 text-cream transition-colors hover:text-matcha">
            Scroll <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
