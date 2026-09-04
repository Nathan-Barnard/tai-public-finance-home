# TAI Public Finance Home — operating guide

## Purpose

This repository is the public, reader-facing notebook home for the TAI public-finance
project. It explains the models, computational choices, and accepted results through an
ordered set of Jupyter notebooks. It is a presentation and reproduction layer, not the
canonical owner of the economics, computational specifications, solver code, or run
evidence.

## Start here

1. Read [`README.md`](README.md) for the audience, notebook route, and setup.
2. Read [`CURRENT_PROJECT_CONTEXT.md`](CURRENT_PROJECT_CONTEXT.md) for the present
   scope and upstream repository map.
3. Read [`notebooks/README.md`](notebooks/README.md) before creating or revising a
   notebook.
4. Inspect the exact upstream repository, commit, computation object, and frozen data
   named in the notebook metadata before changing code or interpretation.

## Ownership and boundaries

- This repository owns notebook order, reader explanations, thin notebook code,
  publication metadata, and render checks.
- The upstream implementation repositories own model code, solvers, tests, dependency
  locks, and immutable computational evidence. Do not fork a solver into a notebook.
- The research workspace owns claims, assumptions, assurance status, computational
  specifications, and result-use decisions. A notebook may explain or reproduce a
  frozen public object; it may not promote a provisional result.
- The interactive explorer may consume selected frozen outputs from this repository.
  It does not become the owner of the notebooks or their numerical provenance.

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

Set up a fresh environment with:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
```

Run the fast structural and render check with:

```bash
python3 scripts/check_notebooks.py
```

Preview notebooks locally with:

```bash
jupyter lab
```

The structural check establishes valid notebook JSON, required narrative placement,
absence of stored execution errors, agreement with the manifest, and successful HTML
conversion. It does not establish that model code is correct or that a numerical result
is fit for publication. A result-bearing notebook also needs clean execution from the
pinned environment and agreement with its frozen upstream evidence.

## Worktrees and shared resources

Use one branch and one Git worktree per write-enabled task. One writer owns the manifest
and any notebook being revised. Parallel read-only review is fine; serialize changes to
the same notebook, dependency file, or workflow. Use task-specific ports for Jupyter
when more than one worktree is active.

## Worktree readiness

The repository is self-contained for its present scaffold. A fresh worktree needs only
tracked files plus the dependency-install command above. No ignored configuration,
database, container, secret, or `.worktreeinclude` is required. The fast and full check
are currently the same command because the repository contains only the reader guide
and notebook template; add notebook-specific execution commands when substantive
notebooks arrive.

## Completion

A notebook change is complete when its Markdown and outputs render, its code runs from
the declared environment, every displayed result resolves to a pinned public source,
the interpretation matches the exact model branch and status, and the manifest and
reader route remain accurate.
