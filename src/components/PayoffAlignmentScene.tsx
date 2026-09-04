import { useState } from 'react';

import type { AlignmentCase, StorySection } from '@/content/types';
import { useTabList } from '@/hooks/useTabList';

import { ResponsiveFigure } from './ResponsiveFigure';
import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; cases: AlignmentCase[]; caveat: string };

/**
 * A large field. Across: futures in which public resources matter less or
 * more to workers. Up: where the available asset pays. Annotation replaces
 * numerical axes.
 */
export function PayoffAlignmentScene({ section, cases, caveat }: Props) {
  const [active, setActive] = useState(0);
  const { tabProps, panelProps, listProps } = useTabList({
    count: cases.length,
    active,
    onChange: setActive,
    orientation: 'vertical',
  });

  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div className="align-scene">
        <div className="align-scene__field">
          <ResponsiveFigure
            wide={
              <Field
                id="align-w"
                layout="wide"
                cases={cases}
                active={active}
                onSelect={setActive}
              />
            }
            tall={
              <Field
                id="align-t"
                layout="tall"
                cases={cases}
                active={active}
                onSelect={setActive}
              />
            }
          />
        </div>
        <div className="align-scene__list">
          <div
            className="tabs tabs--stack"
            {...listProps}
            aria-label="Choose a case"
          >
            {cases.map((c, index) => (
              <button
                key={c.id}
                type="button"
                className="tab"
                {...tabProps(index)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {cases.map((c, index) => (
            <div
              key={c.id}
              {...panelProps(index)}
              className="align-scene__reading"
            >
              <p className={`align-scene__verdict t-h3 verdict--${c.reaches}`}>
                {c.verdict}
              </p>
              <p className="t-body">{c.note}</p>
            </div>
          ))}
          <p className="t-small">{caveat}</p>
        </div>
      </div>
    </div>
  );
}

const layouts = {
  wide: {
    W: 1200,
    H: 800,
    left: 210,
    right: 1160,
    top: 70,
    bottom: 690,
    fs: 22,
    fsCase: 24,
    fsAxis: 24,
  },
  tall: {
    W: 720,
    H: 940,
    left: 130,
    right: 690,
    top: 70,
    bottom: 800,
    fs: 24,
    fsCase: 26,
    fsAxis: 24,
  },
};

function Field({
  id,
  layout,
  cases,
  active,
  onSelect,
}: {
  id: string;
  layout: 'wide' | 'tall';
  cases: AlignmentCase[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const L = layouts[layout];
  const tall = layout === 'tall';
  const px = (x: number) => L.left + x * (L.right - L.left);
  const py = (y: number) => L.bottom - y * (L.bottom - L.top);
  return (
    <svg
      viewBox={`0 0 ${L.W} ${L.H}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className="align-svg"
    >
      <title id={`${id}-title`}>
        Where the asset pays against where public resources matter to workers
      </title>
      <desc id={`${id}-desc`}>
        Four cases. Workers fall behind and the asset rises: reaches this state.
        Workers fall behind and the asset stays flat: misses this state. Workers
        gain less than capital owners and the asset rises: reaches this state.
        The asset rises where workers are already doing well: pays where it is
        needed least.
      </desc>
      {/* shaded regions */}
      <rect
        x={px(0.5)}
        y={L.top}
        width={L.right - px(0.5)}
        height={L.bottom - L.top}
        fill="var(--worker-soft)"
      />
      <rect
        x={L.left}
        y={L.top}
        width={L.right - L.left}
        height={py(0.5) - L.top}
        fill="var(--capital-soft)"
      />
      <text
        x={px(0.75)}
        y={L.bottom - 18}
        textAnchor="middle"
        fontSize={L.fs}
        className="svg-text"
        fill="var(--worker-text)"
        fontWeight="600"
      >
        workers falling behind
      </text>
      <text
        x={px(0.25)}
        y={L.bottom - 18}
        textAnchor="middle"
        fontSize={L.fs}
        className="svg-text"
        fill="var(--text-mute)"
        fontWeight="600"
      >
        workers doing well
      </text>
      <text
        x={L.left + 16}
        y={py(0.5) - 14}
        fontSize={L.fs}
        className="svg-text"
        fill="var(--capital-text)"
        fontWeight="600"
      >
        the asset pays ↑
      </text>
      <text
        x={L.left + 16}
        y={py(0.5) + 32}
        fontSize={L.fs}
        className="svg-text"
        fill="var(--text-mute)"
        fontWeight="600"
      >
        the asset stays flat ↓
      </text>

      {/* axes */}
      <line
        x1={L.left}
        y1={L.bottom}
        x2={L.right}
        y2={L.bottom}
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <line
        x1={L.left}
        y1={L.bottom}
        x2={L.left}
        y2={L.top}
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x={L.right}
        y={L.bottom + 52}
        textAnchor="end"
        fontSize={L.fsAxis}
        className="svg-display"
        fill="var(--ink)"
      >
        {tall
          ? '→ public resources matter more to workers'
          : '→ futures where public resources matter more to workers'}
      </text>
      <text
        x={L.left - 60}
        y={(L.top + L.bottom) / 2}
        textAnchor="middle"
        fontSize={L.fsAxis}
        className="svg-display"
        fill="var(--ink)"
        transform={`rotate(-90 ${L.left - 60} ${(L.top + L.bottom) / 2})`}
      >
        → where the asset pays
      </text>

      {/* the aligned zone */}
      <rect
        x={px(0.5)}
        y={L.top}
        width={L.right - px(0.5)}
        height={py(0.5) - L.top}
        fill="none"
        stroke="var(--public)"
        strokeWidth="3"
        strokeDasharray="10 8"
      />
      {tall ? (
        <>
          <text
            x={px(0.75)}
            y={L.top + 34}
            textAnchor="middle"
            fontSize={L.fs}
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            the payout arrives
          </text>
          <text
            x={px(0.75)}
            y={L.top + 62}
            textAnchor="middle"
            fontSize={L.fs}
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            where it is needed
          </text>
        </>
      ) : (
        <text
          x={px(0.75)}
          y={L.top + 36}
          textAnchor="middle"
          fontSize={L.fs}
          className="svg-display"
          fill="var(--public-text)"
          fontStyle="italic"
        >
          the payout arrives where it is needed
        </text>
      )}

      {cases.map((c, index) => {
        const on = index === active;
        const cx = px(c.x);
        const cy = py(c.y);
        const stroke =
          c.reaches === 'yes'
            ? 'var(--public)'
            : c.reaches === 'no'
              ? 'var(--outside)'
              : 'var(--text-mute)';
        const right = c.labelSide === 'right';
        const below = c.labelSide === 'below';
        const labelX = below ? cx + (tall ? 30 : 0) : cx + (right ? 46 : -46);
        const labelY = below ? cy + (on ? 68 : 58) : cy + 9;
        const anchor = below
          ? tall
            ? 'end'
            : 'middle'
          : right
            ? 'start'
            : 'end';
        return (
          <g
            key={c.id}
            className={`align-case ${on ? 'is-active' : ''}`}
            onClick={() => onSelect(index)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={on ? 34 : 24}
              fill={c.reaches === 'yes' ? stroke : 'var(--paper)'}
              stroke={stroke}
              strokeWidth={c.reaches === 'no' ? 6 : 4}
              strokeDasharray={c.reaches === 'wrong-place' ? '6 6' : undefined}
            />
            {c.reaches === 'no' && (
              <path
                d={`M${cx - 10} ${cy - 10} l20 20 M${cx + 10} ${cy - 10} l-20 20`}
                stroke={stroke}
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
            {c.reaches === 'yes' && (
              <path
                d={`M${cx - 11} ${cy} l8 8 l15 -16`}
                stroke="var(--paper)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <text
              x={labelX}
              y={labelY}
              textAnchor={anchor}
              fontSize={on ? L.fsCase + 2 : L.fsCase}
              className="svg-display"
              fill="var(--ink)"
              fontWeight={on ? 600 : 400}
            >
              {c.verdict}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
