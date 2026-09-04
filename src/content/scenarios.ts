import type { LabState } from '@/lib/lab-model';

import { links } from './links';

// The paper's cases, each as an outcome the reader can see and a description
// of what a good public position looks like there. Every figure is derived
// from the same lab model as the essay; nothing here is calibrated.

export type PositionDirection =
  | 'reverse'
  | 'none'
  | 'hold'
  | 'hold-more'
  | 'line';

export type Scenario = {
  id: string;
  eyebrow: string;
  name: string;
  story: string[];
  /** Lab preset that draws the outcome and the payoff geometry. */
  preset?: LabState;
  /** Scenarios drawn by a dedicated figure instead of the lab preset. */
  figure?: 'successors' | 'transition' | 'large-fund';
  goodPosition: {
    direction: PositionDirection;
    headline: string;
    copy: string[];
    tools: {
      ownership: 'active' | 'idle' | 'wrong';
      saving: 'active' | 'idle';
      tax: 'active' | 'idle';
    };
    needsSecondPayoff?: boolean;
  };
  paperNote: string;
  paperHref: string;
};

export const scenarioIntro = {
  eyebrow: 'Scenarios',
  headline:
    'Eight ways automation can land, and what a good public position looks like in each.',
  lead: 'The paper works through the same question in different economies: when a shock arrives, who gains, what does the public asset pay, and which public tool is doing the work? These are the cases it studies, drawn the way the essay draws them.',
  caveat:
    'Each scenario is a mechanism made visible. Directions and shapes are exact; sizes are not, and none of this ranks real assets or recommends a fund.',
};

