# xyrus-portfolio

Personal portfolio of Xyrus Dimacali, a CS student and full-stack developer who ships code and tests it too. Built with Next.js, TypeScript and Tailwind CSS. Scores 90+ on all four mobile Lighthouse categories.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests
npm run build    # production build
```

Stop `npm run dev` before running `npm run build`; both write to `.next/`.

## Edit content

Everything on the page lives in `src/data/portfolio.ts`: projects, bio, skills, process steps, stats, tech stack and certifications. Edit that file and the page updates. No component changes needed.

To add a project screenshot, put the image in `public/images/projects/` and set `image: "/images/projects/<slug>.png"` on that project. Without an image, the project shows a matcha cover with its name and a small line drawing.

## Photos and files

- Hero portrait: `public/images/portrait.png`, a transparent PNG. 1024px square works; larger (about 1600px) looks sharper on high-resolution screens.
- About photo: `public/images/about.png`, a transparent PNG cropped above the waist. If you change its size, update `width` and `height` in `src/components/sections/About.tsx`.
- Résumé: `public/resume/Dimacali_Xyrus_Lorenz_Dev_Resume.pdf`. The "Résumé" and "Download résumé" links point here.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. No settings needed.
3. Optional: set `NEXT_PUBLIC_SITE_URL` to your custom domain (for example `https://xyrusdimacali.dev`) so social previews use it. Without it, Vercel's production URL is used.
