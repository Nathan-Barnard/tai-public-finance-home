import { href } from '@/lib/paths';

// Every destination was checked against the repository, the published PDFs or
// GitHub on 4 September 2026. Nothing here is guessed.

const repo = 'https://github.com/Nathan-Barnard/tai-public-finance-home';

export const links = {
  /** The long-form working paper. */
  paper: href('paper/automation-capital-taxation-public-insurance.pdf'),
  /** The public descriptive-evidence document behind the four exhibits. */
  dataNotebook: href('paper/appendix-descriptive-evidence.pdf'),
  /** The guided model notebooks, rendered by GitHub. */
  modelNotebook: `${repo}/blob/main/notebooks/00_start_here.ipynb`,
  notebookIndex: `${repo}/tree/main/notebooks`,
  code: repo,
  /** Sources and construction notes live at the foot of the Evidence page. */
  sources: `${href('evidence/')}#sources`,
  appendices: {
    theory: href('paper/appendix-theory.pdf'),
    extended: href('paper/appendix-extended.pdf'),
    computation: href('paper/appendix-computation.pdf'),
    eventArrival: href('paper/appendix-event-arrival.pdf'),
  },
} as const;
