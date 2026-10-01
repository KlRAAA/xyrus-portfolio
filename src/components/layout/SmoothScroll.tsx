"use client";
import type Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/use-in-view-once";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let lenis: Lenis | null = null;
    let cancelled = false;
    // Load and start Lenis once the page is idle so it stays off the critical path.
    const start = () =>
      import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        lenis = new LenisCtor({ duration: 1.1, anchors: { offset: -72 }, autoRaf: true });
        setLenis(lenis);
      });
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = idle(start);
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
