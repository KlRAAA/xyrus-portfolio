# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Xyrus Dimacali's single-page portfolio (Next.js) exactly as described in the design spec, starting with the hero for an early look check.

**Architecture:** Next.js App Router site with one page composed of section components. All copy lives in a typed data file (`src/data/portfolio.ts`); components only render it. The hero's load sequence is pure CSS keyed off a `data-intro` attribute set by an inline head script (so it never causes hydration mismatches and replays only once per session); `motion` drives the few scroll-linked effects; Lenis handles smooth scrolling.

**Tech Stack:** Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4, `motion` 13, `lenis` 1.3, `simple-icons` 16, Vitest + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-10-01-portfolio-design.md`

## Global Constraints

- Colors only from tokens: ink `#0F120D`, moss `#171C14`, matcha-deep `#3F5A2E`, matcha `#7FA35A`, matcha-light `#B9CF8F`, cream `#F2EFE3`, sage `#9AA391`, matcha-milk `#E3E9D2`.
- `matcha` is never text on a light background.
- Gradients only in: hero name, contact glow, button hover fill (plus the scroll progress bar).
- Fonts: Bricolage Grotesque (display + body), Geist Mono (code-like data only). No mono section labels, no all-caps labels, no `A · B · C` strings, no eyebrow labels over headings.
- Headlines lowercase, two lines, no single accented word.
- Numbers only in the Process section.
- No custom cursor, magnetic buttons, tilt, cursor spotlights, or per-section fade-up.
- Animate only `transform` and `opacity` (single exception: the portrait's one-time blur-in on load).
- Hover in 200–300ms ease-out, faster out; keyboard focus gets the same treatment as hover.
- `prefers-reduced-motion`: fades or nothing; Lenis off.
- Intro ≤ 1.2s, once per session, skippable by any key, click, wheel or touch.
- Never publish a phone number or home address.
- Responsive at 375, 768, 1280, 1536px; 20px minimum side gutter on mobile; no horizontal scroll.
- Commits authored as `Xyrus <xyrusdimacali@gmail.com>`, no AI trailers.

## File map

```
src/app/layout.tsx              fonts, metadata, intro head script, SmoothScroll, IntroSkipper
src/app/page.tsx                composes sections
src/app/globals.css             Tailwind import, @theme tokens, utilities, intro keyframes
src/app/opengraph-image.tsx     generated OG card
src/app/icon.tsx                "xd" favicon
src/app/apple-icon.tsx          180px touch icon
src/data/portfolio.ts           all content + types
src/lib/cn.ts                   class name joiner
src/lib/format.ts               formatNumber
src/lib/color.ts                contrastRatio, iconColorOnInk
src/lib/lenis.ts                shared Lenis instance getter/setter
src/lib/tech-icons.ts           icon registry (simple-icons + 1 custom)
src/components/layout/          Nav, ScrollProgress, SmoothScroll, IntroSkipper
src/components/motion/          CountUp
src/components/ui/              Button, Pill, Chip, Icons, ProjectImage, SectionHeading, TechIcon
src/components/sections/        Hero, Work, ProjectRow, About, Capabilities, Process, Numbers, Stack, Certifications, Contact, Footer
tests/                          vitest specs + setup
public/images/portrait.png      hero cut-out
public/images/about.png         jersey cut-out, cropped
```

Note vs. spec: `Reveal` and `SplitText` helpers are dropped (YAGNI). With per-section reveals removed, the only staged motion is the hero (CSS) and Process (inline `motion`).

---

### Task 1: Scaffold, tooling, tokens and assets

**Files:**
- Create: Next.js scaffold (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/*`)
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/smoke.test.ts`
- Replace: `src/app/globals.css`
- Create: `public/images/portrait.png`, `public/images/about.png`, `.claude/launch.json`

**Interfaces:**
- Produces: Tailwind utilities `bg-ink`, `text-cream`, `text-sage`, `bg-moss`, `bg-matcha-milk`, `text-matcha`, `matcha-deep`, `matcha-light`, `font-mono`, `ease-soft`, custom utilities `page-x`, `wdth-75`, `wdth-85`; intro classes `intro-rise`, `intro-portrait`, `intro-fade`, `intro-line` (uses `--i`); keyframe `pulse-ring`.

- [ ] **Step 1: Scaffold into a temp folder and move it in** (folder already has `docs/`, `.gitignore`, `New folder/`)

```bash
npx create-next-app@latest scaffold-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cp -r scaffold-tmp/. . && rm -rf scaffold-tmp
cat >> .gitignore <<'EOF'
New folder/
EOF
rm -f src/app/favicon.ico public/*.svg
npm i motion lenis simple-icons
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

(The scaffold's `.gitignore` overwrites ours, so re-append `New folder/`.)

- [ ] **Step 2: Vitest config**

`vitest.config.ts`
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"], globals: true },
});
```

`tests/setup.ts`
```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement } from "react";

vi.mock("next/image", () => ({
  default: ({ src, alt, fill: _fill, priority: _priority, sizes: _sizes, ...rest }: Record<string, unknown>) =>
    createElement("img", { src, alt, ...rest }),
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
```

`tests/smoke.test.ts`
```ts
it("runs", () => expect(1 + 1).toBe(2));
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Run tests** — `npm test` → 1 passed.

- [ ] **Step 4: Tokens and base CSS** — replace `src/app/globals.css`:

```css
@import "tailwindcss";
@import "lenis/dist/lenis.css";

@theme {
  --color-ink: #0f120d;
  --color-moss: #171c14;
  --color-matcha-deep: #3f5a2e;
  --color-matcha: #7fa35a;
  --color-matcha-light: #b9cf8f;
  --color-cream: #f2efe3;
  --color-sage: #9aa391;
  --color-matcha-milk: #e3e9d2;

  --font-sans: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;

  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}

@utility page-x {
  margin-inline: auto;
  max-width: 90rem;
  padding-inline: 1.25rem;
  @media (width >= 48rem) { padding-inline: 2.5rem; }
  @media (width >= 80rem) { padding-inline: 4rem; }
}
@utility wdth-75 { font-variation-settings: "wdth" 75; }
@utility wdth-85 { font-variation-settings: "wdth" 85; }

@layer base {
  html {
    background: var(--color-ink);
    color: var(--color-cream);
    color-scheme: dark;
  }
  body {
    font-family: var(--font-sans);
    font-size: 1.0625rem;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection { background: var(--color-matcha); color: var(--color-ink); }
  :focus-visible { outline: 2px solid var(--color-matcha); outline-offset: 3px; border-radius: 6px; }
  section[id] { scroll-margin-top: 5rem; }
}

@keyframes rise { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: none; } }
@keyframes unblur {
  from { opacity: 0; filter: blur(16px); transform: translateY(24px) scale(1.02); }
  to { opacity: 1; filter: blur(0); transform: none; }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes pulse-ring { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }

.intro-rise { animation: rise 800ms var(--ease-soft) both; }
.intro-portrait { animation: unblur 900ms var(--ease-soft) 150ms both; }
.intro-line { animation: rise 700ms var(--ease-soft) both; animation-delay: calc(450ms + var(--i, 0) * 90ms); }
.intro-fade { animation: fade-in 500ms var(--ease-soft) 700ms both; }

:root[data-intro="skip"] :is(.intro-rise, .intro-portrait, .intro-line, .intro-fade) { animation: none; }

@media (prefers-reduced-motion: reduce) {
  :is(.intro-rise, .intro-portrait, .intro-line, .intro-fade) { animation: fade-in 300ms ease-out both; }
}
```

- [ ] **Step 5: Copy and crop photos**

```bash
mkdir -p public/images/projects public/resume
python - <<'EOF'
from PIL import Image
Image.open("New folder/Adobe Express - file.png").save("public/images/portrait.png", optimize=True)
im = Image.open("New folder/other pic can cut to hide pants.png")
im.crop((0, 340, 853, 1085)).save("public/images/about.png", optimize=True)
EOF
```

Open `public/images/about.png` and confirm the crop ends at the jersey hem with no pants visible; adjust the bottom value (1085) if not.

- [ ] **Step 6: Dev server config** — `.claude/launch.json`:

```json
{ "version": "0.0.1", "configurations": [ { "name": "dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 } ] }
```

- [ ] **Step 7: Verify and commit** — `npm test` passes, `npm run build` succeeds.

```bash
git add -A && git commit -m "chore: scaffold next.js app with tokens and tooling"
```

---

### Task 2: Content data and helpers

**Files:**
- Create: `src/lib/cn.ts`, `src/lib/format.ts`, `src/lib/color.ts`, `src/lib/tech-icons.ts`, `src/data/portfolio.ts`
- Test: `tests/format.test.ts`, `tests/color.test.ts`, `tests/data.test.ts`

**Interfaces:**
- Produces: `cn(...c: (string | false | null | undefined)[]): string`; `formatNumber(value: number, decimals?: number): string`; `contrastRatio(a: string, b: string): number`; `iconColorOnInk(hex: string): string` (returns `#`-prefixed hex); `techIcons` record and `TechIconKey`; from `@/data/portfolio`: `site`, `navSections`, `projects`, `about`, `capabilities`, `processSteps`, `stats`, `stackGroups`, `certifications`, and types `Project`, `Capability`, `ProcessStep`, `Stat`, `StackGroup`, `Certification`.

- [ ] **Step 1: Write failing tests**

`tests/format.test.ts`
```ts
import { formatNumber } from "@/lib/format";

it("adds thousands separators", () => expect(formatNumber(10040)).toBe("10,040"));
it("keeps fixed decimals", () => expect(formatNumber(0.826, 3)).toBe("0.826"));
it("pads decimals at zero", () => expect(formatNumber(0, 3)).toBe("0.000"));
it("rounds mid-animation values", () => expect(formatNumber(113.6)).toBe("114"));
```

`tests/color.test.ts`
```ts
import { contrastRatio, iconColorOnInk } from "@/lib/color";

it("computes WCAG contrast", () => {
  expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  expect(contrastRatio("#F2EFE3", "#0F120D")).toBeGreaterThan(16);
});
it("keeps brand colors that read on ink", () => expect(iconColorOnInk("7FA35A")).toBe("#7FA35A"));
it("swaps dark brand colors for cream", () => expect(iconColorOnInk("000000")).toBe("#F2EFE3"));
```

`tests/data.test.ts`
```ts
import * as data from "@/data/portfolio";
import { techIcons } from "@/lib/tech-icons";

const { projects, stats, stackGroups, certifications, site } = data;

it("has four projects with unique slugs", () => {
  expect(projects).toHaveLength(4);
  expect(new Set(projects.map((p) => p.slug)).size).toBe(4);
});
it("gives each project 2-3 bullets, chips and an https link", () => {
  for (const p of projects) {
    expect(p.bullets.length).toBeGreaterThanOrEqual(2);
    expect(p.bullets.length).toBeLessThanOrEqual(3);
    expect(p.stack.length).toBeGreaterThan(0);
    expect(p.links.length).toBeGreaterThan(0);
    for (const l of p.links) expect(l.href).toMatch(/^https:\/\//);
  }
});
it("marks only the thesis as featured", () => {
  expect(projects.filter((p) => p.featured).map((p) => p.slug)).toEqual(["rideshare-eu"]);
});
it("has five stats and five certifications", () => {
  expect(stats).toHaveLength(5);
  expect(certifications).toHaveLength(5);
});
it("only references registered tech icons", () => {
  for (const g of stackGroups) for (const t of g.items) expect(techIcons[t.icon]).toBeDefined();
});
it("never publishes a phone number", () => {
  const all = JSON.stringify(data);
  expect(all).not.toMatch(/tel:/);
  expect(all).not.toMatch(/(\+?63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/);
});
it("uses the public email", () => expect(site.email).toBe("xyrusdimacali@gmail.com"));
```

- [ ] **Step 2: Run** — `npm test` → FAIL (modules not found).

- [ ] **Step 3: Implement helpers**

`src/lib/cn.ts`
```ts
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

`src/lib/format.ts`
```ts
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
```

`src/lib/color.ts`
```ts
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
```

`src/lib/tech-icons.ts`
```ts
import {
  siCplusplus, siDart, siDocker, siDrizzle, siFigma, siFlutter, siGit, siGithub, siJavascript, siMysql, siNeon,
  siNestjs, siNextdotjs, siNodedotjs, siOpenjdk, siPandas, siPostgresql, siPostman, siPrisma, siPython, siRailway,
  siReact, siStreamlit, siSupabase, siSwift, siTypescript, siVercel,
} from "simple-icons";

export type IconDef = { title: string; hex: string; path?: string; stroke?: string };

export const techIcons = {
  python: siPython, javascript: siJavascript, typescript: siTypescript, java: { ...siOpenjdk, title: "Java" },
  cplusplus: siCplusplus, dart: siDart, swift: siSwift,
  react: siReact, nextjs: siNextdotjs, nodejs: siNodedotjs, nestjs: siNestjs, flutter: siFlutter, pandas: siPandas,
  streamlit: siStreamlit,
  postgresql: siPostgresql, prisma: siPrisma, drizzle: siDrizzle, mysql: siMysql, neon: siNeon, supabase: siSupabase,
  git: siGit, github: siGithub, docker: siDocker, figma: siFigma,
  // VS Code is not in Simple Icons; a neutral code glyph stands in.
  vscode: { title: "VS Code", hex: "007ACC", stroke: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" },
  vercel: siVercel, railway: siRailway, postman: siPostman,
} satisfies Record<string, IconDef>;

export type TechIconKey = keyof typeof techIcons;
```

- [ ] **Step 4: Content** — `src/data/portfolio.ts`

```ts
import type { TechIconKey } from "@/lib/tech-icons";

export type ProjectLink = { label: "Code" | "Live"; href: string };
export type Project = {
  slug: string; title: string; status: string; period: string; pitch: string;
  bullets: string[]; stack: string[]; links: ProjectLink[];
  /** Path under /public, e.g. "/images/projects/kodigo.png". Leave out to show the gradient cover. */
  image?: string;
  featured?: boolean;
};
export type Capability = { title: string; summary: string; tools: string[] };
export type ProcessStep = { title: string; detail: string };
export type Stat = { value: number; decimals?: number; label: string };
export type StackGroup = { title: string; items: { name: string; icon: TechIconKey }[] };
export type Certification = { name: string; issuer: string; year: number };

export const site = {
  name: "Xyrus Lorenz Dimacali",
  shortName: "Xyrus Dimacali",
  displayName: "XYRUS",
  monogram: "xd.",
  role: "Full-stack developer",
  tagline: ["full-stack developer", "who ships code", "and tests it too."],
  description:
    "Xyrus Dimacali is a Computer Science student and full-stack developer who builds tested, working software. Open to software development, web development and QA internships in Metro Manila.",
  location: "Based in the Philippines, open to roles in Metro Manila",
  availability: "Available for internships",
  email: "xyrusdimacali@gmail.com",
  resume: "/resume/Dimacali_Xyrus_Resume.pdf",
  github: "https://github.com/KlRAAA",
  linkedin: "https://linkedin.com/in/xyrus-dimacali-73a752328",
};

export const navSections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "capabilities", label: "What I do" },
  { id: "process", label: "Process" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export const projects: Project[] = [
  {
    slug: "rideshare-eu",
    title: "RideShareEU",
    status: "Undergraduate thesis, in development",
    period: "Feb 2026 – present",
    pitch: "Schedule-based carpooling for university students, matched by an algorithm I designed.",
    bullets: [
      "PSGA, a two-stage matcher: it filters candidates by route overlap, time window and hard constraints, then ranks them on a weighted composite score.",
      "Beat three baselines (FIFO, route-only, random) with 0.826 Precision@1 on a 500-row human-labeled dataset.",
      "8 core relational entities across 8 tracked migrations.",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Python", "Jest", "Postman", "Figma"],
    links: [{ label: "Code", href: "https://github.com/KlRAAA/rideshare-eu" }],
    featured: true,
  },
  {
    slug: "kodigo",
    title: "Kodigo: AI Study Buddy",
    status: "In development",
    period: "Jan 2026 – present",
    pitch: "A bilingual study platform that turns your notes into flashcards and quizzes.",
    bullets: [
      "Routes requests across 3 AI providers (Google Gemini, Groq, OpenRouter) with automatic model fallback and per-user and global rate limits.",
      "SM-2 spaced-repetition reviews, authentication and content moderation.",
      "Installable as a PWA on iOS.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Neon Postgres", "Drizzle ORM", "Vercel"],
    links: [{ label: "Live", href: "https://kodigo-ai-study-buddy.vercel.app/" }],
  },
  {
    slug: "skillscope",
    title: "SkillScope",
    status: "Completed",
    period: "Jun – Sep 2025",
    pitch: "Exploratory analysis and machine learning on the US tech job market.",
    bullets: [
      "Cleaned 10,040 tech postings from a 123,849-row LinkedIn dataset, with a 166-skill detection pipeline and IQR salary normalization.",
      "XGBoost seniority classifier with company-grouped cross-validation to prevent leakage: 0.607 macro F1 on unseen companies.",
    ],
    stack: ["Python", "pandas", "scikit-learn", "XGBoost", "SHAP", "Streamlit", "GitHub Actions"],
    links: [{ label: "Live", href: "https://skillscope-tech-job-market-analyzer.streamlit.app/" }],
  },
  {
    slug: "webtracker",
    title: "WebTracker",
    status: "Completed",
    period: "Mar – Apr 2025",
    pitch: "A privacy-first Chrome extension that tracks your active browsing time.",
    bullets: [
      "Reconciles sessions from ground truth in chrome.storage.session with atomic, single-threaded queuing, so tracking survives service-worker shutdowns.",
      "114 automated tests, with timing accuracy validated to 120 seconds through the Chrome DevTools Protocol.",
    ],
    stack: ["JavaScript", "Chrome Extension (MV3)", "Chrome Storage API", "Node.js"],
    links: [{ label: "Code", href: "https://github.com/KlRAAA/WebTracker" }],
  },
];

export const about = {
  headline: ["i don't just write code.", "i make sure it works."] as [string, string],
  paragraphs: [
    "I'm a fourth-year Computer Science student majoring in Software Engineering at Manuel S. Enverga University Foundation.",
    "I build full-stack apps, and I care as much about the tests as the features. My thesis started as a research question about matching students to carpools and turned into a working product with a measurable algorithm behind it.",
    "I graduate in June 2027 and I'm looking for an internship where I can put my 600 OJT hours into real software.",
  ],
  facts: [
    { label: "Degree", value: "BS Computer Science, Software Engineering, 2023–2027" },
    { label: "GPA", value: "1.52 (1.00 is highest)" },
    { label: "Honors", value: "College Scholar, 1st to 3rd year" },
    { label: "Internship", value: "600 OJT hours, available now" },
  ],
};

export const capabilities: Capability[] = [
  {
    title: "Full-stack web development",
    summary: "Typed front ends, REST APIs and relational data models that hold up.",
    tools: ["Next.js", "React", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Drizzle", "REST APIs"],
  },
  {
    title: "Software QA and testing",
    summary: "Automated suites, API validation and bug reports a developer can act on.",
    tools: ["Jest", "Postman", "Automated test suites", "API validation", "Bug reporting"],
  },
  {
    title: "Algorithms and data",
    summary: "Matching, ranking and models measured against honest baselines.",
    tools: ["Python", "pandas", "scikit-learn", "XGBoost", "Matching and ranking"],
  },
  {
    title: "Mobile and extensions",
    summary: "Native and cross-platform apps, plus browser extensions.",
    tools: ["Flutter", "Dart", "SwiftUI", "Chrome Extensions (MV3)"],
  },
];

export const processSteps: ProcessStep[] = [
  { title: "understand", detail: "Pin down the problem and what done looks like." },
  { title: "design", detail: "Sketch the data model, the flows and the edge cases first." },
  { title: "build", detail: "Ship small, typed pieces that are easy to review." },
  { title: "test", detail: "Automate the checks: units, APIs and the paths people actually take." },
  { title: "ship", detail: "Deploy, measure, and fix what the numbers point to." },
];

export const stats: Stat[] = [
  { value: 4, label: "projects shipped or in progress" },
  { value: 114, label: "automated tests in WebTracker" },
  { value: 0.826, decimals: 3, label: "Precision@1 for the PSGA matcher" },
  { value: 10040, label: "job postings analyzed in SkillScope" },
  { value: 5, label: "certifications" },
];

export const stackGroups: StackGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "Python", icon: "python" }, { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" }, { name: "Java", icon: "java" },
      { name: "C++", icon: "cplusplus" }, { name: "Dart", icon: "dart" }, { name: "Swift", icon: "swift" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { name: "React", icon: "react" }, { name: "Next.js", icon: "nextjs" }, { name: "Node.js", icon: "nodejs" },
      { name: "NestJS", icon: "nestjs" }, { name: "Flutter", icon: "flutter" }, { name: "pandas", icon: "pandas" },
      { name: "Streamlit", icon: "streamlit" },
    ],
  },
  {
    title: "Data and backend",
    items: [
      { name: "PostgreSQL", icon: "postgresql" }, { name: "Prisma", icon: "prisma" },
      { name: "Drizzle", icon: "drizzle" }, { name: "MySQL", icon: "mysql" },
      { name: "Neon", icon: "neon" }, { name: "Supabase", icon: "supabase" },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git", icon: "git" }, { name: "GitHub", icon: "github" }, { name: "Docker", icon: "docker" },
      { name: "Figma", icon: "figma" }, { name: "VS Code", icon: "vscode" }, { name: "Vercel", icon: "vercel" },
      { name: "Railway", icon: "railway" }, { name: "Postman", icon: "postman" },
    ],
  },
];

export const certifications: Certification[] = [
  { name: "Software Engineering Specialization", issuer: "IBM", year: 2026 },
  { name: "Machine Learning with Python", issuer: "IBM", year: 2026 },
  { name: "Create the User Interface with SwiftUI", issuer: "Meta", year: 2025 },
  { name: "Dynamic Programming and Greedy Algorithms", issuer: "University of Colorado Boulder", year: 2025 },
  { name: "Flutter and Dart: Developing iOS, Android, and Mobile Apps", issuer: "IBM", year: 2025 },
];
```

- [ ] **Step 5: Run** — `npm test` → all pass.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: add typed portfolio content and helpers"`

---

### Task 3: Hero, nav and page shell (checkpoint: user approves the look)

**Files:**
- Create: `src/components/ui/Icons.tsx`, `src/components/ui/Pill.tsx`, `src/components/ui/Button.tsx`
- Create: `src/lib/lenis.ts`, `src/components/layout/SmoothScroll.tsx`, `src/components/layout/IntroSkipper.tsx`, `src/components/layout/ScrollProgress.tsx`, `src/components/layout/Nav.tsx`
- Create: `src/components/sections/Hero.tsx`
- Replace: `src/app/layout.tsx`, `src/app/page.tsx`
- Test: `tests/hero.test.tsx`, `tests/nav.test.tsx`

**Interfaces:**
- Consumes: `site`, `navSections`, `cn`.
- Produces: `<Button href variant? icon? external? download?>`; icons `ArrowUpRight`, `ArrowDown`, `MailIcon`, `GitHubIcon`, `LinkedInIcon` (all `{ className?: string }`); `getLenis(): Lenis | null`, `setLenis(l: Lenis | null)`; `<Hero />`, `<Nav />`, `<ScrollProgress />`.

- [ ] **Step 1: Failing tests**

`tests/hero.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

it("names Xyrus in the page heading", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Xyrus Dimacali/);
});
it("shows availability and the portrait", () => {
  render(<Hero />);
  expect(screen.getByText("Available for internships")).toBeInTheDocument();
  expect(screen.getByAltText("Portrait of Xyrus Dimacali")).toBeInTheDocument();
});
```

`tests/nav.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "@/components/layout/Nav";

it("opens and closes the mobile menu", async () => {
  const user = userEvent.setup();
  render(<Nav />);
  const button = screen.getByRole("button", { name: "Menu" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  await user.click(button);
  expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
  await user.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
});
it("links to the résumé", () => {
  render(<Nav />);
  expect(screen.getAllByRole("link", { name: /résumé/i })[0]).toHaveAttribute("href", "/resume/Dimacali_Xyrus_Resume.pdf");
});
```

- [ ] **Step 2: Run** — `npm test` → FAIL (modules missing).

- [ ] **Step 3: UI primitives**

`src/components/ui/Icons.tsx`
```tsx
import { siGithub } from "simple-icons";

type P = { className?: string };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowDown = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
);
export const MailIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
);
export const GitHubIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor"><path d={siGithub.path} /></svg>
);
// LinkedIn is not in Simple Icons; simple "in" mark.
export const LinkedInIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor" fillRule="evenodd">
    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 7v7h2.5v-7H7Zm1.25-3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM11.5 10v7H14v-3.6c0-1 .6-1.6 1.4-1.6.8 0 1.1.6 1.1 1.5V17H19v-4c0-2-.8-3.2-2.7-3.2-1 0-1.9.4-2.4 1.2v-1h-2.4Z" />
  </svg>
);
```

`src/components/ui/Pill.tsx`
```tsx
import { cn } from "@/lib/cn";

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 rounded-full border border-matcha/30 bg-ink/60 px-4 py-2 text-sm text-cream backdrop-blur-md", className)}>
      <span className="relative flex size-2.5" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-matcha motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
        <span className="relative size-2.5 rounded-full bg-matcha" />
      </span>
      {children}
    </p>
  );
}
```

`src/components/ui/Button.tsx`
```tsx
import { cn } from "@/lib/cn";
import { ArrowDown, ArrowUpRight } from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: "external" | "download" | "none";
  external?: boolean;
  download?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", icon = "external", external, download, className }: Props) {
  const primary = variant === "primary";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-semibold",
        "transition duration-200 ease-out hover:-translate-y-0.5 hover:duration-300 focus-visible:-translate-y-0.5",
        primary
          ? "bg-matcha-deep text-cream hover:text-ink hover:shadow-[0_12px_32px_-12px_rgb(127_163_90/0.7)] focus-visible:text-ink"
          : "border border-cream/25 text-cream hover:border-matcha focus-visible:border-matcha",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full transition-transform duration-200 ease-out group-hover:translate-x-0 group-hover:duration-300 group-focus-visible:translate-x-0",
          primary ? "bg-gradient-to-r from-matcha to-matcha-light" : "bg-matcha/15",
        )}
      />
      <span className="relative">{children}</span>
      {icon === "external" && (
        <ArrowUpRight className="relative size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
      {icon === "download" && (
        <ArrowDown className="relative size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
      )}
    </a>
  );
}
```

- [ ] **Step 4: Layout helpers**

`src/lib/lenis.ts`
```ts
import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;
```

`src/components/layout/SmoothScroll.tsx`
```tsx
"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -72 }, autoRaf: true });
    setLenis(lenis);
    return () => { lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
```

`src/components/layout/IntroSkipper.tsx`
```tsx
"use client";
import { useEffect } from "react";

/** Any input during the intro jumps straight to the end state. */
export function IntroSkipper() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "skip") return;
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    const skip = () => { root.dataset.intro = "skip"; cleanup(); };
    const cleanup = () => { events.forEach((e) => window.removeEventListener(e, skip)); clearTimeout(timer); };
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const timer = window.setTimeout(cleanup, 1300);
    return cleanup;
  }, []);
  return null;
}
```

`src/components/layout/ScrollProgress.tsx`
```tsx
"use client";
import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-matcha-deep via-matcha to-matcha-light"
    />
  );
}
```

`src/components/layout/Nav.tsx`
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { navSections, site } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenis";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const ids = navSections.map((s) => s.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { root.style.overflow = ""; getLenis()?.start(); window.removeEventListener("keydown", onKey); };
  }, [open]);

  const close = () => { getLenis()?.start(); setOpen(false); };

  const linkClass = (id: string) =>
    cn(
      "relative py-1 transition-colors duration-200 hover:text-cream focus-visible:text-cream",
      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-matcha after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100",
      active === id ? "text-cream after:scale-x-100" : "text-sage",
    );

  return (
    <header className="intro-fade fixed inset-x-0 top-0 z-50">
      <div aria-hidden className={cn("absolute inset-0 border-b border-cream/5 bg-ink/75 backdrop-blur-md transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")} />
      <nav aria-label="Main" className="page-x relative flex h-16 items-center justify-between">
        <a href="#top" className="text-2xl font-extrabold tracking-[-0.04em] wdth-75" aria-label="Xyrus Dimacali, back to top">
          xd<span className="text-matcha">.</span>
        </a>
        <ul className="hidden items-center gap-7 text-[0.9375rem] md:flex">
          {navSections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className={linkClass(s.id)} aria-current={active === s.id ? "true" : undefined}>{s.label}</a></li>
          ))}
          <li>
            <a href={site.resume} className="rounded-full border border-cream/25 px-4 py-1.5 text-cream transition-colors duration-200 hover:border-matcha hover:bg-matcha/15 focus-visible:border-matcha">
              Résumé
            </a>
          </li>
        </ul>
        <button
          ref={buttonRef}
          type="button"
          className="relative z-10 rounded-full border border-cream/25 px-4 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      <div id="mobile-menu" hidden={!open} className="fixed inset-0 bg-ink pt-24 md:hidden">
        <ul className="page-x flex flex-col gap-2">
          {navSections.map((s, i) => (
            <li key={s.id}>
              <a ref={i === 0 ? firstLinkRef : undefined} href={`#${s.id}`} onClick={close} className="block py-2 text-4xl font-bold tracking-[-0.03em] wdth-85">
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li className="mt-6"><a href={site.resume} onClick={close} className="text-lg text-matcha underline underline-offset-4">Download résumé</a></li>
        </ul>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Hero** — `src/components/sections/Hero.tsx`

```tsx
import Image from "next/image";
import { site } from "@/data/portfolio";
import { Pill } from "@/components/ui/Pill";

export function Hero() {
  return (
    <section id="top" className="relative isolate flex h-svh min-h-[640px] flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_42%,rgb(63_90_46/0.5),transparent_72%)]" />

      <h1 className="pointer-events-none absolute inset-x-0 top-[16svh] text-center">
        <span
          aria-hidden
          className="intro-rise block bg-gradient-to-b from-matcha-light via-matcha to-matcha-deep bg-clip-text text-[min(30vw,34rem)] leading-[0.8] font-extrabold tracking-[-0.045em] text-transparent wdth-75 [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]"
        >
          {site.displayName}
        </span>
        <span className="sr-only">{site.shortName}, {site.role.toLowerCase()}</span>
      </h1>

      <div className="pointer-events-none absolute bottom-0 left-1/2 w-[min(100vw,80svh,780px)] -translate-x-1/2">
        <div className="intro-portrait relative aspect-square">
          <Image
            src="/images/portrait.png"
            alt="Portrait of Xyrus Dimacali"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 780px"
            className="object-contain object-bottom"
          />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink via-ink/85 to-transparent" />

      <div className="page-x relative w-full pt-20 md:pt-24">
        <div className="flex justify-end">
          <Pill className="intro-fade">{site.availability}</Pill>
        </div>
      </div>

      <div className="page-x relative mt-auto grid w-full gap-6 pb-8 md:pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <p className="max-w-[18ch] text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em] wdth-85">
          {site.tagline.map((line, i) => (
            <span key={line} className="intro-line block" style={{ "--i": i } as React.CSSProperties}>{line}</span>
          ))}
        </p>
        <div className="intro-fade flex items-end justify-between gap-6 text-sm text-sage lg:flex-col lg:items-end">
          <p className="max-w-[28ch] lg:text-right">{site.location}</p>
          <a href="#work" className="inline-flex items-center gap-1.5 text-cream transition-colors hover:text-matcha">
            Scroll <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Layout and page**

`src/app/layout.tsx`
```tsx
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { site } from "@/data/portfolio";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { IntroSkipper } from "@/components/layout/IntroSkipper";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-bricolage", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = `${site.shortName} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  openGraph: { title, description: site.description, url: "/", siteName: site.shortName, type: "website", locale: "en_PH" },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0f120d", colorScheme: "dark" };

const introScript = `try{if(sessionStorage.getItem("xd-intro")){document.documentElement.dataset.intro="skip"}else{sessionStorage.setItem("xd-intro","1")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only z-[70] rounded-full bg-cream px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <SmoothScroll />
        <IntroSkipper />
        {children}
      </body>
    </html>
  );
}
```

`src/app/page.tsx`
```tsx
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 7: Run** — `npm test` → all pass. `npx tsc --noEmit` → clean.

- [ ] **Step 8: Visual check** — start `dev` via preview tools; screenshot 375, 768, 1280, 1536. Check: name sits behind the head and fills ~80% width; portrait shoulders melt into ink; tagline readable over the fade; pill doesn't collide with nav; intro plays once, reload in same tab skips it; pressing a key mid-intro jumps to the end; no horizontal scroll at 375. Fix anything off.

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat: add hero, nav and page shell"`

- [ ] **Step 10: STOP — show the user hero screenshots (desktop + mobile) and wait for approval before Task 4.**

---

### Task 4: Selected work

**Files:**
- Create: `src/components/ui/SectionHeading.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/ProjectImage.tsx`, `src/components/sections/ProjectRow.tsx`, `src/components/sections/Work.tsx`
- Modify: `src/app/page.tsx` (add `<Work />` after `<Hero />`)
- Test: `tests/work.test.tsx`

**Interfaces:**
- Consumes: `projects`, `Project`, `cn`, `ArrowUpRight`.
- Produces: `<SectionHeading id lines tone? />` (`lines: [string, string]`, `tone: "dark" | "light"`), `<Chip>`, `<ProjectImage title slug image? />`.

- [ ] **Step 1: Failing test** — `tests/work.test.tsx`

```tsx
import { render, screen, within } from "@testing-library/react";
import { Work } from "@/components/sections/Work";

it("renders four projects as articles with headings", () => {
  render(<Work />);
  const articles = screen.getAllByRole("article");
  expect(articles).toHaveLength(4);
  expect(within(articles[0]).getByRole("heading", { level: 3 })).toHaveTextContent("RideShareEU");
});
it("opens project links in a new tab, safely", () => {
  render(<Work />);
  const code = screen.getByRole("link", { name: /RideShareEU code/i });
  expect(code).toHaveAttribute("href", "https://github.com/KlRAAA/rideshare-eu");
  expect(code).toHaveAttribute("target", "_blank");
  expect(code).toHaveAttribute("rel", "noopener noreferrer");
});
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement**

`src/components/ui/SectionHeading.tsx`
```tsx
import { cn } from "@/lib/cn";

export function SectionHeading({ id, lines, className }: { id: string; lines: [string, string]; className?: string }) {
  return (
    <h2 id={id} className={cn("max-w-[18ch] text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.035em] wdth-85", className)}>
      <span className="block">{lines[0]}</span>
      <span className="block">{lines[1]}</span>
    </h2>
  );
}
```

`src/components/ui/Chip.tsx`
```tsx
export function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-md border border-cream/10 px-2.5 py-1 font-mono text-[0.8125rem] text-sage">{children}</li>;
}
```

`src/components/ui/ProjectImage.tsx`
```tsx
import Image from "next/image";
import { ArrowUpRight } from "./Icons";

export function ProjectImage({ title, slug, image }: { title: string; slug: string; image?: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-moss ring-1 ring-cream/10">
      <div className="absolute inset-0 transition-transform duration-500 ease-soft group-hover:scale-105">
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
        ) : (
          <div className="flex h-full flex-col justify-between bg-[radial-gradient(80%_90%_at_85%_100%,rgb(127_163_90/0.45),transparent_65%),radial-gradient(60%_60%_at_0%_0%,rgb(63_90_46/0.55),transparent_70%)] p-6 md:p-8">
            <span className="font-mono text-sm text-sage">~/{slug}</span>
            <span className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.85] font-extrabold tracking-[-0.04em] text-cream wdth-75">
              {title.split(":")[0]}
            </span>
          </div>
        )}
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_80px_-20px_rgb(127_163_90/0.5)] ring-1 ring-matcha/70 ring-inset transition-opacity duration-300 group-hover:opacity-100" />
      <span aria-hidden className="absolute top-4 right-4 flex size-10 translate-x-2 -translate-y-2 items-center justify-center rounded-full bg-cream text-ink opacity-0 transition duration-300 ease-soft group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="size-5" />
      </span>
    </div>
  );
}
```

`src/components/sections/ProjectRow.tsx`
```tsx
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ProjectImage } from "@/components/ui/ProjectImage";

