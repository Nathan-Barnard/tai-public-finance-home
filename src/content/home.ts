import { links } from './links';
import { routes } from '@/lib/paths';

export const hero = {
  eyebrow: 'AI, growth, and distribution',
  headline:
    'How might AI change who gains from economic growth, and how could we shape it?',
  body: 'AI may raise productivity, wages and profits in different proportions. This project uses historical evidence and economic models to examine how ownership, taxes and public investment can shape who benefits.',
  primary: { label: 'Explore possible futures', href: routes.explore },
  secondary: { label: 'See what history shows', href: '#history' },
};

export type Panel = { title: string; copy: string };

export const distribution = {
  eyebrow: 'The distribution split',
  headline: 'The economy can grow while the gains split apart.',
  body: 'Picture the same increase in automation in four different economies. Total output rises in all of them. What differs is who ends up owning the gains.',
  panels: [
    {
      title: 'Broadly shared growth',
      copy: 'Workers and owners both gain at similar rates.',
    },
    {
      title: 'Growth with a widening gap',
      copy: 'Both gain, but income from capital grows faster than worker income.',
    },
    {
      title: 'Workers lose, owners gain',
      copy: 'Output rises, but worker pay, hours or employment fall.',
    },
    {
      title: 'Workers gain more',
      copy: 'Worker incomes rise faster than income from capital.',
    },
  ] satisfies Panel[],
  closing:
    'A falling share of income going to labour does not, by itself, tell us which of these worlds we are in.',
  disclosure: {
    title: 'Why can output rise while some workers do worse?',
    body: [
      'New technology can make some jobs more productive, replace other jobs, and raise the value of businesses and equipment at the same time. The economy can therefore produce more even when particular workers lose pay, hours or bargaining power. Output tells us how much is produced. To understand who benefits, we also need to look at pay, employment, profits and ownership.',
    ],
  },
};

export const history = {
  eyebrow: 'What history shows',
  headline:
    'The same economic shift can leave workers in very different positions.',
  body: 'Historical evidence does not tell us what AI will do. It does show why worker income, investment returns and government revenue need to be examined separately.',
};

export const policy = {
  eyebrow: 'What policy can change',
  headline: 'Taxes and public investment do different jobs.',
  panels: [
    {
      title: 'Taxes and transfers',
      copy: 'Taxes and transfers can change how income is shared as it is earned. They can also affect incentives, investment and future tax revenue.',
    },
    {
      title: 'Public investment',
      copy: 'A public fund gives the government a claim on future returns. Whether that protects workers depends on when those investments pay.',
    },
  ] satisfies Panel[],
  closing:
    'Saving and borrowing determine how these policies are financed. They do not, by themselves, make resources arrive in a different set of circumstances.',
  disclosure: {
    title: 'Why are taxes and investments not interchangeable?',
    body: [
      'Taxes change how income is divided as wages and profits are earned. A public investment can also rise or fall when economic conditions change. An investment held before conditions change may provide resources immediately; a change in tax policy usually works through income, behaviour and investment over time. The two tools can complement one another, but they do not act in the same way.',
    ],
  },
};

export const useful = {
  eyebrow: 'What makes an investment useful?',
  headline: 'A good average return is not the same as protection.',
  body: 'Before asking how large a public fund should be, ask what happens to its investments when workers or government revenue are under pressure.',
  figureLabel: 'A simplified example',
  panels: [
    {
      title: 'Pays when workers are under pressure',
      copy: 'The investment can give the government resources at a moment when support is particularly useful.',
    },
    {
      title: 'Pays mainly in already-good times',
      copy: 'The investment can share in the upside without providing much support when worker incomes weaken.',
    },
  ] satisfies Panel[],
  closing:
    'The same asset may be useful for sharing gains and less useful for cushioning losses. Those are different policy roles.',
  disclosure: {
    title: 'Read the economics',
    sections: [
      {
        heading: 'What this means',
        copy: 'A public fund moves resources across possible futures through the investments it owns. The most useful investment is not necessarily the one with the highest average return. It is the one that pays in the circumstances the policy is meant to address.',
      },
      {
        heading: 'Why this is difficult',
        copy: 'Worker incomes, tax revenue and asset prices do not always move together. An investment can perform well over many years and still fall when support is most valuable.',
      },
      {
        heading: 'What could change the answer',
        copy: 'The available investments, borrowing limits, tax rules, financing costs and time horizon can all change how much protection a public fund provides.',
      },
    ],
  },
};

export const model = {
  eyebrow: 'What the model adds',
  headline: 'Different risks may require different investments.',
  body: [
    'Suppose worker income can change for two different reasons, but the government holds only one investment. Changing the size of that holding changes how much it pays. It does not change the circumstances in which it pays.',
    'If two economically different futures produce the same return on the fund, the fund cannot move resources from one of those futures to the other. Taxes can still change how income is shared, but they do not create a missing investment return.',
    'The model clarifies this limit. It does not yet estimate an optimal fund size or predict a particular change in wages.',
  ],
  actions: [
    { label: 'Read the paper', href: links.paper },
    {
      label: 'Open the model notebook',
      href: links.modelNotebook,
      external: true,
    },
  ],
};

export const explorePreview = {
  eyebrow: 'Explore the question',
  headline:
    'What changes when the gains and investment returns arrive in different ways?',
  body: 'Choose how the gains from automation are shared and how a public investment performs. The result is a thought experiment, not a forecast.',
  action: { label: 'Explore possible futures', href: routes.explore },
};

export const closing = {
  headline: 'Growth and distribution are separate questions.',
  body: 'Public investment is one possible way to share technology-related gains. Its usefulness depends on what the government owns, how the investment is financed, and whether it pays when workers need support. The historical evidence helps define those questions, but it does not yet settle the answer.',
  actions: [
    { label: 'Evidence', href: routes.evidence },
    { label: 'Explore', href: routes.explore },
    { label: 'Research', href: routes.research },
  ],
};
