import { useRef } from 'react';
import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal, RevealList, RevealItem } from '../ui/Reveal';
import { CountUp } from '../ui/CountUp';
import { ScrollLine } from '../ui/Motion';
import { EXPERIENCE } from '../../content/profile';

export default function Experience() {
  const contributionsRef = useRef<HTMLOListElement>(null);

  return (
    <Section id="experience" className="border-t border-hairline">
      <Container>
        <Reveal>
          <SectionHead
            title={
              <>
                One internship,
                <br />
                <span className="text-accent">owned end to end.</span>
              </>
            }
            lede={`${EXPERIENCE.title} at ${EXPERIENCE.company}, ${EXPERIENCE.period}.`}
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          {/* Role band. The single role gets a full-width editorial band
              rather than a lone centred card. */}
          <div className="border-t border-hairline pt-8">
            <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {EXPERIENCE.title}
                </h3>
                <p className="mt-3 font-display text-lg text-accent">
                  {EXPERIENCE.company}
                </p>
                <dl className="mt-7 space-y-2 font-mono text-[0.8125rem] text-ink-mute">
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 uppercase">Period</dt>
                    <dd>{EXPERIENCE.period}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 uppercase">Setup</dt>
                    <dd>{EXPERIENCE.setup}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-mono text-[0.75rem] tracking-[0.2em] text-ink-mute uppercase">
                  What I was responsible for
                </h4>
                {/* Spine fills as the responsibilities scroll past. */}
                <ol ref={contributionsRef} className="relative mt-5 space-y-5 pl-7">
                  <ScrollLine target={contributionsRef} className="inset-y-1 left-[3px]" />
                  {EXPERIENCE.contributions.map((point, i) => (
                    <li key={i} className="flex gap-5">
                      <span className="mt-0.5 font-mono text-xs text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                        {point}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Impact numerals, pulled out of the prose and given room to land. */}
        <RevealList className="mt-16 grid gap-y-10 sm:grid-cols-3">
          {EXPERIENCE.metrics.map((m) => (
            <RevealItem key={m.label}>
              <p className="font-display text-[3.25rem] font-bold leading-none tracking-tight text-accent">
                <CountUp value={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-3 font-display text-[0.9375rem] font-semibold text-ink">
                {m.label}
              </p>
              <p className="mt-1 text-sm text-ink-mute">{m.detail}</p>
            </RevealItem>
          ))}
        </RevealList>

        <Reveal delay={0.08} className="mt-16">
          <Hairline />
          <div className="grid gap-6 pt-8 lg:grid-cols-[260px_1fr]">
            <h4 className="font-mono text-[0.75rem] tracking-[0.2em] text-ink-mute uppercase">
              Stack in use
            </h4>
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {EXPERIENCE.stack.map((tool) => (
                <li key={tool} className="font-mono text-sm text-ink-soft">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}