/** Line drawings for project covers, one per project, drawn from what each project does. */
const motifs: Record<string, React.ReactNode> = {
  // Two routes converging into a shared ride.
  "rideshare-eu": (
    <>
      <path d="M8 86 C40 86 52 52 84 50" strokeDasharray="3 5" />
      <path d="M8 18 C40 18 52 48 84 50" strokeDasharray="3 5" />
      <path d="M84 50 H152" />
      <circle cx="8" cy="86" r="3" />
      <circle cx="8" cy="18" r="3" />
      <circle cx="84" cy="50" r="4.5" className="fill-matcha stroke-none" />
      <circle cx="152" cy="50" r="3" />
    </>
  ),
  // A stack of flashcards.
  kodigo: (
    <>
      <rect x="44" y="30" width="78" height="50" rx="6" transform="rotate(-10 83 55)" />
      <rect x="44" y="26" width="78" height="50" rx="6" transform="rotate(-3 83 51)" />
      <rect x="48" y="22" width="78" height="50" rx="6" className="fill-moss" />
      <path d="M60 40 H104 M60 50 H92" />
    </>
  ),
  // A ranked bar chart of skills.
  skillscope: (
    <>
      <path d="M20 88 H150" />
      {[62, 50, 41, 30, 24, 16].map((h, i) => (
        <rect key={h} x={30 + i * 20} y={88 - h} width="10" height={h} rx="2" className={i === 0 ? "fill-matcha stroke-none" : undefined} />
      ))}
    </>
  ),
  // A timer ring, mostly filled.
  webtracker: (
    <>
      <circle cx="96" cy="50" r="34" strokeOpacity="0.35" />
      <path d="M96 16 A34 34 0 1 1 62.6 56" className="stroke-matcha" strokeWidth="3" />
      <path d="M96 50 V30 M96 50 L110 58" />
    </>
  ),
};

export function CoverMotif({ slug }: { slug: string }) {
  const motif = motifs[slug];
  if (!motif) return null;
  return (
    <svg
      viewBox="0 0 160 100"
      aria-hidden
      className="absolute top-1/2 right-[6%] w-[52%] -translate-y-1/2 fill-none stroke-matcha-light/45"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {motif}
    </svg>
  );
}
