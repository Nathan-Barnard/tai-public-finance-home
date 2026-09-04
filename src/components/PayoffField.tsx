import {
  angleDeg,
  fromAngle,
  norm,
  type Projection,
  type Vec2,
  scale,
} from '@/lib/geometry';

export type PayoffFieldLayout = 'wide' | 'compact';

type Props = {
  id: string;
  exposure: Vec2;
  payoffs: Vec2[];
  projection: Projection;
  /** Position along the first payoff, in units of that payoff. */
  position?: number;
  dark?: boolean;
  layout?: PayoffFieldLayout;
  labels?: {
    exposure?: string;
    reached?: string;
    remainder?: string;
    position?: string;
  };
};

const layouts = {
  wide: {
    W: 1100,
    H: 760,
    origin: [150, 610] as Vec2,
    unit: 440,
    fs: 22,
    fsBig: 24,
    fsSmall: 18,
  },
  compact: {
    W: 620,
    H: 660,
    origin: [100, 540] as Vec2,
    unit: 330,
    fs: 24,
    fsBig: 26,
    fsSmall: 22,
  },
};

/**
 * The payoff-space drawing shared by the theatre and the lab. Every arrow is
 * computed from the projection geometry: the reached part is the projection,
 * the remainder is the residual, and a position only ever moves along a line.
 */
