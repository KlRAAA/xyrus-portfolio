import Image from "next/image";
import { CoverMotif } from "./CoverMotif";
import { ArrowUpRight } from "./Icons";

export function ProjectImage({ title, slug, image }: { title: string; slug: string; image?: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-moss ring-1 ring-cream/10">
      <div className="absolute inset-0 transition-transform duration-500 ease-soft group-hover:scale-105">
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
        ) : (
          // Cover shown until a screenshot is added in src/data/portfolio.ts.
          <div className="relative flex h-full flex-col justify-between bg-[radial-gradient(80%_90%_at_85%_100%,rgb(127_163_90/0.3),transparent_65%),radial-gradient(60%_60%_at_0%_0%,rgb(63_90_46/0.5),transparent_70%)] p-6 md:p-8">
            <CoverMotif slug={slug} />
            <span className="relative font-mono text-sm text-sage">~/{slug}</span>
            <span className="relative text-[clamp(2.5rem,6vw,5rem)] leading-[0.85] font-extrabold tracking-[-0.04em] text-cream wdth-75">
              {title.split(":")[0]}
            </span>
          </div>
        )}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_80px_-20px_rgb(127_163_90/0.5)] ring-1 ring-matcha/70 ring-inset transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="absolute top-4 right-4 flex size-10 translate-x-2 -translate-y-2 items-center justify-center rounded-full bg-cream text-ink opacity-0 transition duration-300 ease-soft group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowUpRight className="size-5" />
      </span>
    </div>
  );
}
