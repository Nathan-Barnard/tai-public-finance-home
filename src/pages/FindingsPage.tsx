import { AppShell } from '@/app/AppShell';
import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import { NotebookRoute } from '@/components/NotebookRoute';
import {
  economies,
  findings,
  findingsMeta,
  notReported,
  readiness,
} from '@/content/findings';
import { links } from '@/content/links';
import { routes } from '@/lib/paths';

/**
 * Where the research stands, in large plain statements: six results and
 * how strongly each holds, the two economies, what has numbers and what
 * does not, and the notebook route.
 */
export default function FindingsPage() {
  return (
    <AppShell page="findings">
      <section className="band findings-hero" aria-labelledby="findings-title">
        <div className="wrap">
          <p className="t-eyebrow">Findings</p>
          <h1 id="findings-title" className="t-hero findings-title">
            What the research has established. And what it has not.
          </h1>
          <p className="t-lead measure-wide">
            Six results carry the argument. Each is stated below in plain words
            with how strongly it holds. Nothing here is promoted beyond what the
            paper can support, and the numbers that do not yet exist are named
            as missing.
          </p>
          <p className="dash-stamp">Reviewed {findingsMeta.updated}.</p>
        </div>
      </section>

      <section className="band band--bone" aria-labelledby="results-title">
        <div className="wrap">
          <h2 id="results-title" className="t-eyebrow findings-label">
            Six results
          </h2>
          <ol className="findings">
            {findings.map((f) => (
              <li
                key={f.id}
                className={`finding finding--${f.standing.toLowerCase()}`}
              >
                <div className="finding__standing">
                  <span className="finding__standing-word">{f.standing}</span>
                  <span className="finding__standing-note">
                    {f.standingNote}
                  </span>
                </div>
                <div className="finding__body">
                  <h3 className="t-h2 finding__statement">{f.statement}</h3>
                  <p className="t-lead finding__plain">{f.plain}</p>
                  <p className="t-small finding__where">
                    {f.where}.{' '}
                    {f.href && (
                      <a href={f.href} rel="noopener">
                        Notebook <ArrowUpRight className="inline-icon" />
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="t-small measure-wide findings-key">
            <strong>Exact</strong> means proven under the stated conditions.{' '}
            <strong>Local</strong> means an approximation for small risk.{' '}
            <strong>Geometry</strong> means an exact statement about directions
            and rank, with any welfare value local.
          </p>
        </div>
      </section>

      <section className="band" aria-labelledby="economies-title">
        <div className="wrap">
          <h2 id="economies-title" className="t-h2">
            Two economies, one criterion.
          </h2>
          <p className="t-lead measure-wide">
            The paper asks the same question in two settings. They are different
            chapters with different purposes, never two settings of one dial.
          </p>
          <div className="economies">
            {economies.map((e) => (
              <article key={e.id} className="economy">
                <p className="t-eyebrow">{e.role}</p>
                <h3 className="t-h3">{e.name}</h3>
                <p className="t-body">{e.what}</p>
                <p className="economy__label">Exact</p>
                <ul className="economy__list">
                  {e.exact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {e.local.length > 0 && (
                  <>
                    <p className="economy__label">Local</p>
                    <ul className="economy__list">
                      {e.local.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--ink on-ink" aria-labelledby="nr-title">
        <div className="wrap">
          <h2 id="nr-title" className="t-h2">
            Deliberately not reported.
          </h2>
          <dl className="not-reported">
            {notReported.map((item) => (
              <div key={item.what}>
                <dt className="t-statement">{item.what}</dt>
                <dd className="t-body">{item.why}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band band--bone" aria-labelledby="numbers-title">
        <div className="wrap">
          <h2 id="numbers-title" className="t-h2">
            Where the numbers are.
          </h2>
          <p className="t-lead measure-wide">
            As of {readiness.asOf}. {readiness.summary}
          </p>
          <div
            className="numbers-grid"
            role="img"
            aria-label="Six comparison cells, all stated in words and none with an accepted number"
          >
            {[
              'No public asset',
              'One public payoff',
              'A broader payoff menu',
            ].map((col) =>
              [
                'Tax at its inherited rate',
                'Tax adjusting through the transition',
              ].map((row) => (
                <div key={`${col}-${row}`} className="numbers-cell">
                  <span className="numbers-cell__title">{row}</span>
                  <span className="numbers-cell__title">{col}</span>
                  <span className="numbers-cell__state">
                    in words, not yet in numbers
                  </span>
                </div>
              )),
            )}
          </div>
          <p className="hero__actions">
            <a className="btn btn--ghost" href={routes.explore}>
              Read the six comparisons in the lab <ArrowRight />
            </a>
          </p>
        </div>
      </section>

      <section className="band" aria-labelledby="route-title">
        <div className="wrap">
          <h2 id="route-title" className="t-h2">
            The route through the evidence.
          </h2>
          <p className="t-lead measure-wide">
            Seven public notebooks walk from the question to the models, the
            methods and the evidence behind each displayed result. Each stop is
            a link.
          </p>
          <NotebookRoute />
          <p className="hero__actions">
            <a className="btn" href={links.paper}>
              Read the paper <ArrowRight />
            </a>
            <a className="btn btn--ghost" href={routes.research}>
              The full library <ArrowRight />
            </a>
            <a className="btn btn--ghost" href={routes.dashboard}>
              The indicators <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
