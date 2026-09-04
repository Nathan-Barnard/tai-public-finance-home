import { useEffect, useState } from 'react';

import { CloseIcon, MenuIcon } from '@/components/Icons';
import { nav, type NavId, site } from '@/content/site';
import { routes } from '@/lib/paths';

/** Fixed-height masthead with the four public routes. */
export function Masthead({ current }: { current: NavId }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const items = nav.map((item) => (
    <li key={item.id}>
      <a
        href={item.href}
        aria-current={current === item.id ? 'page' : undefined}
        onClick={() => setOpen(false)}
      >
        {item.label}
      </a>
    </li>
  ));

  return (
    <header className="masthead">
      <div className="wrap masthead__inner">
        <a className="masthead__name" href={routes.home}>
          {site.name}
        </a>
        <nav className="masthead__nav" aria-label="Main">
          <ul className="masthead__list">{items}</ul>
        </nav>
        <button
          type="button"
          className="masthead__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      {open && (
        <nav id="site-menu" className="menu-sheet" aria-label="Site">
          <ul>{items}</ul>
        </nav>
      )}
    </header>
  );
}
