# AI, Growth, and Who Gains

The public home of a research project on how AI might change who gains from
economic growth. The [website](https://nathan-barnard.github.io/tai-public-finance-home/)
sets out the question for a general reader, using historical evidence and an
economic model to examine how ownership, taxes and public investment shape who
benefits. Seven guided Jupyter notebooks then develop the models and the
computational route in depth.

The site takes no position on what AI will do. It distinguishes economic growth
from the distribution of that growth, and it separates worker income, investment
returns and government revenue, because history shows they need not move together.

> **Evidence boundary.** The research combines historical data with a theoretical
> model, and the numerical work is still in progress. The site therefore reports
> no calibrated fund size, policy forecast or estimated welfare gain. Its four
> historical exhibits are descriptive national comparisons; none identifies
> automation as the cause of a national outcome.

## The website

Four public routes, plus a secondary indicators page, all built from the same
content files:

| Route | What it is |
| --- | --- |
| `/` | The question, the four-way distribution split, the four evidence exhibits, what policy can change, and what the model adds |
| `/evidence/` | The same four exhibits at greater length, with sources and construction |
| `/explore/` | A thought experiment: choose how the gains are shared and how a public investment performs |
| `/research/` | The question, what evidence and the model can each show, the current boundary, and related research |
| `/dashboard/` | Longer-run indicators: the share of income going to labour, measures of automation, asset values, interest rates, government debt, work and wages |

The site is static. It has no sign-in, no server, no private API, no runtime
database, no tracking and no custom domain. Every route is prerendered to HTML
and hydrated by a small per-page bundle, so each page reads fully before any
JavaScript runs.

### The four evidence exhibits

Every figure is transcribed from the project's canonical descriptive evidence
record and is pinned by unit tests in `src/lib/content.test.ts`:

1. Worker outcomes in the United States and Germany when labour's share fell.
2. The composition of German tax revenue between the 2000–03 and 2004–07 averages.
3. Long-run total tax revenue in the United States, the United Kingdom and Germany.
4. Equity returns in historically worker-strong and worker-weak years.

### Development

Requires Node.js 22.18 or later and npm.

```bash
npm ci
npm run dev        # development server at http://localhost:5173/
npm run check      # lint, typecheck, unit tests, production build, copy scan
npm run preview    # serves the production build at /tai-public-finance-home/
```

`npm run build` runs the client build, a server build, and `scripts/prerender.mjs`,
which renders each route into its HTML file. `npm run check:copy` then scans the
rendered pages for removed sentences, paper terminology, excluded model numbers,
internal research identifiers, American spellings and numbered chapter ornaments.
`npm run data` refreshes the indicators from FRED, the World Bank, the IMF and
Our World in Data into `src/data/indicators.json`; a monthly workflow re-runs it.
`npm run og` regenerates the social image and touch icon.

Every push to `main` runs the full check and deploys `dist/` through
`.github/workflows/deploy-pages.yml`.

### Layout

```text
index.html, evidence/, explore/, research/, dashboard/, 404.html
                        route entries and metadata
src/entries/            one client entry per route
src/pages/              page assemblies
src/app/                shell, masthead, footer
src/components/         panels, exhibits, charts, the Explore interaction
src/content/            all public wording, verified links, exhibit copy
src/content/figures.ts  the exhibit figures, free of imports so tests can check them
src/data/               the frozen indicator series with provenance
src/lib/                paths and the content tests
src/styles/             tokens and typography, page styles, indicator styles
scripts/                prerender, copy scan, social image, indicator fetch
public/paper/           the paper and its five appendices
notebooks/              ordered reader notebooks and their manifest
```

Public wording lives in `src/content/` and nowhere else, so the components that
draw the site carry no copy.

## The notebooks

Open [`notebooks/00_start_here.ipynb`](notebooks/00_start_here.ipynb). GitHub
renders the Markdown, equations, code and saved output in the browser.

All seven notebooks render directly on GitHub. Some establish analytical relations;
others explain calculations that are still exploratory. The nonlinear policy and
matched welfare comparisons are not yet solved, and their notebooks stop where the
current evidence stops.

| Order | Notebook | Reader question | What is available |
| ----: | --- | --- | --- |
| 0 | [A computational guide](notebooks/00_start_here.ipynb) | What is the paper's central idea, and which notebook answers each part? | Reader orientation |
| 1 | [Why correct market prices do not settle public value](notebooks/01_public_intermediation_problem.ipynb) | Why can a government value a correctly priced claim differently from investors? | Conditional analysis with an illustration |
| 2 | [One claim hedges one direction](notebooks/02_brownian_valuation_and_payoff_span.ipynb) | Which risks can a public claim hedge, and what remains unspanned? | Analytical geometry with an illustration |
| 3 | [What the local model says after an automation displacement](notebooks/03_lq_dynamics_and_impulse_responses.ipynb) | What moves on impact, and how do capital and taxes adjust afterward? | Exploratory local computation |
| 4 | [The nonlinear policy problem—and what remains unsolved](notebooks/04_nonlinear_ramsey_problem.ipynb) | What must a nonlinear solver establish beyond the local approximation? | HJB formulation and pre-solve diagnostic |
| 5 | [One asset, two automation futures](notebooks/05_partial_or_full_automation.ipynb) | Why does one equity position fail to insure two possible successor economies? | Analytical rank result with diagnostic evidence |
| 6 | [What taxes, safe finance, and risky claims each buy](notebooks/06_instruments_and_welfare.ipynb) | Which matched welfare comparisons reveal substitution or complementarity? | Comparison design; numerical welfare withheld |

The sequence follows the paper's economic argument rather than the directory
structure of the source code.

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
python3 scripts/check_notebooks.py --execute
```

## The paper

The long-form working-paper set is in [`public/paper/`](public/paper) and described
in [`paper/README.md`](paper/README.md). The website links to the main paper and to
the descriptive-evidence appendix, which is the public source for the four exhibits.

## Source repositories

- [`tai-public-finance`](https://github.com/Nathan-Barnard/tai-public-finance): the
  continuous-shock, local, small-risk and earlier empirical implementation;
- [`tai-public-finance-poisson`](https://github.com/Nathan-Barnard/tai-public-finance-poisson):
  the two-successor marked-event branch;
- [`tai-public-finance-full-automation`](https://github.com/Nathan-Barnard/tai-public-finance-full-automation):
  the labour-light, capital-only programme;
- [`tai-public-finance-moll-ad-hoc`](https://github.com/Nathan-Barnard/tai-public-finance-moll-ad-hoc):
  fixed-capital state-dependent pricing exercises;
- `tai-public-finance-ramsey-pde`: the nonlinear five-state problem, private while
  under review.

Each result-bearing notebook names an exact repository commit and the corresponding
evidence. The list is a map, not permission to combine different model closures as
though they were one system.
