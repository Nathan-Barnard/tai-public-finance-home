import type { Move } from '@/content/types';

import { ResponsiveFigure } from './ResponsiveFigure';

export type FigureLayout = 'wide' | 'tall';

type Props = {
  worker: Move;
  capital: Move;
  profits: Move;
  assets: Move;
  id: string;
  /** Force one layout (the lab panels use the tall one at every width). */
  layout?: FigureLayout;
};

const angle: Record<Move, number> = {
  falls: 24,
  flat: 0,
  rises: -16,
  'rises-faster': -30,
};

const word: Record<Move, string> = {
  falls: 'falls',
  flat: 'stays flat',
  rises: 'rises',
  'rises-faster': 'rises faster',
};

const layouts = {
  wide: {
    W: 1120,
    H: 620,
    startX: 110,
    shockX: 380,
    len: 380,
    rows: [230, 460],
    fs: 24,
    fsSmall: 20,
    indicators: [
      [110, 585],
      [420, 585],
    ] as const,
  },
  tall: {
    W: 640,
    H: 740,
    startX: 36,
    shockX: 250,
    len: 330,
    rows: [230, 450],
    fs: 28,
    fsSmall: 24,
    indicators: [
      [36, 620],
      [36, 690],
    ] as const,
  },
};

/**
 * Two income tracks that share a path before the shock and rotate apart
 * after it. The rotation is a CSS transform so the change animates.
 */
export function DistributionFigure({ layout, ...props }: Props) {
  if (layout) return <Figure {...props} layout={layout} />;
  return (
    <ResponsiveFigure
      wide={<Figure {...props} id={`${props.id}-w`} layout="wide" />}
      tall={<Figure {...props} id={`${props.id}-t`} layout="tall" />}
    />
  );
}

function Figure({
  worker,
  capital,
  profits,
  assets,
  id,
  layout,
}: Props & { layout: FigureLayout }) {
  const L = layouts[layout];
  const tall = layout === 'tall';
  const rows = [
    {
      key: 'worker',
      label: 'Worker income',
      y: L.rows[0],
      move: worker,
      color: 'var(--worker)',
      text: 'var(--worker-text)',
    },
    {
      key: 'capital',
      label: 'Capital income',
      y: L.rows[1],
      move: capital,
      color: 'var(--capital)',
      text: 'var(--capital-text)',
    },
  ] as const;

  const endPoint = (y: number, move: Move) => {
    const r = (angle[move] * Math.PI) / 180;
    return { x: L.shockX + Math.cos(r) * L.len, y: y + Math.sin(r) * L.len };
  };
  const together = worker === capital && worker !== 'flat';
  const endWord = (key: 'worker' | 'capital', move: Move) =>
    together
      ? key === 'worker'
        ? 'moves with capital'
        : 'moves with workers'
      : word[move];

  return (
    <svg
      className="dist-figure"
      viewBox={`0 0 ${L.W} ${L.H}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>
        How worker income and capital income move after the shock
      </title>
      <desc id={`${id}-desc`}>
        {`Worker income ${word[worker]}; capital income ${word[capital]}; profits ${word[profits]}; asset values ${word[assets]}.`}
      </desc>
      <defs>
        <marker
          id={`${id}-hw`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--worker)" />
        </marker>
        <marker
          id={`${id}-hc`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--capital)" />
        </marker>
      </defs>

      <line
        x1={L.shockX}
        y1={40}
        x2={L.shockX}
        y2={L.rows[1] + 110}
        stroke="var(--ink)"
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      <text
        x={L.shockX + 12}
        y={44}
        fontSize={L.fsSmall}
        className="svg-display"
        fill="var(--ink)"
      >
        The shock
      </text>

      {rows.map((row) => {
        const end = endPoint(row.y, row.move);
        const marker =
          row.key === 'worker' ? `url(#${id}-hw)` : `url(#${id}-hc)`;
        const up = angle[row.move] < 0;
        return (
          <g key={row.key}>
            <text
              x={L.startX}
              y={row.y - 22}
              fontSize={L.fs}
              className="svg-display"
              fontWeight="600"
              fill={row.text}
            >
              {row.label}
            </text>
            <line
              x1={L.startX}
              y1={row.y}
              x2={L.shockX}
              y2={row.y}
              stroke={row.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
            <g
              className="dist-figure__after"
              style={{
                transform: `rotate(${angle[row.move]}deg)`,
                transformOrigin: `${L.shockX}px ${row.y}px`,
              }}
            >
              <line
                x1={L.shockX}
                y1={row.y}
                x2={L.shockX + L.len}
                y2={row.y}
                stroke={row.color}
                strokeWidth="12"
                strokeLinecap="round"
                markerEnd={marker}
              />
            </g>
            {tall ? (
              <g
                className="dist-figure__word"
                style={{
                  transform: `translate(${end.x + 6}px, ${end.y + (up || row.move === 'flat' ? -24 : 44)}px)`,
                }}
              >
                <text
                  fontSize={L.fs}
                  className="svg-display"
                  fontWeight="600"
                  fill={row.text}
                  textAnchor="end"
                >
                  {endWord(row.key, row.move)}
                </text>
              </g>
            ) : (
              <g
                className="dist-figure__word"
                style={{ transform: `translate(${end.x + 22}px, ${end.y}px)` }}
              >
                <text
                  fontSize={L.fs}
                  className="svg-display"
                  fontWeight="600"
                  fill={row.text}
                  dominantBaseline="middle"
                >
                  {endWord(row.key, row.move)}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* profits and asset values ride with capital */}
      <Indicator
        id={`${id}-p`}
        x={L.indicators[0][0]}
        y={L.indicators[0][1]}
        label="Profits"
        move={profits}
        fs={L.fsSmall}
      />
      <Indicator
        id={`${id}-a`}
        x={L.indicators[1][0]}
        y={L.indicators[1][1]}
        label="Asset values"
        move={assets}
        fs={L.fsSmall}
      />
    </svg>
  );
}

function Indicator({
  x,
  y,
  label,
  move,
  fs,
}: {
  id: string;
  x: number;
  y: number;
  label: string;
  move: Move;
  fs: number;
}) {
  const labelWidth = label.length * fs * 0.56;
  const pivotX = x + labelWidth + 18;
  return (
    <g>
      <text
        x={x}
        y={y}
        fontSize={fs}
        className="svg-text"
        fill="var(--text-soft)"
        dominantBaseline="middle"
      >
        {label}
      </text>
      <g
        className="dist-figure__after"
        style={{
          transform: `rotate(${angle[move]}deg)`,
          transformOrigin: `${pivotX}px ${y}px`,
        }}
      >
        <line
          x1={pivotX}
          y1={y}
          x2={pivotX + 56}
          y2={y}
          stroke="var(--capital)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M${pivotX + 56} ${y - 7} l12 7 l-12 7z`}
          fill="var(--capital)"
        />
      </g>
      <text
        x={pivotX + 84}
        y={y}
        fontSize={fs}
        className="svg-text"
        fill="var(--capital-text)"
        dominantBaseline="middle"
      >
        {word[move]}
      </text>
    </g>
  );
}
