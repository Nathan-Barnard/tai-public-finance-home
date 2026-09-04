import { AppShell } from '@/app/AppShell';
import { ArrowUpRight } from '@/components/Icons';
import {
  branches,
  dashboardMeta,
  evidenceRoute,
  headlineResults,
  matrixReadiness,
  notReported,
  repositories,
} from '@/content/dashboard';
import { links } from '@/content/links';
import { matrixColumns, matrixRows } from '@/lib/lab-model';
import { routes } from '@/lib/paths';

const sections = [
  { id: 'results', label: 'Headline results' },
  { id: 'route', label: 'Evidence route' },
  { id: 'branches', label: 'Model branches' },
  { id: 'readiness', label: 'Comparison readiness' },
  { id: 'not-reported', label: 'Not reported' },
  { id: 'code', label: 'Code and computation' },
  { id: 'method', label: 'How this is built' },
];

/**
 * A dated monitor in the style of an indicators dashboard: a hero line, an
 * update stamp, tiles with a status label each, and methodology notes.
 * Every entry comes from the repository's own manifests.
 */
export default function DashboardPage() {
  return (
    <AppShell page="dashboard">
      <section
        className="band band--tight dash-hero"
        aria-labelledby="dash-title"
      >
        <div className="wrap">
          <p className="t-eyebrow">Research dashboard</p>
          <h1 id="dash-title" className="t-h2">
            An up-to-date monitor of what this research has established.
          </h1>
          <p className="t-lead measure-wide">
            What is proven under stated conditions, what is a local
            approximation, what is an illustration, and what is deliberately not
            reported.
          </p>
          <p className="dash-stamp">
            <strong>Last updated {dashboardMeta.updated}.</strong>{' '}
            {dashboardMeta.cadence}
          </p>
          <nav aria-label="Dashboard sections" className="dash-nav">
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section
        id="results"
        className="band band--tight band--bone"
        aria-labelledby="results-title"
      >
        <div className="wrap">
          <h2 id="results-title" className="t-h3 dash-section-title">
            Headline results
          </h2>
          <p className="t-body measure-wide">
            Six results carry the argument. Each tile names the result in plain
            words, its standing, and the conditions under which it holds.
          </p>
          <ul className="tiles">
            {headlineResults.map((result) => (
              <li
                key={result.title}
                className={`tile tile--${result.status.split(' ')[0].toLowerCase()}`}
              >
                <p className="tile__status">{result.status}</p>
                <h3 className="tile__title">{result.title}</h3>
                <p className="t-small tile__plain">{result.plain}</p>
                <dl className="tile__meta">
                  <dt>Holds when</dt>
                  <dd>{result.conditions}</dd>
                  <dt>Where to read it</dt>
                  <dd>{result.where}</dd>
                </dl>
                {result.href && (
                  <a href={result.href} rel="noopener" className="tile__link">
                    Open the notebook <ArrowUpRight className="inline-icon" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="route"
        className="band band--tight"
        aria-labelledby="route-title"
      >
        <div className="wrap">
          <h2 id="route-title" className="t-h3 dash-section-title">
            Evidence route
          </h2>
          <p className="t-body measure-wide">
            The seven public notebooks, in reading order, with the standing of
            the evidence each one shows.
          </p>
          <section
            className="table-scroll"
            aria-label="Notebook route, scrolls sideways on small screens"
          >
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Notebook</th>
                  <th scope="col">Reader question</th>
                  <th scope="col">Evidence shown</th>
                  <th scope="col">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {evidenceRoute.map((entry) => (
                  <tr key={entry.title}>
                    <th scope="row">
                      <a href={entry.href} rel="noopener">
                        {entry.title}
                      </a>
                    </th>
                    <td>{entry.question}</td>
                    <td>{entry.evidence}</td>
                    <td>{entry.reviewed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>

      <section
        id="branches"
        className="band band--tight band--bone"
        aria-labelledby="branches-title"
      >
        <div className="wrap">
          <h2 id="branches-title" className="t-h3 dash-section-title">
            Model branches
          </h2>
          <p className="t-body measure-wide">
            Two economies appear in the paper. They are different chapters with
            different purposes, never two settings of one dial.
          </p>
          <div className="branches">
            {branches.map((branch) => (
              <article key={branch.name} className="branch">
                <p className="t-eyebrow">{branch.role}</p>
                <h3 className="t-h3">{branch.name}</h3>
                <dl className="branch__meta">
                  <dt>Covers</dt>
                  <dd>{branch.covers}</dd>
                  <dt>Exact results</dt>
                  <dd>{branch.exact}</dd>
                  <dt>Local or approximate results</dt>
                  <dd>{branch.local}</dd>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="readiness"
        className="band band--tight"
        aria-labelledby="readiness-title"
      >
        <div className="wrap">
          <h2 id="readiness-title" className="t-h3 dash-section-title">
            Comparison readiness
          </h2>
          <p className="t-body measure-wide">
            As of {matrixReadiness.asOf}. {matrixReadiness.summary}
          </p>
          <section
            className="table-scroll"
            aria-label="Readiness of the six comparisons"
          >
            <table className="dash-table dash-table--matrix">
              <thead>
                <tr>
                  <th scope="col">Tax policy</th>
                  {matrixColumns.map((column) => (
                    <th key={column.id} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{row.label}</th>
                    {matrixColumns.map((column) => (
                      <td key={column.id}>
                        <span className="ready ready--yes">
                          Qualitative statement: available
                        </span>
                        <span className="ready ready--no">
                          Numerical welfare: not yet accepted
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <h3 className="dash-subtitle">
            What has to happen before a number appears
          </h3>
          <ul className="dash-list">
            {matrixReadiness.gates.map((gate) => (
              <li key={gate}>{gate}</li>
            ))}
          </ul>
          <p className="t-small">
            The interface is built so that validated figures can be added cell
            by cell without rebuilding it. None are added now.
          </p>
        </div>
      </section>

      <section
        id="not-reported"
        className="band band--tight band--ink on-ink"
        aria-labelledby="nr-title"
      >
        <div className="wrap">
          <h2 id="nr-title" className="t-h3 dash-section-title">
            Deliberately not reported
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

      <section
        id="code"
        className="band band--tight"
        aria-labelledby="code-title"
      >
        <div className="wrap">
          <h2 id="code-title" className="t-h3 dash-section-title">
            Code and computation
          </h2>
          <ul className="repo-list">
            {repositories.map((repo) => (
              <li key={repo.name} className="repo">
                <span className="repo__name">{repo.name}</span>
                <span className="t-small">{repo.role}</span>
                {repo.href ? (
                  <a href={repo.href} rel="noopener" className="repo__link">
                    GitHub <ArrowUpRight className="inline-icon" />
                  </a>
                ) : (
                  <span className="repo__private">{repo.visibility}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="method"
        className="band band--tight band--bone"
        aria-labelledby="method-title"
      >
        <div className="wrap method">
          <h2 id="method-title" className="t-h3 dash-section-title">
            How this dashboard is built
          </h2>
          <p className="t-body measure-wide">
            The dashboard reads the same content the website is built from: the
            notebook manifest, the notebooks’ review dates, the compact frozen
            exports, and the paper’s stated conditions for each result. It is
            regenerated when the site is rebuilt and never fetches anything
            while you read it. Status labels follow the wording each source
            permits; a label is never promoted here.
          </p>
          <h3 className="dash-subtitle">Cite the draft</h3>
          <p className="cite t-small">
            Barnard, N. (2026).{' '}
            <em>Automation Risk and the Public Balance Sheet</em>. Draft,
            September 2026. <a href={links.paper}>PDF</a> ·{' '}
            <a href={routes.research}>Library</a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
