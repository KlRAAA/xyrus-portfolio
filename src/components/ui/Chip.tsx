export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-md border border-cream/10 px-2.5 py-1 font-mono text-[0.8125rem] text-sage">{children}</li>
  );
}
