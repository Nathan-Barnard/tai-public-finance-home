import { links } from './links';

export type LibraryItem = {
  title: string;
  description: string;
  format: string;
  updated?: string;
  href?: string;
  action: 'Read' | 'Download' | 'Open' | 'View';
  note?: string;
};

export type LibraryGroup = {
  id: string;
  title: string;
  intro?: string;
  items: LibraryItem[];
};

const reviewed = '4 September 2026';

export const libraryGroups: LibraryGroup[] = [
  {
    id: 'paper',
    title: 'The paper',
    intro:
      'Automation Risk and the Public Balance Sheet, by Nathan Barnard. A theoretical public-finance paper that prices one public payoff twice and asks which worker exposures the available assets can reach.',
    items: [
      {
        title: 'Automation Risk and the Public Balance Sheet',
        description:
          'The article, with the model, the valuation result, the payoff-span geometry, the tax-timing result, the two-successor application and five appendices.',
        format: 'PDF, draft, September 2026',
        updated: reviewed,
        href: links.paper,
        action: 'Read',
      },
      {
        title: 'Online theory supplement',
        description:
          'Five short modules on the production branch, commitment and feasibility, the local capital and tax dynamics, richer payoff menus, and the accounting behind the two-successor application.',
        format: 'PDF, draft, September 2026',
        updated: reviewed,
        href: links.supplement,
        action: 'Read',
      },
    ],
  },
  {
    id: 'diagrams',
    title: 'The argument in diagrams',
    intro:
      'The paper’s figures, rebuilt as the large interactive scenes of the visual essay.',
    items: [
      {
        title: 'Same worker loss, asset pays versus asset misses',
        description:
          'Two lanes with the same shortfall for workers and a different payoff from the public asset.',
        format: 'Interactive scene',
        href: 'home:one-pays-one-misses',
        action: 'View',
      },
      {
        title: 'Relative public-versus-market valuation',
        description:
          'The one equation, with each term explained in ordinary language.',
        format: 'Interactive scene',
        href: 'home:theta',
        action: 'View',
      },
      {
        title: 'Payoff projection and the unreached remainder',
        description:
          'The dark payoff-space theatre: a position moves along a line and never turns it.',
        format: 'Interactive scene',
        href: 'home:payoff-space',
        action: 'View',
      },
      {
        title: 'Immediate asset payoff versus later tax transition',
        description: 'A timeline that reveals impact before transition.',
        format: 'Interactive scene',
        href: 'home:impact-and-transition',
        action: 'View',
      },
      {
        title: 'One position across two successor economies',
        description:
          'A fork between a labour-using future and a labour-light future, with one position constrained to one line.',
        format: 'Interactive scene',
        href: 'home:future',
        action: 'View',
      },
    ],
  },
  {
    id: 'figures',
    title: 'Interactive figures',
    items: [
      {
        title: 'The Public Balance Sheet Lab',
        description:
          'Change the distribution of an automation shock and what the public asset pays, then compare the public tools.',
        format: 'Interactive model, in the browser',
        href: 'route:explore',
        action: 'Open',
      },
      {
        title: 'Research dashboard',
        description:
          'What has been established, what is illustrative, what is still being computed, and what is deliberately not reported.',
        format: 'Dated monitor',
        href: 'route:dashboard',
        action: 'Open',
      },
    ],
  },
  {
    id: 'notebooks',
    title: 'Public notebooks',
    intro:
      'Seven guided Jupyter notebooks that walk from the economic question to the models, the computational methods and the evidence behind each displayed result. GitHub renders them in the browser.',
    items: [
      {
        title: 'Start here',
        description: 'What the paper is doing and how to read the notebooks.',
        format: 'Jupyter notebook',
        updated: reviewed,
        href: links.notebooks.start,
        action: 'Open',
      },
      {
        title: 'The public-intermediation problem',
        description:
          'Why a government can have a useful portfolio role even when markets price the available claim correctly.',
        format: 'Jupyter notebook, analytical with illustration',
        updated: reviewed,
        href: links.notebooks.intermediation,
        action: 'Open',
      },
      {
        title: 'Brownian valuation and payoff span',
        description:
          'One payoff supplies one direction in shock space; a second independent payoff completes the plane.',
        format: 'Jupyter notebook, analytical geometry with illustration',
        updated: reviewed,
        href: links.notebooks.span,
        action: 'Open',
      },
      {
        title: 'Local dynamics and impulse responses',
        description:
          'How the transparent local model is solved and checked, and what moves gradually after an automation displacement.',
        format: 'Jupyter notebook, exploratory local computation',
        updated: reviewed,
        href: links.notebooks.lq,
        action: 'Open',
      },
      {
        title: 'The nonlinear Ramsey problem',
        description:
          'The five-state dynamic problem and what must be verified before a numerical solver can say anything about policy.',
        format: 'Jupyter notebook, formulation and diagnostic',
        updated: reviewed,
        href: links.notebooks.ramsey,
        action: 'Open',
      },
      {
        title: 'Partial or full automation',
        description:
          'How uncertainty over the future production regime changes what public equity can reach.',
        format: 'Jupyter notebook, analytical rank result with diagnostics',
        updated: reviewed,
        href: links.notebooks.poisson,
        action: 'Open',
      },
      {
        title: 'Instruments and welfare',
        description:
          'When taxes, safe positions and risky claims substitute for or complement one another, and what current code can and cannot say about welfare.',
        format: 'Jupyter notebook, comparison design',
        updated: reviewed,
        href: links.notebooks.instruments,
        action: 'Open',
      },
    ],
  },
  {
    id: 'model',
    title: 'Technical model',
    intro:
      'Compact descriptions for readers who want the machinery. Each corresponds to a chapter of the essay, where the same material sits in a disclosure beneath the visual.',
    items: [
      {
        title: 'The continuous-shock economy',
        description:
          'A small open economy with hand-to-mouth workers, privately owned domestic capital, two continuous shocks to productivity and the task range capital can perform, one externally priced risky claim, safe finance, and a capital-income tax that changes only gradually. Worker welfare is the objective.',
        format: 'Model branch',
        href: links.paper,
        action: 'Read',
      },
      {
        title: 'Pricing one payoff twice',
        description:
          'The market prices the claim with its own valuation of each future; the government values the same payoff by what it changes for workers. At an interior optimum the two agree along the traded payoff and can disagree in the orthogonal direction.',
        format: 'Main result',
        href: links.paper,
        action: 'Read',
      },
      {
        title: 'The small-risk decomposition',
        description:
          'The leading public position splits into ordinary return demand and a part that offsets worker-resource exposure. The remainder outside the payoff span determines the leading welfare value of an additional payoff.',
        format: 'Local approximation',
        href: links.paper,
        action: 'Read',
      },
      {
        title: 'The marked-event economy',
        description:
          'A single arrival selects a labour-using or a labour-light successor. One inherited equity payoff supplies one transfer direction across the two, an exact rank statement that is not by itself a welfare or implementation result.',
        format: 'Application',
        href: links.paper,
        action: 'Read',
      },
    ],
  },
  {
    id: 'repository',
    title: 'Repository',
    intro:
      'The code behind this website and the notebooks, plus the implementation repositories that own the solvers and run evidence.',
    items: [
      {
        title: 'This website and the notebooks',
        description:
          'The public home of the project: site source, the seven notebooks, their manifest and the compact frozen exports.',
        format: 'GitHub repository',
        href: links.siteRepo,
        action: 'View',
      },
      {
        title: 'Continuous-shock implementation',
        description:
          'Numerical implementation and calibration work for the continuous-shock economy, including the local and small-risk calculations.',
        format: 'GitHub repository',
        href: links.implementation.brownian,
        action: 'View',
      },
      {
        title: 'Marked-event implementation',
        description: 'The two-successor marked-event branch.',
        format: 'GitHub repository',
        href: links.implementation.poisson,
        action: 'View',
      },
      {
        title: 'Full-automation programme',
        description: 'The labour-light, capital-only research programme.',
        format: 'GitHub repository',
        href: links.implementation.fullAutomation,
        action: 'View',
      },
      {
        title: 'Fixed-capital pricing exercises',
        description:
          'A numerical sandbox for continuous-time methods on the model with fixed aggregate capital.',
        format: 'GitHub repository',
        href: links.implementation.fixedCapital,
        action: 'View',
      },
      {
        title: 'Nonlinear five-state implementation',
        description: 'The nonlinear dynamic problem.',
        format: 'GitHub repository, private while under review',
        action: 'View',
        note: 'Not yet public, so no link is given.',
      },
    ],
  },
];
