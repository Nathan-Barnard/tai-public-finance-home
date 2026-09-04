import type { ReactNode } from 'react';

import { ArrowRight } from './Icons';

type Props = {
  id: string;
  title: string;
  /** Extra framing paragraph, shown on the Evidence page only. */
  intro?: string;
  chart: ReactNode;
  interpretation: string;
  supporting?: string;
  note: string;
  conclusion?: string;
  link: { label: string; href: string };
  /** Compact for the homepage, full for the Evidence page. */
  size: 'compact' | 'full';
};

/** One evidence module: chart, reading, caveat, and a route to the sources. */
export function Exhibit({
  id,
  title,
  intro,
  chart,
  interpretation,
  supporting,
  note,
  conclusion,
  link,
  size,
}: Props) {
  // The Evidence page puts each exhibit directly under the page heading; on
  // the homepage they sit inside a section that already has an h2.
  const Heading = size === 'full' ? 'h2' : 'h3';
  return (
    <article
      id={size === 'full' ? id : undefined}
      className={`exhibit exhibit--${size}`}
      aria-labelledby={`${id}-${size}-title`}
    >
      <Heading id={`${id}-${size}-title`} className="exhibit__title t-h3">
        {title}
      </Heading>
      {intro && <p className="exhibit__intro t-body">{intro}</p>}
      <div className="exhibit__chart">{chart}</div>
      <div className="exhibit__reading">
        <p className="exhibit__interpretation">{interpretation}</p>
        {supporting && <p className="t-body">{supporting}</p>}
        {conclusion && (
          <p className="exhibit__conclusion t-body">{conclusion}</p>
        )}
        <p className="t-note">{note}</p>
        <a className="link" href={link.href}>
          {link.label} <ArrowRight />
        </a>
      </div>
    </article>
  );
}
