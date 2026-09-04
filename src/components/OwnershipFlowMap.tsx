import { useEffect, useState } from 'react';

import type { ActorNode, FlowStep, StorySection } from '@/content/types';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { useTabList } from '@/hooks/useTabList';

import { ExpertDisclosure } from './ExpertDisclosure';
import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; actors: ActorNode[]; steps: FlowStep[] };

/**
 * Full-width actor-and-flow map. The shock feeds wages, profits, asset
 * values and public revenue; the final step reveals the public balance
 * sheet between financial markets and workers.
 */
export function OwnershipFlowMap({ section, actors, steps }: Props) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.35,
    once: true,
  });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  // With reduced motion the finished map is shown at once instead of played.
  const shown = reduced && !touched ? steps.length - 1 : active;
  const { tabProps, panelProps, listProps } = useTabList({
    count: steps.length,
    active: shown,
    onChange: (index) => {
      setTouched(true);
      setActive(index);
    },
  });

  // Scroll-driven default: reveal the flows in sequence once the map is on
  // screen, unless the reader has already taken control.
  useEffect(() => {
    if (!inView || touched || reduced) return;
    if (active >= steps.length - 1) return;
    const timer = window.setTimeout(() => setActive(active + 1), 2200);
    return () => window.clearTimeout(timer);
  }, [inView, touched, reduced, active, steps.length]);

  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div
        className="tabs flow-tabs"
        {...listProps}
        aria-label="Reveal the map step by step"
      >
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            className="tab"
            {...tabProps(index)}
          >
            {step.title}
          </button>
        ))}
      </div>
      <div ref={ref} className={`flow-map flow-map--step-${shown}`}>
        <FlowSvg actors={actors} active={shown} layout="wide" />
        <FlowSvg actors={actors} active={shown} layout="tall" />
      </div>
      {steps.map((step, index) => (
        <div
          key={step.title}
          {...panelProps(index)}
          className="flow-map__reading"
        >
          <p className="t-lead measure-wide" aria-live="polite">
            <strong>{step.title}</strong> {step.copy}
          </p>
        </div>
      ))}
      <ul className="actor-list" aria-label="The four actors">
        {actors.map((actor) => (
          <li
            key={actor.id}
            className={`actor-list__item actor-list__item--${actor.id}`}
          >
            <span className="actor-list__name">{actor.name}</span>
            <span className="t-small">{actor.description}</span>
          </li>
        ))}
      </ul>
      {section.expertNote && <ExpertDisclosure note={section.expertNote} />}
    </div>
  );
}

type Pt = { x: number; y: number };

