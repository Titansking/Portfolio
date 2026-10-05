import { Container } from '../ui/Section';
import { GITHUB_MARK } from '../../lib/techIcons';
import { PROFILE } from '../../content/profile';

/* Mirrors the nav and the page order, which mirrors the resume. */
const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: PROFILE.github },
  { label: 'LinkedIn', href: PROFILE.linkedin },
  { label: 'Email', href: PROFILE.emailHref },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline py-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[34ch]">
            <a
              href="#hero"
              className="inline-flex min-h-11 items-center font-display text-lg font-bold tracking-tight text-ink no-underline"
            >
              {PROFILE.initials}
              <span className="text-accent">.</span>dev
            </a>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Full-stack and Flutter developer working on SaaS products, based in{' '}
              {PROFILE.location.replace(', India', '')}.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-[0.9375rem] text-ink-mute no-underline transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Socials live here rather than in the hero, which keeps the hero to
            its four permitted text elements. */}
        <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-hairline pt-8">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex min-h-11 items-center gap-2 font-display text-[0.9375rem] text-ink-soft no-underline transition-colors duration-200 hover:text-accent"
              >
                {s.label === 'GitHub' ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={16}
                    height={16}
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={GITHUB_MARK.path} />
                  </svg>
                ) : null}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 font-mono text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {PROFILE.name}</p>
          <p>React, TypeScript, Flutter, Tailwind</p>
        </div>
      </Container>
    </footer>
  );
}
