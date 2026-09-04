import { useId, useState } from 'react';

import { routes } from '@/lib/paths';
import {
  type AssetPayoff,
  type CapitalMove,
  defaultLabState,
  evaluateLab,
  type LabState,
  labOptions,
  type Menu,
  type Room,
  type TaxMode,
  type WorkerMove,
} from '@/lib/lab-model';
import type { Move } from '@/content/types';

import { DistributionFigure } from './DistributionFigure';
import { HumanComparisonMatrix } from './HumanComparisonMatrix';
import { ArrowRight } from './Icons';
import { PayoffField } from './PayoffField';
import { ValuationStrip } from './ValuationStrip';

type Props = { variant: 'full' | 'embed' };

const toMove = (
  worker: WorkerMove,
  capital: CapitalMove,
): { worker: Move; capital: Move } => ({
  worker: worker === 'rises-less' ? 'rises' : worker,
  capital:
    capital === 'rises-strongly'
      ? 'rises-faster'
      : worker === 'rises-less'
        ? 'rises-faster'
        : capital,
});

/**
 * The reader-controlled explanatory model. Four coordinated panels answer
 * who gains, where a public dollar matters, what the asset reaches, and
 * which public tool is doing the work. Nothing is calibrated or optimised.
 */
export function PublicBalanceSheetLab({ variant }: Props) {
  const [state, setState] = useState<LabState>(defaultLabState);
  const id = useId();
  const reading = evaluateLab(state);
  const moves = toMove(state.workers, reading.capital);
  const full = variant === 'full';

  const update = <K extends keyof LabState>(key: K, value: LabState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const control = <K extends keyof LabState>(
    key: K,
    label: string,
    options: ReadonlyArray<readonly [LabState[K], string]>,
  ) => (
    <div className="field lab__field">
      <label className="field__label" htmlFor={`${id}-${key}`}>
        {label}
      </label>
      <select
        id={`${id}-${key}`}
        className="select"
        value={state[key]}
        onChange={(e) => update(key, e.target.value as LabState[K])}
      >
        {options.map(([value, text]) => (
          <option key={String(value)} value={String(value)}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={`lab lab--${variant}`}>
      <div className="lab__controls">
        <p className="t-eyebrow">Set the scenario</p>
        {control(
          'workers',
          'What happens to workers?',
          labOptions.workers as ReadonlyArray<readonly [WorkerMove, string]>,
        )}
        {control(
          'capital',
          'What happens to capital owners?',
          labOptions.capital as ReadonlyArray<readonly [CapitalMove, string]>,
        )}
        {control(
          'asset',
          'What happens to the public asset?',
          labOptions.asset as ReadonlyArray<readonly [AssetPayoff, string]>,
        )}
        {control(
          'menu',
          'How many independent payoffs are available?',
          labOptions.menu as ReadonlyArray<readonly [Menu, string]>,
        )}
        {control(
          'tax',
          'What can tax policy do?',
          labOptions.tax as ReadonlyArray<readonly [TaxMode, string]>,
        )}
        <details className="lab__advanced">
          <summary>
            Advanced: how constrained is the public balance sheet?
          </summary>
          {control(
            'room',
            'Room to change positions',
            labOptions.room as ReadonlyArray<readonly [Room, string]>,
          )}
          <p className="t-small">
            A qualifier on the wording, not a borrowing limit.
          </p>
        </details>
        {reading.capitalAdjusted && (
          <output className="t-small lab__note">
            Because workers rise by less than capital income, capital income is
            shown rising.
          </output>
        )}
      </div>

      <div className="lab__panels">
        <section className="panel panel--who" aria-labelledby={`${id}-who`}>
          <h3 id={`${id}-who`} className="panel__title t-h3">
            Who gains?
          </h3>
          <DistributionFigure
            id={`${id}-dist`}
            layout="tall"
            worker={moves.worker}
            capital={moves.capital}
            profits={moves.capital}
            assets={moves.capital}
          />
          <p className="panel__reading t-body">{reading.distribution}</p>
        </section>

        <section
          className="panel panel--dollar"
          aria-labelledby={`${id}-dollar`}
        >
          <h3 id={`${id}-dollar`} className="panel__title t-h3">
            Where does a public dollar matter?
          </h3>
          <ValuationStrip
            id={`${id}-val`}
            layout="tall"
            level={reading.dollar.level}
          />
          <p className="panel__reading t-body">{reading.dollar.sentence}</p>
        </section>

        <section className="panel panel--reach" aria-labelledby={`${id}-reach`}>
          <h3 id={`${id}-reach`} className="panel__title t-h3">
            What does the asset reach?
          </h3>
          <PayoffField
            id={`${id}-pay`}
            layout="compact"
            exposure={reading.exposure}
            payoffs={reading.payoffs}
            projection={reading.projection}
          />
          <p
            className={`panel__verdict verdict--${reading.reach.phrase.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {reading.reach.phrase}
          </p>
          <p className="panel__reading t-body">{reading.reach.sentence}</p>
        </section>

        <section className="panel panel--tool" aria-labelledby={`${id}-tool`}>
          <h3 id={`${id}-tool`} className="panel__title t-h3">
            Which public tool is doing the work?
          </h3>
          <ul className="margins">
            {reading.margins.map((margin) => (
              <li
                key={margin.id}
                className={`margin ${margin.active ? 'is-active' : ''}`}
              >
                <span className="margin__label">
                  {margin.label}
                  <span className="margin__state">
                    {margin.active ? 'active' : 'idle'}
                  </span>
                </span>
                <span className="margin__sentence t-small">
                  {margin.sentence}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="lab__conclusion" aria-live="polite" aria-atomic="true">
        <p className="t-eyebrow">What this scenario says</p>
        {reading.conclusion.map((sentence) => (
          <p key={sentence} className="t-lead">
            {sentence}
          </p>
        ))}
      </div>

      {full ? (
        <div className="lab__matrix">
          <h3 className="t-h2">Compare the public tools</h3>
          <p className="t-lead measure-wide">
            Two ways tax policy can behave, three public asset menus. Each cell
            says in plain words what that combination can and cannot do. No cell
            reports a number, because none has been established.
          </p>
          <HumanComparisonMatrix
            current={{ tax: state.tax, menu: state.menu }}
          />
        </div>
      ) : (
        <p className="lab__more">
          <a className="btn" href={routes.explore}>
            Open the full lab, with the comparison matrix <ArrowRight />
          </a>
        </p>
      )}
    </div>
  );
}

export default PublicBalanceSheetLab;
