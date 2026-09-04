import { useId, useMemo, useState } from 'react';

import type { StorySection, SuccessorState } from '@/content/types';
import { useTabList } from '@/hooks/useTabList';
import { fromAngle, projectOntoSpan, scale, type Vec2 } from '@/lib/geometry';

import { ExpertDisclosure } from './ExpertDisclosure';
import { ResponsiveFigure } from './ResponsiveFigure';
import { SectionHeader } from './SectionHeader';

type Props = {
  section: StorySection;
  states: SuccessorState[];
  caveat: string;
};

const TARGET: Vec2 = [0.62, 0.78];
const FIRST: Vec2 = fromAngle(22);
const SECOND_INDEPENDENT: Vec2 = fromAngle(78);

const menus = [
  { id: 'one', label: 'One inherited position' },
  { id: 'two', label: 'Add an independent payoff' },
  { id: 'same', label: 'Add more of the same equity' },
];

/**
 * Two successor economies on two axes. One inherited equity position moves
 * the achievable outcome along one line only; the reader can drag along it
 * but cannot leave it. An independent payoff opens the plane.
 */
export function FutureForkExplorer({ section, states, caveat }: Props) {
  const [menu, setMenu] = useState(0);
  const [s, setS] = useState(0.5);
  const id = useId();
  const { tabProps, listProps } = useTabList({
    count: menus.length,
    active: menu,
    onChange: setMenu,
  });

  const payoffs = useMemo<Vec2[]>(
    () =>
      menu === 0
        ? [FIRST]
        : menu === 1
          ? [FIRST, SECOND_INDEPENDENT]
          : [FIRST, scale(FIRST, 1.4)],
    [menu],
  );
  const projection = useMemo(
    () => projectOntoSpan(TARGET, payoffs, 1e-3),
    [payoffs],
  );
  const reachable = projection.rank === 2;

  const reading =
    menu === 0
      ? 'Dragging the position moves the achievable outcome along one line. The target sits off that line, so no position reaches it; the closest point on the line is the best one position can do.'
      : reachable
        ? 'A second, independent payoff adds a genuinely different direction. In this picture the target becomes reachable with a combination of the two positions.'
        : 'More of the same equity is the same line again. The reachable set has not grown, and the target is still off it.';

  const figure = (layout: 'wide' | 'tall') => (
    <ForkSvg
      id={`${id}-${layout}`}
      layout={layout}
      menu={menu}
      s={s}
      projection={projection.projection}
      reachable={reachable}
      states={states}
      reading={reading}
    />
  );

  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div className="fork">
        <div className="fork__field">
          <ResponsiveFigure wide={figure('wide')} tall={figure('tall')} />
        </div>
        <div className="fork__controls stack">
          <div
            className="tabs tabs--stack"
            {...listProps}
            aria-label="Payoff menu across the two futures"
          >
            {menus.map((m, index) => (
              <button
                key={m.id}
                type="button"
                className="tab"
                {...tabProps(index)}
              >
                {m.label}
              </button>
            ))}
          </div>
          {menu !== 1 && (
            <div className="field">
              <label className="field__label" htmlFor={`${id}-s`}>
                Size of the inherited position
              </label>
              <input
                id={`${id}-s`}
                className="range"
                type="range"
                min="0"
                max="1.1"
                step="0.01"
                value={s}
                onChange={(e) => setS(Number(e.target.value))}
                aria-valuetext={`${s.toFixed(2)} along the line`}
              />
              <p className="t-small">
                The position slides along the line. It cannot leave it.
              </p>
            </div>
          )}
          <p
            className="fork__reading t-lead"
            aria-live="polite"
            aria-atomic="true"
          >
            {reading}
          </p>
          <ul className="fork__states">
            {states.map((state) => (
              <li key={state.id}>
                <span className="fork__state-name">{state.name}</span>
                <span className="t-small">{state.description}</span>
              </li>
            ))}
          </ul>
          <p className="t-small">{caveat}</p>
        </div>
      </div>
      {section.expertNote && <ExpertDisclosure note={section.expertNote} />}
    </div>
  );
}

const forkLayouts = {
  wide: {
    W: 1100,
    H: 760,
    origin: [140, 640] as Vec2,
    unit: 560,
    lineLen: 1.6,
    fs: 22,
    fsBig: 24,
    fsSmall: 18,
  },
  tall: {
    W: 700,
    H: 860,
    origin: [110, 700] as Vec2,
    unit: 470,
    lineLen: 1.25,
    fs: 24,
    fsBig: 26,
    fsSmall: 20,
  },
};

