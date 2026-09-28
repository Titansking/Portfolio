import { useRef, useState } from 'react';
import { Terminal, Database, Wrench, Cpu } from 'lucide-react';
import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal, RevealList } from '../ui/Reveal';
import { HoverRow } from '../ui/Motion';

type Level = 'Advanced' | 'Intermediate';
type Group = 'frontend' | 'backend' | 'tooling' | 'core';

const GROUPS: {
  id: Group;
  label: string;
  icon: typeof Terminal;
  blurb: string;
  skills: { name: string; level: Level }[];
}[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Terminal,
    blurb: 'Languages and UI frameworks used to build fast, accessible interfaces.',
    skills: [
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'React', level: 'Advanced' },
      { name: 'JavaScript (ES6+)', level: 'Advanced' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'HTML5', level: 'Advanced' },
      { name: 'CSS3', level: 'Advanced' },
      { name: 'Next.js', level: 'Intermediate' },
      { name: 'Java', level: 'Intermediate' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'shadcn/ui', level: 'Advanced' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & data',
    icon: Database,
    blurb: 'Service architecture, API design, and the databases behind them.',
    skills: [
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Express', level: 'Advanced' },
      { name: 'REST API design', level: 'Advanced' },
      { name: 'MongoDB', level: 'Advanced' },
      { name: 'Mongoose', level: 'Advanced' },
      { name: 'Middleware patterns', level: 'Advanced' },
      { name: 'Convex', level: 'Advanced' },
      { name: 'MySQL', level: 'Intermediate' },
      { name: 'Microservices', level: 'Intermediate' },
    ],
  },
  {
    id: 'tooling',
    label: 'Auth & tooling',
    icon: Wrench,
    blurb: 'Authentication, version control, and the tools around the code.',
    skills: [
      { name: 'JWT', level: 'Advanced' },
      { name: 'bcrypt', level: 'Advanced' },
      { name: 'Git', level: 'Advanced' },
      { name: 'GitHub', level: 'Advanced' },
      { name: 'Postman', level: 'Advanced' },
      { name: 'Axios', level: 'Advanced' },
      { name: 'Linux', level: 'Intermediate' },
      { name: 'GitLab', level: 'Intermediate' },
    ],
  },
  {
    id: 'core',
    label: 'CS foundations',
    icon: Cpu,
    blurb: 'The theory work that makes the rest of it easier to reason about.',
    skills: [
      { name: 'Data structures & algorithms', level: 'Advanced' },
      { name: 'Object-oriented programming', level: 'Advanced' },
      { name: 'Database management systems', level: 'Advanced' },
      { name: 'Operating systems', level: 'Intermediate' },
    ],
  },
];

export default function Skills() {
  const [active, setActive] = useState<Group>('frontend');
  const railRef = useRef<HTMLDivElement>(null);

  const group = GROUPS.find((g) => g.id === active) ?? GROUPS[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const i = GROUPS.findIndex((g) => g.id === active);
    let next = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % GROUPS.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
      next = (i - 1 + GROUPS.length) % GROUPS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = GROUPS.length - 1;

    setActive(GROUPS[next].id);
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
          />
        </Reveal>

        {/* grid-cols-1 is minmax(0,1fr), not the implicit `auto` track. An auto
            track is sized to max-content, so the 60ch paragraph below would
            force the column wider than the viewport on small screens. */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          {/* Vertical rail. A real tablist: arrow keys, Home and End move
              between tabs, per the WAI-ARIA tabs pattern. */}
          <Reveal>
            <div
              ref={railRef}
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
            >
              {GROUPS.map((g) => {
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
                    className={`flex shrink-0 items-center gap-3 rounded-[10px] px-4 py-3 text-left font-display text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 lg:rounded-none lg:rounded-r-[10px] lg:border-r lg:py-4 ${
                      selected
                        ? 'bg-accent-wash text-accent lg:border-accent'
                        : 'text-ink-soft hover:bg-elevated hover:text-ink lg:border-hairline'
                    }`}
                  >
                    <g.icon size={17} className="shrink-0" />
                    {g.label}
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
                stack of identical cards, and no proficiency bars.
                Row keys change per tab, so the stagger replays on every
                category switch rather than only on first paint. */}
            <RevealList>
              <ul className="grid sm:grid-cols-2">
                {group.skills.map((skill) => (
                  <HoverRow
                    key={skill.name}
                    stagger
                    lift={2}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-4 sm:odd:pr-8 sm:even:border-l sm:even:border-l-hairline sm:even:pl-8"
                  >
                    <span className="font-display text-[0.9375rem] font-medium text-ink">
                      {skill.name}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[0.75rem] tracking-wider uppercase ${
                        skill.level === 'Advanced' ? 'text-accent' : 'text-ink-mute'
                      }`}
                    >
                      {skill.level}
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
