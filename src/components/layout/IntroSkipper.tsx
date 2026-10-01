"use client";
import { useEffect } from "react";

/** Any input during the intro jumps straight to the end state. */
export function IntroSkipper() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "skip") return;
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    const skip = () => {
      root.dataset.intro = "skip";
      cleanup();
    };
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, skip));
      clearTimeout(timer);
    };
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const timer = window.setTimeout(cleanup, 1300);
    return cleanup;
  }, []);
  return null;
}