function ForkSvg({
  id,
  layout,
  menu,
  s,
  projection,
  reachable,
  states,
  reading,
}: {
  id: string;
  layout: 'wide' | 'tall';
  menu: number;
  s: number;
  projection: Vec2;
  reachable: boolean;
  states: SuccessorState[];
  reading: string;
}) {
  const L = forkLayouts[layout];
  const tall = layout === 'tall';
  const { W, H, origin, unit } = L;
  const toSvg = (v: Vec2): [number, number] => [
    origin[0] + v[0] * unit,
    origin[1] - v[1] * unit,
  ];
  const point = toSvg(scale(FIRST, s));
  const target = toSvg(TARGET);
  const closest = toSvg(projection);
  const lineEnd = toSvg(scale(FIRST, L.lineLen));
  const second = toSvg(scale(SECOND_INDEPENDENT, 0.9));
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
      className="fork__svg"
    >
      <title id={`${id}-t`}>
        Public resources across two successor economies
      </title>
      <desc id={`${id}-d`}>{reading}</desc>
      <defs>
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
            stroke="var(--public)"
            strokeWidth="2"
            opacity="0.35"
          />
        </pattern>
        <marker
          id={`${id}-head`}
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
      {reachable && (
        <rect
          x={origin[0]}
          y={40}
          width={W - origin[0] - 30}
          height={origin[1] - 40}
          fill={`url(#${id}-hatch)`}
        />
      )}
      <line
        x1={origin[0]}
        y1={origin[1]}
        x2={W - 30}
        y2={origin[1]}
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <line
        x1={origin[0]}
        y1={origin[1]}
        x2={origin[0]}
        y2={40}
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x={W - 30}
        y={origin[1] + 40}
        textAnchor="end"
        fontSize={L.fs}
        className="svg-display"
        fill="var(--ink)"
      >
        public resources in {states[0].name.toLowerCase()} →
      </text>
      <text
        x={origin[0] - 22}
        y={(origin[1] + 40) / 2}
        textAnchor="middle"
        fontSize={L.fs}
        className="svg-display"
        fill="var(--ink)"
        transform={`rotate(-90 ${origin[0] - 22} ${(origin[1] + 40) / 2})`}
      >
        public resources in {states[1].name.toLowerCase()} →
      </text>

      <line
        x1={origin[0]}
        y1={origin[1]}
        x2={lineEnd[0]}
        y2={lineEnd[1]}
        stroke="var(--capital)"
        strokeWidth="3"
        strokeDasharray={menu === 2 ? undefined : '10 10'}
        opacity="0.6"
      />
      {menu === 2 && (
        <line
          x1={origin[0]}
          y1={origin[1]}
          x2={lineEnd[0]}
          y2={lineEnd[1]}
          stroke="var(--capital)"
          strokeWidth="10"
          opacity="0.25"
        />
      )}
      <text
        x={lineEnd[0] - 6}
        y={lineEnd[1] + 36}
        textAnchor="end"
        fontSize={L.fs}
        className="svg-display"
        fill="var(--capital-text)"
        fontStyle="italic"
      >
        what one inherited position can reach
      </text>
      {menu === 1 && (
        <>
          <line
            x1={origin[0]}
            y1={origin[1]}
            x2={second[0]}
            y2={second[1]}
            stroke="var(--capital)"
            strokeWidth="6"
            strokeLinecap="round"
            markerEnd={`url(#${id}-head)`}
          />
          <text
            x={second[0] + 14}
            y={second[1]}
            fontSize={L.fs}
            className="svg-display"
            fill="var(--capital-text)"
          >
            an independent payoff
          </text>
        </>
      )}

      <g>
        <path
          d={`M${target[0]} ${target[1] - 26} l7 18 l19 0 l-15 12 l6 19 l-17 -12 l-17 12 l6 -19 l-15 -12 l19 0 z`}
          fill="var(--future)"
          stroke="var(--ink)"
          strokeWidth="3"
        />
        <text
          x={target[0]}
          y={target[1] - 40}
          textAnchor="middle"
          fontSize={L.fsBig}
          className="svg-display"
          fill="var(--ink)"
          fontWeight="600"
        >
          the resources wanted in both futures
        </text>
      </g>

      {!reachable ? (
        <>
          <line
            x1={closest[0]}
            y1={closest[1]}
            x2={target[0]}
            y2={target[1]}
            stroke="var(--outside)"
            strokeWidth="6"
            strokeDasharray="12 10"
            strokeLinecap="round"
          />
          <text
            x={(closest[0] + target[0]) / 2 - 18}
            y={(closest[1] + target[1]) / 2 - 8}
            textAnchor="end"
            fontSize={L.fs}
            className="svg-display"
            fill="var(--outside-text)"
            fontStyle="italic"
          >
            not reachable with one position
          </text>
          <circle
            cx={closest[0]}
            cy={closest[1]}
            r="9"
            fill="var(--paper)"
            stroke="var(--capital)"
            strokeWidth="3"
          />
          <text
            x={closest[0]}
            y={closest[1] + (tall ? 60 : 34)}
            textAnchor="middle"
            fontSize={L.fsSmall}
            className="svg-text"
            fill="var(--capital-text)"
          >
            closest point on the line
          </text>
        </>
      ) : (
        <>
          <line
            x1={origin[0]}
            y1={origin[1]}
            x2={target[0]}
            y2={target[1]}
            stroke="var(--public)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text
            x={(origin[0] + target[0]) / 2}
            y={(origin[1] + target[1]) / 2 + 44}
            textAnchor="middle"
            fontSize={L.fs}
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            reached by combining the two positions
          </text>
        </>
      )}

      {menu !== 1 && (
        <g>
          <circle
            cx={point[0]}
            cy={point[1]}
            r="18"
            fill="var(--public)"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <text
            x={point[0]}
            y={point[1] + 46}
            textAnchor="middle"
            fontSize={L.fsSmall}
            className="svg-text"
            fill="var(--public-text)"
            fontWeight="600"
          >
            the public position
          </text>
        </g>
      )}
      <circle cx={origin[0]} cy={origin[1]} r="6" fill="var(--ink)" />
    </svg>
  );
}
