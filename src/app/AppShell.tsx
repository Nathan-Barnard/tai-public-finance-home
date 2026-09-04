import type { ReactNode } from 'react';

import { SiteFooter } from './SiteFooter';
import { StickyStoryNav, type NavPage } from './StickyStoryNav';

type Props = {
  page: NavPage;
  children: ReactNode;
  currentChapter?: string | null;
  progress?: number;
};

export function AppShell({ page, children, currentChapter, progress }: Props) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <StickyStoryNav
        page={page}
        currentChapter={currentChapter}
        progress={progress}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
