import {
  siReact,
  siTypescript,
  siNodedotjs,
  siExpress,
  siMongodb,
  siTailwindcss,
  siNextdotjs,
  siConvex,
  siClerk,
  siGit,
  siLinux,
  siPostman,
  siAxios,
  siJavascript,
  siMysql,
  siGithub,
  siFlutter,
  siDart,
  siFirebase,
  siCloudinary,
  siCursor,
  siGithubcopilot,
  siClaude,
  siGooglegemini,
  siOpencode,
  siShadcnui,
  siHtml5,
  siCss,
} from 'simple-icons';

export type TechMark = { title: string; path: string };

/** Brand marks for the social links. LinkedIn has no Simple Icons entry, so
 *  that one stays a text link rather than becoming a hand-drawn glyph. */
export const GITHUB_MARK: TechMark = { title: siGithub.title, path: siGithub.path };

/**
 * Keyed by display name so content files can reference tools by name.
 * Marks are drawn in a single inherited tone, never their brand hex, so the
 * page's one-accent palette is not quietly abandoned in the project cells.
 *
 * Not every listed tool has a mark. Riverpod, JWT, Bcrypt, Linux-adjacent
 * tooling and the CS foundations have no Simple Icons entry, so getMark
 * returns undefined and the caller falls back to a neutral dot.
 */
const MARKS: Record<string, TechMark> = {
  React: { title: siReact.title, path: siReact.path },
  'React.js': { title: siReact.title, path: siReact.path },
  TypeScript: { title: siTypescript.title, path: siTypescript.path },
  JavaScript: { title: siJavascript.title, path: siJavascript.path },
  'Node.js': { title: siNodedotjs.title, path: siNodedotjs.path },
  'Express.js': { title: siExpress.title, path: siExpress.path },
  MongoDB: { title: siMongodb.title, path: siMongodb.path },
  'Tailwind CSS': { title: siTailwindcss.title, path: siTailwindcss.path },
  'Next.js': { title: siNextdotjs.title, path: siNextdotjs.path },
  Convex: { title: siConvex.title, path: siConvex.path },
  Clerk: { title: siClerk.title, path: siClerk.path },
  Git: { title: siGit.title, path: siGit.path },
  'GitHub': { title: siGithub.title, path: siGithub.path },
  Linux: { title: siLinux.title, path: siLinux.path },
  Postman: { title: siPostman.title, path: siPostman.path },
  Axios: { title: siAxios.title, path: siAxios.path },
  MySQL: { title: siMysql.title, path: siMysql.path },
  // simple-icons dropped the Java mark; the OpenJDK glyph is the closest
  // official path, labelled as Java.
  // Java is intentionally absent. simple-icons has no Java entry, and reusing
  // OpenJDK's mark would put a different company's logo next to a skill the
  // resume claims. It falls through to the neutral dot instead.
  HTML5: { title: siHtml5.title, path: siHtml5.path },
  CSS3: { title: siCss.title, path: siCss.path },
  // Mobile
  Flutter: { title: siFlutter.title, path: siFlutter.path },
  Dart: { title: siDart.title, path: siDart.path },
  // Data & backend services
  Firebase: { title: siFirebase.title, path: siFirebase.path },
  Firestore: { title: siFirebase.title, path: siFirebase.path },
  'Firebase Auth': { title: siFirebase.title, path: siFirebase.path },
  'Security Rules': { title: siFirebase.title, path: siFirebase.path },
  Cloudinary: { title: siCloudinary.title, path: siCloudinary.path },
  'Shadcn UI': { title: siShadcnui.title, path: siShadcnui.path },
  // AI-assisted development
  Cursor: { title: siCursor.title, path: siCursor.path },
  'GitHub Copilot': { title: siGithubcopilot.title, path: siGithubcopilot.path },
  Claude: { title: siClaude.title, path: siClaude.path },
  Gemini: { title: siGooglegemini.title, path: siGooglegemini.path },
  OpenCode: { title: siOpencode.title, path: siOpencode.path },
};

export function getMark(name: string): TechMark | undefined {
  return MARKS[name];
}

/**
 * The scrolling strip. Ordered so the marquee alternates between the layers
 * of the stack rather than bunching all the JavaScript frameworks together,
 * which makes the strip readable while it moves.
 */
/**
 * Resolved through a filter rather than a blind map, because MARKS is
 * intentionally incomplete (see the Java note above). A `.map()` over a name
 * that has no entry yields undefined, and the strip then dereferences
 * `.title` on it and takes down the whole section.
 */
export const ALL_MARKS: TechMark[] = [
  'React.js',
  'TypeScript',
  'Node.js',
  'Express.js',
  'Flutter',
  'Dart',
  'MongoDB',
  'Firebase',
  'Tailwind CSS',
  'Next.js',
  'Convex',
  'JavaScript',
  'MySQL',
  'Cloudinary',
  'Git',
  'Linux',
  'Postman',
  'Axios',
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'Gemini',
  'OpenCode',
]
  .map((key) => MARKS[key])
  .filter((mark): mark is TechMark => mark !== undefined);