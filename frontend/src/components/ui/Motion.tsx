import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from 'motion/react';
import type { ReactNode } from 'react';
import { SCROLL_SPRING, SPRING, itemVariants, revealViewport } from './motionPresets';

/* Interaction motion, deliberately kept separate from Reveal (entry motion).
   Everything here is transform + border-color only, so nothing reflows and no
   animation can change a measured line height, contrast ratio or layout box.
   Each helper degrades to a plain static element under prefers-reduced-motion. */

type HoverRowProps = {
  children: ReactNode;
  className?: string;
  /** Rise in px. Small on purpose: 3-4px reads as responsive, 12px reads as a toy. */
  lift?: number;
  /**
   * Also take part in a parent <RevealList>'s stagger. Motion propagates
   * variants down the React tree, so the row animates in reading order and
   * still lifts on hover.
   */
  stagger?: boolean;
};

/**
 * List row that answers the pointer. Sits on the existing hairline grid so the
 * hover is a nudge, not a repaint of the whole row.
 */
export function HoverRow({ children, className, lift = 3, stagger = false }: HoverRowProps) {
  const reduce = useReducedMotion();
  if (reduce) return <li className={className}>{children}</li>;

  return (
    <motion.li
      className={className}
      variants={stagger ? itemVariants : undefined}
      initial={stagger ? 'hidden' : false}
      whileInView={stagger ? 'shown' : undefined}
      viewport={stagger ? revealViewport : undefined}
      whileHover={{ y: -lift }}
      whileTap={{ y: 0, scale: 0.995 }}
      transition={SPRING}
    >
      {children}
    </motion.li>
  );
}

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  lift?: number;
  /** Also join a parent <RevealList>'s stagger. See HoverRow. */
  stagger?: boolean;
};

/** Block-level counterpart to HoverRow. */
export function HoverCard({ children, className, lift = 4, stagger = false }: HoverCardProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={stagger ? itemVariants : undefined}
      initial={stagger ? 'hidden' : false}
      whileInView={stagger ? 'shown' : undefined}
      viewport={stagger ? revealViewport : undefined}
      whileHover={{ y: -lift }}
      whileTap={{ y: 0, scale: 0.995 }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
}

type ScrollLineProps = {
  /** The scrolling element the line tracks. */
  target: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * A hairline rule that fills with accent as its section is scrolled through.
 * Purely decorative: it is aria-hidden, sits behind the content, and under
 * reduced motion it renders fully drawn so the section never looks unfinished.
 */
export function ScrollLine({ target, className = '' }: ScrollLineProps) {
  const reduce = useReducedMotion();
  // Offsets are fixed rather than exposed: they encode where the line should
  // start and finish drawing, which is a design decision, not a per-call-site
  // knob. 'start end' -> 'end start' draws the line over the full time the
  // target traverses the viewport, from first entering to fully leaving.
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] as const });
  const scaleY = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 left-0 w-px overflow-hidden ${className}`}
    >
      <div className="h-full w-full bg-hairline" />
      {reduce ? (
        <div className="absolute inset-0 origin-top bg-accent" />
      ) : (
        <FillLine progress={scaleY} />
      )}
    </div>
  );
}

function FillLine({ progress }: { progress: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0 origin-top bg-accent"
      style={{ scaleY: progress }}
    />
  );
}

