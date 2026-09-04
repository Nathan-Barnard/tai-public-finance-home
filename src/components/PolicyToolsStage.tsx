import { useId, useState } from 'react';

import type { Instrument, StorySection } from '@/content/types';
import { useInView } from '@/hooks/useInView';
import { useTabList } from '@/hooks/useTabList';

import { ResponsiveFigure } from './ResponsiveFigure';
import { SectionHeader } from './SectionHeader';

type Props = {
  section: StorySection;
  instruments: Instrument[];
  takeaways: string[];
};

/** Three instruments, three different visual forms. */
export function PolicyToolsStage({ section, instruments, takeaways }: Props) {
  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div className="tools">
        {instruments.map((instrument) => (
          <article
            key={instrument.id}
            className={`tool tool--${instrument.visual}`}
            aria-labelledby={`tool-${instrument.id}`}
          >
            <div className="tool__text">
              <p className="t-eyebrow">{instrument.name}</p>
              <h3 id={`tool-${instrument.id}`} className="t-statement">
                {instrument.copy}
              </h3>
              {instrument.caveat && (
                <p className="t-small measure-narrow">{instrument.caveat}</p>
              )}
            </div>
            <div className="tool__visual">
              {instrument.visual === 'time-rail' && <TimeRail />}
              {instrument.visual === 'state-field' && <StateField />}
              {instrument.visual === 'transition-loop' && <TransitionLoop />}
            </div>
          </article>
        ))}
      </div>
      <ul className="takeaways" aria-label="What each tool does">
        {takeaways.map((line) => (
          <li key={line} className="t-statement">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A horizontal time rail: the control moves resources between now and later. */
function TimeRail() {
  const id = useId();
  const [shift, setShift] = useState(0.35);
  const wording =
    shift > 0.05
      ? 'Saving now: fewer resources today, more room later.'
      : shift < -0.05
        ? 'Borrowing now: more resources today, less room later.'
        : 'Neither saving nor borrowing: resources stay where they are.';
  return (
    <div className="time-rail">
      <ResponsiveFigure
        wide={
          <RailSvg
            id={`${id}-w`}
            layout="wide"
            shift={shift}
            wording={wording}
          />
        }
        tall={
          <RailSvg
            id={`${id}-t`}
            layout="tall"
            shift={shift}
            wording={wording}
          />
        }
      />
      <div className="field">
        <label className="field__label" htmlFor={`${id}-shift`}>
          Borrow more ← → Save more
        </label>
        <input
          id={`${id}-shift`}
          className="range"
          type="range"
          min="-0.6"
          max="0.6"
          step="0.01"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          aria-valuetext={wording}
        />
        <p className="t-small" aria-live="polite">
          {wording} This changes when, not which state.
        </p>
      </div>
    </div>
  );
}

const railLayouts = {
  wide: {
    W: 1200,
    H: 360,
    baseY: 250,
    maxH: 170,
    nowX: 300,
    laterX: 760,
    barW: 140,
    fs: 26,
    fsSmall: 20,
    arcY: 230,
    left: 120,
    right: 1080,
  },
  tall: {
    W: 640,
    H: 520,
    baseY: 400,
    maxH: 200,
    nowX: 120,
    laterX: 380,
    barW: 130,
    fs: 28,
    fsSmall: 22,
    arcY: 300,
    left: 50,
    right: 590,
  },
};

function RailSvg({
  id,
  layout,
  shift,
  wording,
}: {
  id: string;
  layout: 'wide' | 'tall';
  shift: number;
  wording: string;
}) {
  const L = railLayouts[layout];
  const now = 1 - shift;
  const later = 1 + shift;
  const nowH = now * L.maxH * 0.6;
  const laterH = later * L.maxH * 0.6;
  const nowMid = L.nowX + L.barW / 2;
  const laterMid = L.laterX + L.barW / 2;
  const arc =
    shift >= 0
      ? `M${L.nowX + L.barW + 10} ${L.baseY - nowH - 30} C ${nowMid + 80} ${L.baseY - L.arcY}, ${laterMid - 80} ${L.baseY - L.arcY}, ${L.laterX - 10} ${L.baseY - laterH - 30}`
      : `M${L.laterX - 10} ${L.baseY - laterH - 30} C ${laterMid - 80} ${L.baseY - L.arcY}, ${nowMid + 80} ${L.baseY - L.arcY}, ${L.nowX + L.barW + 10} ${L.baseY - nowH - 30}`;
  const arcOpacity = Math.min(1, Math.abs(shift) * 3);
  return (
    <svg
      viewBox={`0 0 ${L.W} ${L.H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>Public resources now and later</title>
      <desc id={`${id}-d`}>
        {wording} The control changes timing only; it does not change which
        state an asset pays in.
      </desc>
      <line
        x1={L.left}
        y1={L.baseY}
        x2={L.right}
        y2={L.baseY}
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <path
        d={`M${L.right - 10} ${L.baseY - 10} l14 10 l-14 10`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x={L.left}
        y={L.baseY + 44}
        fontSize={L.fs}
        className="svg-display"
        fill="var(--ink)"
      >
        Now
      </text>
      <text
        x={L.right}
        y={L.baseY + 44}
        fontSize={L.fs}
        className="svg-display"
        fill="var(--ink)"
        textAnchor="end"
      >
        Later
      </text>
      <text
        x={(L.left + L.right) / 2}
        y={L.baseY + 44}
        fontSize={L.fsSmall}
        className="svg-text"
        fill="var(--text-mute)"
        textAnchor="middle"
      >
        time
      </text>
      <rect
        x={L.nowX}
        y={L.baseY - nowH}
        width={L.barW}
        height={nowH}
        fill="var(--public)"
        rx="6"
        style={{ transition: 'all var(--dur) var(--ease)' }}
      />
      <rect
        x={L.laterX}
        y={L.baseY - laterH}
        width={L.barW}
        height={laterH}
        fill="var(--public)"
        rx="6"
        style={{ transition: 'all var(--dur) var(--ease)' }}
      />
      <text
        x={nowMid}
        y={L.baseY - nowH - 14}
        fontSize={L.fsSmall}
        className="svg-text"
        fill="var(--public-text)"
        textAnchor="middle"
        fontWeight="600"
      >
        resources now
      </text>
      <text
        x={laterMid}
        y={L.baseY - laterH - 14}
        fontSize={L.fsSmall}
        className="svg-text"
        fill="var(--public-text)"
        textAnchor="middle"
        fontWeight="600"
      >
        resources later
      </text>
      <path
        d={arc}
        fill="none"
        stroke="var(--public)"
        strokeWidth="4"
        strokeDasharray="10 10"
        opacity={arcOpacity}
        style={{ transition: 'opacity var(--dur)' }}
      />
      <text
        x={(nowMid + laterMid) / 2}
        y={L.baseY - L.arcY + 8}
        fontSize={L.fsSmall}
        className="svg-display"
        fill="var(--public-text)"
        textAnchor="middle"
        fontStyle="italic"
        opacity={arcOpacity}
      >
        {shift >= 0
          ? 'saving moves resources later'
          : 'borrowing brings resources forward'}
      </text>
    </svg>
  );
}

const states = [
  'Workers fall behind',
  'Gains are shared',
  'Workers are ahead',
  'An unrelated shock',
];
const assets = [
  {
    id: 'aligned',
    label: 'An asset that pays when workers fall behind',
    pays: [true, false, false, false],
  },
  {
    id: 'elsewhere',
    label: 'An asset that pays in a different state',
    pays: [false, false, true, true],
  },
  {
    id: 'everywhere',
    label: 'An asset that pays a little in every state',
    pays: [true, true, true, true],
  },
];

/** The selected asset lights only the states in which it pays. */
function StateField() {
  const [active, setActive] = useState(0);
  const { tabProps, listProps } = useTabList({
    count: assets.length,
    active,
    onChange: setActive,
    orientation: 'vertical',
  });
  const asset = assets[active];
  const litStates = states.filter((_, i) => asset.pays[i]);
  return (
    <div className="state-field">
      <div
        className="tabs tabs--stack"
        {...listProps}
        aria-label="Choose a schematic asset"
      >
        {assets.map((a, index) => (
          <button key={a.id} type="button" className="tab" {...tabProps(index)}>
            {a.label}
          </button>
        ))}
      </div>
      <div
        className="state-field__grid"
        role="img"
        aria-label={`Future states lit by this asset: ${litStates.join(', ')}.`}
      >
        {states.map((state, index) => (
          <div
            key={state}
            className={`state-cell ${asset.pays[index] ? 'is-lit' : ''}`}
          >
            <span className="state-cell__name">{state}</span>
            <span className="state-cell__status">
              {asset.pays[index] ? 'money arrives' : 'nothing arrives'}
            </span>
          </div>
        ))}
      </div>
      <p className="t-small" aria-live="polite">
        {asset.id === 'aligned' &&
          'This asset brings resources onto the public balance sheet exactly where workers fall behind.'}
        {asset.id === 'elsewhere' &&
          'This asset brings money in futures where workers are already doing well or the shock is unrelated. It does nothing in the state that matters most.'}
        {asset.id === 'everywhere' &&
          'This asset pays a little everywhere. It brings something in the worker-shortfall state, but no more there than anywhere else.'}
      </p>
    </div>
  );
}

const loop = [
  'profits',
  'tax receipts',
  'investment',
  'capital',
  'wages',
  'future public revenue',
];

const loopLayouts = {
  wide: { W: 900, H: 720, r: 250, nodeW: 224, nodeH: 60, fs: 22, fsCentre: 24 },
  tall: { W: 640, H: 700, r: 215, nodeW: 190, nodeH: 64, fs: 22, fsCentre: 20 },
};

/** A cycle of causal links, traced while on screen. */
function TransitionLoop() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  return (
    <div ref={ref} className={`loop ${inView ? 'is-in' : ''}`}>
      <ResponsiveFigure
        wide={<LoopSvg id="loop-w" layout="wide" />}
        tall={<LoopSvg id="loop-t" layout="tall" />}
      />
    </div>
  );
}

function LoopSvg({ id, layout }: { id: string; layout: 'wide' | 'tall' }) {
  const L = loopLayouts[layout];
  const cx = L.W / 2;
  const cy = L.H / 2 + 10;
  const points = loop.map((_, i) => {
    const a = (-90 + (i * 360) / loop.length) * (Math.PI / 180);
    return { x: cx + Math.cos(a) * L.r, y: cy + Math.sin(a) * L.r };
  });
  const lines = (label: string) => {
    if (layout === 'wide' || label.length <= 13) return [label];
    const cut = label.lastIndexOf(' ');
    return [label.slice(0, cut), label.slice(cut + 1)];
  };
  return (
    <svg
      viewBox={`0 0 ${L.W} ${L.H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>
        How a capital tax works through the economy over time
      </title>
      <desc id={`${id}-d`}>
        A loop: profits to tax receipts to investment to capital to wages to
        future public revenue, and around again.
      </desc>
      <defs>
        <marker
          id={`${id}-head`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--capital)" />
        </marker>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={L.r}
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={L.r}
        fill="none"
        stroke="var(--capital)"
        strokeWidth="6"
        strokeDasharray="40 26"
        className="loop__flow"
        strokeLinecap="round"
      />
      {points.map((p, i) => {
        const next = points[(i + 1) % points.length];
        const mx = (p.x + next.x) / 2 + (cx - (p.x + next.x) / 2) * -0.22;
        const my = (p.y + next.y) / 2 + (cy - (p.y + next.y) / 2) * -0.22;
        return (
          <path
            key={i}
            d={`M${p.x} ${p.y} Q ${mx} ${my} ${next.x} ${next.y}`}
            fill="none"
            stroke="var(--capital)"
            strokeWidth="3"
            markerEnd={`url(#${id}-head)`}
            opacity="0.8"
          />
        );
      })}
      {points.map((p, i) => {
        const text = lines(loop[i]);
        return (
          <g key={loop[i]}>
            <rect
              x={p.x - L.nodeW / 2}
              y={p.y - L.nodeH / 2}
              width={L.nodeW}
              height={L.nodeH}
              rx={L.nodeH / 2}
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="2"
            />
            {text.map((line, j) => (
              <text
                key={line}
                x={p.x}
                y={p.y + (text.length === 1 ? 8 : j === 0 ? -4 : 20)}
                textAnchor="middle"
                fontSize={L.fs}
                className="svg-display"
                fill="var(--ink)"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={L.fsCentre}
        className="svg-display"
        fill="var(--text-soft)"
        fontStyle="italic"
      >
        a tax changes the return to capital,
      </text>
      <text
        x={cx}
        y={cy + 24}
        textAnchor="middle"
        fontSize={L.fsCentre}
        className="svg-display"
        fill="var(--text-soft)"
        fontStyle="italic"
      >
        which changes investment and later wages
      </text>
    </svg>
  );
}
