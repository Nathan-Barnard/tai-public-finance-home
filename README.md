# TAI Public Finance Home

This repository is the guided computational companion to the TAI public-finance paper.
It brings the important models and results into a single sequence of Jupyter
notebooks, explaining both **what the code is doing** and **why each computational step
is economically necessary**.

The aim is not to make readers reverse-engineer several implementation repositories.
A reader should be able to move from the economic question, through the model and
numerical method, to the resulting figures and interpretation while retaining a precise
route back to the underlying code and evidence.

> **Current status:** the complete seven-notebook reader route is live. The notebooks
> distinguish analytical results, illustrations, exploratory computations, diagnostic
> evidence, and unresolved quantitative objects. Availability means the explanation is
> complete and runnable; it does not promote draft computation to an accepted paper result.

## Start here

Open [`notebooks/00_start_here.ipynb`](notebooks/00_start_here.ipynb). GitHub renders
the Markdown, equations, code, and saved output directly in the browser.

The intended reading sequence is:

| Order | Notebook | Reader question | Current state |
|---:|---|---|---|
| 0 | Start here | What is the paper doing, and how should these notebooks be read? | Available |
| 1 | [Public intermediation problem](notebooks/01_public_intermediation_problem.ipynb) | Why do workers and capital markets value automation states differently? | Available — analytical/illustrative |
| 2 | [Brownian valuation and payoff span](notebooks/02_brownian_valuation_and_payoff_span.ipynb) | Which risks can a public claim hedge, and what remains unspanned? | Available — analytical/illustrative |
| 3 | [LQ dynamics and impulse responses](notebooks/03_lq_dynamics_and_impulse_responses.ipynb) | How is the transparent local model solved and checked? | Available — exploratory computation |
| 4 | [Nonlinear Ramsey problem](notebooks/04_nonlinear_ramsey_problem.ipynb) | How does the richer dynamic problem change the analysis? | Available — formulation/diagnostic |
| 5 | [Partial or full automation](notebooks/05_partial_or_full_automation.ipynb) | How is uncertainty over the future production regime represented? | Available — analytical/quarantined diagnostic |
| 6 | [Instruments and welfare](notebooks/06_instruments_and_welfare.ipynb) | When do taxes, safe positions, and risky claims substitute for or complement one another? | Available — comparison contract |

The sequence follows the paper's economic argument rather than the directory structure
of the source code.

## Source repositories

The notebooks will call or document exact versions of the project's public
implementation repositories:

- [`tai-public-finance`](https://github.com/Nathan-Barnard/tai-public-finance) — the
  legacy Brownian, LQ, small-risk, and empirical implementation repository;
- [`tai-public-finance-ramsey-pde`](https://github.com/Nathan-Barnard/tai-public-finance-ramsey-pde)
  — the nonlinear Ramsey PDE work;
- [`tai-public-finance-poisson`](https://github.com/Nathan-Barnard/tai-public-finance-poisson)
  — the marked-Poisson branch;
- [`tai-public-finance-full-automation`](https://github.com/Nathan-Barnard/tai-public-finance-full-automation)
  — the full-automation AK work; and
- [`tai-public-finance-moll-ad-hoc`](https://github.com/Nathan-Barnard/tai-public-finance-moll-ad-hoc)
  — the fixed-capital state-dependent pricing exercises.

Each result-bearing notebook will name an exact repository commit and the corresponding
model/specification and run evidence. The list above is a map, not permission to combine
different model closures as though they were one interchangeable system.

## Repository structure

```text
notebooks/                  ordered reader notebooks and their manifest
notebooks/data/             compact frozen exports with source hashes and status
scripts/check_notebooks.py  notebook-structure and Markdown-render check
scripts/refresh_frozen_exports.py  hash-checked export rebuild from upstream checkouts
.github/workflows/          the same check on GitHub
CURRENT_PROJECT_CONTEXT.md  maintained scope and next work
```

## Local use

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
python3 scripts/check_notebooks.py --execute
jupyter lab
```

The full check executes every notebook in memory and converts it to HTML as well as
validating its structure. Run `python3 scripts/check_notebooks.py` for the faster
structure-and-render-only check.

## Relationship to the interactive explorer

This repository is the long-form computational explanation. The separate
[`tai-public-finance-explorer`](https://github.com/Nathan-Barnard/tai-public-finance-explorer)
will provide the concise, interactive public interface. The explorer may use frozen
figures or compact data exports from published notebooks, but neither repository replaces
the underlying implementation and research records.
