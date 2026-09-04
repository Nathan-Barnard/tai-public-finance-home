import { ResponsiveFigure } from './ResponsiveFigure';

type Level = 'more' | 'same' | 'less';

type Props = {
  /** Which future is highlighted, if any. */
  level?: Level;
  id: string;
  dark?: boolean;
  layout?: 'wide' | 'tall';
};

const futures: Array<{
  id: Level;
  label: string;
  market: number;
  government: number;
  reading: string;
}> = [
  {
    id: 'more',
    label: 'Workers fall behind',
    market: 0.5,
    government: 0.92,
    reading: 'a public dollar matters more',
  },
  {
    id: 'same',
    label: 'Gains are shared',
    market: 0.55,
    government: 0.55,
    reading: 'the two views agree',
  },
  {
    id: 'less',
    label: 'Workers are ahead',
    market: 0.6,
    government: 0.3,
    reading: 'a public dollar matters less',
  },
];

/**
 * Three futures, two valuations of the same dollar in each. Bar sizes are
 * qualitative: they show where the two views pull apart, never a magnitude.
 */
export function ValuationStrip({ layout, ...props }: Props) {
  if (layout) return <Strip {...props} layout={layout} />;
  return (
    <ResponsiveFigure
      wide={<Strip {...props} id={`${props.id}-w`} layout="wide" />}
      tall={<Strip {...props} id={`${props.id}-t`} layout="tall" />}
    />
  );
}

function Strip({
  level,
  id,
  dark = false,
  layout,
}: Props & { layout: 'wide' | 'tall' }) {
  const text = dark ? 'var(--paper)' : 'var(--ink)';
  const mute = dark ? 'var(--text-on-ink-mute)' : 'var(--text-mute)';
  const marketColor = dark ? 'var(--text-on-ink-mute)' : 'var(--text-soft)';
  const publicColor = dark ? 'var(--public-dark)' : 'var(--public)';
  const desc = (
    <>
      <title id={`${id}-t`}>
        Where a public dollar matters more or less than the market says
      </title>
      <desc id={`${id}-d`}>
        In the future where workers fall behind, the government’s value of a
        dollar stands well above the market’s. Where gains are shared, the two
        match. Where workers are ahead, the government’s value sits below the
        market’s. Sizes are qualitative.
      </desc>
    </>
  );

  if (layout === 'tall') {
    const W = 560;
    const rowH = 200;
    const H = 40 + rowH * 3;
    const maxW = 330;
    return (
      <svg
        className="valuation-strip"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
      >
        {desc}
        {futures.map((f, index) => {
          const y0 = 30 + index * rowH;
          const on = level === undefined || level === f.id;
          return (
            <g
              key={f.id}
              opacity={on ? 1 : 0.32}
              className="valuation-strip__col"
            >
              <text
                x={24}
                y={y0 + 28}
                fontSize="28"
                className="svg-display"
                fill={text}
              >
                {f.label}
              </text>
              <text
                x={200}
                y={y0 + 72}
                fontSize="22"
                className="svg-text"
                fill={mute}
                textAnchor="end"
              >
                market
              </text>
              <rect
                x={214}
                y={y0 + 52}
                width={f.market * maxW}
                height={30}
                fill={marketColor}
                rx="4"
                className="valuation-strip__bar"
              />
              <text
                x={200}
                y={y0 + 116}
                fontSize="22"
                className="svg-text"
                fill={mute}
                textAnchor="end"
              >
                government
              </text>
              <rect
                x={214}
                y={y0 + 96}
                width={f.government * maxW}
                height={30}
                fill={publicColor}
                rx="4"
                className="valuation-strip__bar"
              />
              <text
                x={24}
                y={y0 + 166}
                fontSize="22"
                className="svg-text"
                fill={level === f.id ? publicColor : mute}
                fontStyle="italic"
              >
                {f.reading}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  const W = 960;
  const H = 440;
  const colW = 300;
  const baseY = 340;
  const maxH = 210;
  return (
    <svg
      className="valuation-strip"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      {desc}
      {futures.map((f, index) => {
        const x0 = 30 + index * colW;
        const on = level === undefined || level === f.id;
        return (
          <g
            key={f.id}
            opacity={on ? 1 : 0.32}
            className="valuation-strip__col"
          >
            <text
              x={x0 + colW / 2 - 15}
              y={40}
              textAnchor="middle"
              fontSize="26"
              className="svg-display"
              fill={text}
            >
              {f.label}
            </text>
            <text
              x={x0 + colW / 2 - 15}
              y={78}
              textAnchor="middle"
              fontSize="20"
              className="svg-text"
              fill={level === f.id ? publicColor : mute}
              fontStyle="italic"
            >
              {f.reading}
            </text>
            <rect
              x={x0 + 40}
              y={baseY - f.market * maxH}
              width={90}
              height={f.market * maxH}
              fill={marketColor}
              rx="4"
              className="valuation-strip__bar"
            />
            <rect
              x={x0 + 150}
              y={baseY - f.government * maxH}
              width={90}
              height={f.government * maxH}
              fill={publicColor}
              rx="4"
              className="valuation-strip__bar"
            />
            <text
              x={x0 + 85}
              y={baseY + 30}
              textAnchor="middle"
              fontSize="20"
              className="svg-text"
              fill={mute}
            >
              market
            </text>
            <text
              x={x0 + 85}
              y={baseY + 58}
              textAnchor="middle"
              fontSize="20"
              className="svg-math"
              fill={mute}
            >
              m
              <tspan baselineShift="sub" fontSize="14">
                I
              </tspan>
            </text>
            <text
              x={x0 + 195}
              y={baseY + 30}
              textAnchor="middle"
              fontSize="20"
              className="svg-text"
              fill={mute}
            >
              government
            </text>
            <text
              x={x0 + 195}
              y={baseY + 58}
              textAnchor="middle"
              fontSize="20"
              className="svg-math"
              fill={mute}
            >
              m
              <tspan baselineShift="sub" fontSize="14">
                G
              </tspan>
            </text>
          </g>
        );
      })}
      <line
        x1="30"
        y1={baseY}
        x2={W - 30}
        y2={baseY}
        stroke={mute}
        strokeWidth="1.5"
      />
    </svg>
  );
}
