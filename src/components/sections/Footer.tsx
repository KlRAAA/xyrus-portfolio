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
