import { contrastRatio, iconColorOnInk } from "@/lib/color";

it("computes WCAG contrast", () => {
  expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  expect(contrastRatio("#F2EFE3", "#0F120D")).toBeGreaterThan(16);
});
it("keeps brand colors that read on ink", () => expect(iconColorOnInk("7FA35A")).toBe("#7FA35A"));
it("swaps dark brand colors for cream", () => expect(iconColorOnInk("000000")).toBe("#F2EFE3"));
