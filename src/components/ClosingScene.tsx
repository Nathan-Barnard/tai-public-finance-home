import type { Action, StorySection } from '@/content/types';

import { ArrowRight, ArrowUpRight } from './Icons';

export function ClosingScene({
  section,
  actions,
}: {
  section: StorySection;
  actions: Action[];
}) {
  return (
    <div className="wrap closing on-ink">
      <h2 className="t-h2 closing__title" id={`${section.slug}-title`}>
        {section.headline}
      </h2>
      {section.body.map((line) => (
        <p key={line} className="t-lead closing__copy measure-wide">
          {line}
        </p>
      ))}
      <ul className="closing__actions">
        {actions.map((action) => (
          <li key={action.label}>
            <a
              href={action.href}
              className="btn btn--ghost"
              rel={action.external ? 'noopener' : undefined}
            >
              {action.label}{' '}
              {action.external ? <ArrowUpRight /> : <ArrowRight />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
