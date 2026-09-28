import { useRef } from 'react';
import { BrainCircuit, Lightbulb, GraduationCap, Download } from 'lucide-react';
import { trackResumeDownload } from '../../services/api';
import { Container, Section, SectionHead, Hairline } from '../ui/Section';
import { Reveal, RevealList } from '../ui/Reveal';
import { HoverCard, ScrollLine } from '../ui/Motion';

const EDUCATION = [
  {
    years: '2022 to 2026',
    degree: 'Bachelor of Technology, Computer Science and Engineering',
    school: 'Rungta College of Engineering and Technology',
    place: 'Bhilai, Chhattisgarh',
  },
  {
    years: '2020 to 2022',
    degree: 'Higher Secondary, Class XII',
    school: 'Sardar Patel Public School',
    place: 'Bokaro, Jharkhand',
  },
];

const INTERESTS = [
  {
    icon: BrainCircuit,
    title: 'Applied ML and IoT',
    body: 'Wiring machine learning models into devices that are actually deployed.',
  },
  {
    icon: Lightbulb,
    title: 'System design',
    body: 'Service boundaries, data modelling, and the trade-offs behind both.',
  },
  {
    icon: GraduationCap,
    title: 'Keeping current',
    body: 'Cloud-native tooling, web standards, and what is landing in browsers.',
  },
];

export default function About() {
  const educationRef = useRef<HTMLOListElement>(null);
  const handleDownloadResume = () => {
    trackResumeDownload();
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.setAttribute('download', 'Ashwani_Kumar_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section id="about">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Sticky rail. Holds the heading and one action, and stays put
              while the prose column scrolls past it. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHead
                title={
                  <>
                    A developer who
                    <br />
                    likes owning
                    <br />
                    <span className="text-accent">the whole stack.</span>
                  </>
                }
                lede="Backend, frontend, and the deployment path in between."
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <button
                type="button"
                onClick={handleDownloadResume}
                className="btn-ghost btn-ghost-hover btn-ghost-active"
              >
                <Download size={17} />
                Download Resume
              </button>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <div className="space-y-6 text-[1.0625rem] leading-relaxed text-ink-soft">
                <p>
                  I am in the final stretch of a B.Tech in Computer Science at Rungta
                  College of Engineering and Technology, graduating in 2026. I started
                  out building web pages, and the work has since moved up the stack
                  into the parts that are harder to reverse: data models, auth
                  boundaries, and the shape of a service.
                </p>
                <p>
                  Most of that has been learned on live products rather than in
                  tutorials. My internship at Krafzen Inc. was fully remote, which
                  meant owning features end to end, writing the tests, and getting
                  paged when something broke. That is the part of the job I value
                  most, and the part I am best at.
                </p>
                <p>
                  I am looking for a full-time role on a product team that ships
                  often and reviews code seriously.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-16">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                Education
              </h3>
              <Hairline className="mt-5" />

              <ol ref={educationRef} className="relative mt-8 space-y-9 pl-7">
                {/* The spine fills with accent as the list is scrolled through,
                    so progress through the education is visible at a glance. */}
                <ScrollLine target={educationRef} className="inset-y-1 left-[3px]" />
                {EDUCATION.map((entry) => (
                  <li key={entry.degree} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-7 h-[7px] w-[7px] rounded-full bg-accent"
                    />
                    <p className="font-mono text-xs tracking-wide text-accent">
                      {entry.years}
                    </p>
                    <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                      {entry.degree}
                    </h4>
                    <p className="mt-1 text-ink-soft">{entry.school}</p>
                    <p className="mt-0.5 text-sm text-ink-mute">{entry.place}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.08} className="mt-16">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                What I chase
              </h3>
              <Hairline className="mt-5" />

              {/* Hairline columns rather than three identical cards. */}
              <RevealList className="grid gap-x-10 gap-y-8 pt-8 sm:grid-cols-3">
                {INTERESTS.map(({ icon: Icon, title, body }) => (
                  <HoverCard key={title} stagger>
                    <Icon size={22} className="text-accent transition-transform duration-300" />
                    <h4 className="mt-4 font-display text-base font-semibold text-ink">
                      {title}
                    </h4>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {body}
                    </p>
                  </HoverCard>
                ))}
              </RevealList>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
