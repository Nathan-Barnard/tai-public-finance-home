import { links } from './links';
import { routes } from '@/lib/paths';

export const site = {
  name: 'AI, Growth, and Who Gains',
  description:
    'How might AI change who gains from economic growth? A research explainer using historical evidence and economic models to examine ownership, taxes and public investment.',
};

export const nav = [
  { id: 'home', label: 'Home', href: routes.home },
  { id: 'evidence', label: 'Evidence', href: routes.evidence },
  { id: 'explore', label: 'Explore', href: routes.explore },
  { id: 'research', label: 'Research', href: routes.research },
] as const;

export type NavId = (typeof nav)[number]['id'] | 'indicators' | 'other';

export const footerLinks = [
  { label: 'Paper', href: links.paper },
  { label: 'Data notebook', href: links.dataNotebook },
  { label: 'Model notebook', href: links.modelNotebook, external: true },
  { label: 'Sources', href: links.sources },
  { label: 'Code', href: links.code, external: true },
] as const;
