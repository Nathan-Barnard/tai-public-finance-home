# Notebook authoring guide

The notebooks form one guided argument. They are ordered by the questions a reader
needs answered, not by source repository or the date the code was written.

## Public sequence

[`manifest.json`](manifest.json) is the machine-readable index. A planned entry reserves
a reader question, not a claim or a filename that must be filled regardless of evidence.
Change the sequence when the paper's settled argument or computational readiness changes.

An `available` notebook may be analytical, illustrative, exploratory, or diagnostic.
Its visible evidence label determines what a reader may infer. Availability never
promotes an upstream computation.

## Required reader jobs

Use [`TEMPLATE.ipynb`](TEMPLATE.ipynb) as a starting point, not as a sequence of headings
to copy. A published notebook must do the following jobs, but it should combine and
order them around its own economic argument:

1. **Question and answer** — open with the economic problem and give the answer before
   the machinery.
2. **Model and comparison** — actors, inherited state `(S_0, M_0)`, choices, timing,
   closure, units, and what is held fixed.
3. **Computational route** — why this method is appropriate and which alternatives or
   failure modes matter.
4. **Implementation** — short, explained calls into pinned code or frozen data.
5. **Diagnostics** — residuals, feasibility, boundaries, benchmark comparisons, and any
   uncertainty needed for the displayed use.
6. **Economic interpretation** — mechanism, opposing force, and result scope.
7. **Reproduce and trace** — repository, commit, environment, specification, run/data
   provenance, and public download route.

Put a substantive Markdown cell immediately before each substantive code cell. Explain
what the code will calculate, why that calculation is needed, and how the output should
be read. Do not use Markdown merely to restate the code line by line. Avoid repeated
headings such as “Reader question,” “Answer in brief,” and “Current status” when a
substantive heading can name the economic object or conclusion instead.

## Markdown that renders on GitHub

- Use ordinary headings, paragraphs, lists, tables, links, fenced code blocks, and
  GitHub-supported LaTeX.
- Use `$...$` for inline mathematics and `$$...$$` for display mathematics.
- Keep images in tracked repository paths and give each image useful alternative text
  and a nearby caption or interpretation.
- Avoid MyST-only directives, notebook extensions, custom JavaScript, remote widgets,
  and raw HTML whose appearance is essential to the argument.
- Do not rely on a live kernel for the reader to see the main result. Commit compact
  successful outputs only after they have been reproduced from the pinned source.

Run `python3 scripts/check_notebooks.py` from the repository root. It validates every
notebook and converts it to HTML in memory, so malformed Markdown or unsupported notebook
structure is caught before publication.

Run `python3 scripts/check_notebooks.py --execute` for the full clean-
execution check used in continuous integration.

## Provenance metadata

Each result-bearing notebook should add these fields under `metadata.tai`:

```json
{
  "publication_status": "draft or published",
  "upstream_repository": "https://github.com/OWNER/REPOSITORY",
  "upstream_commit": "full Git commit",
  "computation_objects": ["CP...", "CS...", "RUN..."],
  "environment": "path to the pinned environment or lock",
  "last_reviewed": "YYYY-MM-DD"
}
```

Do not invent a run identifier when none exists. A notebook without accepted numerical
evidence may still teach a model or method, but its text and metadata must say so.
