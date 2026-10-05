import { useRef, useState } from 'react';
import { getMark } from '../../lib/techIcons';
import { SKILL_GROUPS, type SkillGroupId } from '../../content/profile';
import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal, RevealList } from '../ui/Reveal';
import { HoverRow } from '../ui/Motion';

/** Brand mark, or a neutral dot when Simple Icons has no entry for the tool.
 *
 *  The dot is deliberately sized and positioned to occupy the same 17px box the
 *  SVG would, so a row never changes width as the user switches categories. */
function SkillMark({ name }: { name: string }) {
  const mark = getMark(name);
  if (!mark) {
    return (
      <span
        aria-hidden="true"
        className="flex h-[17px] w-[17px] shrink-0 items-center justify-center"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="currentColor"
      role="img"
      aria-label={mark.title}
      className="shrink-0"
    >
      <path d={mark.path} />
    </svg>
  );
}

export default function Skills() {
  const [active, setActive] = useState<SkillGroupId>(SKILL_GROUPS[0].id);
  const railRef = useRef<HTMLDivElement>(null);

  const group = SKILL_GROUPS.find((g) => g.id === active) ?? SKILL_GROUPS[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const i = SKILL_GROUPS.findIndex((g) => g.id === active);
    let next = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % SKILL_GROUPS.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
      next = (i - 1 + SKILL_GROUPS.length) % SKILL_GROUPS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = SKILL_GROUPS.length - 1;

    setActive(SKILL_GROUPS[next].id);
    railRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <Section id="skills" className="border-t border-hairline">
      <Container>
        <Reveal>
          <SectionHead
            title={
              <>
                The toolkit I
                <br />
                reach for <span className="text-accent">by default.</span>
              </>
            }
            lede="Listed the way the resume lists it: by layer, not by how good I claim to be at it."
          />
        </Reveal>

        {/* grid-cols-1 is minmax(0,1fr), not the implicit `auto` track. An auto
            track is sized to max-content, so the lede paragraph below would
            force the column wider than the viewport on small screens. */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          {/* Vertical rail. A real tablist: arrow keys, Home and End move
              between tabs, per the WAI-ARIA tabs pattern.

              Horizontal on small screens because the eight labels do not fit as
              a vertical list in 375px. The rail scrolls on its own axis, and the
              edge fade is what signals there is more past the last tab. */}
          <Reveal>
            <div
              ref={railRef}
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="rail-fade flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
            >
              {SKILL_GROUPS.map((g) => {
                const selected = g.id === active;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    id={`tab-${g.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${g.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(g.id)}
                    className={`flex min-h-11 shrink-0 cursor-pointer items-center justify-between gap-3 rounded-[10px] px-4 text-left font-display text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 lg:rounded-none lg:rounded-r-[10px] lg:border-r ${
                      selected
                        ? 'bg-accent-wash text-accent lg:border-accent'
                        : 'text-ink-soft hover:bg-elevated hover:text-ink lg:border-hairline'
                    }`}
                  >
                    {g.label}
                    {/* Count in the rail, so the eight groups can be compared
                        before opening any of them. */}
                    <span className="font-mono text-[0.6875rem] text-ink-mute tabular-nums">
                      {String(g.skills.length).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div
            role="tabpanel"
            id={`panel-${group.id}`}
            aria-labelledby={`tab-${group.id}`}
            tabIndex={0}
            className="min-w-0 focus-visible:outline-none"
          >
            <p className="max-w-[60ch] text-lg leading-relaxed text-ink-soft">
              {group.blurb}
            </p>
            <Hairline className="mt-8" />

            {/* Two-column split with hairline separation. Deliberately not a
                stack of identical cards, and no proficiency bars: the resume
                makes no ranking claim to visualise. Row keys change per tab,
                so the stagger replays on every category switch rather than
                only on first paint. */}
            <RevealList>
              <ul className="grid sm:grid-cols-2">
                {group.skills.map((skill) => (
                  <HoverRow
                    key={skill}
                    stagger
                    lift={2}
                    className="flex items-center gap-3.5 border-b border-hairline py-4 sm:odd:pr-8 sm:even:border-l sm:even:border-l-hairline sm:even:pl-8"
                  >
                    <span className="text-ink-mute">
                      <SkillMark name={skill} />
                    </span>
                    <span className="font-display text-[0.9375rem] font-medium text-ink">
                      {skill}
                    </span>
                  </HoverRow>
                ))}
              </ul>
            </RevealList>
          </div>
        </div>
      </Container>
    </Section>
  );
}