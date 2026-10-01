"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -72 }, autoRaf: true });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
