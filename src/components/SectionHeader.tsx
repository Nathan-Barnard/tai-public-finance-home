import type { StorySection } from '@/content/types';

import { ArrowRight } from './Icons';

type Props = {
  section: StorySection;
  align?: 'left' | 'center';
  titleClass?: string;
  bodyClass?: string;
  showActions?: boolean;
};

export function SectionHeader({
  section,
  align = 'left',
  titleClass = 't-h2',
  bodyClass = 't-lead measure',
  showActions = true,
}: Props) {
  return (
    <header className={`section-head section-head--${align}`}>
      {section.eyebrow && <p className="t-eyebrow">{section.eyebrow}</p>}
      <h2
        className={`section-head__title ${titleClass}`}
        id={`${section.slug}-title`}
      >
        {section.headline}
      </h2>
      {section.body.length > 0 && (
        <div className="section-head__body stack">
          {section.body.map((paragraph) => (
            <p key={paragraph} className={bodyClass}>
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {showActions && section.actions && (
        <p className="section-head__actions">
          {section.actions.map((action, index) => (
            <a
              key={action.label}
              href={action.href}
              className={index === 0 ? 'btn' : 'btn btn--ghost'}
            >
              {action.label} <ArrowRight />
            </a>
          ))}
        </p>
      )}
    </header>
  );
}
