import type { PositionDirection } from '@/content/scenarios';

const stops: Array<{ id: PositionDirection; label: string; x: number }> = [
  { id: 'reverse', label: 'Reverse', x: 0.1 },
  { id: 'none', label: 'None', x: 0.37 },
  { id: 'hold', label: 'Hold', x: 0.64 },
  { id: 'hold-more', label: 'Hold more', x: 0.91 },
];

/**
 * A qualitative gauge of the public position in one asset: reverse, none,
 * hold, hold more. Direction only, never a size.
 */
export function PositionGauge({
  direction,
  id,
}: {
  direction: PositionDirection;
  id: string;
}) {
  const W = 720;
  const H = 150;
  const left = 40;
  const right = W - 40;
  const y = 70;
  const px = (x: number) => left + x * (right - left);
  const active = stops.find((s) => s.id === direction);
  const line = direction === 'line';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="gauge"
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>The direction of a good public position</title>
      <desc id={`${id}-d`}>
        {line
          ? 'One position selects a point on a line; the marker slides along the line rather than pointing to a single setting.'
          : `The marker points to: ${active?.label ?? direction}.`}
      </desc>
      <line
        x1={left}
        y1={y}
        x2={right}
        y2={y}
        stroke="var(--line-strong)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {stops.map((s) => (
        <g key={s.id}>
          <circle
            cx={px(s.x)}
            cy={y}
            r={s.id === direction ? 16 : 7}
            fill={s.id === direction ? 'var(--public)' : 'var(--paper)'}
            stroke={s.id === direction ? 'var(--ink)' : 'var(--line-strong)'}
            strokeWidth="3"
          />
          <text
            x={px(s.x)}
            y={y + 48}
            textAnchor="middle"
            fontSize="20"
            className="svg-text"
            fontWeight={s.id === direction ? 700 : 500}
            fill={s.id === direction ? 'var(--ink)' : 'var(--text-mute)'}
          >
            {s.label}
          </text>
        </g>
      ))}
      {line && (
        <>
          <rect
            x={px(0.5) - 120}
            y={y - 12}
            width={240}
            height={24}
            rx="12"
            fill="var(--public-soft)"
            stroke="var(--public)"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <text
            x={px(0.5)}
            y={y - 24}
            textAnchor="middle"
            fontSize="20"
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            a point on one line
          </text>
        </>
      )}
    </svg>
  );
}
