import { useId } from 'react';

import type { Scenario } from '@/content/scenarios';
import type { Move } from '@/content/types';
import { fromAngle, projectOntoSpan, type Vec2 } from '@/lib/geometry';
import { evaluateLab } from '@/lib/lab-model';

import { DistributionFigure } from './DistributionFigure';
import { FIRST, ForkSvg, TARGET } from './FutureForkExplorer';
import { ArrowUpRight } from './Icons';
import { TimelineSvg } from './ImpactTransitionTimeline';
import { PayoffField } from './PayoffField';
import { PositionGauge } from './PositionGauge';
import { ResponsiveFigure } from './ResponsiveFigure';

const toMove = (
  worker: string,
  capital: string,
): { worker: Move; capital: Move } => ({
  worker: worker === 'rises-less' ? 'rises' : (worker as Move),
  capital:
    capital === 'rises-strongly'
      ? 'rises-faster'
      : worker === 'rises-less'
        ? 'rises-faster'
        : (capital as Move),
});

const toolLabel = {
  ownership: 'Public ownership',
  saving: 'Public saving',
  tax: 'Capital taxation',
} as const;
const toolState = {
  active: 'doing the work',
  idle: 'not the tool for this state',
  wrong: 'points the wrong way here',
} as const;

/** One of the paper's cases: the outcome, the payoff geometry, and the position. */
export function ScenarioScene({
  scenario,
  index,
}: {
  scenario: Scenario;
  index: number;
}) {
  const id = useId();
  const reading = scenario.preset ? evaluateLab(scenario.preset) : null;
  const moves = scenario.preset
    ? toMove(
        scenario.preset.workers,
        reading?.capital ?? scenario.preset.capital,
      )
    : null;
  const dark = index % 2 === 1;

  return (
    <section
      id={scenario.id}
      className={`band scenario ${dark ? 'band--ink on-ink' : index % 4 === 0 ? 'band--paper' : 'band--bone'}`}
      aria-labelledby={`${scenario.id}-title`}
    >
      <div className="wrap">
        <header className="section-head">
          <p className="t-eyebrow">{scenario.eyebrow}</p>
          <h2 id={`${scenario.id}-title`} className="t-h2 section-head__title">
            {scenario.name}
          </h2>
          <div className="section-head__body stack">
            {scenario.story.map((line) => (
              <p key={line} className="t-lead measure">
                {line}
              </p>
            ))}
          </div>
        </header>

        <div className="scenario__figures">
          {reading && moves && (
            <>
              <figure className="scenario__figure">
                <figcaption className="t-eyebrow">What happens</figcaption>
                <DistributionFigure
                  id={`${id}-dist`}
                  layout="tall"
                  worker={moves.worker}
                  capital={moves.capital}
                  profits={moves.capital}
                  assets={moves.capital}
                />
              </figure>
              <figure className="scenario__figure">
                <figcaption className="t-eyebrow">
                  What the asset reaches
                </figcaption>
                <PayoffField
                  id={`${id}-pay`}
                  layout="compact"
                  exposure={reading.exposure}
                  payoffs={reading.payoffs}
                  projection={reading.projection}
                  dark={dark}
                />
                <p
                  className={`scenario__verdict verdict--${reading.reach.phrase.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {reading.reach.phrase}
                </p>
              </figure>
            </>
          )}
          {scenario.figure === 'successors' && (
            <figure className="scenario__figure scenario__figure--full">
              <figcaption className="t-eyebrow">
                What one position can reach across the two futures
              </figcaption>
              <ResponsiveFigure
                wide={<SuccessorFigure id={`${id}-fork-w`} layout="wide" />}
                tall={<SuccessorFigure id={`${id}-fork-t`} layout="tall" />}
              />
            </figure>
          )}
          {scenario.figure === 'transition' && (
            <figure className="scenario__figure scenario__figure--full">
              <figcaption className="t-eyebrow">
                Impact, then transition
              </figcaption>
              <ResponsiveFigure
                wide={<TimelineSvg id={`${id}-tl-w`} layout="wide" t={0.86} />}
                tall={<TimelineSvg id={`${id}-tl-t`} layout="tall" t={0.86} />}
              />
            </figure>
          )}
          {scenario.figure === 'large-fund' && (
            <>
              <figure className="scenario__figure">
                <figcaption className="t-eyebrow">
                  What the holding is made of
                </figcaption>
                <LargeFundFigure id={`${id}-fund`} dark={dark} />
              </figure>
              <figure className="scenario__figure">
                <figcaption className="t-eyebrow">What it reaches</figcaption>
                <LargeFundReach id={`${id}-fund-reach`} dark={dark} />
              </figure>
            </>
          )}
        </div>

        <div className="good-position">
          <div className="good-position__text">
            <p className="t-eyebrow">A good position</p>
            <h3 className="t-statement">{scenario.goodPosition.headline}</h3>
            {scenario.goodPosition.copy.map((line) => (
              <p key={line} className="t-body">
                {line}
              </p>
            ))}
          </div>
          <div className="good-position__gauge">
            <PositionGauge
              id={`${id}-gauge`}
              direction={scenario.goodPosition.direction}
            />
            {scenario.goodPosition.needsSecondPayoff && (
              <p className="good-position__flag">
                Needs a genuinely different payoff to reach the rest
              </p>
            )}
            <ul
              className="tools-used"
              aria-label="Which public tool is doing the work"
            >
              {(['ownership', 'saving', 'tax'] as const).map((tool) => {
                const state = scenario.goodPosition.tools[tool];
                return (
                  <li
                    key={tool}
                    className={`tools-used__item tools-used__item--${state}`}
                  >
                    <span className="tools-used__name">{toolLabel[tool]}</span>
                    <span className="tools-used__state">
                      {toolState[state]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="scenario__paper t-small">
          {scenario.paperNote}{' '}
          <a href={scenario.paperHref}>
            Read it in the paper <ArrowUpRight className="inline-icon" />
          </a>
        </p>
      </div>
    </section>
  );
}

function SuccessorFigure({
  id,
  layout,
}: {
  id: string;
  layout: 'wide' | 'tall';
}) {
  const projection = projectOntoSpan(TARGET, [FIRST], 1e-3);
  return (
    <ForkSvg
      id={id}
      layout={layout}
      menu={0}
      s={0.86}
      projection={projection.projection}
      reachable={false}
      states={[
        { id: 'labour-using', name: 'A labour-using future', description: '' },
        { id: 'labour-light', name: 'A labour-light future', description: '' },
      ]}
      reading="One inherited position moves along one line through the two futures. The target sits off the line; the closest point on the line is the best one position can do."
    />
  );
}

/** The leading position split into return demand and the part that offsets worker exposure. */
function LargeFundFigure({ id, dark }: { id: string; dark: boolean }) {
  const W = 640;
  const H = 420;
  const barY = 160;
  const barH = 76;
  const left = 30;
  const total = 580;
  const offsetShare = 0.22;
  const split = left + total * (1 - offsetShare);
  const ink = dark ? 'var(--paper)' : 'var(--ink)';
  const mute = dark ? 'var(--text-on-ink-mute)' : 'var(--text-mute)';
  const publicColor = dark ? 'var(--public-dark)' : 'var(--public)';
  const soft = dark ? 'rgba(157,187,255,0.28)' : 'var(--public-soft)';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
      className="fund-figure"
    >
      <title id={`${id}-t`}>
        A large public holding split into its two parts
      </title>
      <desc id={`${id}-d`}>
        Most of the holding is ordinary return demand; a small part offsets
        worker exposure. The bar lengths are illustrative shares, not measured
        ones.
      </desc>
      <text
        x={left}
        y={70}
        fontSize="30"
        className="svg-display"
        fill={ink}
        fontWeight="600"
      >
        The public holding
      </text>
      <text x={left} y={106} fontSize="24" className="svg-text" fill={mute}>
        large by any measure
      </text>
      <rect
        x={left}
        y={barY}
        width={total * (1 - offsetShare)}
        height={barH}
        fill={soft}
        stroke={publicColor}
        strokeWidth="2"
      />
      <rect
        x={split}
        y={barY}
        width={total * offsetShare}
        height={barH}
        fill={publicColor}
      />
      <text
        x={left + (total * (1 - offsetShare)) / 2}
        y={barY + barH / 2 + 9}
        textAnchor="middle"
        fontSize="26"
        className="svg-display"
        fill={ink}
      >
        ordinary return demand
      </text>
      <text
        x={left + total}
        y={barY + barH + 38}
        textAnchor="end"
        fontSize="24"
        className="svg-text"
        fill={publicColor}
        fontWeight="600"
      >
        offsets worker exposure
      </text>
      <line
        x1={split}
        y1={barY - 16}
        x2={split}
        y2={barY + barH + 12}
        stroke={ink}
        strokeWidth="2"
        strokeDasharray="4 6"
      />
      <text
        x={left}
        y={H - 64}
        fontSize="24"
        className="svg-display"
        fill={ink}
        fontStyle="italic"
      >
        Size measures the first part.
      </text>
      <text
        x={left}
        y={H - 36}
        fontSize="24"
        className="svg-display"
        fill={ink}
        fontStyle="italic"
      >
        Alignment is about the second.
      </text>
      <text
        x={W - 30}
        y={H - 10}
        textAnchor="end"
        fontSize="20"
        className="svg-text"
        fill={mute}
      >
        illustrative shares, not measured ones
      </text>
    </svg>
  );
}

function LargeFundReach({ id, dark }: { id: string; dark: boolean }) {
  const exposure: Vec2 = fromAngle(78, 0.9);
  const payoff: Vec2 = fromAngle(18, 1);
  const projection = projectOntoSpan(exposure, [payoff]);
  return (
    <PayoffField
      id={id}
      layout="compact"
      exposure={exposure}
      payoffs={[payoff]}
      projection={projection}
      position={1.35}
      dark={dark}
      labels={{ position: 'a large position' }}
    />
  );
}
