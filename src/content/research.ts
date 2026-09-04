import { links } from './links';
import { routes } from '@/lib/paths';

export const researchPage = {
  title: 'Research behind the site',
  sections: [
    {
      heading: 'The question',
      body: 'How can public policy help workers share in technology-related gains when worker income, tax revenue and investment returns respond differently to economic change?',
    },
    {
      heading: 'What historical evidence can show',
      body: 'Historical episodes make these patterns visible. They do not identify the causal effect of AI or automation.',
    },
    {
      heading: 'What the model can show',
      body: 'The model isolates how taxes, public investment, financing limits and the available investments interact. It provides a framework for comparing policies rather than a prediction of a single future.',
    },
    {
      heading: 'Current boundary',
      body: 'The research combines historical data with a theoretical model. The numerical work is still in progress. The site therefore does not report a calibrated fund size, a policy forecast or an estimated welfare gain.',
    },
  ],
  actions: [
    { label: 'Read the paper', href: links.paper },
    { label: 'Open the data notebook', href: links.dataNotebook },
    {
      label: 'Open the model notebook',
      href: links.modelNotebook,
      external: true,
    },
    { label: 'View the code', href: links.code, external: true },
    { label: 'Browse all sources', href: links.sources },
  ],
  indicators: {
    heading: 'Longer-run indicators',
    body: 'A separate page tracks longer series that give this question its background: the share of income going to labour, measures of automation, asset values, interest rates, government debt, and work and wages.',
    action: { label: 'Open the indicators', href: routes.indicators },
  },
};

export type RelatedItem = {
  title: string;
  authors: string;
  summary: string;
  href: string;
};

export const relatedResearch: RelatedItem[] = [
  {
    title: 'Robots and Jobs',
    authors: 'Acemoglu and Restrepo',
    summary:
      'More robot-exposed US local labour markets experienced weaker employment and wages. Local effects do not directly determine the national aggregate outcome.',
    href: 'https://www.journals.uchicago.edu/doi/10.1086/705716',
  },
  {
    title: 'The Adjustment of Labor Markets to Robots',
    authors: 'Dauth, Findeisen, Suedekum and Woessner',
    summary:
      'German manufacturing employment fell in more robot-exposed areas while service employment expanded. Adjustment differed between incumbent workers and new labour-market entrants.',
    href: 'https://academic.oup.com/jeea/article/19/6/3104/6179884',
  },
  {
    title: 'Uneven Growth',
    authors: 'Moll, Rachel and Restrepo',
    summary:
      'Automation can raise output while changing the distribution of income and wealth. Worker outcomes depend on skills, capital ownership and the economy’s adjustment.',
    href: 'https://www.nber.org/papers/w28440',
  },
  {
    title: 'Managing Public Portfolios',
    authors: 'Aparisi de Lannoy, Bhandari, Evans, Golosov and Sargent',
    summary:
      'Government investments can serve several purposes. Their distributional value depends on how investment returns move with the circumstances in which public resources are valuable.',
    href: 'https://www.nber.org/papers/w30501',
  },
  {
    title: 'Public Finance in the Age of AI',
    authors: 'Korinek and Lockwood',
    summary:
      'The paper considers how AI could change existing tax bases and discusses taxation and public ownership as possible responses under uncertainty.',
    href: 'https://www.nber.org/papers/w34873',
  },
];
