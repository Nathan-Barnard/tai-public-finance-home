import { notebookRoute } from '@/content/findings';

import { ResponsiveFigure } from './ResponsiveFigure';

/** The seven notebooks as one path with stops, each a link. */
export function NotebookRoute() {
  return (
    <ResponsiveFigure
      wide={<RouteSvg layout="wide" />}
      tall={<RouteSvg layout="tall" />}
    />
  );
}

function RouteSvg({ layout }: { layout: 'wide' | 'tall' }) {
  const wide = layout === 'wide';
  const W = wide ? 1400 : 700;
  const H = wide ? 360 : 1000;
  const n = notebookRoute.length;
  const stop = (i: number): [number, number] =>
    wide
      ? [100 + (i * (W - 200)) / (n - 1), 150]
      : [90, 80 + (i * (H - 180)) / (n - 1)];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`route-${layout}-t route-${layout}-d`}
      className="route-figure"
    >
      <title id={`route-${layout}-t`}>
        The seven public notebooks in reading order
      </title>
      <desc id={`route-${layout}-d`}>
        {notebookRoute
          .map((s, i) => `${i + 1}. ${s.title} (${s.evidence})`)
          .join('; ')}
      </desc>
      <path
        d={notebookRoute
          .map((_, i) => `${i === 0 ? 'M' : 'L'}${stop(i)[0]} ${stop(i)[1]}`)
          .join(' ')}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {notebookRoute.map((s, i) => {
        const [x, y] = stop(i);
        return (
          <a
            key={s.title}
            href={s.href}
            rel="noopener"
            className="route-figure__stop"
          >
            <circle
              cx={x}
              cy={y}
              r="16"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="4"
            />
            {wide ? (
              <>
                <text
                  x={x}
                  y={i % 2 === 0 ? y - 44 : y + 60}
                  textAnchor={
                    i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'
                  }
                  fontSize="22"
                  className="svg-display"
                  fill="var(--ink)"
                  fontWeight="600"
                >
                  {s.title}
                </text>
                <text
                  x={x}
                  y={i % 2 === 0 ? y - 18 : y + 86}
                  textAnchor={
                    i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'
                  }
                  fontSize="18"
                  className="svg-text"
                  fill="var(--text-mute)"
                >
                  {s.evidence}
                </text>
              </>
            ) : (
              <>
                <text
                  x={x + 36}
                  y={y - 2}
                  fontSize="26"
                  className="svg-display"
                  fill="var(--ink)"
                  fontWeight="600"
                >
                  {s.title}
                </text>
                <text
                  x={x + 36}
                  y={y + 26}
                  fontSize="20"
                  className="svg-text"
                  fill="var(--text-mute)"
                >
                  {s.evidence}
                </text>
              </>
            )}
          </a>
        );
      })}
    </svg>
  );
}
