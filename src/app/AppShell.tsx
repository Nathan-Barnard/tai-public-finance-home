import type { ReactNode } from 'react';

import type { NavId } from '@/content/site';

import { Masthead } from './Masthead';
import { SiteFooter } from './SiteFooter';

export function AppShell({
  current,
  children,
}: {
  current: NavId;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Masthead current={current} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
