import type { WorkerCase } from '@/content/evidence';

import { divergingBar, signed } from './format';

// Two aligned country cards. Each metric uses one scale across both countries,
// so the bars are comparable; the sign is carried by the text and by which
// side of the centre line the bar sits on, never by colour alone.
const SHARE_DOMAIN = 1.05;
const PAY_DOMAIN = 1.6;

const metrics = [
  {
    key: 'labourShare' as const,
    label: 'Labour’s share of income',
    unit: 'percentage points a year',
    domain: SHARE_DOMAIN,
    digits: 2,
  },
  {
    key: 'compensation' as const,
    label: 'Real hourly compensation',
    unit: '% a year',
    domain: PAY_DOMAIN,
    digits: 2,
  },
];

export function WorkerOutcomesChart({
  cases,
  measureNote,
}: {
  cases: WorkerCase[];
  measureNote: string;
}) {
  return (
    <div className="worker-cases">
      {cases.map((entry) => (
        <section
          key={entry.place}
          className="worker-card"
          aria-label={`${entry.place}, ${entry.period}`}
        >
          <header className="worker-card__head">
            <h3 className="worker-card__place">{entry.place}</h3>
            <p className="worker-card__period">{entry.period}</p>
          </header>
          <dl className="worker-card__metrics">
            {metrics.map((metric) => {
              const value = entry[metric.key];
              const bar = divergingBar(value, metric.domain);
              return (
                <div key={metric.key} className="metric">
                  <dt className="metric__label">{metric.label}</dt>
                  <dd className="metric__value">
                    <span className="metric__number">
                      {signed(value, metric.digits)}
                    </span>
                    <span className="metric__unit"> {metric.unit}</span>
                  </dd>
                  <div className="metric__track" aria-hidden="true">
                    <span className="metric__zero" />
                    <span
                      className={`metric__bar metric__bar--${value < 0 ? 'down' : 'up'}`}
                      style={{ width: bar.width, left: bar.left }}
                    />
                  </div>
                </div>
              );
            })}
          </dl>
          <p className="worker-card__copy t-small">{entry.copy}</p>
        </section>
      ))}
      <p className="worker-cases__note t-note">{measureNote}</p>
    </div>
  );
}
