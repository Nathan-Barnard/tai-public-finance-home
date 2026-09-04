import { AppShell } from '@/app/AppShell';
import { Disclosure } from '@/components/Disclosure';
import { Exhibit } from '@/components/Exhibit';
import { exhibitChart } from '@/components/ExhibitCharts';
import { ExploreTool } from '@/components/ExploreTool';
import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import { PanelGrid } from '@/components/PanelGrid';
import { dataLinkLabel, exhibits } from '@/content/evidence';
import {
  closing,
  distribution,
  explorePreview,
  hero,
  history,
  model,
  policy,
  useful,
} from '@/content/home';
import { evidenceAnchor } from '@/lib/paths';

export default function HomePage() {
  return (
    <AppShell current="home">
      {/* Hero: the question, not a conclusion, and no chart. */}
      <section
        className="section section--plain home-hero"
        aria-labelledby="hero-title"
      >
        <div className="wrap home-hero__inner">
          <p className="t-eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="t-hero home-hero__title">
            {hero.headline}
          </h1>
          <p className="t-lead measure home-hero__body">{hero.body}</p>
          <p className="actions">
            <a className="btn" href={hero.primary.href}>
              {hero.primary.label} <ArrowRight />
            </a>
            <a className="link" href={hero.secondary.href}>
              {hero.secondary.label} <ArrowRight />
            </a>
          </p>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="split-title">
        <div className="wrap">
          <header className="section__head">
            <p className="t-eyebrow">{distribution.eyebrow}</p>
            <h2 id="split-title" className="t-h2">
              {distribution.headline}
            </h2>
            <p className="t-lead measure">{distribution.body}</p>
          </header>
          <PanelGrid
            panels={distribution.panels}
            variant="quad"
            label="Four possible outcomes, each equally weighted"
          />
          <p className="section__closing t-body measure">
            {distribution.closing}
          </p>
          <Disclosure
            title={distribution.disclosure.title}
            body={distribution.disclosure.body}
          />
        </div>
      </section>

      <section className="section" id="history" aria-labelledby="history-title">
        <div className="wrap">
          <header className="section__head">
            <p className="t-eyebrow">{history.eyebrow}</p>
            <h2 id="history-title" className="t-h2">
              {history.headline}
            </h2>
            <p className="t-lead measure">{history.body}</p>
          </header>
          <div className="exhibit-grid">
            {exhibits.map((exhibit) => (
              <Exhibit
                key={exhibit.id}
                id={exhibit.id}
                size="compact"
                title={exhibit.homeTitle}
                chart={exhibitChart[exhibit.id]}
                interpretation={exhibit.interpretation}
                supporting={exhibit.supporting}
                note={exhibit.note}
                link={{
                  label: dataLinkLabel,
                  href: evidenceAnchor(exhibit.id),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="policy-title">
        <div className="wrap">
          <header className="section__head">
            <p className="t-eyebrow">{policy.eyebrow}</p>
            <h2 id="policy-title" className="t-h2">
              {policy.headline}
            </h2>
          </header>
          <PanelGrid panels={policy.panels} variant="pair" />
          <p className="section__closing t-body measure">{policy.closing}</p>
          <Disclosure
            title={policy.disclosure.title}
            body={policy.disclosure.body}
          />
        </div>
      </section>

      <section className="section" aria-labelledby="useful-title">
        <div className="wrap">
          <header className="section__head">
            <p className="t-eyebrow">{useful.eyebrow}</p>
            <h2 id="useful-title" className="t-h2">
              {useful.headline}
            </h2>
            <p className="t-lead measure">{useful.body}</p>
          </header>
          <p className="figure-label">{useful.figureLabel}</p>
          <PanelGrid panels={useful.panels} variant="pair" />
          <p className="section__closing t-body measure">{useful.closing}</p>
          <Disclosure
            title={useful.disclosure.title}
            sections={useful.disclosure.sections}
          />
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="model-title">
        <div className="wrap model-block">
          <header className="section__head">
            <p className="t-eyebrow">{model.eyebrow}</p>
            <h2 id="model-title" className="t-h2">
              {model.headline}
            </h2>
          </header>
          <div className="model-block__body">
            {model.body.map((paragraph) => (
              <p key={paragraph} className="t-body measure">
                {paragraph}
              </p>
            ))}
            <p className="actions">
              {model.actions.map((action) => (
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
        </div>
      </section>

      <section className="section" aria-labelledby="explore-title">
        <div className="wrap">
          <header className="section__head">
            <p className="t-eyebrow">{explorePreview.eyebrow}</p>
            <h2 id="explore-title" className="t-h2">
              {explorePreview.headline}
            </h2>
            <p className="t-lead measure">{explorePreview.body}</p>
          </header>
          <ExploreTool compact />
          <p className="actions explore-preview__action">
            <a className="btn btn--ghost" href={explorePreview.action.href}>
              {explorePreview.action.label} <ArrowRight />
            </a>
          </p>
        </div>
      </section>

      <section
        className="section section--tint"
        aria-labelledby="closing-title"
      >
        <div className="wrap closing-block">
          <h2 id="closing-title" className="t-h2">
            {closing.headline}
          </h2>
          <p className="t-lead measure">{closing.body}</p>
          <p className="actions">
            {closing.actions.map((action) => (
              <a key={action.label} className="link" href={action.href}>
                {action.label} <ArrowRight />
              </a>
            ))}
          </p>
        </div>
      </section>
    </AppShell>
  );
}