export const scenarios: Scenario[] = [
  {
    id: 'output-neutral',
    eyebrow: 'The aligned case',
    name: 'Output holds. Income shifts from labour to capital.',
    story: [
      'Automation lets capital do tasks that labour used to do, without changing total output at first. Wages fall and profits rise by the same amount. Capital owners gain exactly what workers lose.',
      'The public asset pays in this state: its payoff arrives in the future where workers are falling behind and a public dollar matters most.',
    ],
    preset: {
      workers: 'falls',
      capital: 'rises',
      asset: 'pays-in-shortfall',
      menu: 'one',
      tax: 'inherited',
      room: 'some',
    },
    goodPosition: {
      direction: 'hold',
      headline: 'Hold the asset. It pays exactly when workers lose.',
      copy: [
        'The payoff lands in the worker-shortfall state, so a holding turns part of the private windfall into public resources at the moment they are needed.',
        'The tax recovers only a fraction of the shift on its own, and saving adds room over time rather than in this state. Ownership is the tool that reaches the state.',
      ],
      tools: { ownership: 'active', saving: 'idle', tax: 'idle' },
    },
    paperNote:
      'The paper’s output-neutral redistribution experiment: at inherited capital, output is unchanged while worker and fiscal resources fall and the claim pays.',
    paperHref: links.paper,
  },
  {
    id: 'claim-neutral',
    eyebrow: 'The negative control',
    name: 'Workers and public revenue fall. The asset does not move.',
    story: [
      'A different automation shock lowers output, wages and the tax base together. Workers are worse off and so is the public purse.',
      'The same public asset has zero payoff in this state. It is closely associated with automation and still misses this particular shock.',
    ],
    preset: {
      workers: 'falls',
      capital: 'flat',
      asset: 'flat',
      menu: 'one',
      tax: 'inherited',
      room: 'some',
    },
    goodPosition: {
      direction: 'none',
      headline:
        'No position in this asset helps. A different payoff is needed.',
      copy: [
        'Holding more of the asset moves government along a line that never touches this state. The shortfall is entirely outside the asset menu.',
        'What reaches it is a payoff that points in a genuinely different direction. Until one exists, saving and the tax path are the only margins left.',
      ],
      tools: { ownership: 'wrong', saving: 'active', tax: 'active' },
      needsSecondPayoff: true,
    },
    paperNote:
      'The paper’s claim-neutral automation experiment: a material worker and fiscal loss with zero impact exposure to the maintained claim.',
    paperHref: links.paper,
  },
  {
    id: 'unequal-upside',
    eyebrow: 'Shared gains, unequal shares',
    name: 'Workers gain. Investors gain much more.',
    story: [
      'Nobody loses in absolute terms. Wages rise a little; profits and asset values rise a lot. Workers are better off than before and further behind the owners than before.',
      'A public dollar still matters more to workers here than the market’s price for this future says, because the people pricing the asset are doing so well.',
    ],
    preset: {
      workers: 'rises-less',
      capital: 'rises-strongly',
      asset: 'pays-in-shortfall',
      menu: 'one',
      tax: 'inherited',
      room: 'some',
    },
    goodPosition: {
      direction: 'hold',
      headline:
        'Hold the asset. It shares the upside with people who own none of it.',
      copy: [
        'The asset pays in the state where workers fall behind in relative terms, so the holding transfers part of the boom to them.',
        'This is the case people forget: public ownership is not only for downturns. It works whenever the gains split apart, including in good times.',
      ],
      tools: { ownership: 'active', saving: 'idle', tax: 'idle' },
    },
    paperNote:
      'In the paper, equity can share unequal upside: workers gain but investors gain more, so a public dollar remains relatively valuable along the claim’s payoff.',
    paperHref: links.paper,
  },
  {
    id: 'common-exposure',
    eyebrow: 'Everyone moves together',
    name: 'Wages, profits and asset values rise in step.',
    story: [
      'Automation raises output and the gains are shared in proportion. Workers and capital owners experience the same event in the same way.',
      'The two valuations of a public dollar do not pull apart in this state. Government values it at about the market’s price.',
    ],
    preset: {
      workers: 'rises',
      capital: 'rises',
      asset: 'pays-in-shortfall',
      menu: 'one',
      tax: 'inherited',
      room: 'some',
    },
    goodPosition: {
      direction: 'none',
      headline:
        'No state motive. Any holding here is a bet on returns, not a transfer.',
      copy: [
        'With nothing pulling the two valuations apart, the asset has no job to do for workers in this state. A position would be ordinary return demand: the government taking market risk for market compensation.',
        'The case for public ownership is strongest where the gains split. Where they are shared, it is weakest.',
      ],
      tools: { ownership: 'idle', saving: 'active', tax: 'idle' },
    },
    paperNote:
      'Common exposure in the paper: worker and investor consumption move proportionally, so there is no relative valuation innovation along the claim.',
    paperHref: links.paper,
  },
  {
    id: 'worker-outperformance',
    eyebrow: 'The reverse case',
    name: 'Workers outperform capital.',
    story: [
      'New tasks raise the demand for labour faster than the return to capital. Wages rise more than profits, and asset values soften.',
      'The asset pays where workers are already ahead. Its payoff arrives in the future that needs public resources least.',
    ],
    preset: {
      workers: 'rises',
      capital: 'falls',
      asset: 'against',
      menu: 'one',
      tax: 'inherited',
      room: 'some',
    },
    goodPosition: {
      direction: 'reverse',
      headline:
        'Reduce or reverse the exposure. The payoff points the wrong way.',
      copy: [
        'Held the usual way, the asset brings money when workers are doing well and loses it when they are not. The worker-relevant motive points away from the asset.',
        'Ordinary return demand may still argue for some holding, but that is a return decision, not a decision made for workers.',
      ],
      tools: { ownership: 'wrong', saving: 'idle', tax: 'idle' },
    },
    paperNote:
      'The paper notes that equity can pay in an automation state without helping workers when workers already do better in relative marginal-value terms.',
    paperHref: links.paper,
  },
  {
    id: 'large-fund',
    eyebrow: 'Size is not alignment',
    name: 'A large public fund, held for the wrong reason.',
    story: [
      'The public position has two parts. One is ordinary return demand: the amount any investor would hold for the asset’s expected return. The other is the part that offsets worker exposure.',
      'A fund can be very large because the first part is large, while the second part is small and the worker exposure that matters lies off the asset’s line.',
    ],
    figure: 'large-fund',
    goodPosition: {
      direction: 'hold-more',
      headline: 'Judge the fund by what it offsets, not by how big it is.',
      copy: [
        'The gross holding is not a measure of how much it does for workers. Two funds of the same size can offset very different amounts of worker exposure.',
        'The useful question is the alignment between the exposure workers face and the payoff the fund holds, and what remains outside it.',
      ],
      tools: { ownership: 'active', saving: 'idle', tax: 'idle' },
      needsSecondPayoff: true,
    },
    paperNote:
      'The paper’s leading position splits into compensated-return demand and a part that offsets worker-resource exposure; their sum is not a measure of what the holding does for workers.',
    paperHref: links.paper,
  },
  {
    id: 'two-futures',
    eyebrow: 'A transformed economy',
    name: 'One arrival, two possible economies.',
    story: [
      'A transformative automation event arrives and selects one of two successors: a labour-using economy where wages still carry households, or a labour-light one where capital does nearly all the work.',
      'The country holds one inherited equity position. Its payoff across the two futures is one vector.',
    ],
    figure: 'successors',
    goodPosition: {
      direction: 'line',
      headline:
        'One position picks a point on a line. Reaching both futures takes a second payoff.',
      copy: [
        'Changing the size of the position moves public resources along one line through the two futures. It cannot choose how prepared the country is for each one separately.',
        'A good position is the closest point on that line to the mix of resources the country wants, together with an honest account of the gap and a search for a payoff that points differently.',
      ],
      tools: { ownership: 'active', saving: 'active', tax: 'idle' },
      needsSecondPayoff: true,
    },
    paperNote:
      'The paper’s two-successor application: with one nonzero equity payoff vector, varying the inherited exposure traces a line in successor-wealth space, not the whole plane.',
    paperHref: links.paper,
  },
  {
    id: 'transition',
    eyebrow: 'After the shock',
    name: 'The years after: the tax does its work on the path.',
    story: [
      'The shock has landed and the asset has paid whatever it was going to pay. Now the tax rate can start to move.',
      'A higher tax on capital income takes a larger share of profits for workers. It also lowers the return to capital, which slows investment, and later wages and revenue.',
    ],
    figure: 'transition',
    goodPosition: {
      direction: 'none',
      headline:
        'Let the asset handle the impact and the tax handle the transition.',
      copy: [
        'Tax policy cannot manufacture a payoff at the instant of the shock. What it can do is shape the path afterwards: distribution now against capital, wages and revenue later.',
        'Whether the tax should rise or fall is not universal. It depends on the whole future path of the tax base and on how much preserved capital is worth to workers.',
      ],
      tools: { ownership: 'idle', saving: 'active', tax: 'active' },
    },
    paperNote:
      'The paper’s tax-speed condition aggregates a discounted path of tax-base and capital trade-offs; it is not an impact transfer and carries no unconditional sign.',
    paperHref: links.paper,
  },
];
