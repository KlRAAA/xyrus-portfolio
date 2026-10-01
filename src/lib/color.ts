const INK = "#0F120D";
const CREAM = "#F2EFE3";

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Brand color if it reaches 3:1 (non-text contrast) on ink, otherwise cream. */
export function iconColorOnInk(hex: string): string {
  const withHash = `#${hex.replace("#", "").toUpperCase()}`;
  return contrastRatio(withHash, INK) >= 3 ? withHash : CREAM;
}
