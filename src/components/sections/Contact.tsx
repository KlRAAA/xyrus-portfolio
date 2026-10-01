import { site } from "@/data/portfolio";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from "@/components/ui/Icons";

export function SocialLinks() {
  const links = [
    { href: site.github, label: "GitHub", Icon: GitHubIcon },
    { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
  ];
  return (
    <ul className="flex gap-3">
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
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(127_163_90/0.35),rgb(63_90_46/0.15)_45%,transparent_75%)]"
      />
      <div className="page-x">
        <h2
          id="contact-title"
          className="max-w-[14ch] text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] font-extrabold tracking-[-0.04em] wdth-85"
        >
          <span className="block">looking for an intern who ships?</span>
          <span className="block">let&apos;s talk.</span>
        </h2>
        <p className="mt-8 max-w-[48ch] text-lg text-sage">
          Tell me about the team and the role, and I&apos;ll send over anything you need.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={`mailto:${site.email}`}>Email me</Button>
          <Button href={site.resume} variant="secondary" icon="download" download>
            Download résumé
          </Button>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <SocialLinks />
          <a href={`mailto:${site.email}`} className="font-mono text-sm text-sage transition-colors hover:text-matcha">
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
