import { routes } from '@/lib/paths';

// The Explore page is a thought experiment. Its outcomes are fixed
// descriptions, not computed results: no fund sizes, weights, rates or
// percentages appear anywhere in it.

export const explorePage = {
  title: 'Explore possible futures',
  intro:
    'This is a thought experiment, not a forecast. Choose how the gains from automation are shared, then ask whether a public investment helps in that particular future.',
  action: {
    label: 'Read how the model represents these possibilities',
    href: routes.research,
  },
};

export type DistributionOption = {
  id: string;
  label: string;
  workers: string;
  owners: string;
  question: string;
};

export type InvestmentOption = {
  id: string;
  label: string;
  outcome: string;
};

export const distributionChoice = {
  label: 'How are the gains shared?',
  options: [
    {
      id: 'similar',
      label: 'Workers and owners both gain at similar rates',
      workers: 'Pay and employment improve alongside output.',
      owners: 'Profits and asset income rise at a similar rate.',
      question: 'Which institutions help this pattern persist?',
    },
    {
      id: 'owners-more',
      label: 'Owners gain more than workers',
      workers: 'Worker incomes rise, but more slowly than income from capital.',
      owners: 'Profits and asset values rise faster.',
      question: 'How broadly should the additional income be shared?',
    },
    {
      id: 'workers-lose',
      label: 'Workers lose while owners gain',
      workers: 'Pay, hours or employment weaken even as output rises.',
      owners: 'Profits and asset values rise.',
      question:
        'Can support reach workers without creating larger costs elsewhere?',
    },
    {
      id: 'workers-more',
      label: 'Workers gain more than owners',
      workers: 'Worker incomes capture a large part of the additional output.',
      owners: 'Capital income rises more slowly.',
      question: 'What helped workers capture more of the gains?',
    },
  ] satisfies DistributionOption[],
};

export const investmentChoice = {
  label: 'How does the public investment perform?',
  options: [
    {
      id: 'pays-under-pressure',
      label: 'It pays when workers are under pressure',
      outcome:
        'The investment can provide resources when worker incomes are weak. It may reduce the gap, but it does not automatically reverse changes in wages or employment.',
    },
    {
      id: 'pays-good-times',
      label: 'It pays mainly in good times',
      outcome:
        'The investment shares in economic upside. It provides less protection if worker incomes weaken in different circumstances.',
    },
    {
      id: 'little-relation',
      label: 'It does not move much with worker outcomes',
      outcome:
        'The investment may add to public wealth over time, but it does little to move resources specifically toward worker-weak periods.',
    },
  ] satisfies InvestmentOption[],
};

export const resultFields = {
  workers: 'Workers',
  owners: 'Owners',
  investment: 'Public investment',
  question: 'The policy question',
};
