import { links } from './links';

// A dated monitor of the research programme. Every entry is drawn from the
// repository's own manifests and the paper's stated wording ceilings. It is
// rebuilt with the site; nothing is read live.

export const dashboardMeta = {
  updated: '4 September 2026',
  cadence:
    'Updated when the notebooks, exports or paper draft change. Rebuilt with the website; no live data.',
};

export type ResultStatus =
  | 'Established under stated conditions'
  | 'Local approximation'
  | 'Exact geometry'
  | 'Illustration'
  | 'Not yet accepted numerically';

export type HeadlineResult = {
  title: string;
  plain: string;
  status: ResultStatus;
  conditions: string;
  where: string;
  href?: string;
};

export const headlineResults: HeadlineResult[] = [
  {
    title: 'One payoff, priced twice',
    plain:
      'The market prices a public asset by its own valuation of each future. The government values the same payoff by what it changes for workers. Public trade makes the two agree along the traded payoff, and only there.',
    status: 'Established under stated conditions',
    conditions:
      'Smooth interior of the continuous-shock economy, with transfers and the position interior.',
    where:
      'Paper, the section on when equity works for workers; notebook on the public-intermediation problem.',
    href: links.notebooks.intermediation,
  },
  {
    title: 'The two automation experiments',
    plain:
      'One shock keeps output fixed while shifting income from labour to capital, and the claim pays. Another lowers worker and public resources while the same claim does not move at all.',
    status: 'Established under stated conditions',
    conditions:
      'Local experiments at inherited capital on the maintained production branch.',
    where:
      'Paper, the economy section; the central comparison on the home page.',
  },
  {
    title: 'Return demand versus the part that offsets worker exposure',
    plain:
      'The leading public position is ordinary return demand minus the part of worker exposure the asset already replicates. A large holding can be driven by return demand while an important worker exposure stays outside the asset.',
    status: 'Local approximation',
    conditions:
      'Small-risk expansion along a feasible deterministic path with an interior position.',
    where: 'Paper, the missing-payoff section; notebook on local dynamics.',
    href: links.notebooks.lq,
  },
  {
    title: 'More of one asset versus a new payoff',
    plain:
      'A larger position moves along the same line. Only an independent payoff reaches the remainder, and that remainder sets the leading value of adding one.',
    status: 'Exact geometry',
    conditions:
      'The geometry is exact; the welfare value is a local small-risk result along a common deterministic path.',
    where:
      'Paper, the missing-payoff section; notebook on valuation and payoff span.',
    href: links.notebooks.span,
  },
  {
    title: 'Taxes work on a different clock',
    plain:
      'An inherited asset position pays with the shock. The tax rate and the capital stock are inherited, so tax policy changes the path of investment, wages and revenue afterwards. Its sign is not universal.',
    status: 'Established under stated conditions',
    conditions:
      'A selected smooth interior path with its terminal condition; constrained cases need their own treatment.',
    where: 'Paper, the taxes section; the timeline on the home page.',
  },
  {
    title: 'One position across two futures',
    plain:
      'When a single event selects a labour-using or a labour-light economy, one inherited equity payoff supplies one direction across the two. Changing its size moves along a line, not across the plane.',
    status: 'Exact geometry',
    conditions:
      'Fixed-policy rank statement for the named equity-and-flow-tax menu. Not a welfare, tax or implementation result.',
    where:
      'Paper, the two-economies section; notebook on partial or full automation.',
    href: links.notebooks.poisson,
  },
];

export type RouteEntry = {
  title: string;
  question: string;
  evidence: string;
  reviewed: string;
  href: string;
};

