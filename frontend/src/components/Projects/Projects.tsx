import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SPRING } from '../ui/motionPresets';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { getMark, GITHUB_MARK } from '../../lib/techIcons';
import { Container, Section, SectionHead } from '../ui/Section';
import { Reveal } from '../ui/Reveal';

type Highlight = { title: string; body: string };

type Project = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  tech: string[];
  repo: string;
  demo: string | null;
  highlights: Highlight[];
};

const PROJECTS: Project[] = [
  {
    id: 'gdocs',
    title: 'Google Docs Clone',
    kind: 'Real-time collaborative editor',
    summary:
      'A shared document workspace where many people edit the same page at once, with live cursors and export to the usual formats.',
    tech: ['React.js', 'TypeScript', 'Convex', 'Clerk', 'Liveblocks'],
    repo: 'https://github.com/Titansking',
    demo: null,
    highlights: [
      {
        title: 'Concurrency',
        body: 'State stays in sync across up to 50 simultaneous editors with propagation held under 50ms.',
      },
      {
        title: 'Presence and access',
        body: 'Liveblocks WebSocket pipelines carry presence and cursor position, with Clerk handling role-based access on every document route.',
      },
      {
        title: 'Editing surface',
        body: 'Rich-text controls, structured tables, asset uploads, and export to PDF, HTML, TXT or JSON.',
      },
    ],
  },
  {
    id: 'taskflow',
    title: 'Task Flow',
    kind: 'Kanban project management',
    summary:
      'A board-based project tool for agile teams, built around a stateless API and a dashboard that holds up on a phone.',
    tech: ['React.js', 'Node.js', 'Express', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    repo: 'https://github.com/Titansking',
    demo: 'https://task-flow-ivory-five.vercel.app/',
    highlights: [
      {
        title: 'Throughput',
        body: 'A REST API over an indexed MongoDB schema that holds 200+ requests per minute under concurrent load.',
      },
      {
        title: 'Type safety',
        body: 'TypeScript end to end, which removed the runtime bugs that used to come from mismatched data shapes.',
      },
      {
        title: 'Session handling',
        body: 'Stateless JWT sessions with bcrypt hashing, plus route guards on every state-mutating endpoint.',
      },
    ],
  },
];

function TechRow({ names }: { names: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {names.map((name) => {
        const mark = getMark(name);
        return (
          <li
            key={name}
            className="flex items-center gap-2 text-ink-mute transition-colors duration-200 hover:text-ink"
          >
            {mark ? (
              <svg
                viewBox="0 0 24 24"
                width={17}
                height={17}
                fill="currentColor"
                role="img"
                aria-label={mark.title}
              >
                <path d={mark.path} />
              </svg>
            ) : (
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-current"
              />
            )}
            <span className="font-mono text-[0.8125rem] whitespace-nowrap">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ProjectCell({ project, wide }: { project: Project; wide: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = `panel-${project.id}`;

  return (
    <motion.article
      className={`group flex flex-col rounded-[18px] border border-hairline bg-surface p-7 transition-colors duration-300 hover:border-hairline-strong sm:p-9 ${
        wide ? 'lg:p-11' : ''
      }`}
      initial={false}
      whileHover={reduce ? undefined : { y: -5 }}
      whileTap={reduce ? undefined : { y: -1, scale: 0.997 }}
      transition={SPRING}
    >
      <div className="flex items-start justify-between gap-6">
        <h3
          className={`font-display font-bold tracking-tight ${
            wide ? 'text-3xl sm:text-[2.5rem]' : 'text-2xl sm:text-3xl'
          }`}
        >
          {project.title}
        </h3>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source on GitHub`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden="true">
              <path d={GITHUB_MARK.path} />
            </svg>
          </a>
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <ArrowUpRight size={17} />
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-3 font-mono text-[0.8125rem] text-accent">{project.kind}</p>

      <p
        className={`mt-6 leading-relaxed text-ink-soft ${
          wide ? 'max-w-[54ch] text-[1.0625rem]' : 'max-w-[46ch]'
        }`}
      >
        {project.summary}
      </p>

      <div className="mt-8">
        <TechRow names={project.tech} />
      </div>

      <div className="mt-auto pt-9">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex cursor-pointer items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink transition-colors duration-200 hover:text-accent"
        >
          {open ? 'Hide' : 'Read'} technical detail
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={panelId}
              key="detail"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-6 space-y-5 border-t border-hairline pt-6">
                {project.highlights.map((h) => (
                  <li key={h.title} className="flex gap-5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="font-display text-[0.9375rem] font-semibold text-ink">
                        {h.title}
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                        {h.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <Section id="projects" className="border-t border-hairline">
      <Container>
        <Reveal>
          <SectionHead
            title={
              <>
                Two products,
                <br />
                <span className="text-accent">built and released.</span>
              </>
            }
            lede="Both shipped from an empty repository to a live URL, which is the part I care about most."
          />
        </Reveal>

        {/* Exactly two projects, so exactly two cells. Unequal columns give the
            pair a rhythm instead of a mirrored 50/50. */}
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <ProjectCell project={PROJECTS[0]} wide />
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectCell project={PROJECTS[1]} wide={false} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
