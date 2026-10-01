import { siGithub } from "simple-icons";

type P = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowDown = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const MailIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const GitHubIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d={siGithub.path} />
  </svg>
);
// LinkedIn is not in Simple Icons; simple "in" mark.
export const LinkedInIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor" fillRule="evenodd">
    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 7v7h2.5v-7H7Zm1.25-3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM11.5 10v7H14v-3.6c0-1 .6-1.6 1.4-1.6.8 0 1.1.6 1.1 1.5V17H19v-4c0-2-.8-3.2-2.7-3.2-1 0-1.9.4-2.4 1.2v-1h-2.4Z" />
  </svg>
);
