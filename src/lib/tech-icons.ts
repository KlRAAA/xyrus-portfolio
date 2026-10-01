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
