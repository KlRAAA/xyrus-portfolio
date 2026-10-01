import { formatNumber } from "@/lib/format";

it("adds thousands separators", () => expect(formatNumber(10040)).toBe("10,040"));
it("keeps fixed decimals", () => expect(formatNumber(0.826, 3)).toBe("0.826"));
it("pads decimals at zero", () => expect(formatNumber(0, 3)).toBe("0.000"));
it("rounds mid-animation values", () => expect(formatNumber(113.6)).toBe("114"));
