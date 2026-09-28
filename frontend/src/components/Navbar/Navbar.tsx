import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Writing', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''));

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window === 'undefined' ? 'dark' : (localStorage.getItem('theme') ?? 'dark') === 'light' ? 'light' : 'dark',
  );
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const reduce = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll position is read as a Motion value, never through a
  // window.addEventListener('scroll') handler. setState only fires when the
  // boolean actually flips, so scrolling costs at most one render per threshold.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled((prev) => (prev === latest > 24 ? prev : latest > 24));
  });

  // The theme class is an external system (documentElement), so this belongs
  // in an effect. The React state itself is seeded by the lazy initialiser
  // above, which avoids a cascading render on mount.
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Scroll spy via IntersectionObserver.
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null,
    );
    if (nodes.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }

        let best = '';
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        setActive(bestRatio > 0 ? best : '');
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.75] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close the drawer on Escape, and hand focus back to the toggle so keyboard
  // users are not dropped at the top of the document.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const isCurrent = (href: string) => active === href.replace('#', '');

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-canvas/85 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/70'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12"
      >
        <a
          href="#hero"
          className="font-display text-lg font-bold tracking-tight text-ink no-underline"
        >
          AK<span className="text-accent">.</span>dev
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? 'true' : undefined}
              className={`relative rounded-full px-3.5 py-2 font-display text-[0.9375rem] font-medium no-underline transition-colors duration-200 ${
                isCurrent(link.href) ? 'text-accent' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {link.name}
              {isCurrent(link.href) ? (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-accent-wash"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}
            </a>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'light'}
            className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Reading position. Motivated as feedback: it answers "how much is left". */}
      {!reduce ? (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-px origin-left bg-accent"
        />
      ) : null}

      {isOpen ? (
        <motion.div
          id="mobile-drawer"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-hairline bg-canvas/97 backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-[1400px] flex-col px-5 pb-8 pt-4 sm:px-8">
            {NAV_LINKS.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between border-b border-hairline py-3.5 font-display text-lg font-medium text-ink no-underline"
                >
                  {link.name}
                  <span className="font-mono text-xs text-ink-mute">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </header>
  );
}
