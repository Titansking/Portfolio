import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, groupVariants, itemVariants, revealViewport } from './motionPresets';

type RevealProps = {
  children: ReactNode;
  /** Seconds. Stagger children by passing an incrementing index. */
  delay?: number;
  /** Travel distance in px. Keep small so the section never reflows. */
  y?: number;
  className?: string;
  /** How much of the element must be visible before it plays. */
  amount?: number;
};

/**
 * Scroll-reveal. Motivated by hierarchy: content enters in reading order so
 * the eye is led down the section instead of landing on a wall of equal
 * weight. Collapses to a plain static element under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  amount = 0.25,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type RevealListProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
};

/** Parent for a staggered group. Pairs with <RevealItem>. */
export function RevealList({ children, className, amount = revealViewport.amount }: RevealListProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