export const evidenceRoute: RouteEntry[] = [
  {
    title: 'Start here',
    question:
      'What is the paper doing, and how should these notebooks be read?',
    evidence: 'Reader orientation',
    reviewed: '4 September 2026',
    href: links.notebooks.start,
  },
  {
    title: 'The public-intermediation problem',
    question:
      'Why do workers and capital markets value automation states differently?',
    evidence: 'Analytical result with an illustration',
    reviewed: '4 September 2026',
    href: links.notebooks.intermediation,
  },
  {
    title: 'Brownian valuation and payoff span',
    question:
      'Which risks can one public claim reach, and what remains outside it?',
    evidence: 'Analytical geometry with an illustration',
    reviewed: '4 September 2026',
    href: links.notebooks.span,
  },
  {
    title: 'Local dynamics and impulse responses',
    question: 'How is the transparent local model solved and checked?',
    evidence: 'Exploratory local computation; not a global solution',
    reviewed: '4 September 2026',
    href: links.notebooks.lq,
  },
  {
    title: 'The nonlinear Ramsey problem',
    question: 'How does the richer dynamic problem change the analysis?',
    evidence:
      'Formulation and pre-solve diagnostic; the equation is not yet solved',
    reviewed: '4 September 2026',
    href: links.notebooks.ramsey,
  },
  {
    title: 'Partial or full automation',
    question:
      'How is uncertainty over the future production regime represented?',
    evidence: 'Analytical rank result; numerical diagnostics withheld',
    reviewed: '4 September 2026',
    href: links.notebooks.poisson,
  },
  {
    title: 'Instruments and welfare',
    question:
      'When do taxes, safe positions and risky claims substitute for or complement one another?',
    evidence: 'Comparison design; no numerical welfare accepted',
    reviewed: '4 September 2026',
    href: links.notebooks.instruments,
  },
];

export type MatrixReadiness = {
  cell: string;
  qualitative: 'available';
  numerical: 'not yet accepted';
};

export const matrixReadiness = {
  asOf: '4 September 2026',
  summary:
    'All six qualitative statements are available and shown in the lab. No cell has an accepted numerical welfare comparison. The fixed-capital code that exists evaluates pre-announced rules and does not choose optimal policy, so it cannot fill the cells.',
  gates: [
    'An immutable, independently reviewed comparison bundle from the same inherited state in every cell.',
    'A solved nonlinear dynamic problem, or an accepted local substitute with stated error bounds.',
    'Coverage of the two-successor economy beyond the current reduced diagnostics.',
  ],
};

export const notReported = [
  {
    what: 'Calibrated magnitudes',
    why: 'No parameter in the paper is estimated or calibrated to a country.',
  },
  {
    what: 'An optimal tax rate or its sign',
    why: 'The tax result is a path identity whose sign depends on the discounted future tax base and the value of preserved capital.',
  },
  {
    what: 'Portfolio weights or an optimal fund size',
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

export const branches = [
  {
    name: 'The continuous-shock economy',
    role: 'The paper’s spine',
    covers:
      'Productivity and automation move continuously. One externally priced claim, safe finance, a gradually adjusting capital tax, worker welfare.',
    exact: 'The valuation result and the projection geometry.',
    local:
      'The leading position and the welfare values of claim access and of a second payoff.',
  },
  {
    name: 'The marked-event economy',
    role: 'An application of the same criterion',
    covers:
      'A single arrival selects a labour-using or a labour-light successor. Domestic installed-capital equity and a flow tax on rental income.',
    exact: 'The one-direction rank statement across the two successors.',
    local:
      'None claimed. Numerical diagnostics exist but are withheld from public results.',
  },
];

export const repositories = [
  {
    name: 'This website and the notebooks',
    role: 'Public home, notebooks, manifest, frozen exports',
    href: links.siteRepo,
    visibility: 'public',
  },
  {
    name: 'Continuous-shock implementation',
    role: 'Local, small-risk and earlier empirical code',
    href: links.implementation.brownian,
    visibility: 'public',
  },
  {
    name: 'Marked-event implementation',
    role: 'Two-successor branch',
    href: links.implementation.poisson,
    visibility: 'public',
  },
  {
    name: 'Full-automation programme',
    role: 'Labour-light, capital-only work',
    href: links.implementation.fullAutomation,
    visibility: 'public',
  },
  {
    name: 'Fixed-capital pricing exercises',
    role: 'Continuous-time methods with fixed aggregate capital',
    href: links.implementation.fixedCapital,
    visibility: 'public',
  },
  {
    name: 'Nonlinear five-state implementation',
    role: 'The nonlinear dynamic problem',
    href: undefined,
    visibility: 'private while under review',
  },
];
