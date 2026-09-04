import { useId } from 'react';

import { ResponsiveFigure } from './ResponsiveFigure';

export type IndicatorSeries = {
  place: string;
  code: string;
  lastDate: string;
  lastValue: number;
  values: Array<[string, number]>;
};

export type IndicatorChartData = {
  id: string;
  title: string;
  unit: string;
  frequency: string;
  source: { name: string; url: string; citation: string; series?: string[] };
  series: IndicatorSeries[];
  note?: string;
};

type Props = { chart: IndicatorChartData; highlight?: string | null };

/** One colour and one dash pattern per place, so no line relies on colour alone. */
const placeStyles: Record<string, { color: string; dash?: string }> = {
  'United States': { color: '#101d1b' },
  'United Kingdom': { color: '#2a55c9', dash: '12 6' },
  Germany: { color: '#0f7a6b', dash: '3 6' },
  Japan: { color: '#d4562a', dash: '14 6 3 6' },
  France: { color: '#c2247c', dash: '6 6' },
  'South Korea': { color: '#7a6b00', dash: '18 8' },
  China: { color: '#6d4fc9', dash: '2 5' },
};
const fallbackStyles = [
  { color: '#101d1b' },
  { color: '#2a55c9', dash: '12 6' },
  { color: '#0f7a6b', dash: '3 6' },
  { color: '#d4562a', dash: '14 6 3 6' },
  { color: '#c2247c', dash: '6 6' },
  { color: '#7a6b00', dash: '18 8' },
];

export function styleFor(place: string, index: number) {
  return placeStyles[place] ?? fallbackStyles[index % fallbackStyles.length];
}

function toYear(date: string): number {
  if (date.length === 4) return Number(date) + 0.5;
  const [y, m, d] = date.split('-').map(Number);
  return y + ((m ?? 1) - 1) / 12 + ((d ?? 1) - 1) / 365;
}

export function formatDate(date: string, frequency: string): string {
  if (date.length === 4) return date;
  const [y, m] = date.split('-').map(Number);
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
  if (frequency === 'quarterly')
    return `${['first', 'second', 'third', 'fourth'][Math.floor((m - 1) / 3)]} quarter of ${y}`;
  if (frequency === 'annual') return String(y);
  return `${months[m - 1]} ${y}`;
}

export function formatValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100000)
    return value.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  if (abs >= 1000)
    return value.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  if (abs >= 100)
    return value.toLocaleString('en-GB', { maximumFractionDigits: 1 });
  return value.toLocaleString('en-GB', { maximumFractionDigits: 2 });
}

function niceStep(range: number, target: number): number {
  const raw = range / target;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 2.5, 5, 10].map((c) => c * power);
  return candidates.find((c) => c >= raw) ?? candidates[candidates.length - 1];
}

export function IndicatorChart({ chart, highlight = null }: Props) {
  const id = useId();
  return (
    <ResponsiveFigure
      wide={
        <ChartSvg
          id={`${id}-w`}
          layout="wide"
          chart={chart}
          highlight={highlight}
        />
      }
      tall={
        <ChartSvg
          id={`${id}-t`}
          layout="tall"
          chart={chart}
          highlight={highlight}
        />
      }
    />
  );
}

const layouts = {
  wide: {
    W: 1200,
    H: 560,
    left: 90,
    right: 330,
    top: 50,
    bottom: 70,
    fs: 18,
    fsLabel: 19,
  },
  tall: {
    W: 640,
    H: 600,
    left: 100,
    right: 30,
    top: 50,
    bottom: 120,
    fs: 22,
    fsLabel: 22,
  },
};

