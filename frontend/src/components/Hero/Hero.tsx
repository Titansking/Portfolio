import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, Download } from 'lucide-react';
import { trackResumeDownload } from '../../services/api';
import { PROFILE, SHIPS } from '../../content/profile';
import { GITHUB_MARK } from '../../lib/techIcons';
import { Container } from '../ui/Section';

import profile320 from '../../assets/profile-320.webp';
import profile640 from '../../assets/profile-640.webp';

/* Portrait is exported at 320 and 640. 320 is the rendered CSS width and 640
   its retina pair, so no device ever downloads the small file on a 2x screen.
   `sizes` is what tells the browser which to pick: full width of the portrait
   column below lg, capped at 320px above it. */
const PORTRAIT_SIZES = '(min-width: 1024px) 320px, 78vw';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused) return;

    const id = window.setInterval(() => {
      // Pause the rotator while the tab is in the background.
      if (document.visibilityState === 'visible') {
        setRoleIndex((i) => (i + 1) % SHIPS.length);
      }
    }, 2800);

    return () => window.clearInterval(id);
  }, [reduce, paused]);

  const handleDownloadResume = () => {
    trackResumeDownload();
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.setAttribute('download', 'Ashwani_Kumar_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeShip = SHIPS[reduce ? 0 : roleIndex];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16"
    >
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* ---------------------------------------------------------- Copy */}
          <div>
            {/* Availability. A real semantic state, not decoration, so this is
                the one status indicator the page is allowed. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface/70 px-3.5 py-1.5"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                {!reduce ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                ) : null}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-[0.8125rem] font-medium text-ink-soft">
                Open to full-time roles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 font-display text-[clamp(2.75rem,8.5vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.03em]"
            >
              Ashwani
              <br />
              <span className="text-accent">Kumar.</span>
            </motion.h1>

            {/* Role rotator. Grid stack keeps the box at the width of the
                longest role, so swapping text never reflows the hero. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="mt-6 font-display text-xl font-medium text-ink-soft sm:text-2xl"
            >
              <span className="sr-only">I ship {SHIPS.join(', ')}.</span>
              <span className="inline-grid" aria-hidden="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={activeShip}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="col-start-1 row-start-1"
                  >
                    I ship{' '}
                    <span className="text-ink underline decoration-accent decoration-2 underline-offset-[6px]">
                      {activeShip}
                    </span>
                    .
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-soft"
            >
              Full-stack and Flutter developer based in {PROFILE.location}. Shipped
              two SaaS platforms at Krafzen Inc. and a surplus-food marketplace
              from a single Dart codebase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projects"
                className="btn-accent btn-accent-hover btn-accent-active"
              >
                View work
                <ArrowDownRight size={18} />
              </a>
              <button
                type="button"
                onClick={handleDownloadResume}
                className="btn-ghost btn-ghost-hover btn-ghost-active"
              >
                <Download size={17} />
                Resume
              </button>

              {/* The two profiles a recruiter actually opens, promoted out of
                  the footer. Icon-only, so both need an accessible name. */}
              <div className="flex items-center gap-2.5">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile, opens in a new tab"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={GITHUB_MARK.path} />
                  </svg>
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile, opens in a new tab"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {/* LinkedIn has no Simple Icons entry and no Lucide glyph, so
                      the mark is its own logotype set in type rather than a
                      hand-drawn SVG that could be subtly wrong. */}
                  <span aria-hidden="true" className="font-display text-[0.9375rem] font-bold tracking-tight">
                    in
                  </span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* -------------------------------------------------------- Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            /* Capped at 320px rather than the 400px the old cutout used. At
               400px the head was large enough to crowd the headline column;
               320 keeps it a portrait rather than the loudest thing on screen. */
            className="relative mx-auto w-full max-w-[320px]"
          >
            {/* Atmosphere behind the figure. The cutout has no background of
                its own, so it needs a light source to sit against. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--accent-wash),transparent_68%)]"
            />

            {/* Offset accent slab behind the figure. Purely structural: it
                gives the portrait depth without a drop shadow.

                Anchored to the top of the figure rather than the full box. The
                caption adds its own height below the photo, and a full-height
                outline would read as a frame around the caption too. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[400px] rounded-[26px] border border-accent/25"
            />
            <div
              aria-hidden="true"
              className="absolute top-[380px] right-0 h-20 w-20 rounded-[26px] bg-accent/12"
            />

            <figure>
              {/* Studio backdrop keyed out at the source, then cropped to 4:5.
                  WebP only, with no PNG twin: every browser that can run this
                  React app decodes WebP, and a second copy of the same photo
                  cost 116 kB to serve an audience that does not exist.

                  width/height are the intrinsic size of the 320px export, so the
                  frame is reserved before the bytes land and the caption below
                  never shifts. */}
              <img
                src={profile320}
                srcSet={`${profile320} 320w, ${profile640} 640w`}
                sizes={PORTRAIT_SIZES}
                alt={`${PROFILE.name}, ${PROFILE.role.toLowerCase()} based in ${PROFILE.location}`}
                width={320}
                height={400}
                fetchPriority="high"
                decoding="async"
                className="h-auto w-full"
              />
              {/* Caption sits outside the frame. No pill, tag or label is
                  overlaid on the photograph. */}
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <p className="font-display text-base font-semibold text-ink">
                  {PROFILE.name}
                </p>
                <p className="font-mono text-xs text-ink-mute">
                  {PROFILE.degree}
                </p>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}