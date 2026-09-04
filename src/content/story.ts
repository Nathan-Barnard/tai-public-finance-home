import { routes } from '@/lib/paths';

import { links } from './links';
import type { StorySection } from './types';

export const storySections: StorySection[] = [
  {
    slug: 'top',
    eyebrow: 'The public balance sheet and automation',
    headline: 'Automation pays the people who own it.',
    body: [
      'When new technology raises profits and asset values, people who own capital share in the upside automatically. Workers who do not own those assets may not.',
      'The question is who owns the claims on the wealth automation creates.',
    ],
    actions: [
      { label: 'Follow the money', href: '#problem' },
      { label: 'Open the interactive lab', href: routes.explore },
    ],
    visual: { kind: 'hero-split' },
    theme: 'paper',
  },
  {
    slug: 'problem',
    navLabel: 'The problem',
    eyebrow: 'The distribution split',
    headline: 'The economy can grow while the gains split apart.',
    body: [
      'Picture the same automation shock landing in four different economies. Total output rises in all of them. What differs is who ends up owning the gains.',
    ],
    exitLine: 'Growth does not tell us who owns the gains.',
    visual: {
      kind: 'distribution',
      states: [
        {
          id: 'workers-lose',
          label: 'Workers lose while capital gains',
          title: 'The gains go one way. The losses go another.',
          copy: 'Automation raises profits and the value of the assets that earn them. Wages fall. Capital owners gain; workers lose.',
          worker: 'falls',
          capital: 'rises',
          profits: 'rises',
          assets: 'rises',
          verdict:
            'Worker income falls while capital income, profits and asset values rise.',
        },
        {
          id: 'workers-gain-less',
          label: 'Workers gain, but capital gains much more',
          title: 'Workers can gain and still fall behind.',
          copy: 'Nobody’s wages fall here. Yet most of the new income lands with the people who own and price capital. Workers are better off than before, and further behind the owners than before. The public question arises here too.',
          worker: 'rises',
          capital: 'rises-faster',
          profits: 'rises-faster',
          assets: 'rises-faster',
          verdict:
            'Worker income rises, but capital income, profits and asset values rise much faster.',
        },
        {
          id: 'together',
          label: 'Workers and capital move together',
          title: 'Sometimes the gains are shared.',
          copy: 'When wages and capital income rise in step, ownership of the winning assets matters far less. Nobody is left behind by the shock itself.',
          worker: 'rises',
          capital: 'rises',
          profits: 'rises',
          assets: 'rises',
          verdict: 'Worker income and capital income rise together.',
        },
        {
          id: 'workers-outperform',
          label: 'Workers outperform capital',
          title: 'Occasionally the shock favours workers.',
          copy: 'New tasks can raise the demand for labour faster than the return to capital. Wages rise more than profits, and asset values can soften. Here workers are the ones who participate first.',
          worker: 'rises-faster',
          capital: 'flat',
          profits: 'flat',
          assets: 'falls',
          verdict:
            'Worker income rises faster than capital income; profits stay flat and asset values fall.',
        },
      ],
    },
    theme: 'paper',
  },
  {
    slug: 'ownership',
    navLabel: 'Public ownership',
    eyebrow: 'Who owns what',
    headline: 'Who owns the upside when automation arrives?',
    body: [
      'Start with workers who do not own the assets that gain. Government can buy financial claims and use the resulting public resources on their behalf.',
      'A public holding can turn part of a private windfall into public resources. Whether it succeeds depends on when the asset actually pays.',
    ],
    visual: {
      kind: 'ownership-flow',
      actors: [
        {
          id: 'workers',
          name: 'Workers',
          description: 'Earn wages. Own no financial claims.',
        },
        {
          id: 'owners',
          name: 'Capital owners',
          description: 'Own productive capital and decide how much to invest.',
        },
        {
          id: 'government',
          name: 'Government',
          description: 'Taxes, saves or borrows, buys claims, and transfers.',
        },
        {
          id: 'markets',
          name: 'Financial markets',
          description: 'Price the claims that government can buy.',
        },
      ],
      steps: [
        {
          title: 'The shock lands.',
          copy: 'Automation changes what capital can do and what labour is paid for.',
        },
        {
          title: 'The gains split into four flows.',
          copy: 'Wages go to workers. Profits and asset values go to capital owners, and financial markets price them. Public revenue goes to government.',
        },
        {
          title: 'Now add the public balance sheet.',
          copy: 'Government buys claims in financial markets and transfers what they pay to workers. It is acting for people who own no claims of their own.',
        },
      ],
    },
    expertNote: {
      title: 'See the model behind this',
      copy: [
        'Workers do not privately trade the financial assets in the model.',
        'Domestic productive capital is privately owned.',
        'The government can trade external claims and transfer resources to workers.',
        'Market prices are taken as given in the core small-open-economy setup.',
      ],
      paperHref: links.paper,
      notebookHref: links.notebooks.intermediation,
    },
    theme: 'bone',
  },
  {
    slug: 'one-pays-one-misses',
    eyebrow: 'The central comparison',
    headline: 'One pays. One misses.',
    body: [
      'Same economy. Same public debt. Same tax rate. Workers take the same hit. Now change one thing: whether the public asset pays.',
    ],
    visual: {
      kind: 'state-payoff',
      lanes: [
        {
          id: 'pays',
          title: 'The asset pays',
          steps: [
            'Workers fall behind',
            'The public asset rises',
            'Public resources arrive',
          ],
          pays: true,
          readout: 'Government can transfer what the asset paid.',
        },
        {
          id: 'misses',
          title: 'The asset misses',
          steps: [
            'Workers fall behind',
            'The public asset stays flat',
            'Nothing arrives from that asset',
          ],
          pays: false,
          readout:
            'The shortfall is untouched by this holding, however large it is.',
        },
      ],
      after: [
        'The label on the asset does not matter. Its payoff does.',
        'An asset can be closely associated with automation and still miss the particular automation shock that hurts workers.',
      ],
    },
    theme: 'paper',
  },
  {
    slug: 'theta',
    eyebrow: 'The one equation',
    headline: 'Where does a public dollar matter most?',
    body: [
      'Markets value a dollar differently depending on the future in which it arrives.',
      'Government cares about that same dollar because it can change workers’ resources.',
    ],
    visual: { kind: 'theta' },
    expertNote: {
      title: 'Read the economics',
      copy: [
        'In the paper, mI is the market stochastic discount factor.',
        'mG is the fiscal valuation kernel induced by the government’s objective for workers.',
        'Θ is the relative fiscal-to-market valuation ratio.',
        'A high level of Θ everywhere does not by itself identify a risky asset position. State-to-state variation in Θ creates the relevant portfolio motive.',
        'Θ is not a forecast, a probability, an inequality index, a policy score or a recommended portfolio weight.',
      ],
      paperHref: links.paper,
      notebookHref: links.notebooks.intermediation,
    },
    theme: 'paper',
  },
  {
    slug: 'payoffs',
    navLabel: 'Payoffs',
    eyebrow: 'Payoff alignment',
    headline: 'An asset can rise with automation and still miss the problem.',
    body: [
      'A public holding helps when its payout arrives in the same future state as the worker shortfall.',
      'High average returns are not enough. A large position in the wrong payoff is still the wrong payoff.',
    ],
    visual: {
      kind: 'payoff-alignment',
      cases: [
        {
          id: 'behind-rises',
          label: 'Workers fall behind and the asset rises',
          verdict: 'Reaches this state',
          note: 'The payout lands in the future where a public dollar matters most to workers.',
          x: 0.86,
          y: 0.86,
          reaches: 'yes',
          labelSide: 'below',
        },
        {
          id: 'behind-flat',
          label: 'Workers fall behind and the asset stays flat',
          verdict: 'Misses this state',
          note: 'Nothing arrives from this holding, however large it is. The shortfall is untouched.',
          x: 0.86,
          y: 0.22,
          reaches: 'no',
          labelSide: 'left',
        },
        {
          id: 'gain-less-rises',
          label: 'Workers gain less than capital owners and the asset rises',
          verdict: 'Reaches this state',
          note: 'Workers are not poorer, but they are behind. A public dollar still matters more here, and the asset supplies it.',
          x: 0.62,
          y: 0.6,
          reaches: 'yes',
          labelSide: 'left',
        },
        {
          id: 'well-rises',
          label:
            'The asset rises in a state where workers are already doing well',
          verdict: 'Pays where it is needed least',
          note: 'The payout arrives in a future where workers already participate. Public resources matter less there.',
          x: 0.16,
          y: 0.84,
          reaches: 'wrong-place',
          labelSide: 'right',
        },
      ],
      caveat:
        'These four cases are positions in a picture, not securities. Nothing here ranks real assets or recommends a holding.',
    },
    theme: 'bone',
  },
  {
    slug: 'payoff-space',
    eyebrow: 'The payoff-space theatre',
    headline: 'More of the same asset is not a new payoff.',
    body: [
      'A bigger holding moves government farther along the same payoff line. It does not turn the line.',
      'A country can own more of an asset and still remain exposed to the part of automation risk that asset never touches.',
    ],
    visual: {
      kind: 'payoff-space',
      modes: [
        {
          id: 'one',
          label: 'One available payoff',
          copy: [
            'Slide the public position up or down. The point moves along the same line, farther or closer, and the rose remainder never shrinks.',
          ],
        },
        {
          id: 'two',
          label: 'Add a different payoff',
          copy: [
            'A genuinely different payoff points somewhere new. Together the two directions reach more of the worker exposure.',
            'This is a picture of a mechanism. Two directions in a diagram do not complete every market a real economy would need, and nothing here is a recommendation.',
          ],
        },
      ],
    },
    expertNote: {
      title: 'Read the economics',
      copy: [
        'The drawing is the projection of a worker-resource exposure onto the span of the available payoffs. For one payoff a and exposure e, the reached part is a·(e·a)/(a·a) and the remainder is e minus that. For several payoffs collected in A, the reached part is A(AᵀA)⁻¹Aᵀe.',
        'In the paper the exposure is the state loading of the value of future wages and tax resources, and the payoff is the state loading of the traded claim. Public trade removes the projection of the valuation disagreement on the traded payoff and leaves the orthogonal part untouched.',
        'The orthogonal remainder is what gives a second, independent payoff its value at leading order, even if that payoff carries no extra expected return.',
      ],
      paperHref: links.paper,
      notebookHref: links.notebooks.span,
    },
    theme: 'ink',
  },
  {
    slug: 'tools',
    navLabel: 'Policy tools',
    eyebrow: 'The policy tools',
    headline: 'Three public tools. Three different jobs.',
    body: [
      'Each can put resources behind workers. They work through different parts of the economy and at different times.',
    ],
    visual: {
      kind: 'instrument-stage',
      instruments: [
        {
          id: 'saving',
          name: 'Public saving',
          copy: 'Saving gives government more room later. Borrowing brings future revenue forward.',
          visual: 'time-rail',
          takeaway: 'Saving works across time.',
        },
        {
          id: 'ownership',
          name: 'Public ownership',
          copy: 'Ownership changes which shocks bring money onto the public balance sheet.',
          visual: 'state-field',
          takeaway: 'Public ownership works across states.',
        },
        {
          id: 'taxation',
          name: 'Capital taxation',
          copy: 'Taxation changes how gains are divided. It also changes investment, capital, wages, and future revenue.',
          visual: 'transition-loop',
          takeaway:
            'Tax policy changes distribution and the path of production.',
          caveat:
            'Whether the tax should rise or fall is not universal. It depends on how the tax base, investment and revenue move in the years that follow.',
        },
      ],
      takeaways: [
        'Saving works across time.',
        'Public ownership works across states.',
        'Tax policy changes distribution and the path of production.',
      ],
    },
    theme: 'paper',
  },
  {
    slug: 'impact-and-transition',
    eyebrow: 'Impact and transition',
    headline:
      'A public asset can pay when the shock lands. Tax policy changes what happens next.',
    body: [
      'A tax is not a delayed copy of an asset payoff. It works through a different path: it changes the return to capital, which changes investment, and later wages and revenue.',
    ],
    visual: {
      kind: 'timeline',
      beats: [
        {
          id: 'before',
          title: 'Before the shock',
          copy: 'The public position must already be in place.',
        },
        {
          id: 'shock',
          title: 'The shock lands',
          copy: 'The asset payoff can change public wealth immediately.',
        },
        {
          id: 'after',
          title: 'The years after',
          copy: 'Taxes affect profits, investment, capital, wages, and revenue over time.',
        },
      ],
    },
    expertNote: {
      title: 'Read the economics',
      copy: [
        'In the continuous-shock economy, an inherited risky position moves public net worth together with the innovation itself. Bounded tax receipts and capital accumulation work through the flows that follow, which are smaller over any short interval than the position’s payoff.',
        'The tax rate and the capital stock are inherited state variables. The government can reset how fast the tax changes, not the rate or the capital stock at the moment of the shock.',
        'The paper also treats a separate marked-event economy, where a single arrival selects one of two successor economies. There the same distinction appears as the difference between an event payoff and a flow tax that has no mass at the event.',
      ],
      paperHref: links.paper,
      notebookHref: links.notebooks.lq,
    },
    theme: 'ink',
  },
  {
    slug: 'future',
    navLabel: 'Future',
    eyebrow: 'A fork in the future',
    headline: 'Automation does not lead to one future economy.',
    body: [
      'One public position cannot independently choose how prepared the country is for two very different futures.',
      'One payoff remains one direction, even when the uncertainty is a transformation of the entire economy.',
    ],
    visual: {
      kind: 'successor-space',
      states: [
        {
          id: 'labour-using',
          name: 'A labour-using future',
          description:
            'Automation does part of the work. Wages still carry households, and capital and labour both earn.',
        },
        {
          id: 'labour-light',
          name: 'A labour-light future',
          description:
            'Capital does nearly all of the work. Output can keep growing while wages stop carrying households.',
        },
      ],
      caveat:
        'The two futures illustrate a mechanism. They are not forecasts, and no probability is attached to either.',
    },
    expertNote: {
      title: 'See the model behind this',
      copy: [
        'In the marked-event economy a single arrival selects either a labour-using successor or a labour-light successor in which capital alone produces output.',
        'The public asset is domestic installed-capital equity. Its payoff across the two successors is one vector. Varying the inherited position traces a line in successor-wealth space, not the whole plane.',
        'This is an exact rank statement for that payoff menu. It is not a welfare ranking, a tax result or an implementation result.',
      ],
      paperHref: links.paper,
      notebookHref: links.notebooks.poisson,
    },
    theme: 'paper',
  },
  {
    slug: 'lab',
    eyebrow: 'Try it',
    headline: 'The Public Balance Sheet Lab',
    body: [
      'Change the distribution of an automation shock. Then change what the public asset pays.',
    ],
    actions: [{ label: 'Open the full lab', href: routes.explore }],
    visual: { kind: 'lab-embed' },
    theme: 'bone',
  },
  {
    slug: 'design-question',
    eyebrow: 'The design question',
    headline: 'The public balance sheet needs the right payoff map.',
    body: [
      'Public ownership should be judged by the future it reaches—not by the size of the fund or the label attached to the asset.',
    ],
    visual: {
      kind: 'questions',
      questions: [
        'What does the asset actually pay on?',
        'Who receives the public resources when it pays?',
        'What remains untouched by the available assets?',
      ],
    },
    theme: 'paper',
  },
  {
    slug: 'closing',
    headline:
      'If workers cannot buy a stake in the future, government can. But the payoff has to arrive in the future workers actually need.',
    body: [
      'Build public capacity across time. Choose assets by the states in which they pay. Keep the remaining exposure visible.',
    ],
    visual: {
      kind: 'closing',
      actions: [
        { label: 'Read the paper', href: links.paper },
        { label: 'Open the full interactive lab', href: routes.explore },
        {
          label: 'Explore the notebooks',
          href: links.notebookIndex,
          external: true,
        },
        {
          label: 'View the research on GitHub',
          href: links.siteRepo,
          external: true,
        },
      ],
    },
    theme: 'ink',
  },
];

export const navChapters = storySections
  .filter((section) => section.navLabel)
  .map((section) => ({ id: section.slug, label: section.navLabel as string }));
