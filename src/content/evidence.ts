// The four historical evidence exhibits.
//
// Every figure below is transcribed from the project's canonical descriptive
// evidence record and was checked against it on 4 September 2026. These are
// descriptive national comparisons. None of them identifies automation as the
// cause of a national outcome, and none is a result of the project's model.

import { links } from './links';
import {
  EQUITY_GROUPS,
  LONG_RUN_TAX,
  TAX_COMPONENTS,
  TAX_TOTAL,
  WORKER_CASES,
} from './figures';

export const evidencePage = {
  title: 'Evidence behind the argument',
  intro:
    'Historical data cannot tell us exactly how AI will affect the economy. They can show which variables have moved together in the past—and which apparently similar periods produced different outcomes.',
};

export type WorkerCase = {
  place: string;
  period: string;
  labourShare: number;
  compensation: number;
  copy: string;
};

export type TaxComponent = { label: string; value: number };

export type LongRunCountry = { place: string; start: number; end: number };

export type EquityGroup = {
  place: string;
  state: 'strong' | 'pressure';
  stateLabel: string;
  domestic: number;
  restOfWorld: number;
  observations: number;
};

export type Exhibit = {
  id: string;
  /** Title used in the compact homepage module. */
  homeTitle: string;
  /** Heading used on the Evidence page. */
  heading: string;
  /** Extra framing shown only on the Evidence page. */
  intro: string;
  interpretation: string;
  supporting?: string;
  note: string;
  /** Conclusion shown only on the Evidence page. */
  conclusion: string;
};

export const workerOutcomes = {
  id: 'worker-outcomes',
  homeTitle: 'A falling labour share can mean different things for workers.',
  heading: 'The same fall in labour share can mean different things',
  intro:
    'Labour share is a relative measure: it tells us how income is divided, not whether workers’ living standards rose or fell. We therefore track hourly compensation and aggregate worker income separately.',
  interpretation:
    'A shift toward capital can coexist with rising worker incomes or with falling worker incomes. Labour’s share alone does not tell us whether workers became better or worse off.',
  note: 'These are descriptive national comparisons. The German dates are an illustrative period within a longer study of adjustment to robots; neither comparison shows that automation caused the national changes.',
  conclusion:
    'The US and German comparisons make different possible outcomes visible. They do not identify automation as the cause of either national path.',
  measureNote:
    'Real hourly compensation is pay and employer-provided benefits, adjusted for inflation.',
  cases: [
    {
      ...WORKER_CASES[0],
      copy: 'Labour’s share of income fell by about 0.07 percentage points a year. Real hourly compensation still rose by about 1.3% a year.',
    },
    {
      ...WORKER_CASES[1],
      copy: 'Labour’s share fell by about 0.97 percentage points a year. Real hourly compensation fell by about 1.51% a year.',
    },
  ] satisfies WorkerCase[],
} satisfies Exhibit & Record<string, unknown>;

export const taxComposition = {
  id: 'tax-composition',
  homeTitle: 'Worker income and government revenue can move differently.',
  heading: 'Tax systems change composition',
  intro:
    'Corporate taxes are only one part of government revenue. Income taxes, payroll contributions, property taxes and consumption taxes may move differently.',
  interpretation:
    'Corporate-tax receipts rose while labour-linked receipts fell. The composition of tax revenue changed much more than the total.',
  supporting:
    'Government finances depend on the whole tax system. A rise in profits does not translate automatically into an equal rise in public revenue, but weaker worker income does not automatically produce a fiscal crisis either.',
  note: 'This is an accounting comparison between two periods, not evidence that automation or any single tax caused the change.',
  conclusion:
    'Capital-side tax revenue can rise without producing an equal increase in total revenue.',
  caption: 'Germany, change from the 2000–03 average to the 2004–07 average',
  unit: 'percentage points of GDP',
  components: [...TAX_COMPONENTS] satisfies TaxComponent[],
  total: TAX_TOTAL satisfies TaxComponent,
  /** Shown beside the total so the four categories are not read as exhaustive. */
  totalNote:
    'The four categories above do not add up to the total. Property, consumption and other taxes moved too, and are not shown.',
} satisfies Exhibit & Record<string, unknown>;

