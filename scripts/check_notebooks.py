#!/usr/bin/env python3
"""Validate notebook structure and confirm that Markdown converts to HTML."""

from __future__ import annotations

import json
from pathlib import Path
import sys

import nbformat
from nbconvert import HTMLExporter
from nbconvert.preprocessors import ExecutePreprocessor


ROOT = Path(__file__).resolve().parents[1]
NOTEBOOK_DIR = ROOT / "notebooks"
MANIFEST_PATH = NOTEBOOK_DIR / "manifest.json"


def load_manifest() -> dict:
    with MANIFEST_PATH.open(encoding="utf-8") as handle:
        manifest = json.load(handle)
    if manifest.get("schema_version") != 1:
        raise ValueError("notebooks/manifest.json must use schema_version 1")
    return manifest


def validate_manifest(manifest: dict) -> list[str]:
    errors: list[str] = []
    entries = manifest.get("notebooks")
    if not isinstance(entries, list) or not entries:
        return ["notebooks/manifest.json must contain a non-empty notebooks list"]

    orders = [entry.get("order") for entry in entries]
    if orders != list(range(len(entries))):
        errors.append("manifest notebook order must be consecutive and start at zero")

    paths = [entry.get("path") for entry in entries]
    if len(paths) != len(set(paths)):
        errors.append("manifest notebook paths must be unique")

    for entry in entries:
        missing = [
            key
            for key in ("order", "path", "title", "reader_question", "status")
            if key not in entry or entry[key] in (None, "")
        ]
        if missing:
            errors.append(f"manifest entry {entry!r} is missing: {', '.join(missing)}")
            continue
        path = ROOT / entry["path"]
        if entry["status"] != "planned" and not path.is_file():
            errors.append(f"available manifest notebook is missing: {entry['path']}")

    return errors


def validate_notebook(path: Path, execute: bool = False) -> list[str]:
    errors: list[str] = []
    relative = path.relative_to(ROOT)

    try:
        notebook = nbformat.read(path, as_version=4)
        nbformat.validate(notebook)
    except Exception as exc:  # nbformat exposes several validation exception types
        return [f"{relative}: invalid notebook: {exc}"]

    markdown_cells = [
        cell
        for cell in notebook.cells
        if cell.cell_type == "markdown" and cell.source.strip()
    ]
    if not markdown_cells:
        errors.append(f"{relative}: notebook has no substantive Markdown cells")
    elif not markdown_cells[0].source.lstrip().startswith("# "):
        errors.append(f"{relative}: first substantive Markdown cell must start with a level-one title")

    for index, cell in enumerate(notebook.cells):
        if cell.cell_type != "code" or not cell.source.strip():
            continue
        if index == 0:
            errors.append(f"{relative}: code cell 1 has no preceding Markdown explanation")
        else:
            previous = notebook.cells[index - 1]
            if previous.cell_type != "markdown" or len(previous.source.strip()) < 40:
                errors.append(
                    f"{relative}: substantive code cell {index + 1} must be immediately preceded "
                    "by a substantive Markdown explanation"
                )
        for output in cell.get("outputs", []):
            if output.get("output_type") == "error":
                errors.append(f"{relative}: code cell {index + 1} contains a stored execution error")

    tai_metadata = notebook.metadata.get("tai", {})
    for field in ("publication_status", "role", "last_reviewed"):
        if not tai_metadata.get(field):
            errors.append(f"{relative}: metadata.tai.{field} is required")

    if execute:
        try:
            executor = ExecutePreprocessor(timeout=120, kernel_name="python3")
            executor.preprocess(notebook, {"metadata": {"path": str(ROOT)}})
        except Exception as exc:
            errors.append(f"{relative}: clean execution failed: {exc}")

    try:
        html, _ = HTMLExporter().from_notebook_node(notebook)
        if "<h1" not in html:
            errors.append(f"{relative}: HTML conversion produced no level-one heading")
    except Exception as exc:
        errors.append(f"{relative}: HTML conversion failed: {exc}")

    return errors


def main() -> int:
    execute = "--execute" in sys.argv[1:]
    unknown = [argument for argument in sys.argv[1:] if argument != "--execute"]
    if unknown:
        print(f"ERROR: unknown arguments: {', '.join(unknown)}", file=sys.stderr)
        return 2
    try:
        manifest = load_manifest()
    except Exception as exc:
        print(f"ERROR: could not load notebook manifest: {exc}", file=sys.stderr)
        return 1

    errors = validate_manifest(manifest)
    notebooks = sorted(NOTEBOOK_DIR.glob("*.ipynb"))
    if not notebooks:
        errors.append("no notebooks found")
    for path in notebooks:
        errors.extend(validate_notebook(path, execute=execute))

    if errors:
        print("Notebook checks failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    execution_note = ", clean execution" if execute else ""
    print(
        f"Checked {len(notebooks)} notebooks: valid structure{execution_note} "
        "and HTML rendering."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
