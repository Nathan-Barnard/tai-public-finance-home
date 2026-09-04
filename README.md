# Automation Risk and the Public Balance Sheet

The public home of the research project *Automation Risk and the Public Balance
Sheet*. The [website](https://nathan-barnard.github.io/tai-public-finance-home/)
is a long-form visual argument about one idea: automation pays the people who own
it, and public ownership only helps workers when the public asset pays in the futures
where they are left behind. Seven guided Jupyter notebooks then
develop the models and computational route in depth.

> **Status:** the website is a complete visual essay with an interactive lab, a
> research library and a dated research dashboard. Its diagrams are editorial
> illustrations of a mechanism; none reports measured data, a forecast, a welfare
> figure or a policy estimate. The notebooks distinguish analytical results,
> exploratory computations and diagnostics, and withhold numerical claims that lack
> accepted evidence.

## The website

Four static routes, all built from the same content files:

| Route | What it is |
| --- | --- |
| `/` | The visual essay: full-viewport scenes, oversized interactive diagrams, an embedded lab |
| `/explore/` | The Public Balance Sheet Lab: change an automation shock and what the public asset pays, compare public tools |
| `/research/` | A quiet library: the paper, its diagrams, the notebooks, the technical model, the repositories |
| `/dashboard/` | A dated monitor of what is established, what is illustrative, what is not yet computed, and what is deliberately not reported |

The site is static. It has no sign-in, no server, no private API, no runtime
database, no tracking and no custom domain. Every route is prerendered to HTML and
hydrated by a small per-page bundle, so the pages read fully before JavaScript runs.

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
rendered pages for banned language, internal research identifiers and numbered
chapter ornaments. `npm run og` regenerates the social image and touch icon with
headless Chrome.

Every push to `main` runs the full check and deploys `dist/` to GitHub Pages through
`.github/workflows/deploy-pages.yml`.

### Layout

```text
index.html, explore/, research/, dashboard/, 404.html   route entries and metadata
src/entries/            one client entry per route
src/pages/              page assemblies
src/app/                shell, sticky navigation, progress rail, footer
src/components/         the scenes, diagrams, lab and library
src/content/            narrative content, verified links, library and dashboard data
src/lib/                payoff geometry and the lab model, with node:test tests
src/hooks/              media queries, in-view, scroll steps, tabs, autoplay
src/styles/             design tokens, typography, scene, lab and library styles
public/paper/           the paper and its online supplement (PDF)
public/fonts/           bundled Latin subsets of Fraunces, Inter and JetBrains Mono
scripts/                prerender, copy scan, social image
notebooks/              ordered reader notebooks and their manifest
notebooks/data/         compact frozen exports with source hashes and status
```

Narrative content lives in `src/content/story.ts` as a list of sections, each with a
visual specification; the components in `src/components/` draw them. Every payoff
diagram is computed from `src/lib/geometry.ts`, so a public position only ever moves
along a line and never rotates it.

## The notebooks

Open [`notebooks/00_start_here.ipynb`](notebooks/00_start_here.ipynb). GitHub renders
the Markdown, equations, code and saved output in the browser.

| Order | Notebook | Reader question | Evidence shown |
| ----: | --- | --- | --- |
| 0 | Start here | What is the paper doing, and how should these notebooks be read? | Reader orientation |
| 1 | [The public-intermediation problem](notebooks/01_public_intermediation_problem.ipynb) | Why do workers and capital markets value automation states differently? | Analytical, with illustration |
| 2 | [Brownian valuation and payoff span](notebooks/02_brownian_valuation_and_payoff_span.ipynb) | Which risks can one public claim reach, and what remains outside it? | Analytical geometry, with illustration |
| 3 | [LQ dynamics and impulse responses](notebooks/03_lq_dynamics_and_impulse_responses.ipynb) | How is the transparent local model solved and checked? | Exploratory local computation |
| 4 | [The nonlinear Ramsey problem](notebooks/04_nonlinear_ramsey_problem.ipynb) | How does the richer dynamic problem change the analysis? | Formulation and pre-solve diagnostic |
| 5 | [Partial or full automation](notebooks/05_partial_or_full_automation.ipynb) | How is uncertainty over the future production regime represented? | Analytical rank result; diagnostics withheld |
| 6 | [Instruments and welfare](notebooks/06_instruments_and_welfare.ipynb) | When do taxes, safe positions and risky claims substitute for or complement one another? | Comparison design; no numerical welfare yet |

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
python3 scripts/check_notebooks.py --execute
```

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
