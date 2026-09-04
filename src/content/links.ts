import { href } from '@/lib/paths';

// Every destination below was checked against the repository or GitHub on
// 4 September 2026. Nothing here is guessed.

const repo = 'https://github.com/Nathan-Barnard/tai-public-finance-home';
const notebookBase = `${repo}/blob/main/notebooks/`;

export const links = {
  siteRepo: repo,
  paper: href('paper/automation-risk-and-the-public-balance-sheet.pdf'),
  supplement: href(
    'paper/automation-risk-and-the-public-balance-sheet-supplement.pdf',
  ),
  notebooks: {
    start: `${notebookBase}00_start_here.ipynb`,
    intermediation: `${notebookBase}01_public_intermediation_problem.ipynb`,
    span: `${notebookBase}02_brownian_valuation_and_payoff_span.ipynb`,
    lq: `${notebookBase}03_lq_dynamics_and_impulse_responses.ipynb`,
    ramsey: `${notebookBase}04_nonlinear_ramsey_problem.ipynb`,
    poisson: `${notebookBase}05_partial_or_full_automation.ipynb`,
    instruments: `${notebookBase}06_instruments_and_welfare.ipynb`,
  },
  notebookIndex: `${repo}/tree/main/notebooks`,
  implementation: {
    brownian: 'https://github.com/Nathan-Barnard/tai-public-finance',
    poisson: 'https://github.com/Nathan-Barnard/tai-public-finance-poisson',
    fullAutomation:
      'https://github.com/Nathan-Barnard/tai-public-finance-full-automation',
    fixedCapital:
      'https://github.com/Nathan-Barnard/tai-public-finance-moll-ad-hoc',
  },
} as const;
