"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState(value);
  const armed = useRef(false);

  // Only animate numbers that start below the fold; ones already visible stay put.
  useEffect(() => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect && rect.top > window.innerHeight) {
      armed.current = true;
      setDisplay(0);
    }
  }, [reduce]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDisplay,
      onComplete: () => {
        armed.current = false;
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      <span aria-hidden className="tabular-nums">
        {formatNumber(display, decimals)}
      </span>
      <span className="sr-only">{formatNumber(value, decimals)}</span>
    </span>
  );
}
