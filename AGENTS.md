# TAI Public Finance Home — operating guide

## Purpose

This repository is the public, reader-facing home for the TAI public-finance project.
The GitHub Pages site gives a concise, interactive introduction; an ordered set of
Jupyter notebooks explains the models and computational choices in depth. Both are
presentation and reproduction layers, not the canonical owners of the economics,
computational specifications, solver code, or run evidence.

## Start here

1. Read [`README.md`](README.md) for the audience, notebook route, and setup.
2. Read [`CURRENT_PROJECT_CONTEXT.md`](CURRENT_PROJECT_CONTEXT.md) for the present
   scope and upstream repository map.
3. For website work, treat `src/content/` as the single source of public wording and
   verified links, and keep visual components in `src/components/` free of copy.
4. Read [`notebooks/README.md`](notebooks/README.md) before creating or revising a
   notebook.
5. Inspect the exact upstream repository, commit, computation object, and frozen data
   named in the notebook metadata before changing code or interpretation.

## Ownership and boundaries

- This repository owns notebook order, reader explanations, thin notebook code,
  publication metadata, and render checks.
- This repository also owns the public interface, release-ready website copy,
  illustration assets, the bundled paper PDFs, static build, and GitHub Pages
  deployment. Public copy must pass `npm run check:copy`: no insurance vocabulary,
  no internal research identifiers, no numbered chapter ornaments, and none of the
  phrases the scan lists.
- The upstream implementation repositories own model code, solvers, tests, dependency
  locks, and immutable computational evidence. Do not fork a solver into a notebook.
- The research workspace owns claims, assumptions, assurance status, computational
  specifications, and result-use decisions. A notebook may explain or reproduce a
  frozen public object; it may not promote a provisional result.
- The interactive homepage may consume selected frozen outputs from the notebooks. It
  does not become the owner of their numerical provenance. Internal research IDs and
  unpublished-source metadata remain outside the public website bundle.

If a notebook uncovers a discrepancy, preserve the observation and route the correction
upstream. Do not silently repair a result only in the explanatory notebook.

## Notebook standard

Every published notebook must:

1. ask a clear economic or computational question and give the answer in ordinary
   language before exposing machinery;
2. state the model branch, comparison, units, timing, what is held fixed, and the
   evidence status of displayed results;
3. place a substantive Markdown explanation immediately before every substantive code
   cell, explaining what the code will do and why it matters;
4. use GitHub-renderable Markdown and LaTeX, avoiding MyST-only directives, custom
   JavaScript, or local-image paths that cannot render on GitHub;
5. call a pinned upstream package or load a frozen, hashed export rather than duplicate
   model primitives or solver logic;
6. include the upstream repository URL and commit, relevant computation/specification
   identifiers, environment reference, and data or run provenance in notebook metadata;
7. keep enough successful output for a GitHub reader to see the result without running
   the notebook, while excluding bulky, private, or machine-specific artifacts; and
8. end with the economic interpretation, main limitation, and exact reproduction path.

The ordered public sequence is recorded in [`notebooks/manifest.json`](notebooks/manifest.json).
Change that manifest in the same commit when a notebook is added, renamed, published,
superseded, or withdrawn.

## Validation

For the website, use Node.js 22.18 or later:

```bash
npm ci
npm run check
```

`check` runs lint, typecheck, the geometry and lab-model tests, the prerendered
production build and the public-copy scan. Preview the production build at its
subpath with `npm run preview`, or develop with `npm run dev`. A push to `main`
deploys the resulting static `dist/` directory through
`.github/workflows/deploy-pages.yml`.

For the notebooks, set up a fresh Python environment with:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
```

Run the fast structural and render check with:

```bash
python3 scripts/check_notebooks.py
```

Run the full clean-execution and render check with:

```bash
python3 scripts/check_notebooks.py --execute
```

Preview notebooks locally with:

```bash
jupyter lab
```

The structural check establishes valid notebook JSON, required narrative placement,
absence of stored execution errors, agreement with the manifest, and successful HTML
conversion. The full check also establishes that every notebook executes cleanly from
the repository root. Neither check establishes that upstream model code is correct or
that a numerical result is fit for publication; result use must still agree with its
frozen upstream evidence and review status.

## Worktrees and shared resources

Use one branch and one Git worktree per write-enabled task. One writer owns the website
entrypoint and release content; one writer owns the manifest and any notebook being
revised. Parallel read-only review is fine. Serialize changes to the same interface,
notebook, dependency file, or workflow. Use task-specific ports for local web or Jupyter
previews when more than one worktree is active.

## Worktree readiness

The repository is self-contained. A fresh worktree needs only tracked files plus the
Node and Python dependency-install commands above. No ignored configuration, database,
container, secret, or `.worktreeinclude` is required. The committed compact exports are
sufficient for clean notebook execution; refreshing them requires separate local
checkouts of the named upstream repositories.

## Completion

A website change is complete when `npm run check` passes, its public claims remain
below the release ceiling, every diagram keeps a text alternative and a reduced-motion
final state, the layout holds at 320, 390, 768, 1024 and 1440 pixels without
horizontal overflow, and the GitHub Pages URL loads without a sign-in. A notebook change is complete when its Markdown and outputs render, its code
runs from the declared environment, every displayed result resolves to a pinned public
source, the interpretation matches the exact model branch and status, and the manifest
and reader route remain accurate.
