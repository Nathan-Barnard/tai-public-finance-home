import type { ComponentType } from 'react';

import DashboardPage from './DashboardPage';
import ExplorePage from './ExplorePage';
import FindingsPage from './FindingsPage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import ResearchPage from './ResearchPage';
import ScenariosPage from './ScenariosPage';

// Used by the prerender step only; each page has its own client entry in
// src/entries so the browser downloads just the code for the page it is on.
export type PageId =
  | 'home'
  | 'explore'
  | 'scenarios'
  | 'findings'
  | 'research'
  | 'dashboard'
  | 'not-found';

export const pages: ReadonlyArray<{ id: PageId; file: string }> = [
  { id: 'home', file: 'index.html' },
  { id: 'explore', file: 'explore/index.html' },
  { id: 'scenarios', file: 'scenarios/index.html' },
  { id: 'findings', file: 'findings/index.html' },
  { id: 'research', file: 'research/index.html' },
  { id: 'dashboard', file: 'dashboard/index.html' },
  { id: 'not-found', file: '404.html' },
];

const components: Record<PageId, ComponentType> = {
  home: HomePage,
  explore: ExplorePage,
  scenarios: ScenariosPage,
  findings: FindingsPage,
  research: ResearchPage,
  dashboard: DashboardPage,
  'not-found': NotFoundPage,
};

export function pageComponent(id: PageId): ComponentType {
  return components[id];
}
