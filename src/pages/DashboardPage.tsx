import { useState } from 'react';

import { AppShell } from '@/app/AppShell';
import { ArrowUpRight } from '@/components/Icons';
import {
  formatDate,
  formatValue,
  IndicatorChart,
  type IndicatorChartData,
  styleFor,
} from '@/components/IndicatorChart';
import {
  indicatorGroups,
  indicatorsMeta,
  methodology,
  noteOverrides,
  places,
  titleOverrides,
} from '@/content/indicators';
import data from '@/data/indicators.json';
import { routes } from '@/lib/paths';

const charts = new Map(
  (data.charts as IndicatorChartData[]).map((c) => [c.id, c]),
);

function niceDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * An indicators dashboard in the manner of an economic monitor: dated,
 * sectioned, every chart sourced, every series frozen at build time.
 */
export default function DashboardPage() {
  const [highlight, setHighlight] = useState<string | null>(null);
  return (
    <AppShell current="indicators">
      <section
        className="band band--tight dash-hero"
        aria-labelledby="dash-title"
      >
        <div className="wrap">
          <p className="t-eyebrow">{indicatorsMeta.eyebrow}</p>
          <h1 id="dash-title" className="t-h2">
            {indicatorsMeta.headline}
          </h1>
          <p className="t-lead measure-wide">{indicatorsMeta.lead}</p>
          <p className="dash-stamp">
            <strong>Data downloaded {niceDate(data.fetchedAt)}.</strong>{' '}
            {indicatorsMeta.cadence}
          </p>
          <nav aria-label="Dashboard sections" className="dash-nav">
            <ul>
              {indicatorGroups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.title}</a>
                </li>
              ))}
              <li>
                <a href="#method">How this is built</a>
              </li>
            </ul>
          </nav>
          <div
            className="place-picker"
            role="group"
            aria-label="Highlight a place in every chart"
          >
            <span className="place-picker__label">Highlight</span>
            {places.map((place, index) => {
              const style = styleFor(place, index);
              const on = highlight === place;
              return (
                <button
                  key={place}
                  type="button"
                  className={`place-chip ${on ? 'is-on' : ''}`}
                  aria-pressed={on}
                  onClick={() => setHighlight(on ? null : place)}
                >
                  <span
                    className="place-chip__swatch"
                    style={{ background: style.color }}
                    aria-hidden="true"
                  />
                  {place}
                </button>
              );
            })}
            {highlight && (
              <button
                type="button"
                className="place-chip place-chip--clear"
                onClick={() => setHighlight(null)}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {indicatorGroups.map((group, index) => (
        <section
          key={group.id}
          id={group.id}
          className={`band band--tight ${index % 2 === 0 ? 'band--bone' : ''}`}
          aria-labelledby={`${group.id}-title`}
        >
          <div className="wrap">
            <h2 id={`${group.id}-title`} className="t-h2 dash-group-title">
              {group.title}
            </h2>
            <p className="t-lead measure-wide dash-group-intro">
              {group.intro}
            </p>
            <div className="indicators">
              {group.charts.map((entry) => {
                const chart = charts.get(entry.id);
                if (!chart) {
                  return (
                    <article
                      key={entry.id}
                      className="indicator indicator--missing"
                    >
                      <p className="t-small">
                        This series is not in the current data file.
                      </p>
                    </article>
                  );
                }
                return (
                  <IndicatorPanel
                    key={entry.id}
                    chart={chart}
                    why={entry.why}
                    highlight={highlight}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section
        id="method"
        className="band band--tight"
        aria-labelledby="method-title"
      >
        <div className="wrap method">
          <h2 id="method-title" className="t-h3 dash-section-title">
            How this dashboard is built
          </h2>
          {methodology.map((paragraph) => (
            <p key={paragraph} className="t-body measure-wide">
              {paragraph}
            </p>
          ))}
          <p className="t-small">
            <a href={indicatorsMeta.dataHref} rel="noopener">
              The frozen data file <ArrowUpRight className="inline-icon" />
            </a>{' '}
            ·{' '}
            <a href={indicatorsMeta.scriptHref} rel="noopener">
              The fetch script <ArrowUpRight className="inline-icon" />
            </a>{' '}
            · <a href={routes.research}>Research behind the site</a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function IndicatorPanel({
  chart,
  why,
  highlight,
}: {
  chart: IndicatorChartData;
  why: string;
  highlight: string | null;
}) {
  const latestDate = chart.series.reduce(
    (best, s) => (s.lastDate > best ? s.lastDate : best),
    '',
  );
  const tableRows = buildTable(chart);
  return (
    <article className="indicator" aria-labelledby={`${chart.id}-title`}>
      <header className="indicator__head">
        <h3 id={`${chart.id}-title`} className="indicator__title">
          {titleOverrides[chart.id] ?? chart.title}
        </h3>
        <p className="indicator__meta">
          {chart.unit} · {chart.frequency} · latest{' '}
          {formatDate(latestDate, chart.frequency)}
        </p>
      </header>
      <IndicatorChart chart={chart} highlight={highlight} />
      <ul className="latest" aria-label="Latest values">
        {chart.series.map((s, index) => {
          const style = styleFor(s.place, index);
          return (
            <li
              key={s.place}
              className={
                highlight &&
                highlight !== s.place &&
                chart.series.some((o) => o.place === highlight)
                  ? 'is-dim'
                  : ''
              }
            >
              <span
                className="latest__swatch"
                style={{ background: style.color }}
                aria-hidden="true"
              />
              <span className="latest__place">{s.place}</span>
              <span className="latest__value">{formatValue(s.lastValue)}</span>
              <span className="latest__date">
                {formatDate(s.lastDate, chart.frequency)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="indicator__why t-body">{why}</p>
      {(noteOverrides[chart.id] ?? chart.note) && (
        <p className="indicator__note t-small">
          {noteOverrides[chart.id] ?? chart.note}
        </p>
      )}
      <p className="indicator__source t-small">
        Source:{' '}
        <a href={chart.source.url} rel="noopener">
          {chart.source.name}
        </a>
        . {chart.source.citation}.
      </p>
      <details className="disclosure indicator__table">
        <summary>Data table</summary>
        <div className="disclosure__body">
          <p className="t-small">{tableRows.note}</p>
          <div className="table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  {chart.series.map((s) => (
                    <th key={s.place} scope="col">
                      {s.place}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.rows.map((row) => (
                  <tr key={row.date}>
                    <th scope="row">{formatDate(row.date, chart.frequency)}</th>
                    {row.cells.map((cell, i) => (
                      <td key={i}>{cell === null ? '' : formatValue(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </article>
  );
}

function buildTable(chart: IndicatorChartData) {
  const dates = [
    ...new Set(chart.series.flatMap((s) => s.values.map((v) => v[0]))),
  ].sort();
  const keep =
    chart.frequency === 'annual'
      ? dates.slice(-25)
      : chart.frequency === 'quarterly'
        ? dates.slice(-16)
        : dates.slice(-24);
  const lookups = chart.series.map((s) => new Map(s.values));
  return {
    note: `The most recent ${keep.length} observations. The full series is in the data file linked below.`,
    rows: keep
      .slice()
      .reverse()
      .map((date) => ({
        date,
        cells: lookups.map((m) =>
          m.has(date) ? (m.get(date) as number) : null,
        ),
      })),
  };
}
