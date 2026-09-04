// The Public Balance Sheet Lab is a reader-controlled explanatory model. It
// turns a handful of qualitative choices into coordinated readings. Nothing
// in it is calibrated, estimated or optimised; every output is a sentence or
// a piece of drawn geometry.

import {
  fromAngle,
  norm,
  projectOntoSpan,
  type Projection,
  type Vec2,
  unreachedShare,
} from './geometry.ts';

export type WorkerMove = 'falls' | 'flat' | 'rises' | 'rises-less';
export type CapitalMove = 'falls' | 'flat' | 'rises' | 'rises-strongly';
export type AssetPayoff =
  | 'pays-in-shortfall'
  | 'flat'
  | 'pays-elsewhere'
  | 'against';
export type Menu = 'none' | 'one' | 'two';
export type TaxMode = 'inherited' | 'adjusts';
export type Room = 'little' | 'some' | 'broad';

export type LabState = {
  workers: WorkerMove;
  capital: CapitalMove;
  asset: AssetPayoff;
  menu: Menu;
  tax: TaxMode;
  room: Room;
};

export const defaultLabState: LabState = {
  workers: 'falls',
  capital: 'rises',
  asset: 'pays-in-shortfall',
  menu: 'one',
  tax: 'inherited',
  room: 'some',
};

export const labOptions = {
  workers: [
    ['falls', 'Income falls'],
    ['flat', 'Income stays broadly flat'],
    ['rises', 'Income rises'],
    ['rises-less', 'Income rises, but less than capital income'],
  ],
  capital: [
    ['falls', 'Income falls'],
    ['flat', 'Income stays broadly flat'],
    ['rises', 'Income rises'],
    ['rises-strongly', 'Income rises strongly'],
  ],
  asset: [
    ['pays-in-shortfall', 'Pays in the worker-shortfall state'],
    ['flat', 'Does not move in that state'],
    ['pays-elsewhere', 'Pays mainly in another state'],
    ['against', 'Moves against the public need'],
  ],
  menu: [
    ['none', 'No risky payoff'],
    ['one', 'One payoff'],
    ['two', 'Two distinct payoffs'],
  ],
  tax: [
    ['inherited', 'Stays at the inherited rate initially'],
    ['adjusts', 'Adjusts through the transition'],
  ],
  room: [
    ['little', 'Little room to change positions'],
    ['some', 'Some room'],
    ['broad', 'Broad room'],
  ],
} as const;

export type Relative = 'behind' | 'together' | 'ahead';
export type Margin = 'timing' | 'state' | 'transition';

export type LabReading = {
  /** Effective capital move after reconciling "rises less than capital". */
  capital: CapitalMove;
  capitalAdjusted: boolean;
  relative: Relative;
  distribution: string;
  dollar: { level: 'more' | 'same' | 'less'; sentence: string };
  exposure: Vec2;
  payoffs: Vec2[];
  projection: Projection;
  reachShare: number;
  reach: {
    phrase:
      | 'Reaches this state'
      | 'Reaches part of this state'
      | 'Misses this state'
      | 'Moves in the wrong direction'
      | 'Adds a new payoff direction'
      | 'Still outside the asset menu'
      | 'No shortfall in this state';
    sentence: string;
  };
  margins: Array<{
    id: Margin;
    label: string;
    active: boolean;
    sentence: string;
  }>;
  tax: string;
  room: string;
  conclusion: string[];
};

const workerScore: Record<WorkerMove, number> = {
  falls: -1,
  flat: 0,
  rises: 1,
  'rises-less': 0.55,
};

const capitalScore: Record<CapitalMove, number> = {
  falls: -1,
  flat: 0,
  rises: 1,
  'rises-strongly': 1.6,
};

const workerWords: Record<WorkerMove, string> = {
  falls: 'Worker income falls',
  flat: 'Worker income stays broadly flat',
  rises: 'Worker income rises',
  'rises-less': 'Worker income rises, but by less than capital income',
};

const capitalWords: Record<CapitalMove, string> = {
  falls: 'capital income falls',
  flat: 'capital income stays broadly flat',
  rises: 'capital income rises',
  'rises-strongly': 'capital income rises strongly',
};

