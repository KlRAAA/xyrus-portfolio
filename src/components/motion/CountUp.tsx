"use client";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { prefersReducedMotion } from "@/lib/use-in-view-once";

const DURATION = 1400;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    let armed = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        setDisplay(value * easeOutExpo(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    // The observer's first report says where the number starts: only ones below the fold count up.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!armed) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) return obs.disconnect();
          armed = true;
          setDisplay(0);
          return;
        }
        if (entry.isIntersecting) {
          obs.disconnect();
          run();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span aria-hidden className="tabular-nums">
        {formatNumber(display, decimals)}
      </span>
      <span className="sr-only">{formatNumber(value, decimals)}</span>
    </span>
  );
}