export function ProjectRow({ project, reversed }: { project: Project; reversed: boolean }) {
  const { title, slug, status, period, pitch, bullets, stack, links, image, featured } = project;
  const primary = links[0];
  return (
    <article className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        className={cn(featured ? "lg:col-span-7" : "lg:col-span-6", reversed && "lg:order-2")}
      >
        <ProjectImage title={title} slug={slug} image={image} />
      </a>
      <div className={featured ? "lg:col-span-5" : "lg:col-span-6"}>
        <p className="text-sm text-sage">{status}, {period}</p>
        <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-bold tracking-[-0.025em] transition-transform duration-300 ease-soft group-hover:translate-x-1">
          {title}
        </h3>
        <p className="mt-3 max-w-[52ch] text-lg text-cream/90">{pitch}</p>
        <ul className="mt-5 max-w-[60ch] space-y-2.5 text-sage">
          {bullets.map((b) => (
            <li key={b} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-matcha">{b}</li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${title} tech stack`}>
          {stack.map((s) => <Chip key={s}>{s}</Chip>)}
        </ul>
        <div className="mt-7 flex gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title.split(":")[0]} ${l.label.toLowerCase()}`}
              className="group/link inline-flex items-center gap-1.5 font-semibold text-matcha transition-colors hover:text-matcha-light"
            >
              {l.label}
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
```

`src/components/sections/Work.tsx`
```tsx
import { projects } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectRow } from "./ProjectRow";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="page-x py-24 md:py-36">
      <SectionHeading id="work-title" lines={["things i've built", "and tested."]} />
      <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
        {projects.map((p, i) => <ProjectRow key={p.slug} project={p} reversed={i % 2 === 1} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run** — `npm test` → pass.
- [ ] **Step 5: Visual check** at 375/768/1280/1536: rows alternate on desktop, featured image visibly larger, hover zoom/glow/arrow; Tab focus reaches Code/Live links with ring.
- [ ] **Step 6: Commit** — `git commit -am "feat: add selected work section"` (use `git add -A` first for new files).

---

### Task 5: About and What I do

**Files:**
- Create: `src/components/sections/About.tsx`, `src/components/sections/Capabilities.tsx`
- Modify: `src/app/page.tsx` (append `<About />`, `<Capabilities />`)
- Test: `tests/about.test.tsx`

**Interfaces:** Consumes `about`, `capabilities`, `SectionHeading`, `Chip`.

- [ ] **Step 1: Failing test** — `tests/about.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";

it("states GPA and school", () => {
  render(<About />);
  expect(screen.getByText(/1\.52/)).toBeInTheDocument();
  expect(screen.getByText(/Manuel S\. Enverga University Foundation/)).toBeInTheDocument();
  expect(screen.getByAltText(/Xyrus/)).toBeInTheDocument();
});
it("lists four capabilities", () => {
  render(<Capabilities />);
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
});
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement**

`src/components/sections/About.tsx`
```tsx
import Image from "next/image";
import { about } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-matcha-milk text-ink">
      <div className="page-x grid gap-12 pt-24 md:pt-36 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 lg:pb-36">
          <SectionHeading id="about-title" lines={about.headline} />
          <div className="mt-10 max-w-[62ch] space-y-5 text-lg text-ink/85">
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-ink/15 pt-8 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-matcha-deep">{f.label}</dt>
                <dd className="mt-1 font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-sm self-end lg:col-span-5 lg:max-w-none">
          <Image
            src="/images/about.png"
            alt="Xyrus Dimacali in a hockey jersey, looking to the side"
            width={853}
            height={745}
            sizes="(max-width: 1024px) 384px, 40vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
```

(`height` must equal the cropped image's real height from Task 1 Step 5: 1085 − 340 = 745.)

`src/components/sections/Capabilities.tsx`
```tsx
import { capabilities } from "@/data/portfolio";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="page-x py-24 md:py-36">
      <SectionHeading id="capabilities-title" lines={["what i do,", "and what i use to do it."]} />
      <div className="mt-16 md:mt-20">
        {capabilities.map((c) => (
          <div key={c.title} className="grid gap-4 border-t border-cream/10 py-8 md:grid-cols-12 md:gap-10 md:py-10">
            <h3 className="text-2xl leading-tight font-bold tracking-[-0.02em] md:col-span-5 md:text-3xl">{c.title}</h3>
            <div className="md:col-span-7">
              <p className="max-w-[56ch] text-sage">{c.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${c.title} tools`}>
                {c.tools.map((t) => <Chip key={t}>{t}</Chip>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run** — pass. **Step 5:** visual check (light section contrast, image flush to section bottom, no pants visible). **Step 6:** `git add -A && git commit -m "feat: add about and capabilities sections"`

---

### Task 6: How I build and Numbers

**Files:**
- Create: `src/components/motion/CountUp.tsx`, `src/components/sections/Process.tsx`, `src/components/sections/Numbers.tsx`
- Modify: `src/app/page.tsx` (append `<Process />`, `<Numbers />`)
- Test: `tests/numbers.test.tsx`

**Interfaces:** Consumes `processSteps`, `stats`, `formatNumber`. Produces `<CountUp value decimals? />`.

- [ ] **Step 1: Failing test** — `tests/numbers.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";

it("exposes final stat values to assistive tech", () => {
  render(<Numbers />);
  // Visible (aria-hidden) and sr-only copies both render the final value.
  expect(screen.getAllByText("10,040").length).toBeGreaterThan(0);
  expect(screen.getAllByText("0.826").length).toBeGreaterThan(0);
});
it("renders five ordered process steps", () => {
  render(<Process />);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement**

`src/components/motion/CountUp.tsx`
```tsx
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
      onComplete: () => { armed.current = false; },
    });
    return () => controls.stop();
  }, [inView, value]);

  const final = formatNumber(value, decimals);
  return (
    <span ref={ref}>
      <span aria-hidden className="tabular-nums">{formatNumber(display, decimals)}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
```

`src/components/sections/Process.tsx`
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { processSteps } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const reduce = useReducedMotion();
  return (
    <section id="process" aria-labelledby="process-title" className="page-x py-24 md:py-36">
      <SectionHeading id="process-title" lines={["how a feature gets", "from idea to shipped."]} />
      <div className="relative mt-16 md:mt-20">
        <motion.span
          aria-hidden
          className="absolute top-0 bottom-0 left-[0.6rem] w-px origin-top bg-matcha/50 lg:top-[0.6rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
          initial={reduce ? false : { scaleX: 0, scaleY: 0 }}
          whileInView={{ scaleX: 1, scaleY: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.2, ease }}
        />
        <ol className="grid gap-10 lg:grid-cols-5 lg:gap-8">
          {processSteps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative pl-10 lg:pt-12 lg:pl-0"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.15 + i * 0.18 }}
            >
              <span aria-hidden className="absolute top-0 left-0 flex size-5 items-center justify-center rounded-full bg-ink ring-1 ring-matcha lg:top-0">
                <span className="size-1.5 rounded-full bg-matcha" />
              </span>
              <span className="font-mono text-sm text-matcha">{i + 1}</span>
              <h3 className="mt-1 text-2xl font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 max-w-[30ch] text-sage">{s.detail}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

`src/components/sections/Numbers.tsx`
```tsx
import { stats } from "@/data/portfolio";
import { CountUp } from "@/components/motion/CountUp";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Numbers() {
  return (
    <section id="numbers" aria-labelledby="numbers-title" className="page-x py-24 md:py-36">
      <SectionHeading id="numbers-title" lines={["the numbers,", "straight from the projects."]} />
      <div className="mt-14 rounded-2xl border border-cream/10 bg-moss p-6 font-mono md:mt-20 md:p-10">
        <p className="text-sm text-sage" aria-hidden>$ npm test -- portfolio</p>
        <ul className="mt-6 divide-y divide-cream/10">
          {stats.map((s) => (
            <li key={s.label} className="grid grid-cols-[1.5rem_1fr] items-baseline gap-x-3 gap-y-1 py-5 md:grid-cols-[1.5rem_12rem_1fr] md:gap-x-6">
              <span aria-hidden className="text-matcha">✓</span>
              <span className="text-3xl text-cream md:text-5xl"><CountUp value={s.value} decimals={s.decimals} /></span>
              <span className="col-start-2 font-sans text-sage md:col-start-3">{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-matcha" aria-hidden>Tests: {stats.length} passed, {stats.length} total</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run** — pass. **Step 5:** visual check (line draws, steps stagger once, count-up runs once from below the fold, no layout shift; emulate reduced motion and confirm static). **Step 6:** `git add -A && git commit -m "feat: add process timeline and numbers band"`

---

### Task 7: Stack and Certifications

**Files:**
- Create: `src/components/ui/TechIcon.tsx`, `src/components/sections/Stack.tsx`, `src/components/sections/Certifications.tsx`
- Modify: `src/app/page.tsx` (append `<Stack />`, `<Certifications />`)
- Test: `tests/stack.test.tsx`

**Interfaces:** Consumes `stackGroups`, `certifications`, `techIcons`, `iconColorOnInk`.

- [ ] **Step 1: Failing test** — `tests/stack.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { Stack } from "@/components/sections/Stack";
import { Certifications } from "@/components/sections/Certifications";

it("names every tool for screen readers", () => {
  render(<Stack />);
  for (const n of ["Python", "Next.js", "PostgreSQL", "VS Code", "Postman"]) {
    expect(screen.getAllByText(n).length).toBeGreaterThan(0);
  }
});
it("lists five certifications", () => {
  render(<Certifications />);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement**

`src/components/ui/TechIcon.tsx`
```tsx
import { iconColorOnInk } from "@/lib/color";
import { techIcons, type IconDef, type TechIconKey } from "@/lib/tech-icons";

export function TechIcon({ name, icon }: { name: string; icon: TechIconKey }) {
  const def: IconDef = techIcons[icon];
  return (
    <li
      className="group/icon relative flex size-14 items-center justify-center rounded-xl border border-cream/10 bg-moss text-sage/70 transition duration-200 ease-out hover:-translate-y-1 hover:border-cream/20 hover:text-[var(--brand)] hover:duration-300"
      style={{ "--brand": iconColorOnInk(def.hex) } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-7" {...(def.stroke ? { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } : { fill: "currentColor" })}>
        <path d={def.stroke ?? def.path} />
      </svg>
      <span className="sr-only">{name}</span>
      <span aria-hidden className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md bg-cream px-2 py-1 text-xs whitespace-nowrap text-ink opacity-0 transition duration-200 group-hover/icon:translate-y-0 group-hover/icon:opacity-100">
        {name}
      </span>
    </li>
  );
}
```

`src/components/sections/Stack.tsx`
```tsx
import { stackGroups } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="page-x py-24 md:py-36">
      <SectionHeading id="stack-title" lines={["the tools", "i reach for."]} />
      <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-x-16">
        {stackGroups.map((g) => (
          <div key={g.title}>
            <h3 className="text-lg font-semibold">{g.title}</h3>
            <ul className="mt-5 flex flex-wrap gap-3">
              {g.items.map((t) => <TechIcon key={t.name} name={t.name} icon={t.icon} />)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`src/components/sections/Certifications.tsx`
```tsx
import { certifications } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="page-x py-24 md:py-36">
      <SectionHeading id="certifications-title" lines={["certified,", "and still learning."]} />
      <ul className="mt-14 md:mt-20">
        {certifications.map((c) => (
          <li key={c.name} className="grid gap-1 border-t border-cream/10 py-6 last:border-b md:grid-cols-[1fr_16rem_4rem] md:items-baseline md:gap-8">
            <span className="text-xl font-semibold tracking-[-0.01em]">{c.name}</span>
            <span className="text-sage">{c.issuer}</span>
            <span className="font-mono text-sm text-sage md:text-right">{c.year}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run** — pass. **Step 5:** visual check (icons muted, brand color on hover, dark brands become cream, tooltip not clipped). **Step 6:** `git add -A && git commit -m "feat: add stack and certifications"`

---

### Task 8: Contact and footer

**Files:**
- Create: `src/components/sections/Contact.tsx`, `src/components/sections/Footer.tsx`
- Modify: `src/app/page.tsx` (append `<Contact />` inside main, `<Footer />` after main)
- Test: `tests/contact.test.tsx`

- [ ] **Step 1: Failing test** — `tests/contact.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

it("offers email and résumé", () => {
  render(<Contact />);
  expect(screen.getByRole("link", { name: /email me/i })).toHaveAttribute("href", "mailto:xyrusdimacali@gmail.com");
  expect(screen.getByRole("link", { name: /download résumé/i })).toHaveAttribute("href", "/resume/Dimacali_Xyrus_Resume.pdf");
});
it("never links a phone number", () => {
  const { container } = render(<><Contact /><Footer /></>);
  expect(container.querySelector('a[href^="tel:"]')).toBeNull();
});
it("credits Xyrus in the footer", () => {
  render(<Footer />);
  expect(screen.getByText(/© 2026 Xyrus Lorenz Dimacali/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement**

`src/components/sections/Contact.tsx`
```tsx
import { site } from "@/data/portfolio";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";

export function SocialLinks({ className }: { className?: string }) {
  const links = [
    { href: site.github, label: "GitHub", Icon: GitHubIcon },
    { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  ];
  return (
    <ul className={className ?? "flex gap-3"}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-full border border-cream/15 text-sage transition duration-200 ease-out hover:scale-110 hover:border-matcha hover:text-matcha focus-visible:scale-110 focus-visible:text-matcha"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 md:py-44">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(127_163_90/0.35),rgb(63_90_46/0.15)_45%,transparent_75%)]" />
      <div className="page-x">
        <h2 id="contact-title" className="max-w-[14ch] text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] font-extrabold tracking-[-0.04em] wdth-85">
          <span className="block">looking for an intern who ships?</span>
          <span className="block">let&apos;s talk.</span>
        </h2>
        <p className="mt-8 max-w-[48ch] text-lg text-sage">
          I reply within a day. Tell me about the team and the role, and I&apos;ll send over anything you need.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={`mailto:${site.email}`}>Email me</Button>
          <Button href={site.resume} variant="secondary" icon="download" download>Download résumé</Button>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <SocialLinks />
          <a href={`mailto:${site.email}`} className="font-mono text-sm text-sage transition-colors hover:text-matcha">{site.email}</a>
        </div>
      </div>
    </section>
  );
}
```

`src/components/sections/Footer.tsx`
```tsx
import { site } from "@/data/portfolio";
import { SocialLinks } from "./Contact";

export function Footer() {
  return (
    <footer className="page-x flex flex-col gap-6 border-t border-cream/10 py-8 text-sm text-sage md:flex-row md:items-center md:justify-between">
      <p>© 2026 {site.name}. Designed and built by me with Next.js.</p>
      <SocialLinks />
    </footer>
  );
}
```

- [ ] **Step 4: Run** — pass. **Step 5:** visual check (glow sits behind headline, buttons sweep/lift, icons scale; mobile buttons wrap cleanly). **Step 6:** `git add -A && git commit -m "feat: add contact section and footer"`

---

### Task 9: SEO: OG image and icons

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`

- [ ] **Step 1: Implement**

`src/app/opengraph-image.tsx`
```tsx
import { ImageResponse } from "next/og";

export const alt = "Xyrus Dimacali, full-stack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#f2efe3", background: "radial-gradient(circle at 50% 120%, #3f5a2e 0%, #0f120d 62%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 800 }}>
          <span style={{ display: "flex" }}>xd<span style={{ color: "#7fa35a" }}>.</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 500, color: "#b9cf8f" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#7fa35a" }} />
            Available for internships
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 300, fontWeight: 800, letterSpacing: -14, lineHeight: 0.8, backgroundImage: "linear-gradient(180deg, #b9cf8f, #7fa35a 45%, #3f5a2e)", backgroundClip: "text", color: "transparent" }}>
          XYRUS
        </div>
        <div style={{ display: "flex", fontSize: 40 }}>full-stack developer who ships code and tests it too.</div>
      </div>
    ),
    size,
  );
}
```

`src/app/icon.tsx`
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f120d", borderRadius: 8, color: "#f2efe3", fontSize: 19, fontWeight: 800, letterSpacing: -1 }}>
        xd<span style={{ color: "#7fa35a" }}>.</span>
      </div>
    ),
    size,
  );
}
```

`src/app/apple-icon.tsx`
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f120d", color: "#f2efe3", fontSize: 96, fontWeight: 800, letterSpacing: -5 }}>
        xd<span style={{ color: "#7fa35a" }}>.</span>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2: Verify** — `npm run build`; open `/opengraph-image`, `/icon`, `/apple-icon` in the dev server and look at them. Confirm `<meta property="og:image">` is present in page HTML.
- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat: add og image and icons"`

---

### Task 10: Polish pass, build, Lighthouse, README

**Files:**
- Modify: any component flagged in review
- Create: `README.md` (replace scaffold README)

- [ ] **Step 1: frontend-design review.** Screenshot every section at 375 and 1440. Against the skill, check: one bold element only (hero); no template tells (all-caps labels, mono labels, `·` strings, single-word accents, identical card grids); type scale consistent; line lengths < 80ch; spacing rhythm between sections; contrast (spot-check with the `contrastRatio` helper for any new pairing). Remove one accessory. Record before/after screenshots of every change.
- [ ] **Step 2: Reduced motion and keyboard.** Emulate `prefers-reduced-motion: reduce`; Tab through the whole page; confirm visible focus everywhere and the mobile menu traps nothing unexpectedly.
- [ ] **Step 3: Build** — `npm run lint && npm test && npm run build`; fix all errors and warnings.
- [ ] **Step 4: Lighthouse (mobile)** — `npm run start` in background, then:

```bash
npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=./.lighthouse.json --quiet
node -e "const r=require('./.lighthouse.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"
```

Target ≥ 90 on all four; fix and re-run if not. Add `.lighthouse.json` to `.gitignore`.

- [ ] **Step 5: README** — `README.md`

````markdown
# Xyrus Dimacali portfolio

Personal portfolio built with Next.js, Tailwind CSS, Motion and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests
npm run build    # production build
```

## Edit content

Everything you see on the page lives in `src/data/portfolio.ts`: projects, bio, skills, stats, stack and certifications. Edit that file and the page updates; no component changes needed.

To add a project screenshot, put the image in `public/images/projects/` and set `image: "/images/projects/<slug>.png"` on that project. Without an image, the project shows a matcha cover with its name.

## Photos and files

- Hero portrait: `public/images/portrait.png` (transparent PNG, about 1024px square or larger)
- About photo: `public/images/about.png` (transparent PNG)
- Résumé: `public/resume/Dimacali_Xyrus_Resume.pdf`

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. No settings needed.
3. Optional: set `NEXT_PUBLIC_SITE_URL` to your custom domain so social previews use it.
````

- [ ] **Step 6: Commit** — `git add -A && git commit -m "chore: polish pass and readme"`; then report Lighthouse scores and before/after screenshots to the user.