/** Direction in which worker-relevant exposure points in the drawings. */
const EXPOSURE_ANGLE = 68;

export function evaluateLab(state: LabState): LabReading {
  // "Rises, but less than capital income" only makes sense if capital rises.
  const capitalAdjusted =
    state.workers === 'rises-less' && capitalScore[state.capital] < 1;
  const capital: CapitalMove = capitalAdjusted ? 'rises' : state.capital;

  const gap = workerScore[state.workers] - capitalScore[capital];
  const relative: Relative =
    gap < -0.2 ? 'behind' : gap > 0.2 ? 'ahead' : 'together';

  const distribution =
    `${workerWords[state.workers]} and ${capitalWords[capital]}. ` +
    (relative === 'behind'
      ? 'Workers fall behind the people who own capital.'
      : relative === 'ahead'
        ? 'Workers come out ahead of capital owners.'
        : 'Workers and capital owners move together.');

  const dollar =
    relative === 'behind'
      ? {
          level: 'more' as const,
          sentence:
            'In this future a public dollar matters more to workers than the market’s price for that future says.',
        }
      : relative === 'ahead'
        ? {
            level: 'less' as const,
            sentence:
              'In this future workers are already doing well, so a public dollar matters less here than the market’s price says.',
          }
        : {
            level: 'same' as const,
            sentence:
              'In this future the two valuations do not pull apart. A public dollar is worth about what the market says.',
          };

  const shortfall = relative === 'behind' ? Math.min(1, -gap) : 0;
  const exposure: Vec2 = fromAngle(EXPOSURE_ANGLE, shortfall);

  const payoffAngle: Record<AssetPayoff, number> = {
    'pays-in-shortfall': EXPOSURE_ANGLE,
    flat: EXPOSURE_ANGLE - 90,
    'pays-elsewhere': EXPOSURE_ANGLE - 62,
    against: EXPOSURE_ANGLE + 160,
  };
  const first = fromAngle(payoffAngle[state.asset], 1);
  const second = fromAngle(payoffAngle[state.asset] - 88, 1);
  const payoffs: Vec2[] =
    state.menu === 'none'
      ? []
      : state.menu === 'one'
        ? [first]
        : [first, second];

  const projection = projectOntoSpan(exposure, payoffs);
  const reachShare =
    norm(exposure) === 0 ? 0 : 1 - unreachedShare(projection, exposure);

  let reach: LabReading['reach'];
  if (shortfall === 0) {
    reach = {
      phrase: 'No shortfall in this state',
      sentence:
        relative === 'ahead'
          ? 'Workers are ahead in this future, so there is no shortfall for a public asset to reach. An asset that pays here pays where it is needed least.'
          : 'Workers are not behind in this future, so there is no shortfall for a public asset to reach.',
    };
  } else if (payoffs.length === 0) {
    reach = {
      phrase: 'Still outside the asset menu',
      sentence:
        'No risky public payoff is available, so the whole worker exposure remains outside the asset menu. Saving can still change how many resources are available over time.',
    };
  } else if (projection.rank === 2) {
    reach = {
      phrase: 'Adds a new payoff direction',
      sentence:
        'The second asset adds a genuinely different payoff direction. Together the two payoffs reach the worker exposure in this picture, which is a mechanism, not a complete market.',
    };
  } else if (state.asset === 'pays-in-shortfall') {
    reach = {
      phrase: 'Reaches this state',
      sentence: 'This asset pays in the state where workers fall behind.',
    };
  } else if (state.asset === 'flat') {
    reach = {
      phrase: 'Misses this state',
      sentence:
        'Workers fall behind, but this asset does not move. Increasing the position does not change that.',
    };
  } else if (state.asset === 'pays-elsewhere') {
    reach = {
      phrase: 'Reaches part of this state',
      sentence:
        'This asset pays mainly in another state. Part of the worker exposure is reached; the rest is still outside the asset menu, and a bigger position does not reach it.',
    };
  } else {
    reach = {
      phrase: 'Moves in the wrong direction',
      sentence:
        'Held the usual way, this asset pays when workers are doing well and loses when they fall behind. The position would have to be reversed to reach this state, and the part off its line is still outside the asset menu.',
    };
  }

  const stateActive = payoffs.length > 0 && reachShare > 0.05;
  const margins: LabReading['margins'] = [
    {
      id: 'timing',
      label: 'Timing',
      active: true,
      sentence:
        'Saving or borrowing moves public resources across time. It does not change which state an asset pays in.',
    },
    {
      id: 'state',
      label: 'State exposure',
      active: stateActive,
      sentence: stateActive
        ? 'The public asset brings resources onto the balance sheet in the states where it pays.'
        : payoffs.length === 0
          ? 'No risky payoff is held, so nothing arrives with the shock itself.'
          : 'The held asset does not pay in the state that matters here, so this margin is idle.',
    },
    {
      id: 'transition',
      label: 'Future distribution and production',
      active: state.tax === 'adjusts',
      sentence:
        state.tax === 'adjusts'
          ? 'Tax policy changes the later division of income and the path of investment, capital, wages and revenue.'
          : 'The tax stays at its inherited rate at first, so nothing on this margin changes when the shock lands.',
    },
  ];

  const tax =
    state.tax === 'adjusts'
      ? 'Tax policy changes the later distribution of income, but it does not create an inherited payoff at the instant of the shock.'
      : 'Tax policy stays at its inherited rate initially, so the only immediate public payoff is whatever the asset pays.';

  const room: Record<Room, string> = {
    little:
      'With little room to change positions, even a well-aligned asset can be held only in a small amount. The reach is real but limited.',
    some: 'With some room, the position can move part of the way toward the exposure it can reach.',
    broad:
      'With broad room, the position can be sized to the exposure it can reach, though never past the line the asset draws.',
  };

  const conclusion = [distribution, dollar.sentence, reach.sentence, tax];
  if (payoffs.length > 0 && shortfall > 0 && reachShare > 0.05) {
    conclusion.push(room[state.room]);
  }

  return {
    capital,
    capitalAdjusted,
    relative,
    distribution,
    dollar,
    exposure,
    payoffs,
    projection,
    reachShare,
    reach,
    margins,
    tax,
    room: room[state.room],
    conclusion,
  };
}

