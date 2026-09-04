import { useEffect, useState } from 'react';

import { navChapters } from '@/content/story';
import { homeAnchor, routes } from '@/lib/paths';

import { CloseIcon, MenuIcon } from '@/components/Icons';

export type NavPage =
  | 'home'
  | 'explore'
  | 'scenarios'
  | 'findings'
  | 'research'
  | 'dashboard'
  | 'other';

type Props = {
  page: NavPage;
  /** The chapter currently in view on the home page. */
  currentChapter?: string | null;
  progress?: number;
};

export function StickyStoryNav({
  page,
  currentChapter = null,
  progress = 0,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const chapterHref = (id: string) =>
    page === 'home' ? `#${id}` : homeAnchor(id);

  const routeItems = [
    { id: 'explore', label: 'Explore', href: routes.explore },
    { id: 'scenarios', label: 'Scenarios', href: routes.scenarios },
    { id: 'findings', label: 'Findings', href: routes.findings },
    { id: 'research', label: 'Read', href: routes.research },
    { id: 'dashboard', label: 'Dashboard', href: routes.dashboard },
  ];

  const items = (
    <>
      {navChapters.map((chapter) => (
        <li key={chapter.id}>
          <a
            href={chapterHref(chapter.id)}
            aria-current={
              page === 'home' && currentChapter === chapter.id
                ? 'true'
                : undefined
            }
            onClick={() => setOpen(false)}
          >
            {chapter.label}
          </a>
        </li>
      ))}
      {routeItems.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            className="is-route"
            aria-current={page === item.id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </>
  );

  return (
    <>
      <header className="nav">
        <div className="wrap nav__inner">
          <a
            href={routes.home}
            className="nav__brand"
            aria-label="Automation Risk and the Public Balance Sheet, home"
          >
            Automation Risk <span>&amp; the Public Balance Sheet</span>
          </a>
          <nav aria-label="Main">
            <ul className="nav__links">{items}</ul>
          </nav>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        {page === 'home' && (
          <div
            className="progress-bar"
            aria-hidden="true"
            style={{ '--progress': progress } as React.CSSProperties}
          >
            <span />
          </div>
        )}
      </header>
      {open && (
        <nav id="site-menu" className="menu-sheet" aria-label="Site menu">
          <ul>{items}</ul>
        </nav>
      )}
    </>
  );
}
