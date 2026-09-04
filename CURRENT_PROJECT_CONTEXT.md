# Current project context

**Updated:** 4 September 2026

**State:** complete first public notebook sequence; public website added

## Purpose

TAI Public Finance Home is the reader-facing companion to the paper. Its public website
introduces the question, mechanism, policy tools, and evidence boundary in ordinary
language. The notebooks then turn the important models, solution approaches,
diagnostics, and results into an ordered computational narrative. The repository remains
separate from those that own production solver code.

## Current state

The repository has a static GitHub Pages website and a complete seven-notebook route,
with an authoring template, a public manifest, compact provenance-bearing exports, and
structural, execution, and HTML render checks. The website requires no account or
sign-in. Its current diagrams are synthetic illustrations, not empirical estimates.

On 4 September 2026, the `main` branches of the five mapped implementation repositories
contained no `.ipynb` files. The notebooks were therefore written here as thin public
interfaces to pinned code, compact frozen exports, and explicit evidence-status records.

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

## Maintained notebook route and evidence boundary

The route is recorded in [`notebooks/manifest.json`](notebooks/manifest.json). It begins
with the public-intermediation question, develops the Brownian valuation and payoff-span
logic, shows the local and nonlinear solution approaches, then turns to the Poisson
partial-versus-full-automation case and the policy comparison.

The route is now fully available. “Available” describes a complete runnable explanation,
not an accepted quantitative claim. The public-intermediation and payoff-span notebooks
are analytical/illustrative. The LQ notebook exposes a frozen exploratory local run. The
nonlinear notebook stops at the implemented pre-solve diagnostic. The Poisson notebook
contains an exact rank argument and quarantine-affected run-status evidence. The final
notebook records the matched comparison required for welfare while withholding numerical
rankings that lack an immutable, independently accepted evidence bundle.

## Next concrete step

As upstream work is promoted, update the existing notebook rather than adding a rival
result track. The highest-value upgrades are: a fingerprinted and reviewed CS001 bundle;
a corrected-provenance nonlinear evaluator/PDE stage; closed CP005 coverage and inherited-
state matching; and an immutable, independently reviewed fixed-policy or Brownian
six-cell welfare bundle. Every upgrade must retain the current comparison contract and
replace the evidence-status label in the same commit as its figures and data.