export const longRunTax = {
  id: 'long-run-tax',
  homeTitle: 'Total tax revenue has not followed a simple downward path.',
  heading: 'Total tax revenue has not simply declined',
  intro:
    'The long-run record provides a useful check on claims that technological change necessarily erodes the overall tax take.',
  interpretation:
    'Total tax revenue as a share of GDP was higher in 2024 than in 1965 in all three countries.',
  supporting:
    'This does not tell us what AI will do next. It shows why a shrinking labour share cannot be translated mechanically into a shrinking overall tax take.',
  note: 'Total revenue can conceal large changes between income, payroll, corporate, property and consumption taxes.',
  conclusion:
    'The historical record is consistent with tax systems adapting. It does not establish that future adaptation to AI will be automatic or costless.',
  caption: 'Total tax revenue, 1965 and 2024',
  unit: '% of GDP',
  countries: [...LONG_RUN_TAX] satisfies LongRunCountry[],
} satisfies Exhibit & Record<string, unknown>;

export const equityOutcomes = {
  id: 'equity-outcomes',
  homeTitle: 'Equity returns were weaker when workers were under pressure.',
  heading: 'Equity has not automatically protected workers',
  intro:
    'A high average return does not tell us whether an investment performs well when worker incomes are weak.',
  interpretation:
    'In these small historical samples, broad equity performed much better when workers were relatively strong than when workers were under pressure.',
  supporting:
    'Equity may help workers share in economic gains. This history does not show that it is a reliable source of support when worker incomes weaken.',
  note: 'The groups are defined by observed worker outcomes, not by identified automation events. These averages are not estimates of an investment hedge.',
  conclusion:
    'In these samples, equity looks more reliable as a way to share capital-market upside than as protection against worker hardship.',
  caption: 'Average annual real return, by country and worker outcome',
  unit: '% a year, real',
  groups: EQUITY_GROUPS.map((group) => ({
    ...group,
    stateLabel:
      group.state === 'strong'
        ? 'Workers relatively strong'
        : 'Workers under pressure',
  })) satisfies EquityGroup[],
} satisfies Exhibit & Record<string, unknown>;

export const exhibits: Exhibit[] = [
  workerOutcomes,
  taxComposition,
  longRunTax,
  equityOutcomes,
];

export const dataLinkLabel = 'Data and notes';

export const sources = {
  id: 'sources',
  heading: 'Sources and construction',
  intro:
    'The exhibits above are built from published national and cross-country statistics. Full construction, definitions and citations are in the data notebook.',
  entries: [
    {
      title: 'Tax revenue',
      detail:
        'OECD Revenue Statistics, harmonised general-government tax revenue for the United States, the United Kingdom and Germany, 1965 to 2024, with components for personal income tax, employee and employer social contributions, and corporate income tax. OECD tax revenue, Treasury cash receipts and national-accounts revenue are different accounting families and are not spliced.',
    },
    {
      title: 'Labour share and worker compensation',
      detail:
        'National accounts measures of labour’s share of income and real compensation. Real hourly compensation is used as the intensive-margin measure, with aggregate real compensation tracked separately.',
    },
    {
      title: 'Equity returns',
      detail:
        'Long-history domestic and rest-of-world real equity returns from the Jordà–Schularick–Taylor macrohistory data. Worker-strong and worker-under-pressure years are defined by observed worker outcomes, not by identified automation events. Cell sizes are small and are reported with each group.',
    },
    {
      title: 'Episode windows',
      detail:
        'The US window follows the exposure period used by Acemoglu and Restrepo. The German 2004–07 window is an illustrative subperiod inside the longer robot-adjustment period studied by Dauth, Findeisen, Suedekum and Woessner. Neither window is an identified automation event at national level.',
    },
  ],
  action: { label: 'Open the data notebook', href: links.dataNotebook },
};
