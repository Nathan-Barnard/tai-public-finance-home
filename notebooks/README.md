# Notebook authoring guide

The notebooks form one guided argument. They are ordered by the questions a reader
needs answered, not by source repository or the date the code was written.

## Public sequence

[`manifest.json`](manifest.json) is the machine-readable index. A planned entry reserves
a reader question, not a claim or a filename that must be filled regardless of evidence.
Change the sequence when the paper's settled argument or computational readiness changes.

## Required narrative structure

Use [`TEMPLATE.ipynb`](TEMPLATE.ipynb) as the starting point. A published notebook should
contain these Markdown sections, adapted to the object rather than copied mechanically:

1. **Reader question** — the economic or computational question in plain language.
2. **Answer in brief** — what the notebook establishes and how strongly.
3. **Model and comparison** — actors, inherited state `(S_0, M_0)`, choices, timing,
   closure, units, and what is held fixed.
4. **Computational route** — why this method is appropriate and which alternatives or
   failure modes matter.
5. **Implementation** — short, explained calls into pinned code or frozen data.
6. **Diagnostics** — residuals, feasibility, boundaries, benchmark comparisons, and any
   uncertainty needed for the displayed use.
7. **Economic interpretation** — mechanism, opposing force, and result scope.
8. **Reproduce and trace** — repository, commit, environment, specification, run/data
   provenance, and public download route.

Put a substantive Markdown cell immediately before each substantive code cell. Explain
what the code will calculate, why that calculation is needed, and how the output should
be read. Do not use Markdown merely to restate the code line by line.

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
