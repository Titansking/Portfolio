import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal, RevealList, RevealItem } from '../ui/Reveal';
import { CountUp } from '../ui/CountUp';
import { HoverRow } from '../ui/Motion';

const LEDGER = [
  {
    value: 400,
    suffix: '+',
    label: 'Coding Ninjas',
    detail: 'Recursion, trees and dynamic programming, mostly in Java.',
  },
  {
    value: 160,
    suffix: '+',
    label: 'GeeksforGeeks',
    detail: 'Arrays, searching, sorting, and system design problems.',
  },
  { value: 4, suffix: '', label: 'Hacktoberfest PRs', detail: 'Merged in 2023, with a tree planted via Tree-Nation.' },
];

const CERTS = [
  {
    title: 'Data Structures & Algorithms',
    issuer: 'Coding Ninjas',
    body: 'Problem-solving mastery across the core algorithms and structures.',
  },
  {
    title: 'Full-Stack Web Development',
    issuer: '30 Days Coding',
    body: 'Frontend frameworks, REST API design, and database architecture.',
  },
  {
    title: 'Java Programming',
    issuer: 'Oracle',
    body: 'Object-oriented design, data structures, and exception handling.',
  },
  {
    title: 'Open Source Contribution',
    issuer: 'Hacktoberfest 2023',
    body: 'Four merged pull requests, recognised with a community tree.',
  },
];

export default function Achievements() {
  return (
    <Section id="achievements" className="border-t border-hairline">
      <Container>
        <Reveal>
          <SectionHead
            title={
              <>
                Practice, and the
                <br />
                <span className="text-accent">paperwork that came with it.</span>
              </>
            }
          />
        </Reveal>

        {/* Recommendation, full-bleed. Italic display type needs
            leading-[1.3] plus bottom padding or the descenders in
            "reliability" clip. */}
        <Reveal delay={0.08} className="mt-14">
          <figure className="rounded-[18px] border border-hairline bg-surface px-7 py-12 sm:px-14 sm:py-16">
            <blockquote className="max-w-[52ch] font-display text-xl font-medium italic leading-[1.3] pb-2 text-ink sm:text-[1.75rem] sm:leading-[1.3]">
              &ldquo;Commended for technical execution, ownership, and reliability
              across our core full-stack platforms.&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex flex-col gap-1">
              <span className="font-display font-semibold text-ink">Khadija Zain</span>
              <span className="text-sm text-ink-mute">CEO, Krafzen Inc.</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Ledger. A horizontal rule-separated row, not three equal cards. */}
        <RevealList className="mt-16 grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {LEDGER.map((stat) => (
            <RevealItem
              key={stat.label}
              className="py-8 sm:px-8 sm:py-0 first:sm:pl-0 last:sm:pr-0"
            >
              <p className="font-display text-[3.5rem] font-bold leading-none tracking-tight text-accent">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-4 font-display font-semibold text-ink">{stat.label}</p>
              <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-ink-mute">
                {stat.detail}
              </p>
            </RevealItem>
          ))}
        </RevealList>

        <Reveal delay={0.08} className="mt-20">
          <h3 className="font-display text-2xl font-bold tracking-tight">Certificates</h3>
          <Hairline className="mt-5" />

          {/* Staggered on scroll, and each row lifts on hover with the issuer
              label brightening, so the list reads as a set of cards rather
              than a wall of static text. */}
          <RevealList className="mt-8">
            <ul className="grid sm:grid-cols-2">
              {CERTS.map((cert) => (
                <HoverRow
                  key={cert.title}
                  stagger
                  className="border-b border-hairline py-7 sm:odd:pr-10 sm:even:border-l sm:even:border-l-hairline sm:even:pl-10"
                >
                  <p className="font-mono text-[0.75rem] tracking-[0.16em] text-accent uppercase">
                    {cert.issuer}
                  </p>
                  <h4 className="mt-2.5 font-display text-lg font-semibold text-ink">
                    {cert.title}
                  </h4>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {cert.body}
                  </p>
                </HoverRow>
              ))}
            </ul>
          </RevealList>
        </Reveal>
      </Container>
    </Section>
  );
}
