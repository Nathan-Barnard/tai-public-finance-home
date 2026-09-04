import { libraryGroups, type LibraryItem } from '@/content/research';
import { homeAnchor, routes } from '@/lib/paths';

import { ArrowRight, ArrowUpRight } from './Icons';

function resolve(item: LibraryItem): { href?: string; external: boolean } {
  if (!item.href) return { external: false };
  if (item.href.startsWith('home:'))
    return { href: homeAnchor(item.href.slice(5)), external: false };
  if (item.href === 'route:explore')
    return { href: routes.explore, external: false };
  if (item.href === 'route:dashboard')
    return { href: routes.dashboard, external: false };
  return { href: item.href, external: item.href.startsWith('http') };
}

export function ResearchLibrary() {
  return (
    <div className="wrap library">
      <nav className="library__toc" aria-label="Sections of the library">
        <ul>
          {libraryGroups.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`}>{group.title}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="library__groups">
        {libraryGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="library__group"
            aria-labelledby={`${group.id}-title`}
          >
            <h2 id={`${group.id}-title`} className="t-h3 library__group-title">
              {group.title}
            </h2>
            {group.intro && (
              <p className="t-body measure-wide library__intro">
                {group.intro}
              </p>
            )}
            <ul className="library__items">
              {group.items.map((item) => {
                const { href, external } = resolve(item);
                return (
                  <li key={item.title} className="library__item">
                    <div className="library__item-text">
                      <p className="library__item-title">{item.title}</p>
                      <p className="t-small">{item.description}</p>
                      <p className="library__meta">
                        <span>{item.format}</span>
                        {item.updated && <span>Reviewed {item.updated}</span>}
                        {item.note && <span>{item.note}</span>}
                      </p>
                    </div>
                    {href && (
                      <a
                        href={href}
                        className="btn btn--ghost library__action"
                        rel={external ? 'noopener' : undefined}
                      >
                        {item.action}{' '}
                        {external ? <ArrowUpRight /> : <ArrowRight />}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
