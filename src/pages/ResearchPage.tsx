import { AppShell } from '@/app/AppShell';
import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import { relatedResearch, researchPage } from '@/content/research';

export default function ResearchPage() {
  return (
    <AppShell current="research">
      <section
        className="section section--plain page-head"
        aria-labelledby="research-title"
      >
        <div className="wrap">
          <h1 id="research-title" className="t-hero page-head__title">
            {researchPage.title}
          </h1>
        </div>
      </section>

      <section className="section" aria-label="What the research does">
        <div className="wrap">
          <dl className="research-sections">
            {researchPage.sections.map((section) => (
              <div key={section.heading} className="research-section">
                <dt className="t-h3">{section.heading}</dt>
                <dd className="t-lead">{section.body}</dd>
              </div>
            ))}
          </dl>
          <p className="actions research-actions">
            {researchPage.actions.map((action) => (
              <a
                key={action.label}
                className="link"
                href={action.href}
                rel={
                  'external' in action && action.external
                    ? 'noopener'
                    : undefined
                }
              >
                {action.label}{' '}
                {'external' in action && action.external ? (
                  <ArrowUpRight />
                ) : (
                  <ArrowRight />
                )}
              </a>
            ))}
          </p>
        </div>
      </section>

      <section
        className="section section--tint"
        aria-labelledby="indicators-title"
      >
        <div className="wrap indicators-pointer">
          <h2 id="indicators-title" className="t-h2">
            {researchPage.indicators.heading}
          </h2>
          <p className="t-lead measure">{researchPage.indicators.body}</p>
          <p className="actions">
            <a
              className="btn btn--ghost"
              href={researchPage.indicators.action.href}
            >
              {researchPage.indicators.action.label} <ArrowRight />
            </a>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="wrap">
          <h2 id="related-title" className="t-h2 section__head">
            Related research
          </h2>
          <ul className="related">
            {relatedResearch.map((item) => (
              <li key={item.title} className="related__item">
                <h3 className="related__title t-h3">
                  <a href={item.href} rel="noopener">
                    {item.title}
                  </a>
                </h3>
                <p className="related__authors t-small">{item.authors}</p>
                <p className="related__summary t-body">{item.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