function FlowSvg({
  actors,
  active,
  layout,
}: {
  actors: ActorNode[];
  active: number;
  layout: 'wide' | 'tall';
}) {
  const name = (id: ActorNode['id']) =>
    actors.find((a) => a.id === id)?.name ?? id;
  const step1 = active >= 1;
  const step2 = active >= 2;
  const flowLabel: Record<string, string> = {
    wages: 'Wages',
    profits: 'Profits',
    assets: 'Asset values',
    revenue: 'Public revenue',
  };
  const actorColor = (id: string) =>
    id === 'workers'
      ? 'var(--worker)'
      : id === 'owners'
        ? 'var(--capital)'
        : id === 'government'
          ? 'var(--public)'
          : 'var(--ink)';
  const edge = (a: Pt, b: Pt) =>
    `M${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;
  const trace = (d: string, len: number, key: string) => (
    <path
      key={key}
      className="trace"
      d={d}
      style={{ '--len': len } as React.CSSProperties}
    />
  );

  if (layout === 'tall') {
    // Flows in the left column, actors in the right column, the shock feeding
    // a spine on the far left, and the public balance sheet on the right edge.
    const W = 660;
    const H = 800;
    const fx = 190;
    const ax = 470;
    const rows: Record<string, number> = {
      wages: 200,
      profits: 340,
      assets: 480,
      revenue: 620,
    };
    const actorOf: Record<string, ActorNode['id']> = {
      wages: 'workers',
      profits: 'owners',
      assets: 'markets',
      revenue: 'government',
    };
    const shock: Pt = { x: 330, y: 70 };
    return (
      <svg
        className="flow-map__svg flow-map__svg--tall"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="flow-title-tall flow-desc-tall"
      >
        <title id="flow-title-tall">
          Who owns the upside when automation arrives
        </title>
        <desc id="flow-desc-tall">
          An automation shock feeds wages, profits, asset values and public
          revenue. Wages reach workers; profits and asset values reach capital
          owners and are priced by financial markets; revenue reaches
          government. The public balance sheet then links government to
          financial markets, where it buys claims, and to workers, who receive
          transfers.
        </desc>
        <defs>
          <marker
            id="fm-ink-tall"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="var(--ink)" />
          </marker>
          <marker
            id="fm-pub-tall"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="var(--public)" />
          </marker>
        </defs>
        <g className="flow-node is-on">
          <rect
            x={shock.x - 140}
            y={shock.y - 32}
            width={280}
            height={64}
            rx="32"
            fill="var(--ink)"
          />
          <text
            x={shock.x}
            y={shock.y + 9}
            textAnchor="middle"
            fontSize="26"
            className="svg-display"
            fill="var(--paper)"
          >
            Automation shock
          </text>
        </g>
        <g
          className={`flow-edges ${step1 ? 'is-in' : ''}`}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
        >
          {trace(
            `M${shock.x - 140} ${shock.y} C 100 ${shock.y}, 30 120, 30 ${rows.wages}`,
            400,
            'spine-top',
          )}
          {trace(`M30 ${rows.wages} V${rows.revenue}`, 460, 'spine')}
          {Object.entries(rows).map(([key, y]) => (
            <path
              key={key}
              className="trace"
              d={`M30 ${y} H${fx - 92}`}
              markerEnd="url(#fm-ink-tall)"
              style={{ '--len': 80 } as React.CSSProperties}
            />
          ))}
          {Object.entries(rows).map(([key, y]) => (
            <path
              key={`to-${key}`}
              className="trace"
              d={`M${fx + 92} ${y} H${ax - 98}`}
              markerEnd="url(#fm-ink-tall)"
              style={{ '--len': 120 } as React.CSSProperties}
            />
          ))}
          <path
            className="trace"
            d={`M${fx + 80} ${rows.assets - 30} C ${fx + 200} ${rows.assets - 60}, ${ax - 140} ${rows.profits + 60}, ${ax - 60} ${rows.profits + 38}`}
            markerEnd="url(#fm-ink-tall)"
            style={{ '--len': 320 } as React.CSSProperties}
          />
        </g>
        {Object.entries(rows).map(([key, y]) => (
          <g key={key} className={`flow-node ${step1 ? 'is-on' : ''}`}>
            <rect
              x={fx - 92}
              y={y - 30}
              width={184}
              height={60}
              rx="10"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="2"
            />
            <text
              x={fx}
              y={y + 8}
              textAnchor="middle"
              fontSize="24"
              className="svg-display"
              fill="var(--ink)"
            >
              {flowLabel[key]}
            </text>
          </g>
        ))}
        {Object.entries(rows).map(([key, y]) => {
          const id = actorOf[key];
          return (
            <g key={id} className={`flow-node ${step1 ? 'is-on' : ''}`}>
              <rect
                x={ax - 98}
                y={y - 32}
                width={196}
                height={64}
                rx="32"
                fill={actorColor(id)}
              />
              <text
                x={ax}
                y={y + 8}
                textAnchor="middle"
                fontSize={id === 'markets' ? 21 : 24}
                className="svg-display"
                fill="var(--paper)"
                fontWeight="500"
              >
                {name(id)}
              </text>
            </g>
          );
        })}
        <text
          x={fx}
          y={rows.assets + 54}
          textAnchor="middle"
          fontSize="20"
          className={`svg-text flow-note ${step1 ? 'is-on' : ''}`}
          fill="var(--text-mute)"
        >
          priced by financial markets
        </text>
        <g
          className={`flow-edges flow-edges--public ${step2 ? 'is-in' : ''}`}
          fill="none"
          stroke="var(--public)"
          strokeWidth="5"
        >
          <path
            className="trace"
            markerEnd="url(#fm-pub-tall)"
            d={`M${ax + 30} ${rows.revenue - 34} V${rows.assets + 40}`}
            style={{ '--len': 120 } as React.CSSProperties}
          />
          <path
            className="trace"
            markerEnd="url(#fm-pub-tall)"
            d={`M${ax - 30} ${rows.assets + 34} V${rows.revenue - 40}`}
            style={{ '--len': 120 } as React.CSSProperties}
          />
          <path
            className="trace"
            markerEnd="url(#fm-pub-tall)"
            d={`M${ax + 98} ${rows.revenue - 10} C ${W - 20} ${rows.revenue - 10}, ${W - 20} ${rows.wages + 10}, ${ax + 104} ${rows.wages + 10}`}
            style={{ '--len': 900 } as React.CSSProperties}
          />
        </g>
        <g className={`flow-note ${step2 ? 'is-on' : ''}`}>
          <text
            x={ax + 44}
            y={(rows.assets + rows.revenue) / 2 + 8}
            fontSize="24"
            className="svg-text"
            fill="var(--public-text)"
            fontWeight="600"
          >
            buys claims
          </text>
          <text
            x={ax - 44}
            y={(rows.assets + rows.revenue) / 2 + 8}
            fontSize="24"
            className="svg-text"
            fill="var(--public-text)"
            fontWeight="600"
            textAnchor="end"
          >
            claims pay
          </text>
          <text
            x={W / 2 + 30}
            y={H - 90}
            textAnchor="middle"
            fontSize="26"
            className="svg-display"
            fill="var(--public-text)"
          >
            The public balance sheet
          </text>
          <text
            x={W / 2 + 30}
            y={H - 58}
            textAnchor="middle"
            fontSize="20"
            className="svg-text"
            fill="var(--public-text)"
          >
            transfers to workers what the claims pay
          </text>
        </g>
      </svg>
    );
  }

  const W = 1400;
  const H = 820;
  const shock: Pt = { x: 700, y: 80 };
  const flows: Record<string, Pt> = {
    wages: { x: 230, y: 300 },
    profits: { x: 545, y: 300 },
    assets: { x: 855, y: 300 },
    revenue: { x: 1170, y: 300 },
  };
  const act: Record<string, Pt> = {
    workers: { x: 230, y: 560 },
    owners: { x: 545, y: 560 },
    markets: { x: 855, y: 560 },
    government: { x: 1170, y: 560 },
  };
  const fs = 24;

  return (
    <svg
      className="flow-map__svg flow-map__svg--wide"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="flow-title-wide flow-desc-wide"
    >
      <title id="flow-title-wide">
        Who owns the upside when automation arrives
      </title>
      <desc id="flow-desc-wide">
        An automation shock feeds wages, profits, asset values and public
        revenue. Wages reach workers; profits and asset values reach capital
        owners and are priced by financial markets; revenue reaches government.
        The public balance sheet then links government to financial markets,
        where it buys claims, and to workers, who receive transfers.
      </desc>
      <defs>
        <marker
          id="fm-ink-wide"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--ink)" />
        </marker>
        <marker
          id="fm-pub-wide"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--public)" />
        </marker>
      </defs>

      <g className="flow-node is-on">
        <rect
          x={shock.x - 150}
          y={shock.y - 34}
          width={300}
          height={68}
          rx="34"
          fill="var(--ink)"
        />
        <text
          x={shock.x}
          y={shock.y + 8}
          textAnchor="middle"
          fontSize={fs + 2}
          className="svg-display"
          fill="var(--paper)"
        >
          Automation shock
        </text>
      </g>

      <g
        className={`flow-edges ${step1 ? 'is-in' : ''}`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        markerEnd="url(#fm-ink-wide)"
      >
        {Object.entries(flows).map(([key, p]) =>
          trace(edge(shock, { x: p.x, y: p.y - 34 }), 900, key),
        )}
        {trace(
          edge(
            { x: flows.wages.x, y: flows.wages.y + 34 },
            { x: act.workers.x, y: act.workers.y - 36 },
          ),
          600,
          'w-w',
        )}
        {trace(
          edge(
            { x: flows.profits.x, y: flows.profits.y + 34 },
            { x: act.owners.x, y: act.owners.y - 36 },
          ),
          600,
          'p-o',
        )}
        {trace(
          edge(
            { x: flows.assets.x, y: flows.assets.y + 34 },
            { x: act.owners.x + 60, y: act.owners.y - 36 },
          ),
          700,
          'a-o',
        )}
        {trace(
          edge(
            { x: flows.assets.x, y: flows.assets.y + 34 },
            { x: act.markets.x, y: act.markets.y - 36 },
          ),
          600,
          'a-m',
        )}
        {trace(
          edge(
            { x: flows.revenue.x, y: flows.revenue.y + 34 },
            { x: act.government.x, y: act.government.y - 36 },
          ),
          700,
          'r-g',
        )}
      </g>
      {Object.entries(flows).map(([key, p]) => (
        <g key={key} className={`flow-node ${step1 ? 'is-on' : ''}`}>
          <rect
            x={p.x - 120}
            y={p.y - 32}
            width={240}
            height={64}
            rx="12"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text
            x={p.x}
            y={p.y + 8}
            textAnchor="middle"
            fontSize={fs}
            className="svg-display"
            fill="var(--ink)"
          >
            {flowLabel[key]}
          </text>
        </g>
      ))}
      <text
        x={flows.assets.x}
        y={flows.assets.y + 58}
        textAnchor="middle"
        fontSize="18"
        className={`svg-text flow-note ${step1 ? 'is-on' : ''}`}
        fill="var(--text-mute)"
      >
        priced by financial markets
      </text>

      {(['workers', 'owners', 'markets', 'government'] as const).map((id) => {
        const p = act[id];
        return (
          <g key={id} className={`flow-node ${step1 ? 'is-on' : ''}`}>
            <rect
              x={p.x - 126}
              y={p.y - 38}
              width={252}
              height={76}
              rx="38"
              fill={actorColor(id)}
            />
            <text
              x={p.x}
              y={p.y + 9}
              textAnchor="middle"
              fontSize={fs + 2}
              className="svg-display"
              fill="var(--paper)"
              fontWeight="500"
            >
              {name(id)}
            </text>
          </g>
        );
      })}

      <g
        className={`flow-edges flow-edges--public ${step2 ? 'is-in' : ''}`}
        fill="none"
        stroke="var(--public)"
        strokeWidth="5"
      >
        <path
          className="trace"
          markerEnd="url(#fm-pub-wide)"
          d={`M${act.government.x - 126} ${act.government.y - 12} C ${act.government.x - 220} ${act.government.y - 12}, ${act.markets.x + 220} ${act.markets.y - 12}, ${act.markets.x + 130} ${act.markets.y - 12}`}
          style={{ '--len': 500 } as React.CSSProperties}
        />
        <path
          className="trace"
          markerEnd="url(#fm-pub-wide)"
          d={`M${act.markets.x + 126} ${act.markets.y + 14} C ${act.markets.x + 220} ${act.markets.y + 14}, ${act.government.x - 220} ${act.government.y + 14}, ${act.government.x - 130} ${act.government.y + 14}`}
          style={{ '--len': 500 } as React.CSSProperties}
        />
        <path
          className="trace"
          markerEnd="url(#fm-pub-wide)"
          d={`M${act.government.x} ${act.government.y + 38} C ${act.government.x} ${act.government.y + 200}, ${act.workers.x} ${act.workers.y + 200}, ${act.workers.x} ${act.workers.y + 42}`}
          style={{ '--len': 1600 } as React.CSSProperties}
        />
      </g>
      <g className={`flow-note ${step2 ? 'is-on' : ''}`}>
        <text
          x={(act.markets.x + act.government.x) / 2}
          y={act.markets.y - 24}
          textAnchor="middle"
          fontSize="20"
          className="svg-text"
          fill="var(--public-text)"
          fontWeight="600"
        >
          buys claims
        </text>
        <text
          x={(act.markets.x + act.government.x) / 2}
          y={act.markets.y + 48}
          textAnchor="middle"
          fontSize="20"
          className="svg-text"
          fill="var(--public-text)"
          fontWeight="600"
        >
          claims pay
        </text>
        <text
          x={(act.workers.x + act.government.x) / 2}
          y={act.workers.y + 190}
          textAnchor="middle"
          fontSize="28"
          className="svg-display"
          fill="var(--public-text)"
        >
          The public balance sheet: transfers what the claims pay
        </text>
      </g>
    </svg>
  );
}
