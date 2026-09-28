import { useReducedMotion } from 'motion/react';
import { ALL_MARKS, type TechMark } from '../../lib/techIcons';
import { Container } from '../ui/Section';

function Mark({ icon }: { icon: TechMark }) {
  return (
    <span
      role="img"
      aria-label={icon.title}
      className="flex shrink-0 items-center gap-2.5 text-ink-mute transition-colors duration-200 hover:text-ink"
    >
      <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
        <path d={icon.path} />
      </svg>
      <span className="font-mono text-[0.8125rem] whitespace-nowrap">{icon.title}</span>
    </span>
  );
}

export default function StackMarquee() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Technologies I work with" className="border-y border-hairline py-7">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-9">
        {/* The page's single structural eyebrow. */}
        <p className="eyebrow shrink-0">Works daily with</p>

        {reduce ? (
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {ALL_MARKS.map((icon) => (
              <li key={icon.title}>
                <Mark icon={icon} />
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
            }}
          >
            <ul className="flex w-max animate-marquee items-center gap-9 hover:[animation-play-state:paused] motion-reduce:animate-none">
              {/* Duplicated once so the -50% keyframe loops seamlessly. The
                  copy is hidden from assistive tech to avoid a double read. */}
              {[...ALL_MARKS, ...ALL_MARKS].map((icon, i) => (
                <li key={`${icon.title}-${i}`} aria-hidden={i >= ALL_MARKS.length}>
                  <Mark icon={icon} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
