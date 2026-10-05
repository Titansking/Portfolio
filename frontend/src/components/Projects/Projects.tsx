import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SPRING } from '../ui/motionPresets';
import { ArrowUpRight, ChevronDown, Download } from 'lucide-react';
import { getMark, GITHUB_MARK } from '../../lib/techIcons';
import { PROJECTS, type Project } from '../../content/profile';
import { Container, Section, SectionHead } from '../ui/Section';
import { Reveal } from '../ui/Reveal';

function TechRow({ names }: { names: readonly string[] }) {
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

/** GitHub / live site. Each is 44px, the minimum touch target the platform
 *  guidelines ask for.
 *
 *  A download link is not repeated here. The APK has a labelled row in the body
 *  of the cell, which says what it is; a third unlabelled icon in this corner
 *  would only duplicate it. */
function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} source on GitHub, opens in a new tab`}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
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
          aria-label={`${project.title} live site, opens in a new tab`}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <ArrowUpRight size={17} />
        </a>
      ) : null}
      </div>
  );
}

function ProjectCell({ project, wide }: { project: Project; wide: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = `panel-${project.id}`;

  return (
    <motion.article
      className={`group flex h-full flex-col rounded-[18px] border border-hairline bg-surface p-7 transition-colors duration-300 hover:border-hairline-strong sm:p-9 ${
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
        <ProjectLinks project={project} />
      </div>

      <p className="mt-3 font-mono text-[0.8125rem] text-accent">{project.kind}</p>

      {/* The APK gets a labelled row rather than a fourth icon. "Download" on
          its own does not say what comes down, and the icon-only button in the
          corner is easy to miss next to the source and demo links. */}
      {project.download ? (
        /* `download` is deliberately absent. It only works same-origin, so on a
           Google Drive URL the browser ignores it and the server decides
           whether the file arrives or a preview page does. Leaving it off keeps
           the markup honest about what actually happens. */
        <a
          href={project.download.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Download ${project.title} ${project.download.label}, opens in a new tab`}
          className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-hairline-strong px-3.5 font-display text-[0.875rem] font-semibold text-ink no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <Download size={16} />
          {project.download.label}
        </a>
      ) : null}

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
          className="-ml-2 flex min-h-11 cursor-pointer items-center gap-2 px-2 font-display text-[0.9375rem] font-semibold text-ink transition-colors duration-200 hover:text-accent"
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
            lede="One shipped as an installable Android app, one as a live web URL. Both from an empty repository, which is the part I care about most."
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