function ChartSvg({
  id,
  layout,
  chart,
  highlight,
}: {
  id: string;
  layout: 'wide' | 'tall';
  chart: IndicatorChartData;
  highlight: string | null;
}) {
  const base = layouts[layout];
  const tall = layout === 'tall';
  const legendColumns = chart.series.some((entry) => entry.place.length > 18)
    ? 1
    : 2;
  const legendRows = tall ? Math.ceil(chart.series.length / legendColumns) : 0;
  const L = {
    ...base,
    H: tall ? base.H + Math.max(0, legendRows - 2) * 28 : base.H,
  };
  const plotW = L.W - L.left - L.right;
  const plotH =
    L.H - L.top - L.bottom - (tall ? Math.max(0, legendRows - 2) * 28 : 0);
  const all = chart.series.flatMap((s) => s.values);
  if (all.length === 0) return null;
  const years = all.map((v) => toYear(v[0]));
  const x0 = Math.min(...years);
  const x1 = Math.max(...years);
  const values = all.map((v) => v[1]);
  let y0 = Math.min(...values);
  let y1 = Math.max(...values);
  if (y0 > 0 && y0 < (y1 - y0) * 0.5) y0 = 0;
  const step = niceStep(y1 - y0, 5);
  y0 = Math.floor(y0 / step) * step;
  y1 = Math.ceil(y1 / step) * step;
  if (y1 === y0) y1 = y0 + step;
  const px = (year: number) => L.left + ((year - x0) / (x1 - x0)) * plotW;
  const py = (value: number) =>
    L.top + plotH - ((value - y0) / (y1 - y0)) * plotH;

  const yTicks: number[] = [];
  for (let v = y0; v <= y1 + 1e-9; v += step) yTicks.push(Number(v.toFixed(6)));
  const span = x1 - x0;
  const xStep = span > 60 ? 10 : span > 25 ? 5 : span > 12 ? 2 : 1;
  const xTicks: number[] = [];
  for (let y = Math.ceil(x0 / xStep) * xStep; y <= x1; y += xStep)
    xTicks.push(y);

  // End labels: spread vertically so they never overlap.
  const labels = chart.series
    .map((s, index) => ({
      s,
      index,
      y: py(s.lastValue),
      x: px(toYear(s.lastDate)),
    }))
    .sort((a, b) => a.y - b.y);
  const minGap = L.fsLabel + 4;
  for (let i = 1; i < labels.length; i++)
    if (labels[i].y - labels[i - 1].y < minGap)
      labels[i].y = labels[i - 1].y + minGap;
  for (let i = labels.length - 2; i >= 0; i--)
    if (labels[i + 1].y - labels[i].y < minGap)
      labels[i].y = labels[i + 1].y - minGap;

  const desc = chart.series
    .map(
      (s) =>
        `${s.place}: ${formatValue(s.lastValue)} ${chart.unit} in ${formatDate(s.lastDate, chart.frequency)}`,
    )
    .join('; ');

  return (
    <svg
      viewBox={`0 0 ${L.W} ${L.H}`}
      className="indicator-chart"
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>{chart.title}</title>
      <desc id={`${id}-d`}>{`${chart.unit}. Latest values: ${desc}.`}</desc>
      {/* gridlines and y axis */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={L.left}
            y1={py(v)}
            x2={L.left + plotW}
            y2={py(v)}
            stroke="var(--line)"
            strokeWidth="1"
          />
          <text
            x={L.left - 10}
            y={py(v) + 6}
            textAnchor="end"
            fontSize={L.fs}
            className="svg-text"
            fill="var(--text-mute)"
          >
            {formatValue(v)}
          </text>
        </g>
      ))}
      <text
        x={L.left}
        y={L.top - 18}
        fontSize={L.fs}
        className="svg-text"
        fill="var(--text-mute)"
      >
        {chart.unit}
      </text>
      {/* x axis */}
      <line
        x1={L.left}
        y1={L.top + plotH}
        x2={L.left + plotW}
        y2={L.top + plotH}
        stroke="var(--line-strong)"
        strokeWidth="1.5"
      />
      {xTicks.map((y) => (
        <text
          key={y}
          x={px(y)}
          y={L.top + plotH + 30}
          textAnchor="middle"
          fontSize={L.fs}
          className="svg-text"
          fill="var(--text-mute)"
        >
          {y}
        </text>
      ))}
      {/* lines */}
      {chart.series.map((s, index) => {
        const style = styleFor(s.place, index);
        const dimmed =
          highlight !== null &&
          highlight !== s.place &&
          chart.series.some((o) => o.place === highlight);
        const on = highlight === s.place;
        // Long monthly series are thinned for drawing only; tables keep every point.
        const stride = Math.max(1, Math.ceil(s.values.length / 320));
        const points = s.values.filter(
          (_, i) => i % stride === 0 || i === s.values.length - 1,
        );
        const d = points
          .map(
            (v, i) =>
              `${i === 0 ? 'M' : 'L'}${px(toYear(v[0])).toFixed(0)} ${py(v[1]).toFixed(0)}`,
          )
          .join(' ');
        return (
          <path
            key={s.place}
            d={d}
            fill="none"
            stroke={style.color}
            strokeWidth={on ? 5 : dimmed ? 1.5 : 3}
            strokeDasharray={style.dash}
            strokeOpacity={dimmed ? 0.4 : 1}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        );
      })}
      {/* end labels */}
      {!tall &&
        labels.map(({ s, index, y, x }) => {
          const style = styleFor(s.place, index);
          const dimmed =
            highlight !== null &&
            highlight !== s.place &&
            chart.series.some((o) => o.place === highlight);
          return (
            <text
              key={s.place}
              x={Math.max(x, L.left) + 12}
              y={y + 6}
              fontSize={L.fsLabel}
              className="svg-text"
              fontWeight={highlight === s.place ? 700 : 600}
              fill={style.color}
              opacity={dimmed ? 0.5 : 1}
            >
              {s.place}
            </text>
          );
        })}
      {tall && (
        <g>
          {chart.series.map((s, index) => {
            const style = styleFor(s.place, index);
            const col = index % legendColumns;
            const row = Math.floor(index / legendColumns);
            const lx = L.left + col * (plotW / legendColumns);
            const ly = L.top + plotH + 62 + row * 28;
            return (
              <g key={s.place}>
                <line
                  x1={lx}
                  y1={ly - 6}
                  x2={lx + 34}
                  y2={ly - 6}
                  stroke={style.color}
                  strokeWidth="4"
                  strokeDasharray={style.dash}
                />
                <text
                  x={lx + 42}
                  y={ly}
                  fontSize={L.fs}
                  className="svg-text"
                  fill="var(--text-soft)"
                >
                  {s.place}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
