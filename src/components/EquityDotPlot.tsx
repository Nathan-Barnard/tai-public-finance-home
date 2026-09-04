import { useId } from 'react';

import type { EquityGroup } from '@/content/evidence';

import { plain } from './format';

const MIN = -5;
const MAX = 21;

/**
 * Four groups, two marks each. Domestic and rest-of-world are separated by
 * shape as well as fill, so the comparison survives without colour. Sample
 * sizes are printed beside every group because the cells are small.
 */
export function EquityDotPlot({
  groups,
  caption,
  unit,
}: {
  groups: EquityGroup[];
  caption: string;
  unit: string;
}) {
  const id = useId();
  const W = 640;
  const rowH = 62;
  const top = 46;
  const H = top + groups.length * rowH + 44;
  const left = 178;
  const right = W - 26;
  const px = (v: number) => left + ((v - MIN) / (MAX - MIN)) * (right - left);
  const ticks = [-5, 0, 5, 10, 15, 20];

  return (
    <figure className="dot-plot">
      <figcaption className="dot-plot__caption">
        {caption}
        <span className="dot-plot__unit"> · {unit}</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${id}-t`}>{caption}</title>
        <desc id={`${id}-d`}>
          {groups
            .map(
              (g) =>
                `${g.place}, ${g.stateLabel.toLowerCase()}: domestic ${plain(g.domestic)} per cent, rest of world ${plain(g.restOfWorld)} per cent, from ${g.observations} years`,
            )
            .join('. ')}
          .
        </desc>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={px(t)}
              y1={top - 16}
              x2={px(t)}
              y2={top + groups.length * rowH - 18}
              stroke={t === 0 ? 'var(--line-strong)' : 'var(--line)'}
              strokeWidth="1"
            />
            <text
              x={px(t)}
              y={top + groups.length * rowH}
              textAnchor="middle"
              fontSize="13"
              fill="var(--ink-mute)"
            >
              {t}
            </text>
          </g>
        ))}
        {groups.map((g, index) => {
          const y = top + index * rowH + 8;
          return (
            <g key={`${g.place}-${g.state}`}>
              <text
                x={0}
                y={y - 4}
                fontSize="14"
                fontWeight="600"
                fill="var(--ink)"
              >
                {g.place}
              </text>
              <text x={0} y={y + 15} fontSize="13" fill="var(--ink-mute)">
                {g.stateLabel}
                <tspan fill="var(--ink-mute)"> · n={g.observations}</tspan>
              </text>
              <line
                x1={px(Math.min(g.domestic, g.restOfWorld))}
                y1={y + 4}
                x2={px(Math.max(g.domestic, g.restOfWorld))}
                y2={y + 4}
                stroke="var(--capital)"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              <circle
                cx={px(g.domestic)}
                cy={y + 4}
                r="7"
                fill="var(--capital)"
              />
              <circle
                cx={px(g.restOfWorld)}
                cy={y + 4}
                r="7"
                fill="var(--bg)"
                stroke="var(--capital)"
                strokeWidth="2.5"
              />
            </g>
          );
        })}
      </svg>
      <ul className="dot-plot__key" aria-label="Key">
        <li>
          <span className="dot-plot__swatch dot-plot__swatch--filled" />
          Domestic equity
        </li>
        <li>
          <span className="dot-plot__swatch dot-plot__swatch--open" />
          Rest-of-world equity
        </li>
      </ul>
    </figure>
  );
}
