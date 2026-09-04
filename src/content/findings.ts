import { links } from './links';

// Content for the findings page: what the research has established, in
// large plain statements. Drawn from the paper's stated conditions and the
// notebook manifest; no result is promoted beyond its source.

export const findingsMeta = { updated: '4 September 2026' };

export type Standing = 'Exact' | 'Local' | 'Geometry';

export type Finding = {
  id: string;
  statement: string;
  plain: string;
  standing: Standing;
  standingNote: string;
  where: string;
  href?: string;
};

export const findings: Finding[] = [
  {
    id: 'priced-twice',
    statement: 'One payoff, priced twice.',
    plain:
      'The market prices a public asset by its own valuation of each future. The government values the same payoff by what it changes for workers. Public trade makes the two agree along the traded payoff, and only there.',
    standing: 'Exact',
    standingNote:
      'Holds on the smooth interior of the continuous-shock economy, with transfers and the position interior.',
    where: 'The section on when equity works for workers',
    href: links.notebooks.intermediation,
  },
  {
    id: 'two-experiments',
    statement: 'The same worker loss can be reached or missed.',
    plain:
      'One shock keeps output fixed while shifting income from labour to capital, and the claim pays. Another lowers worker and public resources while the same claim does not move at all.',
    standing: 'Exact',
    standingNote:
      'Local experiments at inherited capital on the maintained production branch.',
    where: 'The economy section and the central comparison',
  },
  {
    id: 'size-versus-alignment',
    statement: 'A big fund is not the same as an aligned one.',
    plain:
      'The leading public position is ordinary return demand minus the part of worker exposure the asset already replicates. A large holding can be mostly return demand while an important worker exposure stays outside the asset.',
    standing: 'Local',
    standingNote:
      'A small-risk expansion along a feasible deterministic path with an interior position.',
    where: 'The missing-payoff section',
    href: links.notebooks.lq,
  },
  {
    id: 'more-is-not-new',
    statement: 'More of one asset is not a new payoff.',
    plain:
      'A larger position moves along the same line. Only an independent payoff reaches the remainder, and that remainder sets the leading value of adding one.',
    standing: 'Geometry',
    standingNote:
      'The geometry is exact; the welfare value is a local small-risk result along a common deterministic path.',
    where: 'The missing-payoff section',
    href: links.notebooks.span,
  },
  {
    id: 'different-clock',
    statement: 'Taxes work on a different clock.',
    plain:
      'An inherited asset position pays with the shock. The tax rate and the capital stock are inherited, so tax policy changes the path of investment, wages and revenue afterwards. Its sign is not universal.',
    standing: 'Exact',
    standingNote:
      'A selected smooth interior path with its terminal condition; constrained cases need their own treatment.',
    where: 'The taxes section',
  },
  {
    id: 'one-line-two-futures',
    statement: 'One position, one line, two futures.',
    plain:
      'When a single event selects a labour-using or a labour-light economy, one inherited equity payoff supplies one direction across the two. Changing its size moves along a line, not across the plane.',
    standing: 'Geometry',
    standingNote:
      'A fixed-policy rank statement for the named equity-and-flow-tax menu. Not a welfare, tax or implementation result.',
    where: 'The two-economies section',
    href: links.notebooks.poisson,
  },
];

export const economies = [
  {
    id: 'continuous',
    name: 'The continuous-shock economy',
    role: 'The spine of the paper',
    what: 'Productivity and automation move continuously. Workers live on wages and transfers; capital is privately owned; one externally priced claim, safe finance and a slowly moving capital tax.',
    exact: [
      'One payoff, priced twice',
      'The projection geometry',
      'The tax-speed identity',
    ],
    local: [
      'The leading position',
      'The value of claim access',
      'The value of a second payoff',
    ],
  },
  {
    id: 'event',
    name: 'The marked-event economy',
    role: 'The same criterion, applied to a transformation',
    what: 'A single arrival selects a labour-using or a labour-light successor. The public asset is domestic equity; the tax is a levy on rental income flows.',
    exact: ['One position traces one line across the two successors'],
    local: [],
  },
];

export const notReported = [
  {
    what: 'Calibrated magnitudes',
    why: 'No parameter is estimated or calibrated to a country.',
  },
  {
    what: 'An optimal tax rate or its sign',
    why: 'The tax result is a path identity whose sign depends on the discounted future tax base and the value of preserved capital.',
  },
  {
    what: 'Portfolio weights or a fund size',
    why: 'The paper shows which exposures an asset menu can reach, not how large a real position should be.',
  },
  {
    what: 'A welfare ranking of the public tools',
    why: 'The matched six-cell comparison has no accepted numerical bundle yet.',
  },
  {
    what: 'Probabilities for the two future economies',
    why: 'The two-successor result is a rank statement, not a forecast.',
  },
];

export const notebookRoute = [
  { title: 'Start here', evidence: 'Orientation', href: links.notebooks.start },
  {
    title: 'The public-intermediation problem',
    evidence: 'Analytical',
    href: links.notebooks.intermediation,
  },
  {
    title: 'Valuation and payoff span',
    evidence: 'Analytical geometry',
    href: links.notebooks.span,
  },
  {
    title: 'Local dynamics',
    evidence: 'Exploratory computation',
    href: links.notebooks.lq,
  },
  {
    title: 'The nonlinear problem',
    evidence: 'Formulation and diagnostic',
    href: links.notebooks.ramsey,
  },
  {
    title: 'Partial or full automation',
    evidence: 'Analytical rank result',
    href: links.notebooks.poisson,
  },
  {
    title: 'Instruments and welfare',
    evidence: 'Comparison design',
    href: links.notebooks.instruments,
  },
];

export const readiness = {
  asOf: '4 September 2026',
  summary:
    'All six comparisons of tax policy against the public asset menu are stated in words. None has an accepted number. The interface has room for validated figures cell by cell, and none are entered.',
};
