import { useId, useMemo, useState } from 'react';

import type { PayoffMode, StorySection } from '@/content/types';
import { useTabList } from '@/hooks/useTabList';
import {
  fromAngle,
  projectOntoSpan,
  unreachedShare,
  type Vec2,
} from '@/lib/geometry';

import { ExpertDisclosure } from './ExpertDisclosure';
import { PayoffField } from './PayoffField';
import { ResponsiveFigure } from './ResponsiveFigure';
import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; modes: PayoffMode[] };

const EXPOSURE: Vec2 = fromAngle(66, 0.95);
const FIRST_ANGLE = 24;

/**
 * Dark full-bleed field. One payoff: the position slides along a line that
 * never rotates and the remainder stays visible. Two payoffs: a genuinely
 * different direction reaches more, unless the second only repeats the first.
 */
export function PayoffSpaceExplorer({ section, modes }: Props) {
  const [mode, setMode] = useState(0);
  const [position, setPosition] = useState(0.55);
  const [secondAngle, setSecondAngle] = useState(112);
  const ids = useId();
  const { tabProps, panelProps, listProps } = useTabList({
    count: modes.length,
    active: mode,
    onChange: setMode,
  });

  const first = fromAngle(FIRST_ANGLE);
  const payoffs = useMemo<Vec2[]>(
    () => (mode === 0 ? [first] : [first, fromAngle(secondAngle)]),
    [mode, first, secondAngle],
  );
  const projection = useMemo(
    () => projectOntoSpan(EXPOSURE, payoffs, 1e-3),
    [payoffs],
  );
  const unreached = unreachedShare(projection, EXPOSURE);

  const reading =
    mode === 0
      ? `The public position sits ${position < 0.05 ? 'at zero' : position < 0.5 ? 'a short way' : position < 1.1 ? 'well' : 'far'} along the payoff line. The remainder is unchanged: ${Math.round(unreached * 100)} percent of the worker exposure lies off this line, and no position on the line reaches it.`
      : projection.independent
        ? 'The second payoff points in a genuinely different direction. Together the two directions reach the whole exposure in this field.'
        : 'That second payoff points along the same line. It adds size, not a new direction, so the remainder is exactly what it was with one payoff.';

  return (
    <div className="wrap on-ink">
      <SectionHeader section={section} />
      <div className="space-scene">
        <div className="space-scene__field">
          <ResponsiveFigure
            wide={
              <PayoffField
                id={`${ids}-field-w`}
                exposure={EXPOSURE}
                payoffs={payoffs}
                projection={projection}
                position={mode === 0 ? position : undefined}
                dark
              />
            }
            tall={
              <PayoffField
                id={`${ids}-field-t`}
                layout="compact"
                exposure={EXPOSURE}
                payoffs={payoffs}
                projection={projection}
                position={mode === 0 ? position : undefined}
                dark
              />
            }
          />
        </div>
        <div className="space-scene__controls">
          <div className="tabs" {...listProps} aria-label="Payoff menu">
            {modes.map((m, index) => (
              <button
                key={m.id}
                type="button"
                className="tab"
                {...tabProps(index)}
              >
                {m.label}
              </button>
            ))}
          </div>
          {modes.map((m, index) => (
            <div
              key={m.id}
              {...panelProps(index)}
              className="space-scene__panel stack"
            >
              {m.copy.map((line) => (
                <p key={line} className="t-body">
                  {line}
                </p>
              ))}
              {index === 0 ? (
                <div className="field">
                  <label className="field__label" htmlFor={`${ids}-position`}>
                    Size of the public position
                  </label>
                  <input
                    id={`${ids}-position`}
                    className="range"
                    type="range"
                    min="-0.4"
                    max="1.6"
                    step="0.01"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    aria-valuetext={`${position < 0 ? 'reversed, ' : ''}${Math.abs(position).toFixed(2)} times the payoff`}
                  />
                  <p className="t-small">
                    Slide it either way. The point stays on the line.
                  </p>
                </div>
              ) : (
                <div className="field">
                  <label className="field__label" htmlFor={`${ids}-angle`}>
                    Direction of the second payoff
                  </label>
                  <input
                    id={`${ids}-angle`}
                    className="range"
                    type="range"
                    min={FIRST_ANGLE - 178}
                    max={FIRST_ANGLE + 178}
                    step="1"
                    value={secondAngle}
                    onChange={(e) => setSecondAngle(Number(e.target.value))}
                    aria-valuetext={
                      projection.independent
                        ? 'a different direction'
                        : 'the same direction as the first payoff'
                    }
                  />
                  <p className="t-small">
                    Turn it until it lines up with the first payoff and watch
                    the remainder come back.
                  </p>
                </div>
              )}
            </div>
          ))}
          <p
            className="space-scene__reading t-lead"
            aria-live="polite"
            aria-atomic="true"
          >
            {reading}
          </p>
          <ul className="legend" aria-label="Key">
            <li>
              <span className="legend__swatch legend__swatch--worker" />
              Worker exposure
            </li>
            <li>
              <span className="legend__swatch legend__swatch--capital" />
              Available payoff direction
            </li>
            <li>
              <span className="legend__swatch legend__swatch--public" />
              Reached by the asset
            </li>
            <li>
              <span className="legend__swatch legend__swatch--outside" />
              Still outside the asset menu
            </li>
          </ul>
        </div>
      </div>
      {section.expertNote && <ExpertDisclosure note={section.expertNote} />}
    </div>
  );
}
