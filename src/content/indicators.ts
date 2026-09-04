import { links } from './links';

// Human copy for the indicators dashboard. The numbers come from
// src/data/indicators.json, which scripts/fetch-indicators.mjs freezes from
// public sources; nothing is fetched while a reader is on the page.

export const indicatorsMeta = {
  eyebrow: 'Indicators',
  headline: 'Longer-run indicators behind the question.',
  lead: 'The site asks who gains from economic growth and when a public investment helps. This page tracks the longer series behind that question in several economies: the share of income going to labour, measures of automation, asset values, interest rates, government debt, and work and wages.',
  cadence:
    'Refreshed by re-running the fetch script and rebuilding the site. The page makes no requests while you read it.',
  dataHref: `${links.code}/blob/main/src/data/indicators.json`,
  scriptHref: `${links.code}/blob/main/scripts/fetch-indicators.mjs`,
};

// Where a source's own note uses American spelling or wording that does not
// suit this site, the page shows our wording instead. The published note stays
// in the data file, so provenance is unchanged.
export const noteOverrides: Record<string, string> = {
  'ai-adoption':
    'The share of surveyed companies using AI in at least one business function. Use covers a wide range, from early experiments to systems running across the whole business.',
};

export const titleOverrides: Record<string, string> = {
  'labour-share-us-quarterly':
    'Labour share, United States nonfarm business sector',
};

export const places = [
  'United States',
  'United Kingdom',
  'Germany',
  'Japan',
  'France',
  'South Korea',
  'China',
];

export type IndicatorGroup = {
  id: string;
  title: string;
  intro: string;
  charts: Array<{ id: string; why: string }>;
};

export const indicatorGroups: IndicatorGroup[] = [
  {
    id: 'income',
    title: 'Who gets the income',
    intro:
      'The site opens with the split between worker income and capital income. These series show that split as it is measured: the share of national income paid to labour, and the share taken by profits.',
    charts: [
      {
        id: 'labour-share',
        why: 'The share of income going to workers, across seven economies over seven decades. A falling line is the distribution split of the essay: output can grow while a smaller share reaches wages.',
      },
      {
        id: 'labour-share-us-quarterly',
        why: 'The same idea at quarterly frequency for the United States, so recent movements are visible.',
      },
      {
        id: 'profits-share-us',
        why: 'The mirror image: the share of output that ends up as after-tax corporate profit, which is the income the owners of capital receive.',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Measures of automation',
    intro:
      'Automation is measured here as machines installed, money committed to AI, firms reporting AI use, and business spending on software. None of these is the model’s automation state, but all of them move it.',
    charts: [
      {
        id: 'robots',
        why: 'Industrial robots are the clearest physical measure of capital taking over tasks. The scale of installation differs enormously across places.',
      },
      {
        id: 'ai-investment',
        why: 'Private capital committed to AI companies, by region. Investment is where profits and asset values are expected to appear first.',
      },
      {
        id: 'ai-adoption',
        why: 'The share of surveyed organisations reporting AI use. Adoption is when the change reaches wages and tasks rather than share prices.',
      },
      {
        id: 'software-investment-us',
        why: 'Business spending on software and other intellectual property as a share of output in the United States: the investment that carries automation into production.',
      },
      {
        id: 'productivity-and-pay-us',
        why: 'Output per hour against real pay per hour. When the two lines separate, the gains from production are not reaching wages in proportion.',
      },
    ],
  },
  {
    id: 'assets',
    title: 'Asset values',
    intro:
      'Capital owners share in the upside partly because asset values rise. These are the asset values.',
    charts: [
      {
        id: 'share-prices',
        why: 'Share price indices in seven economies. These are the assets a public fund could hold, and the wealth that workers without claims do not receive.',
      },
      {
        id: 'sp500',
        why: 'The most-watched equity index in the world, as a monthly average.',
      },
      {
        id: 'market-cap',
        why: 'Stock markets relative to the size of the economy. A rising ratio means asset values growing faster than output.',
      },
    ],
  },
  {
    id: 'rates',
    title: 'Interest rates',
    intro:
      'Markets put a price on a pound or a dollar arriving later. The safe rate is that price, and it is what government saving and borrowing cost.',
    charts: [
      {
        id: 'long-rates',
        why: 'Ten-year government bond yields in six economies: the market price of moving public resources across time.',
      },
      {
        id: 'us-rates',
        why: 'The nominal and inflation-indexed ten-year yields in the United States. The gap between them is expected inflation; the indexed yield is the real cost of public borrowing.',
      },
    ],
  },
  {
    id: 'balance-sheet',
    title: 'Government finances',
    intro:
      'A government that wants to hold claims on behalf of workers must be able to finance them. Gross debt is the simplest measure of how much room is left.',
    charts: [
      {
        id: 'government-debt',
        why: 'General government gross debt relative to output in seven economies. Every public position is financed against this starting point.',
      },
    ],
  },
  {
    id: 'work',
    title: 'Work and wages',
    intro:
      'Workers in the model live on wages and transfers. These series are the state of wages and employment.',
    charts: [
      {
        id: 'unemployment',
        why: 'Unemployment in seven economies. Job loss is the sharpest form of weakness in worker income.',
      },
      {
        id: 'us-real-earnings',
        why: 'Real median weekly earnings of full-time workers in the United States, in constant prices. The flat decades are the reason the question is asked.',
      },
    ],
  },
];

export const methodology = [
  'Every series is downloaded by a script in the repository from a public source that needs no key: FRED at the Federal Reserve Bank of St. Louis, the World Bank, the IMF World Economic Outlook database and Our World in Data. The script records the source, the series codes and the date of the download.',
  'Daily series are averaged to months. Ratios are computed from the published nominal series. Indices are rebased where stated. No value is estimated, interpolated or forecast by this site; where a source publishes its own estimate for the latest year, the chart says so.',
  'The frozen data file is versioned with the site, so every published build is reproducible and the page has no live data dependency. Update it by running the script and rebuilding.',
];
