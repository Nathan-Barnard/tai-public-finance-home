import { useId } from 'react';

import type { LongRunCountry } from '@/content/evidence';

import { plain } from './format';

// An endpoint comparison, not a time series: only the two published years are
// known here, so no path is drawn between them beyond a straight connector.
const MIN = 20;
const MAX = 40;

export function LongRunTaxChart({
  countries,
  caption,
  unit,
}: {
  countries: LongRunCountry[];
  caption: string;
  unit: string;
}) {
  const id = useId();
  const W = 640;
  const H = 300;
  const left = 104;
  const right = W - 150;
  const top = 34;
  const bottom = H - 40;
  const py = (v: number) => bottom - ((v - MIN) / (MAX - MIN)) * (bottom - top);
  const ticks = [20, 25, 30, 35, 40];

  return (
    <figure className="slope-chart">
      <figcaption className="slope-chart__caption">
        {caption}
        <span className="slope-chart__unit"> · {unit}</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${id}-t`}>{caption}</title>
        <desc id={`${id}-d`}>
          {countries
            .map(
              (c) =>
                `${c.place}: ${plain(c.start)}% of GDP in 1965, ${plain(c.end)}% in 2024`,
            )
            .join('. ')}
          .
        </desc>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={left}
              y1={py(t)}
              x2={right}
              y2={py(t)}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={left - 52}
              y={py(t) + 4}
              textAnchor="end"
              fontSize="13"
              fill="var(--ink-mute)"
            >
              {t}
            </text>
          </g>
        ))}
        <text x={left} y={top - 14} fontSize="13" fill="var(--ink-mute)">
          1965
        </text>
        <text
          x={right}
          y={top - 14}
          textAnchor="end"
          fontSize="13"
          fill="var(--ink-mute)"
        >
          2024
        </text>
        {countries.map((c) => (
          <g key={c.place}>
            <line
              x1={left}
              y1={py(c.start)}
              x2={right}
              y2={py(c.end)}
              stroke="var(--ink-soft)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx={left} cy={py(c.start)} r="4.5" fill="var(--ink-soft)" />
            <circle cx={right} cy={py(c.end)} r="4.5" fill="var(--ink)" />
            <text
              x={left - 10}
              y={py(c.start) + 4}
              textAnchor="end"
              fontSize="14"
              fontWeight="600"
              fill="var(--ink)"
              className="slope-chart__start"
            >
              {plain(c.start)}
            </text>
            <text
              x={right + 12}
              y={py(c.end) + 4}
              fontSize="14"
              fill="var(--ink)"
            >
              <tspan fontWeight="600">{plain(c.end)}</tspan>
              <tspan fill="var(--ink-soft)"> {c.place}</tspan>
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
