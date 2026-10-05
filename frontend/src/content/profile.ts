/* ==========================================================================
   RESUME FACTS, SINGLE SOURCE OF TRUTH
   Every figure, date and claim on this site lives here. It mirrors
   AshwaniResume[September].pdf line for line, so the site and the PDF cannot
   drift apart: when the resume changes, only this file changes.

   Nothing in here may be a claim the resume does not make. Notably there are
   no proficiency levels, because the resume lists skills flatly and inventing
   an "advanced/intermediate" split would be self-assessment the document does
   not support.
   ========================================================================== */

export const PROFILE = {
  name: 'Ashwani Kumar',
  initials: 'AK',
  role: 'Full-Stack Developer',
  location: 'Kolkata, India',
  phone: '+91 76440 59802',
  phoneHref: 'tel:+917644059802',
  email: 'akumarclash1@gmail.com',
  emailHref: 'mailto:akumarclash1@gmail.com',
  github: 'https://github.com/Titansking',
  linkedin: 'https://linkedin.com/in/ashwani-kumar-898189281',
  portfolio: 'portfolio-ashwani.vercel.app',
  degree: 'B.Tech Computer Science, 2026',
} as const;

/** Recruiter-facing lines, rotated in the hero. Every entry is backed by a
 *  project or a bullet further down this file. */
export const SHIPS = [
  'SaaS platforms',
  'Flutter apps and APIs',
  'real-time workspaces',
] as const;

export const EDUCATION = [
  {
    years: '2022 to 2026',
    degree: 'Bachelor of Technology, Computer Science and Engineering',
    school: 'Rungta College of Engineering and Technology',
    place: 'Bhilai, Chhattisgarh',
  },
  {
    years: '2020 to 2022',
    degree: 'Higher Secondary Education, Class XII',
    school: 'Sardar Patel Public School',
    place: 'Bokaro, Jharkhand',
  },
] as const;

export const EXPERIENCE = {
  company: 'Krafzen Inc.',
  title: 'Full-Stack Developer Intern',
  period: 'Oct 2025 to Apr 2026',
  setup: 'Remote, full time',
  contributions: [
    'Engineered responsive web applications across the full stack with React.js and Node.js, restructuring component lifecycles to cut initial render latency by 20%.',
    'Collaborated directly with engineering leads to deploy two SaaS platforms, streamlining sprint workflows and shortening cycle times by 15%.',
    'Conducted 30+ peer code reviews and diagnosed the architectural bottlenecks behind recurring regressions, cutting them and codebase technical debt by 25%.',
  ],
  metrics: [
    { value: 20, suffix: '%', label: 'faster initial render', detail: 'Component lifecycles restructured' },
    { value: 15, suffix: '%', label: 'shorter cycle time', detail: 'Sprint workflow changes' },
    { value: 25, suffix: '%', label: 'less technical debt', detail: 'Bottlenecks found in review' },
  ],
  stack: [
    'React.js',
    'Node.js',
    'Express.js',
    'TypeScript',
    'MongoDB',
    'RESTful APIs',
    'Middleware Architecture',
    'Microservices',
  ],
} as const;

/** Grouped exactly as the resume's Technical Skills block, in resume order. */
export type SkillGroupId =
  | 'languages'
  | 'frontend'
  | 'mobile'
  | 'backend'
  | 'data'
  | 'tooling'
  | 'ai'
  | 'core';

