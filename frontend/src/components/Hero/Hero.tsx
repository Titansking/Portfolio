import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, Download } from 'lucide-react';
import { trackResumeDownload } from '../../services/api';
import profileImg from '../../assets/profile-cutout.png';
import profileWebp from '../../assets/profile-cutout.webp';
import { Container } from '../ui/Section';

const SHIPS = ['full-stack apps', 'SaaS products', 'open source tools'];

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
              Shipping SaaS products end to end with React, Node and MongoDB, with an
              internship at Krafzen Inc. behind it.
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
            </motion.div>
          </div>

          {/* -------------------------------------------------------- Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[400px]"
          >
            {/* Atmosphere behind the figure. The cutout has no background of
                its own, so it needs a light source to sit against. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--accent-wash),transparent_68%)]"
            />

            {/* Offset accent slab behind the figure. Purely structural: it
                gives the portrait depth without a drop shadow. */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[26px] border border-accent/25"
            />
            <div
              aria-hidden="true"
              className="absolute -right-2 -bottom-2 h-24 w-24 rounded-[26px] bg-accent/12"
            />

            <figure>
              {/* White studio backdrop removed by flood fill, so the portrait
                  sits directly on the page. 441x513 native, rendered at no
                  more than 400px wide, so it is never upscaled. */}
              <picture>
                <source srcSet={profileWebp} type="image/webp" />
                <img
                  src={profileImg}
                  alt="Ashwani Kumar, full-stack developer"
                  width={441}
                  height={513}
                  fetchPriority="high"
                  className="h-auto w-full"
                />
              </picture>
              {/* Caption sits outside the frame. No pill, tag or label is
                  overlaid on the photograph. */}
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <p className="font-display text-base font-semibold text-ink">
                  Ashwani Kumar
                </p>
                <p className="font-mono text-xs text-ink-mute">B.Tech CSE, 2026</p>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
