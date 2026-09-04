import type { TaxComponent } from '@/content/evidence';

import { divergingBar, signed } from './format';

const DOMAIN = 0.85;

/**
 * Diverging bars for the four published components, with the total held
 * visually apart. The components do not sum to the total, and the note says
 * so, so the chart cannot be read as a complete decomposition.
 */
export function TaxCompositionChart({
  components,
  total,
  totalNote,
  caption,
  unit,
}: {
  components: TaxComponent[];
  total: TaxComponent;
  totalNote: string;
  caption: string;
  unit: string;
}) {
  const row = (entry: TaxComponent, kind: 'labour' | 'capital' | 'total') => {
    const bar = divergingBar(entry.value, DOMAIN);
    return (
      <div key={entry.label} className={`tax-row tax-row--${kind}`}>
        <span className="tax-row__label">{entry.label}</span>
        <span className="tax-row__track" aria-hidden="true">
          <span className="tax-row__zero" />
          <span
            className="tax-row__bar"
            style={{ width: bar.width, left: bar.left }}
          />
        </span>
        <span className="tax-row__value">{signed(entry.value)}</span>
      </div>
    );
  };

  return (
    <figure className="tax-chart">
      <figcaption className="tax-chart__caption">
        {caption}
        <span className="tax-chart__unit"> · {unit}</span>
      </figcaption>
      <div className="tax-chart__rows">
        {components.map((entry) =>
          row(
            entry,
            entry.label.startsWith('Corporate') ? 'capital' : 'labour',
          ),
        )}
      </div>
      <div className="tax-chart__total">{row(total, 'total')}</div>
      <p className="t-note tax-chart__note">{totalNote}</p>
      <p className="sr-only">
        {components
          .map((entry) => `${entry.label}: ${signed(entry.value)} ${unit}`)
          .join('. ')}
        . Held separately, {total.label}: {signed(total.value)} {unit}.
      </p>
    </figure>
  );
}
