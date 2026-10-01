import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement } from "react";

// Render next/image as a plain <img>, dropping Next-only props.
const nextOnly = new Set(["fill", "priority", "sizes"]);
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    createElement("img", Object.fromEntries(Object.entries(props).filter(([k]) => !nextOnly.has(k)))),
}));

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IO });
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  }),
});
