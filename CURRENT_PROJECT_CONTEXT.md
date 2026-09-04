# Current project context

**Updated:** 4 September 2026

**State:** initial public scaffold

## Purpose

TAI Public Finance Home is the reader-facing computational companion to the paper. Its
job is to turn the important models, solution approaches, diagnostics, and results into
an ordered notebook narrative. It is deliberately separate from both the interactive
website and the repositories that own production solver code.

## Current state

The repository has a rendered start-here notebook, an authoring template, a public
notebook manifest, and a structural/HTML render check. No numerical paper result is
currently published here.

On 4 September 2026, the `main` branches of the five mapped implementation repositories
contained no `.ipynb` files. The initial task is therefore creation, not mechanical
collection: each notebook must wrap pinned upstream code or frozen accepted output and
explain it for a reader.

The source work currently spans:

- the Brownian, local-quadratic, small-risk, and earlier empirical code in
  `Nathan-Barnard/tai-public-finance`;
- the nonlinear five-state work in `Nathan-Barnard/tai-public-finance-ramsey-pde`;
- the marked-Poisson work in `Nathan-Barnard/tai-public-finance-poisson`;
- the small-open full-automation work in
  `Nathan-Barnard/tai-public-finance-full-automation`; and
- the fixed-capital state-dependent pricing work in
  `Nathan-Barnard/tai-public-finance-moll-ad-hoc`.

Several computational specifications remain draft or proposed, and not every external
run is suitable for a public quantitative claim. The notebook sequence may explain a
model or method before decision-grade results exist, but it must label such material as
analytical, illustrative, diagnostic, or provisional.

## Maintained notebook route

The route is recorded in [`notebooks/manifest.json`](notebooks/manifest.json). It begins
with the public-intermediation question, develops the Brownian valuation and payoff-span
logic, shows the local and nonlinear solution approaches, then turns to the Poisson
partial-versus-full-automation case and the policy comparison.

The first substantive notebook should be chosen for pedagogical value and evidentiary
readiness. The Brownian valuation-and-span notebook is likely the cleanest entry because
it carries the central mechanism without requiring the unresolved global nonlinear
calculations. That is a sequencing judgment, not a claim that its public export is
already ready.

## Next concrete step

For the first substantive notebook:

1. freeze the exact upstream repository and commit;
2. identify the exact model, specification, and admissible evidence;
3. define the reader question and the comparison held fixed;
4. expose a thin public API or a compact frozen export if the source repository lacks
   one;
5. write the explanation around the computation; and
6. execute, render, and compare the notebook output with its upstream evidence before
   changing its manifest state to published.
