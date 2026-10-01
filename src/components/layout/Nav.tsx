"use client";
import { useEffect, useRef, useState } from "react";
import { navSections, site } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenis";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const ids = navSections.map((s) => s.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    getLenis()?.start();
    setOpen(false);
  };

  const linkClass = (id: string) =>
    cn(
      "relative py-1 transition-colors duration-200 hover:text-cream focus-visible:text-cream",
      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-matcha after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100",
      active === id ? "text-cream after:scale-x-100" : "text-sage",
    );

  return (
    <header className="intro-fade fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 border-b border-cream/5 bg-ink/75 backdrop-blur-md transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav aria-label="Main" className="page-x relative flex h-16 items-center justify-between">
        <a href="#top" onClick={close} className="relative z-10 text-2xl font-extrabold tracking-[-0.04em] wdth-75" aria-label="Xyrus Dimacali, back to top">
          xd<span className="text-matcha">.</span>
        </a>
        <ul className="hidden items-center gap-7 text-[0.9375rem] md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={linkClass(s.id)} aria-current={active === s.id ? "true" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              className="rounded-full border border-cream/25 px-4 py-1.5 text-cream transition-colors duration-200 hover:border-matcha hover:bg-matcha/15 focus-visible:border-matcha"
            >
              Résumé
            </a>
          </li>
        </ul>
        <button
          ref={buttonRef}
          type="button"
          className="relative z-10 rounded-full border border-cream/25 px-4 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      <div id="mobile-menu" hidden={!open} className="fixed inset-0 bg-ink pt-24 md:hidden">
        <ul className="page-x flex flex-col gap-2">
          {navSections.map((s, i) => (
            <li key={s.id}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={`#${s.id}`}
                onClick={close}
                className="block py-2 text-4xl font-bold tracking-[-0.03em] wdth-85"
              >
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li className="mt-6">
            <a href={site.resume} onClick={close} className="text-lg text-matcha underline underline-offset-4">
              Download résumé
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
