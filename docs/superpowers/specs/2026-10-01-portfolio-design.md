# Portfolio site design

Personal e-portfolio for Xyrus Dimacali, 4th-year CS student applying for software dev, web dev and QA internships in Metro Manila.

Source brief: `claude-code-portfolio-prompt.md`. Design authority: the `frontend-design` skill. Where the two conflicted, the skill wins on design detail; content, palette and features stay as briefed. Decisions below were approved on 2026-10-01.

## Subject and job

- **Audience:** recruiters (10-second skim) and engineering leads (read the projects).
- **Primary job:** make a lead think "this person ships working things", then click **Email me**.
- **The one bold element:** the hero. Portrait cut-out in front of a giant matcha-gradient `XYRUS`. Everything after the hero stays quiet.

## Color tokens

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0F120D` | Page background |
| `moss` | `#171C14` | Raised surfaces, image frames |
| `matcha-deep` | `#3F5A2E` | Gradient start, button fill, links on light sections |
| `matcha` | `#7FA35A` | Accent on dark: links, pulse dot, focus ring |
| `matcha-light` | `#B9CF8F` | Gradient end, hover glow |
| `cream` | `#F2EFE3` | Primary text on dark |
| `sage` | `#9AA391` | Secondary text on dark |
| `matcha-milk` | `#E3E9D2` | Background of the single light section (About) |

Contrast (WCAG AA): cream/ink 17:1, sage/ink 7.2:1, matcha/ink 6.5:1, cream/matcha-deep 6.7:1, ink/matcha-milk 15:1. `matcha` is never used as text on a light background (2.5:1).

Gradients only in: the hero name, the contact glow, button hover fill.

## Type

- **Bricolage Grotesque** (variable: `wght`, `wdth`, `opsz`) for display and body. Condensed, heavy and tight at hero size; calm at text size.
- **Geist Mono** only for code-like data: tech chips, stat values, project path/date meta. Never for section labels.
- Body 17px / 1.6, measure ≤ 66ch. Scale ratio 1.25 (34 → 72px headings). Hero name ~22–26vw.
- Headlines: lowercase, two lines, no single accented word.
- No all-caps labels, no `A · B · C` meta strings, no eyebrow labels above section headings.

## Layout

Left-aligned editorial layout throughout; the hero is the only centered composition.

1. **Hero:** `xd.` monogram top-left; "Available for internships" pill with pulsing dot top-right. `XYRUS` behind the portrait, gradient deep → light fading into `ink` toward the bottom. Tagline: "full-stack developer who ships code and tests it too." Footer line: "Based in the Philippines, open to Metro Manila", plus a "Scroll" hint.
2. **Work:** four editorial rows, image and text alternating sides. RideShareEU (thesis) gets the largest row. Each row: title, pitch, 2–3 impact bullets, mono tech chips, Code / Live links. Images fall back to a matcha gradient with the project name when no screenshot exists.
3. **About:** `matcha-milk` background. Jersey cut-out cropped above the pants beside a short bio. Headline: "i don't just write code. / i make sure it works."
4. **What I do:** four full-width rows separated by hairlines (field name left, mono tool chips right). Not cards.
5. **How I build:** the only numbered section: 1 understand, 2 design, 3 build, 4 test, 5 ship. Connecting line draws left to right; steps appear as reached. Vertical on mobile.
6. **Numbers:** one test-runner-style band: `✓ 4 projects`, `✓ 114 tests passing`, `✓ 0.826 precision@1`, `✓ 10,040 postings analyzed`, `✓ 5 certifications`. Values count up on first view. The QA motif appears only here.
7. **Stack:** four labelled groups (Languages, Frameworks, Data & backend, Tools). Simple Icons SVGs, muted by default; full color, small lift and name tooltip on hover or focus. No marquee.
8. **Certifications:** three-column list (name, issuer, year).
9. **Contact:** "looking for an intern who ships? / let's talk." over a matcha glow. Email me (`mailto:xyrusdimacali@gmail.com`), Download résumé (`/resume/Dimacali_Xyrus_Resume.pdf`), GitHub and LinkedIn icons. No phone number, no address.
10. **Footer:** "© 2026 Xyrus Lorenz Dimacali. Designed and built by me with Next.js." plus social icons.

Sticky nav: `xd.` left; section links and a Resume button right; collapses to a menu on mobile. Scroll-spy highlights the current section. Nav links are not numbered.

## Motion

- Lenis for smooth scroll (loaded when the browser is idle). GSAP not needed.
- `motion` was dropped during the performance pass: it was a ~58KB gzipped chunk serving three effects (progress bar, process reveal, count-up), each now a few lines of CSS transitions, `IntersectionObserver` and `requestAnimationFrame`. This took mobile Lighthouse Performance from 75 to ~90.
- The portrait's load-in is transform-only (no blur, no opacity) and its cast shadow is a radial gradient rather than `filter: drop-shadow`: the portrait is the LCP element, and filters on it delayed first paint by up to 2s in Lighthouse.
- **Signature moment (≈1.1s, once per session via `sessionStorage`):** name rises, portrait settles into place, tagline rises line by line, then nav and pill fade in. Any key, click or scroll completes it instantly. Never blocks content.
- Other motion only where it explains something: stat count-up, process line drawing, top scroll-progress bar, scroll-spy.
- No custom cursor, magnetic buttons, card tilt or cursor spotlights. No fade-up on every section.
- Hover (and identical keyboard focus): button gradient sweep, ↗ nudge, 2px lift with soft glow; project image scale 1.05 with matcha edge glow; nav underline drawn from left; icons turn matcha. 200–300ms ease-out in, faster out.
- Only `transform` and `opacity` animate. `prefers-reduced-motion`: animations become fades or nothing, Lenis disabled.
- Touch: nothing important relies on hover.

## Tech and structure

Next.js (App Router) + TypeScript + Tailwind CSS v4 (tokens in `@theme`), `motion`, `lenis`, `next/font`, `next/image`. Deploys to Vercel with zero config.

```
src/app/                 layout.tsx, page.tsx, globals.css, opengraph-image.tsx, icon.tsx
src/data/portfolio.ts    all content, typed
src/components/sections/ Hero, Work, About, Capabilities, Process, Numbers, Stack, Certifications, Contact, Footer
src/components/layout/   Nav, ScrollProgress, SmoothScroll
src/components/motion/   Reveal, SplitText, CountUp
src/components/ui/       Button, Pill, Chip, ProjectImage
public/images/portrait.png        face cut-out (1024×1024, transparent)
public/images/about.png           jersey cut-out cropped above the pants
public/images/projects/<slug>.png optional screenshots
public/resume/                    résumé PDF (added by Xyrus)
```

## Quality bar

- Lighthouse mobile ≥ 90 on all four categories.
- Semantic HTML, keyboard navigable, visible matcha focus ring, alt text on every image.
- Title, meta description, generated OG image, "xd." favicon.
- No console errors, hydration warnings or layout shift.
- Checked visually at 375, 768, 1280 and 1536px after each section.

## Build order

Hero first (for look approval), then Work, About, What I do, How I build, Numbers, Stack, Certifications, Contact/Footer, then the frontend-design polish pass, production build, Lighthouse, README.
