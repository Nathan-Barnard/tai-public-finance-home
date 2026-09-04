import { useState } from 'react';

import type { StorySection } from '@/content/types';

import { ExpertDisclosure } from './ExpertDisclosure';
import { SectionHeader } from './SectionHeader';
import { ValuationStrip } from './ValuationStrip';

type Term = 'theta' | 'mG' | 'mI';

const meanings: Record<Term, { name: React.ReactNode; text: string }> = {
  theta: {
    name: 'Θ',
    text: 'Θ compares those two valuations. It rises in the futures where a public dollar matters more to workers than the market’s price for that future says.',
  },
  mG: {
    name: (
      <>
        m<sub>G</sub>
      </>
    ),
    text: 'mG is the government’s value on behalf of workers: what one more public dollar would change for them, future by future.',
  },
  mI: {
    name: (
      <>
        m<sub>I</sub>
      </>
    ),
    text: 'mI is the market’s state-by-state value: the price investors put on a dollar arriving in each future.',
  },
};

type Props = { section: StorySection };

export function ThetaExplainer({ section }: Props) {
  const [term, setTerm] = useState<Term>('theta');
  const termButton = (id: Term, className: string) => (
    <button
      type="button"
      className={`theta__term ${className} ${term === id ? 'is-active' : ''}`}
      aria-pressed={term === id}
      onClick={() => setTerm(id)}
      onFocus={() => setTerm(id)}
      onMouseEnter={() => setTerm(id)}
    >
      {meanings[id].name}
    </button>
  );

  return (
    <div className="wrap theta">
      <SectionHeader section={section} align="center" />
      <div className="theta__stage">
        <fieldset className="theta__equation t-math">
          <legend className="sr-only">
            Theta equals m G divided by m I. Select a term to read what it
            means.
          </legend>
          {termButton('theta', 'theta__term--theta')}
          <span className="theta__equals" aria-hidden="true">
            =
          </span>
          <span className="theta__fraction">
            {termButton('mG', 'theta__term--mg')}
            <span className="theta__bar" aria-hidden="true" />
            {termButton('mI', 'theta__term--mi')}
          </span>
        </fieldset>
        <p
          className="theta__reading t-lead"
          aria-live="polite"
          aria-atomic="true"
        >
          {meanings[term].text}
        </p>
      </div>
      <p className="theta__statement t-statement">
        Markets put a price on a payoff. Government asks what that payoff would
        change for workers. Θ tells us where those two views pull apart.
      </p>
      <div className="theta__strip">
        <ValuationStrip id="theta-strip" />
        <p className="t-small measure-wide">
          Three futures, one dollar, two valuations each. Bar heights are
          qualitative. The useful public asset is the one that pays where the
          blue bar stands above the grey one.
        </p>
      </div>
      {section.expertNote && <ExpertDisclosure note={section.expertNote} />}
    </div>
  );
}
