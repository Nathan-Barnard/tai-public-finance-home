// Every internal link goes through here so the site works from the GitHub
// Pages subpath in production and from the root in local development.
export const BASE = import.meta.env.BASE_URL;

export const SITE_URL =
  'https://nathan-barnard.github.io/tai-public-finance-home/';

export function href(path: string): string {
  return BASE + path.replace(/^\//, '');
}

export const routes = {
  home: href(''),
  evidence: href('evidence/'),
  explore: href('explore/'),
  research: href('research/'),
  indicators: href('dashboard/'),
} as const;

export function evidenceAnchor(id: string): string {
  return `${routes.evidence}#${id}`;
}
