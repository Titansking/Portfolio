import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

type CountUpProps = {
  value: number;
  /** Rendered after the digits, e.g. "+" or "k". */
  suffix?: string;
  prefix?: string;
  durationSeconds?: number;
  className?: string;
};

/**
 * Counts a figure up once, when it scrolls into view.
 *
 * Writes to textContent on a ref instead of React state, so a 24-item
 * statistics strip animating simultaneously triggers zero re-renders
 * (taste-skill 3.B). Under reduced motion the final value renders directly.
 */
export function CountUp({
  value,
  suffix = '',
  prefix = '',
  durationSeconds = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    if (reduce) {
      ref.current.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    if (!inView) {
      ref.current.textContent = `${prefix}0${suffix}`;
      return;
    }

    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, durationSeconds]);

  return (
    <span ref={ref} className={className}>
      {reduce ? `${prefix}${value}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
}