export const SKILL_GROUPS: {
  id: SkillGroupId;
  label: string;
  blurb: string;
  skills: readonly string[];
}[] = [
  {
    id: 'languages',
    label: 'Languages',
    blurb: 'The languages everything else is written in.',
    skills: ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Dart', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'Component libraries and styling systems for accessible interfaces.',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Shadcn UI'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    blurb: 'One shared codebase shipping to Android and iOS.',
    skills: ['Flutter', 'Dart', 'Riverpod'],
  },
  {
    id: 'backend',
    label: 'Backend & architecture',
    blurb: 'Service boundaries, API design, and the middleware behind them.',
    skills: [
      'Node.js',
      'Express.js',
      'RESTful APIs',
      'Middleware Architecture',
      'Microservices',
    ],
  },
  {
    id: 'data',
    label: 'Data & backend services',
    blurb: 'Databases, and the hosted backends that stand in for them.',
    skills: [
      'MongoDB',
      'MySQL',
      'Firebase',
      'Firestore',
      'Firebase Auth',
      'Security Rules',
      'Convex',
      'Mongoose',
    ],
  },
  {
    id: 'tooling',
    label: 'Auth, tools & VCS',
    blurb: 'Authentication, version control, and the tools around the code.',
    skills: [
      'JWT',
      'Bcrypt',
      'Git',
      'GitHub',
      'GitLab',
      'Linux',
      'VS Code',
      'Postman',
      'Axios',
      'Cloudinary',
    ],
  },
  {
    id: 'ai',
    label: 'AI-assisted dev',
    blurb: 'Daily drivers for writing, reviewing and debugging code.',
    skills: ['Cursor', 'GitHub Copilot', 'Claude', 'Gemini', 'OpenCode'],
  },
  {
    id: 'core',
    label: 'CS foundations',
    blurb: 'The theory work that makes the rest of it easier to reason about.',
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'DBMS',
      'Operating Systems',
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  tech: readonly string[];
  repo: string;
  demo: string | null;
  /** Optional direct download, used for the SurplusBite Android APK. */
  download: { label: string; href: string } | null;
  highlights: readonly { title: string; body: string }[];
};

export const PROJECTS: readonly Project[] = [
  {
    id: 'surplusbite',
    title: 'SurplusBite',
    kind: 'Surplus food marketplace, Flutter',
    summary:
      'A marketplace that connects consumers, food providers and NGOs, so unsold food becomes revenue for local businesses instead of waste.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Riverpod', 'Cloudinary'],
    repo: 'https://github.com/Titansking',
    demo: null,
    /* The installable Android build.

       This is the `uc?export=download` form rather than the /view URL you gave
       me: /view renders an HTML preview page and never starts a transfer.

       Note for whoever clicks it: the APK is 58 MB, which is over Drive's
       virus-scan threshold, so Drive answers with its "this file is executable"
       interstitial and the visitor has to press "Download anyway". That step is
       unavoidable from a plain link. Driving it invisibly would mean posting to
       Drive's usercontent endpoint with a `uuid` that Drive regenerates per
       request, so the token cannot be baked into a static href. Hosting the
       build on GitHub Releases instead would skip the interstitial entirely. */
    download: {
      label: 'Android APK',
      href: 'https://drive.google.com/uc?export=download&id=11_OINKsovA-DMpL0_DfKTv1Tny1DxY-K',
    },
    highlights: [
      {
        title: 'No overselling, ever',
        body: 'Atomic Firestore transactions reserve stock, so two buyers claiming the last portion cannot both win, and a cancellation restores it exactly once.',
      },
      {
        title: 'Rules, not trust',
        body: 'Firestore security rules validated by 66 emulator tests, blocking abuse cases such as a buyer editing listing stock or posting a duplicate review.',
      },
      {
        title: 'Live without polling',
        body: 'Listing and order updates stream straight from Firestore, so the app shows stock changes with zero polling.',
      },
      {
        title: 'Testable by construction',
        body: 'Riverpod dependency injection and immutable models let the whole app be tested against fake services with no Firebase project. Email/password and Google sign-in, Cloudinary uploads.',
      },
    ],
  },
  {
    id: 'taskflow',
    title: 'Task Flow',
    kind: 'Kanban project management',
    summary:
      'A board-based project tool for agile teams, built around a stateless API and a dashboard that holds up on a phone.',
    tech: ['React.js', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    repo: 'https://github.com/Titansking',
    demo: 'https://task-flow-ivory-five.vercel.app/',
    download: null,
    highlights: [
      {
        title: 'Throughput',
        body: 'A high-throughput REST API over an indexed MongoDB schema, holding 200+ requests per minute under concurrent load.',
      },
      {
        title: 'One set of schemas',
        body: 'TypeScript across frontend and backend, so mismatched data shapes fail at compile time instead of in production.',
      },
      {
        title: 'Session handling',
        body: 'Stateless JWT sessions with Bcrypt hashing, and custom auth guards on 100% of state-changing routes.',
      },
    ],
  },
];

export const LEDGER = [
  {
    value: 540,
    suffix: '+',
    label: 'Problems solved',
    detail: 'Algorithmic challenges across online judges, mostly in Java.',
  },
  {
    value: 400,
    suffix: '+',
    label: 'Coding Ninjas',
    detail: 'Recursion, trees and dynamic programming.',
  },
  {
    value: 140,
    suffix: '+',
    label: 'GeeksforGeeks',
    detail: 'Arrays, searching, sorting, and system design.',
  },
  {
    value: 4,
    suffix: '',
    label: 'Hacktoberfest PRs',
    detail: 'Merged in 2023, with a tree planted via Tree-Nation.',
  },
] as const;

export const CERTS = [
  {
    title: 'Data Structures & Algorithms',
    issuer: 'Coding Ninjas',
    body: 'Problem-solving across the core algorithms and structures.',
  },
  {
    title: 'Full-Stack Web Development',
    issuer: '30 Days Coding',
    body: 'Frontend frameworks, REST API design, and database architecture.',
  },
  {
    title: 'Java Programming',
    issuer: 'Oracle Certified Foundations',
    body: 'Object-oriented design, data structures, and exception handling.',
  },
  {
    title: 'Open Source Contribution',
    issuer: 'Hacktoberfest 2023',
    body: 'Four merged pull requests, recognised with a community tree.',
  },
] as const;

/**
 * The September resume attributes the letter to "the CEO of Krafzen Inc."
 * without naming them, so neither does the site. Add a name here only once it
 * appears in the PDF too, or a recruiter comparing the two will notice.
 */
export const RECOMMENDATION = {
  quote:
    'Commended for technical execution, ownership, and reliability across our core full-stack platforms.',
  name: 'CEO, Krafzen Inc.',
  role: 'Letter of recommendation',
} as const;