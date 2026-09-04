import type { ComponentType } from 'react';

import DashboardPage from './DashboardPage';
import EvidencePage from './EvidencePage';
import ExplorePage from './ExplorePage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import ResearchPage from './ResearchPage';

// Used by the prerender step. Each page also has its own client entry in
// src/entries, so a browser downloads only the code for the page it is on.
export type PageId =
  | 'home'
  | 'evidence'
  | 'explore'
  | 'research'
  | 'dashboard'
  | 'not-found';

export const pages: ReadonlyArray<{ id: PageId; file: string }> = [
  { id: 'home', file: 'index.html' },
  { id: 'evidence', file: 'evidence/index.html' },
  { id: 'explore', file: 'explore/index.html' },
  { id: 'research', file: 'research/index.html' },
  { id: 'dashboard', file: 'dashboard/index.html' },
  { id: 'not-found', file: '404.html' },
];

const components: Record<PageId, ComponentType> = {
  home: HomePage,
  evidence: EvidencePage,
  explore: ExplorePage,
  research: ResearchPage,
  dashboard: DashboardPage,
  'not-found': NotFoundPage,
};

export function pageComponent(id: PageId): ComponentType {
  return components[id];
}
