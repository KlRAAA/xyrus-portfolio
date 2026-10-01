import { act, render } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { CountUp } from "@/components/motion/CountUp";

type Entry = { isIntersecting: boolean; boundingClientRect: { top: number } };
let report: (entries: Entry[]) => void = () => {};
const RealIO = window.IntersectionObserver;

afterEach(() => {
  vi.useRealTimers();
  window.IntersectionObserver = RealIO;
});

function setup(value: number, decimals?: number) {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  window.IntersectionObserver = class {
    constructor(cb: (entries: Entry[]) => void) {
      report = cb;
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  const { container } = render(<CountUp value={value} decimals={decimals} />);
  return () => container.querySelector("[aria-hidden]")!.textContent;
}

it("starts below the fold at zero and lands on the exact value", () => {
  const shown = setup(10040);
  act(() => report([{ isIntersecting: false, boundingClientRect: { top: 2000 } }]));
  expect(shown()).toBe("0");
  act(() => report([{ isIntersecting: true, boundingClientRect: { top: 400 } }]));
  act(() => vi.advanceTimersByTime(700));
  expect(shown()).not.toBe("10,040");
  act(() => vi.advanceTimersByTime(1000));
  expect(shown()).toBe("10,040");
});

it("finishes on the exact value even after frames pause mid-count", () => {
  const shown = setup(0.826, 3);
  act(() => report([{ isIntersecting: false, boundingClientRect: { top: 2000 } }]));
  act(() => report([{ isIntersecting: true, boundingClientRect: { top: 400 } }]));
  act(() => vi.advanceTimersByTime(16 * 3));
  // Simulate a backgrounded tab: the clock moves on while no frames run, then one frame fires.
  act(() => {
    vi.setSystemTime(Date.now() + 5000);
    vi.advanceTimersByTime(5000);
  });
  expect(shown()).toBe("0.826");
});

it("leaves numbers that are already on screen alone", () => {
  const shown = setup(114);
  act(() => report([{ isIntersecting: true, boundingClientRect: { top: 300 } }]));
  expect(shown()).toBe("114");
});
