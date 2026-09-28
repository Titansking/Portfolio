import type { Variants } from 'motion/react';

/* Shared motion tokens. Kept out of the component files because
   react-refresh/only-export-components requires a module to export components
   only, and these are plain values. */

/** Expressive out-ease. Fast departure, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Hover/press feedback. Stiff enough to feel instant, damped enough not to wobble. */
export const SPRING = { type: 'spring', stiffness: 320, damping: 26, mass: 0.6 } as const;

/** Softer spring for scroll-linked values, which need to not jitter. */
export const SCROLL_SPRING = { stiffness: 180, damping: 34, restDelta: 0.001 } as const;

export const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Shared viewport for staggered lists, including semantic ul/ol variants. */
export const revealViewport = { once: true, amount: 0.15 } as const;
