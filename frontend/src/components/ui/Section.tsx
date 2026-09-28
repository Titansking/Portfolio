import type { ReactNode } from 'react';

/* Standardised page gutter. 4 / 8 / 12 columns, one place to change. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** Vertical rhythm is set here so every band breathes the same amount. */
export function Section({ id, children, className = '' }: SectionProps) {
  // No scroll-mt here on purpose: `html { scroll-padding-top }` in index.css
  // already clears the fixed header. Setting both stacks to 192px and leaves a
  // full band of the previous section stranded above the heading.
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

type SectionHeadProps = {
  title: ReactNode;
  lede?: string;
  /**
   * The page's structural label. taste-skill 4.7 caps these at one per three
   * sections. Currently spent on the Marquee band only.
   */
  eyebrow?: string;
  className?: string;
};

/**
 * Left-aligned by design. DESIGN_VARIANCE is 7, so the centred hero and
 * centred section headers the site used before are both off the table.
 * Also avoids the split-header pattern (big headline left, small paragraph
 * floating right) - the lede always stacks under the headline.
 */
export function SectionHead({ title, lede, eyebrow, className = '' }: SectionHeadProps) {
  return (
    <div className={`max-w-[62ch] ${className}`}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="font-display text-[2.1rem] leading-[1.08] font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {lede ? <p className="mt-5 text-lg leading-relaxed text-ink-soft">{lede}</p> : null}
    </div>
  );
}

/** Vertical hairline used to separate rows without boxing them in a card. */
export function Hairline({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full bg-hairline ${className}`} />;
}
