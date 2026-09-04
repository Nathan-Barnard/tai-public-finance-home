import type { PayoffLane, StorySection } from '@/content/types';
import { useInView } from '@/hooks/useInView';

import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; lanes: PayoffLane[]; after: string[] };

/**
 * Two large horizontal lanes. The first traces to completion; the second
 * stops abruptly at the asset node because nothing arrives from it.
 */
export function StatePayoffTheatre({ section, lanes, after }: Props) {
  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div className="theatre">
        {lanes.map((lane) => (
          <Lane key={lane.id} lane={lane} />
        ))}
      </div>
      <div className="theatre__after">
        <p className="t-statement measure-wide">{after[0]}</p>
        {after.slice(1).map((line) => (
          <p key={line} className="t-lead measure-wide">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function Lane({ lane }: { lane: PayoffLane }) {
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.45,
    once: true,
  });
  const stops = [0.08, 0.5, 0.92];
  return (
    <div
      ref={ref}
      className={`lane lane--${lane.pays ? 'pays' : 'misses'} ${inView ? 'is-in' : ''}`}
    >
      <p className="t-eyebrow lane__title">{lane.title}</p>
      <div className="lane__track">
        <svg
          className="lane__svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            className="lane__base"
            x1={stops[0] * 1200}
            y1="60"
            x2={stops[2] * 1200}
            y2="60"
            stroke="var(--line)"
            strokeWidth="2"
            strokeDasharray="2 10"
          />
          {lane.pays ? (
            <path
              className="trace lane__line"
              d={`M${stops[0] * 1200} 60 H${stops[2] * 1200}`}
              stroke="var(--public)"
              strokeWidth="10"
              strokeLinecap="round"
              style={{ '--len': 1100 } as React.CSSProperties}
            />
          ) : (
            <>
              <path
                className="trace lane__line"
                d={`M${stops[0] * 1200} 60 H${stops[1] * 1200}`}
                stroke="var(--public)"
                strokeWidth="10"
                strokeLinecap="round"
                style={{ '--len': 600 } as React.CSSProperties}
              />
              <path
                className="lane__stop fade-up"
                d={`M${stops[1] * 1200 + 16} 26 V94`}
                stroke="var(--outside)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                className="lane__void"
                d={`M${stops[1] * 1200 + 40} 60 H${stops[2] * 1200}`}
                stroke="var(--outside)"
                strokeWidth="3"
                strokeDasharray="4 12"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
        <ol className="lane__steps">
          {lane.steps.map((step, index) => (
            <li
              key={step}
              className={`lane__step ${!lane.pays && index === 2 ? 'is-void' : ''}`}
              style={{ '--stop': stops[index] } as React.CSSProperties}
            >
              <span className="lane__dot" aria-hidden="true" />
              <span className="lane__label">{step}</span>
              {!lane.pays && index === 2 && (
                <span className="sr-only">(no payout)</span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <p
        className={`lane__readout t-lead ${lane.pays ? '' : 'lane__readout--void'}`}
      >
        {lane.readout}
      </p>
    </div>
  );
}
