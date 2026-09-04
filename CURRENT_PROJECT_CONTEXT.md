# Current project context

**Updated:** 4 September 2026

**State:** complete public website (visual essay, lab, library, dashboard) and the
complete seven-notebook route

## Purpose

This repository is the reader-facing home of *Automation Risk and the Public Balance
Sheet*. The website makes one argument impossible to miss: automation divides the
gains; ownership determines who participates; government can act for people without
claims; the public asset only works where it pays; one payoff reaches one direction;
saving, ownership and taxation act on different margins; a transformed economy may
need a broader public payoff menu. The notebooks then turn the models, solution
approaches, diagnostics and results into an ordered computational narrative.

## Current state

The website was rebuilt on 4 September 2026 as four prerendered static routes under
`/tai-public-finance-home/`: the visual essay, the Public Balance Sheet Lab, the
research library and a dated research dashboard. All diagrams are computed SVG; the
payoff diagrams use exact projection geometry. The site bundles its fonts, includes
the paper and supplement PDFs under `public/paper/`, and carries no sign-in, server,
database, tracking or custom domain.

Public copy is scanned on every build for banned language, internal research
identifiers and numbered ornaments. The lab and matrix show only qualitative
statements; the content model has room for validated figures cell by cell, and none
are entered.

The notebook route is unchanged: analytical and illustrative for the intermediation and
payoff-span notebooks; exploratory local computation for the local model; formulation
and pre-solve diagnostic for the nonlinear problem; an exact rank result with withheld
diagnostics for the two-successor case; and a comparison design without a numerical
welfare ranking for the instruments notebook.

## Next concrete step

As upstream work is promoted, update the existing notebook and the dashboard entry
rather than adding a rival result track. The highest-value upgrades remain a reviewed
local-model bundle, a corrected-provenance nonlinear stage, closed coverage of the
two-successor case, and an immutable, independently reviewed six-cell comparison
bundle. Every upgrade must replace the evidence label in `src/content/dashboard.ts` in
the same commit as its figures and data.
