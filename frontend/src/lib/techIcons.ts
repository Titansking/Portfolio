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
  siOpenjdk,
  siGithub,
} from 'simple-icons';

export type TechMark = { title: string; path: string };

/** Brand marks for the social links. LinkedIn has no Simple Icons entry, so
 *  that one stays a text link rather than becoming a hand-drawn glyph. */
export const GITHUB_MARK: TechMark = { title: siGithub.title, path: siGithub.path };

/**
 * Keyed by display name so content files can reference tools by name.
 * Marks are drawn in a single inherited tone, never their brand hex, so the
 * page's one-accent palette is not quietly abandoned in the project cells.
 */
const MARKS: Record<string, { title: string; path: string }> = {
  React: { title: siReact.title, path: siReact.path },
  'React.js': { title: siReact.title, path: siReact.path },
  TypeScript: { title: siTypescript.title, path: siTypescript.path },
  'JavaScript': { title: siJavascript.title, path: siJavascript.path },
  'Node.js': { title: siNodedotjs.title, path: siNodedotjs.path },
  Express: { title: siExpress.title, path: siExpress.path },
  MongoDB: { title: siMongodb.title, path: siMongodb.path },
  'Tailwind CSS': { title: siTailwindcss.title, path: siTailwindcss.path },
  'Next.js': { title: siNextdotjs.title, path: siNextdotjs.path },
  Convex: { title: siConvex.title, path: siConvex.path },
  Clerk: { title: siClerk.title, path: siClerk.path },
  Git: { title: siGit.title, path: siGit.path },
  Linux: { title: siLinux.title, path: siLinux.path },
  Postman: { title: siPostman.title, path: siPostman.path },
  Axios: { title: siAxios.title, path: siAxios.path },
  MySQL: { title: siMysql.title, path: siMysql.path },
  Java: { title: 'Java', path: siOpenjdk.path },
};

export function getMark(name: string): TechMark | undefined {
  return MARKS[name];
}
/** Every mark in the map, ordered for the scrolling strip. */
export const ALL_MARKS: TechMark[] = [
  'React',
  'TypeScript',
  'Node.js',
  'Express',
  'MongoDB',
  'Tailwind CSS',
  'Next.js',
  'Convex',
  'Clerk',
  'JavaScript',
  'MySQL',
  'Java',
  'Git',
  'Linux',
  'Postman',
  'Axios',
].map((key) => MARKS[key]);
