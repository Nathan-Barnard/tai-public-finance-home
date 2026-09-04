import type { DistributionState, StorySection } from '@/content/types';
import { useAutoplay } from '@/hooks/useAutoplay';
import { useDesktop, useReducedMotion } from '@/hooks/useMediaQuery';
import { useScrollSteps } from '@/hooks/useScrollSteps';
import { useTabList } from '@/hooks/useTabList';

import { DistributionFigure } from './DistributionFigure';
import { PlayIcon } from './Icons';
import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; states: DistributionState[] };

/**
 * Sticky scenario sequence. On desktop the text steps scroll past a fixed
 * figure; on smaller screens the same states are tabs with a play control.
 */
export function DistributionScenarioTabs({ section, states }: Props) {
  const desktop = useDesktop();
  const reduced = useReducedMotion();
  const { active, setActive, registerStep, scrollToStep } = useScrollSteps(
    states.length,
    desktop,
  );
  const { playing, play, stop } = useAutoplay(states.length, active, setActive);
  const { tabProps, panelProps, listProps } = useTabList({
    count: states.length,
    active,
    onChange: (index) => {
      stop();
      setActive(index);
      if (desktop) scrollToStep(index, !reduced);
    },
  });

  const state = states[active];
  const announced = state.verdict;

  return (
    <div className="wrap">
      <SectionHeader section={section} />
      <div className="scene-split">
        <div className="scene-split__steps" aria-hidden={!desktop}>
          {states.map((s, index) => (
            <div
              key={s.id}
              ref={registerStep(index)}
              data-step={index}
              className={`step ${active === index ? 'is-active' : ''}`}
            >
              <p className="t-eyebrow">{s.label}</p>
              <h3 className="t-statement step__title">{s.title}</h3>
              <p className="t-body measure-narrow">{s.copy}</p>
            </div>
          ))}
        </div>

        <div className="scene-split__sticky">
          <div className="sticky-panel">
            <div className="sticky-panel__controls">
              <div
                className="tabs"
                {...listProps}
                aria-label="Choose an automation outcome"
              >
                {states.map((s, index) => (
                  <button
                    key={s.id}
                    type="button"
                    className="tab"
                    {...tabProps(index)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--ghost play-btn"
                onClick={playing ? stop : play}
                aria-pressed={playing}
              >
                <PlayIcon /> {playing ? 'Stop' : 'Play explanation'}
              </button>
            </div>
            <DistributionFigure
              id="dist-main"
              worker={state.worker}
              capital={state.capital}
              profits={state.profits}
              assets={state.assets}
            />
            {states.map((s, index) => (
              <div
                key={s.id}
                {...panelProps(index)}
                className="scene-mobile-text"
              >
                <h3 className="t-h3">{s.title}</h3>
                <p className="t-body">{s.copy}</p>
              </div>
            ))}
            <p
              className="live-note t-small"
              aria-live="polite"
              aria-atomic="true"
            >
              {announced}
            </p>
          </div>
        </div>
      </div>
      {section.exitLine && (
        <p className="exit-line t-statement">{section.exitLine}</p>
      )}
    </div>
  );
}
