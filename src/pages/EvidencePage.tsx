import { AppShell } from '@/app/AppShell';
import { Exhibit } from '@/components/Exhibit';
import { exhibitChart } from '@/components/ExhibitCharts';
import { ArrowRight } from '@/components/Icons';
import {
  dataLinkLabel,
  evidencePage,
  exhibits,
  sources,
} from '@/content/evidence';
import { routes } from '@/lib/paths';

export default function EvidencePage() {
  return (
    <AppShell current="evidence">
      <section
        className="section section--plain page-head"
        aria-labelledby="evidence-title"
      >
        <div className="wrap">
          <h1 id="evidence-title" className="t-hero page-head__title">
            {evidencePage.title}
          </h1>
          <p className="t-lead measure">{evidencePage.intro}</p>
          <nav className="page-toc" aria-label="Exhibits">
            <ul>
              {exhibits.map((exhibit) => (
                <li key={exhibit.id}>
                  <a href={`#${exhibit.id}`}>{exhibit.heading}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {exhibits.map((exhibit, index) => (
        <section
          key={exhibit.id}
          className={`section ${index % 2 === 0 ? 'section--tint' : ''}`}
          aria-labelledby={`${exhibit.id}-full-title`}
        >
          <div className="wrap">
            <Exhibit
              id={exhibit.id}
              size="full"
              title={exhibit.heading}
              intro={exhibit.intro}
              chart={exhibitChart[exhibit.id]}
              interpretation={exhibit.interpretation}
              supporting={exhibit.supporting}
              conclusion={exhibit.conclusion}
              note={exhibit.note}
              link={{ label: dataLinkLabel, href: `#${sources.id}` }}
            />
          </div>
        </section>
      ))}

      <section
        className="section"
        id={sources.id}
        aria-labelledby="sources-title"
      >
        <div className="wrap sources">
          <h2 id="sources-title" className="t-h2">
            {sources.heading}
          </h2>
          <p className="t-lead measure">{sources.intro}</p>
          <dl className="sources__list">
            {sources.entries.map((entry) => (
              <div key={entry.title} className="sources__item">
                <dt className="t-h3">{entry.title}</dt>
                <dd className="t-body">{entry.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="actions">
            <a className="btn btn--ghost" href={sources.action.href}>
              {sources.action.label} <ArrowRight />
            </a>
            <a className="link" href={routes.indicators}>
              Longer-run indicators <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
