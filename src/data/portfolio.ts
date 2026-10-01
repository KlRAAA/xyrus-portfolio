import type { TechIconKey } from "@/lib/tech-icons";

export type ProjectLink = { label: "Code" | "Live"; href: string };
export type Project = {
  slug: string;
  title: string;
  status: string;
  period: string;
  pitch: string;
  bullets: string[];
  stack: string[];
  links: ProjectLink[];
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
  resume: "/resume/Dimacali_Xyrus_Lorenz_Dev_Resume.pdf",
  github: "https://github.com/KlRAAA",
  linkedin: "https://linkedin.com/in/xyrus-dimacali-73a752328",
  instagram: "https://www.instagram.com/_xyrusdmcl",
  facebook: "https://www.facebook.com/share/1CXviKnSq4/",
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
    image: "/images/projects/kodigo.png",
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
    image: "/images/projects/skillscope.png",
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
    image: "/images/projects/webtracker.png",
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
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cplusplus" },
      { name: "Dart", icon: "dart" },
      { name: "Swift", icon: "swift" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Node.js", icon: "nodejs" },
      { name: "NestJS", icon: "nestjs" },
      { name: "Flutter", icon: "flutter" },
      { name: "pandas", icon: "pandas" },
      { name: "Streamlit", icon: "streamlit" },
    ],
  },
  {
    title: "Data and backend",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Prisma", icon: "prisma" },
      { name: "Drizzle", icon: "drizzle" },
      { name: "MySQL", icon: "mysql" },
      { name: "Neon", icon: "neon" },
      { name: "Supabase", icon: "supabase" },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Docker", icon: "docker" },
      { name: "Figma", icon: "figma" },
      { name: "VS Code", icon: "vscode" },
      { name: "Vercel", icon: "vercel" },
      { name: "Railway", icon: "railway" },
      { name: "Postman", icon: "postman" },
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
