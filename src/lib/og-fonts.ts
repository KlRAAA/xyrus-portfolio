import { readFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "node_modules/@fontsource/bricolage-grotesque/files");

/** Bricolage Grotesque for generated images (OG card, icons). Satori needs woff, not woff2. */
export async function ogFonts() {
  const [bold, medium] = await Promise.all([
    readFile(path.join(dir, "bricolage-grotesque-latin-800-normal.woff")),
    readFile(path.join(dir, "bricolage-grotesque-latin-500-normal.woff")),
  ]);
  return [
    { name: "Bricolage", data: bold, weight: 800, style: "normal" },
    { name: "Bricolage", data: medium, weight: 500, style: "normal" },
  ] as const;
}