export function PayoffField({
  id,
  exposure,
  payoffs,
  projection,
  position,
  dark = false,
  layout = 'wide',
  labels = {},
}: Props) {
  const L = layouts[layout];
  const { W, H, origin, unit } = L;
  const toSvg = (v: Vec2): [number, number] => [
    origin[0] + v[0] * unit,
    origin[1] - v[1] * unit,
  ];

  const exposureColor = dark ? 'var(--worker-dark)' : 'var(--worker)';
  const payoffColor = dark ? 'var(--capital-dark)' : 'var(--capital)';
  const reachedColor = dark ? 'var(--public-dark)' : 'var(--public)';
  const remainderColor = dark ? 'var(--outside-dark)' : 'var(--outside)';
  const inkColor = dark ? 'var(--paper)' : 'var(--ink)';
  const mute = dark ? 'var(--text-on-ink-mute)' : 'var(--text-mute)';

  const eTip = toSvg(exposure);
  const hasExposure = norm(exposure) > 1e-6;
  const pTip = toSvg(projection.projection);
  const firstPayoff = payoffs[0];
  // The payoff line runs from just behind the origin to the frame's edge.
  const lineFor = (a: Vec2) => {
    const direction = fromAngle(angleDeg(a));
    const room = Math.max(
      0.3,
      Math.abs(direction[0]) > 0.05
        ? (W - 24 - origin[0]) / (unit * Math.abs(direction[0]))
        : 3,
    );
    const roomUp = Math.max(
      0.3,
      Math.abs(direction[1]) > 0.05
        ? (origin[1] - 24) / (unit * Math.abs(direction[1]))
        : 3,
    );
    const length = Math.min(2.4, room, roomUp);
    return {
      from: toSvg(scale(direction, -0.18)),
      to: toSvg(scale(direction, length)),
    };
  };
  const posPoint =
    firstPayoff && position !== undefined
      ? toSvg(scale(firstPayoff, position))
      : null;
  const full = projection.rank === 2;
  const unreached = hasExposure ? remainderShare(projection, exposure) : 0;

  return (
    <svg
      className="payoff-field"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>
        What the available payoffs reach and what remains outside them
      </title>
      <desc id={`${id}-d`}>
        {hasExposure
          ? payoffs.length === 0
            ? 'A worker exposure arrow with no available payoff: the whole exposure lies outside the asset menu.'
            : full
              ? 'Two independent payoff directions reach the whole worker exposure in this field.'
              : `One payoff direction reaches ${Math.round((1 - unreached) * 100)} percent of the worker exposure; the rest lies off its line and no larger position reaches it.`
          : 'No worker shortfall in this state, so there is nothing for the payoff to reach.'}
      </desc>
      <defs>
        {[
          ['e', exposureColor],
          ['a', payoffColor],
          ['p', reachedColor],
          ['r', remainderColor],
        ].map(([key, color]) => (
          <marker
            key={key}
            id={`${id}-m-${key}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill={color} />
          </marker>
        ))}
        <pattern
          id={`${id}-hatch`}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="14"
            stroke={reachedColor}
            strokeWidth="2"
            opacity="0.35"
          />
        </pattern>
      </defs>

      {/* reachable region when two independent payoffs exist */}
      {full && (
        <rect
          x="0"
          y="0"
          width={W}
          height={H}
          fill={`url(#${id}-hatch)`}
          className="fade-up is-on"
        />
      )}
      {full && (
        <text
          x={W - 30}
          y={40}
          textAnchor="end"
          fontSize={L.fs}
          className="svg-display"
          fill={reachedColor}
          fontStyle="italic"
        >
          two directions: everything in this field is reachable
        </text>
      )}

      {/* axes */}
      <line
        x1={origin[0] - 60}
        y1={origin[1]}
        x2={W - 30}
        y2={origin[1]}
        stroke={mute}
        strokeWidth="1.5"
      />
      <line
        x1={origin[0]}
        y1={origin[1] + 60}
        x2={origin[0]}
        y2={40}
        stroke={mute}
        strokeWidth="1.5"
      />
      <text
        x={W - 30}
        y={origin[1] + 34}
        textAnchor="end"
        fontSize={L.fsSmall}
        className="svg-text"
        fill={mute}
      >
        one kind of automation shock →
      </text>
      <text
        x={origin[0] - 16}
        y={(origin[1] + 40) / 2}
        textAnchor="middle"
        fontSize={L.fsSmall}
        className="svg-text"
        fill={mute}
        transform={`rotate(-90 ${origin[0] - 16} ${(origin[1] + 40) / 2})`}
      >
        another kind of shock →
      </text>

      {/* payoff lines */}
      {payoffs.map((a, index) => {
        const line = lineFor(a);
        const tip = toSvg(a);
        return (
          <g key={index}>
            <line
              x1={line.from[0]}
              y1={line.from[1]}
              x2={line.to[0]}
              y2={line.to[1]}
              stroke={payoffColor}
              strokeWidth={index === 0 ? 2 : 1.5}
              strokeDasharray={index === 0 ? undefined : '8 8'}
              opacity="0.55"
            />
            <line
              x1={origin[0]}
              y1={origin[1]}
              x2={tip[0]}
              y2={tip[1]}
              stroke={payoffColor}
              strokeWidth="6"
              strokeLinecap="round"
              markerEnd={`url(#${id}-m-a)`}
            />
            <text
              x={tip[0] + (tip[0] > W * 0.6 ? -14 : 14)}
              y={tip[1] + (tip[1] < 70 ? 34 : 6)}
              textAnchor={tip[0] > W * 0.6 ? 'end' : 'start'}
              fontSize={L.fs}
              className="svg-display"
              fill={payoffColor}
              fontWeight="500"
            >
              {index === 0 ? 'the available payoff' : 'a different payoff'}
            </text>
          </g>
        );
      })}

      {/* exposure */}
      {hasExposure && (
        <>
          <line
            x1={origin[0]}
            y1={origin[1]}
            x2={eTip[0]}
            y2={eTip[1]}
            stroke={exposureColor}
            strokeWidth="9"
            strokeLinecap="round"
            markerEnd={`url(#${id}-m-e)`}
          />
          <text
            x={eTip[0] + (eTip[0] > W * 0.6 ? -16 : 16)}
            y={eTip[1] - 12}
            textAnchor={eTip[0] > W * 0.6 ? 'end' : 'start'}
            fontSize={L.fsBig}
            className="svg-display"
            fill={exposureColor}
            fontWeight="600"
          >
            {labels.exposure ?? 'worker exposure'}
          </text>
        </>
      )}

      {/* reached part and remainder */}
      {hasExposure &&
        payoffs.length > 0 &&
        norm(projection.projection) > 1e-6 && (
          <>
            <line
              x1={origin[0]}
              y1={origin[1]}
              x2={pTip[0]}
              y2={pTip[1]}
              stroke={reachedColor}
              strokeWidth="7"
              strokeLinecap="round"
              markerEnd={`url(#${id}-m-p)`}
              className="payoff-field__reached"
            />
            <text
              x={pTip[0] + (pTip[0] > W * 0.6 ? -14 : 14)}
              y={pTip[1] + 34}
              textAnchor={pTip[0] > W * 0.6 ? 'end' : 'start'}
              fontSize={L.fs}
              className="svg-display"
              fill={reachedColor}
              fontWeight="500"
            >
              {labels.reached ??
                (full
                  ? 'reached by the two payoffs'
                  : 'the part the asset reaches')}
            </text>
          </>
        )}
      {hasExposure && norm(projection.residual) > 1e-6 && (
        <>
          <line
            x1={pTip[0]}
            y1={pTip[1]}
            x2={eTip[0]}
            y2={eTip[1]}
            stroke={remainderColor}
            strokeWidth="6"
            strokeDasharray="12 10"
            strokeLinecap="round"
            markerEnd={`url(#${id}-m-r)`}
            className="payoff-field__remainder"
          />
          <text
            x={
              (pTip[0] + eTip[0]) / 2 +
              ((pTip[0] + eTip[0]) / 2 > W * 0.6 ? -18 : 18)
            }
            y={(pTip[1] + eTip[1]) / 2 + 4}
            textAnchor={(pTip[0] + eTip[0]) / 2 > W * 0.6 ? 'end' : 'start'}
            fontSize={L.fs}
            className="svg-display"
            fill={remainderColor}
            fontStyle="italic"
          >
            {labels.remainder ?? 'still outside the asset menu'}
          </text>
        </>
      )}

      {/* the public position on the first payoff line */}
      {posPoint && (
        <g className="payoff-field__position">
          <circle
            cx={posPoint[0]}
            cy={posPoint[1]}
            r="16"
            fill={reachedColor}
            stroke={inkColor}
            strokeWidth="3"
          />
          <text
            x={posPoint[0] + 24}
            y={posPoint[1] - 18}
            fontSize={L.fsSmall}
            className="svg-text"
            fill={inkColor}
            fontWeight="600"
          >
            {labels.position ?? 'the public position'}
          </text>
        </g>
      )}
      <circle cx={origin[0]} cy={origin[1]} r="6" fill={inkColor} />
      <text
        x={origin[0] + 14}
        y={origin[1] + 36}
        fontSize={L.fsSmall}
        className="svg-text"
        fill={mute}
      >
        no position
      </text>
    </svg>
  );
}

function remainderShare(p: Projection, e: Vec2) {
  const total = e[0] * e[0] + e[1] * e[1];
  return total === 0
    ? 0
    : (p.residual[0] * p.residual[0] + p.residual[1] * p.residual[1]) / total;
}