export type MatrixCell = { menu: Menu; tax: TaxMode; text: string };

export const matrixColumns: Array<{ id: Menu; label: string }> = [
  { id: 'none', label: 'No public asset' },
  { id: 'one', label: 'One public payoff' },
  { id: 'two', label: 'A broader payoff menu' },
];

export const matrixRows: Array<{ id: TaxMode; label: string }> = [
  { id: 'inherited', label: 'Tax stays at its inherited rate initially' },
  { id: 'adjusts', label: 'Tax can adjust through the transition' },
];

export const matrixCells: MatrixCell[] = [
  {
    tax: 'inherited',
    menu: 'none',
    text: 'No shock-contingent public payout. Saving can still change how many resources are available over time.',
  },
  {
    tax: 'inherited',
    menu: 'one',
    text: 'The asset can reach one pattern of shocks. Any worker exposure pointing elsewhere remains.',
  },
  {
    tax: 'inherited',
    menu: 'two',
    text: 'Distinct payoffs can reach more directions, provided they are genuinely independent.',
  },
  {
    tax: 'adjusts',
    menu: 'none',
    text: 'Tax policy changes future distribution and investment, but there is no inherited risky payoff at impact.',
  },
  {
    tax: 'adjusts',
    menu: 'one',
    text: 'One state-dependent payout is available immediately; tax policy changes the path that follows.',
  },
  {
    tax: 'adjusts',
    menu: 'two',
    text: 'More future states can bring resources onto the public balance sheet, while taxes change distribution and accumulation afterward.',
  },
];

export function matrixCell(tax: TaxMode, menu: Menu): MatrixCell {
  const cell = matrixCells.find((c) => c.tax === tax && c.menu === menu);
  if (!cell) throw new Error(`No matrix cell for ${tax}/${menu}`);
  return cell;
}
