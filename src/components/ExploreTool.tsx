import { useId, useState } from 'react';

import {
  distributionChoice,
  investmentChoice,
  resultFields,
} from '@/content/explore';

/**
 * Two reader choices and three qualitative result fields. Every outcome is a
 * fixed sentence written in advance: nothing here is computed, and no number
 * appears.
 */
export function ExploreTool({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [distribution, setDistribution] = useState(
    distributionChoice.options[1].id,
  );
  const [investment, setInvestment] = useState(investmentChoice.options[0].id);

  const chosen =
    distributionChoice.options.find((o) => o.id === distribution) ??
    distributionChoice.options[0];
  const held =
    investmentChoice.options.find((o) => o.id === investment) ??
    investmentChoice.options[0];

  const group = (
    name: string,
    legend: string,
    options: ReadonlyArray<{ id: string; label: string }>,
    value: string,
    onChange: (next: string) => void,
  ) => (
    <fieldset className="choice">
      <legend className="choice__legend">{legend}</legend>
      <div className="choice__options">
        {options.map((option) => (
          <label
            key={option.id}
            className={`choice__option ${value === option.id ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name={`${id}-${name}`}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className={`explore ${compact ? 'explore--compact' : ''}`}>
      <div className="explore__choices">
        {group(
          'distribution',
          distributionChoice.label,
          distributionChoice.options,
          distribution,
          setDistribution,
        )}
        {group(
          'investment',
          investmentChoice.label,
          investmentChoice.options,
          investment,
          setInvestment,
        )}
      </div>
      <dl className="explore__results" aria-live="polite" aria-atomic="true">
        <div className="result result--workers">
          <dt className="result__label">{resultFields.workers}</dt>
          <dd className="result__copy">{chosen.workers}</dd>
        </div>
        <div className="result result--owners">
          <dt className="result__label">{resultFields.owners}</dt>
          <dd className="result__copy">{chosen.owners}</dd>
        </div>
        <div className="result result--investment">
          <dt className="result__label">{resultFields.investment}</dt>
          <dd className="result__copy">{held.outcome}</dd>
        </div>
        <p className="explore__question">
          <span className="explore__question-label">
            {resultFields.question}
          </span>{' '}
          {chosen.question}
        </p>
      </dl>
    </div>
  );
}
