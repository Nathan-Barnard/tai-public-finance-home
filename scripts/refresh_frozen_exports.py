#!/usr/bin/env python3
"""Rebuild compact notebook exports from the pinned upstream evidence bundles.

This script is intentionally not run in CI: it requires local checkouts of the
implementation repositories. The committed JSON files are the portable public
exports consumed by the notebooks.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "notebooks" / "data"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require_hash(path: Path, expected: str) -> None:
    actual = sha256(path)
    if actual != expected:
        raise ValueError(f"{path} has SHA-256 {actual}, expected {expected}")


def write_json(name: str, payload: dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    destination = DATA_DIR / name
    destination.write_text(
        json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(f"wrote {destination.relative_to(ROOT)}")


def build_lq_export(root: Path) -> None:
    output = root / "outputs" / "cs001-lq-anchor-baseline-repair-01"
    summary_path = output / "summary.md"
    findings_path = output / "FINDINGS.md"
    matrix_path = output / "matrices" / "A_closed_loop.csv"
    grid_path = output / "portfolio_net_worth_grid.csv"
    run_path = root / "runs" / "RUN-20260901T194938Z-CS001-d876a61e-01.yaml"

    require_hash(
        summary_path,
        "655ec87d028842b5d5072f4917745447404168afdac97df3cf6d65bd97de9b82",
    )
    require_hash(
        findings_path,
        "4e4070307a5fe6adeb86a917914012a3631cfde09538ba4001b63e6e2b655054",
    )
    require_hash(
        matrix_path,
        "02b57ade7014b7524bab130725adbb8c64a7509003daf05b1710b6475275f467",
    )
    require_hash(
        grid_path,
        "22088c317b596dfd3c64432c64838794dce05c4a7019e58c0fd89642a53b19bb",
    )
    require_hash(
        run_path,
        "beeaf9092b42e158e95570d59776c1cc38674d80632c0096745a6ed679a42851",
    )

    matrix_rows = list(csv.DictReader(matrix_path.open(encoding="utf-8", newline="")))
    coordinates = [row["coordinate"] for row in matrix_rows]
    closed_loop_matrix = [
        [float(row[column]) for column in coordinates] for row in matrix_rows
    ]
    grid_rows = list(csv.DictReader(grid_path.open(encoding="utf-8", newline="")))
    baseline = next(
        row for row in grid_rows if float(row["public_net_worth_to_fiscal_wealth"]) == 0.0
    )
    payload = {
        "schema_version": 1,
        "result_use_status": "exploratory_only",
        "scope": (
            "Illustrative local Brownian LQ anchor and leading-small-risk calculation; "
            "not a global Ramsey solution or a finite-risk welfare result."
        ),
        "source": {
            "repository": "https://github.com/Nathan-Barnard/tai-public-finance",
            "public_container_commit": "971cab12986bce99c23a291fd62a5cde66ffa01a",
            "implementation_commit": "d876a61ef593737c2cfbd6f758192c0f390318ab",
            "run_id": "RUN-20260901T194938Z-CS001-d876a61e-01",
            "specification": {"id": "CS001", "version": "0.1", "status": "draft"},
            "artifacts": {
                "summary.md": {
                    "path": "outputs/cs001-lq-anchor-baseline-repair-01/summary.md",
                    "sha256": sha256(summary_path),
                    "public_upstream": True,
                },
                "FINDINGS.md": {
                    "path": "outputs/cs001-lq-anchor-baseline-repair-01/FINDINGS.md",
                    "sha256": sha256(findings_path),
                    "public_upstream": True,
                },
                "A_closed_loop.csv": {
                    "path": "outputs/cs001-lq-anchor-baseline-repair-01/matrices/A_closed_loop.csv",
                    "sha256": sha256(matrix_path),
                    "public_upstream": True,
                },
                "portfolio_net_worth_grid.csv": {
                    "path": "outputs/cs001-lq-anchor-baseline-repair-01/portfolio_net_worth_grid.csv",
                    "sha256": sha256(grid_path),
                    "public_upstream": True,
                },
                "run_record": {
                    "path": "runs/RUN-20260901T194938Z-CS001-d876a61e-01.yaml",
                    "sha256": sha256(run_path),
                    "public_upstream": True,
                },
            },
            "transformation": (
                "Copied the tracked closed-loop matrix and the zero-public-net-worth "
                "row; transcribed named diagnostics and corrected interpretation values "
                "from the hash-verified public summary and findings files."
            ),
        },
        "closed_loop_system": {
            "coordinates": coordinates,
            "matrix": closed_loop_matrix,
        },
        "baseline": {
            key: float(baseline[key])
            for key in (
                "public_net_worth_to_fiscal_wealth",
                "public_net_worth",
                "comprehensive_resources",
                "worker_consumption",
                "wage_income",
                "transfer",
            )
        },
        "portfolio_decomposition": {
            "leading_constrained_position": float(baseline["leading_constrained_position"]),
            "return_demand_component": float(baseline["return_demand_component"]),
            "fiscal_hedge_component": float(baseline["fiscal_hedge_component"]),
            "marketed_fiscal_wealth_amount": float(
                baseline["marketed_fiscal_wealth_amount"]
            ),
        },
        "diagnostics": {
            "riccati_scaled_residual": 1.159e-16,
            "sylvester_scaled_residual": 6.322e-17,
            "discounted_lyapunov_scaled_residual": 1.608e-17,
            "closed_loop_stability_margin": 0.076027776479,
        },
        "public_reporting_correction": {
            "automation_claim_no_claim_consumption_gap": 2.752428e-05,
            "gap_horizon_years": [0.0, 40.0],
            "interpretation": (
                "The public FINDINGS.md reports this gap as constant across all 161 "
                "horizons to 1e-11; raw IRF rows are intentionally not republished here."
            ),
        },
    }
    write_json("cs001_lq_snapshot.json", payload)


def build_pde_export(root: Path) -> None:
    summary_path = root / "outputs" / "cs004-block1-primitive-domain-screen" / "summary.json"
    config_path = root / "configs" / "cs004" / "broad_pde_feasibility_v1.json"
    require_hash(
        summary_path,
        "6b2aab6ed22647aae20880cb0204e4c9a6d50a17498b8169aeabc0b4ace1b958",
    )
    require_hash(
        config_path,
        "b060925f4327a1464dc12320aba0271d3411db1ae3d05e42406d5cc11a8296cd",
    )
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    checks = {
        item["name"]: item["computed"]
        for item in summary["benchmark_comparison"]["checks"]
    }
    payload = {
        "schema_version": 1,
        "result_use_status": "exploratory_only",
        "disposition": "diagnose_before_scaling",
        "scope": (
            "Pre-solve primitive and sampled-domain diagnostic for an illustrative "
            "five-state box; not a nonlinear HJB solution or policy result."
        ),
        "source": {
            "repository": "https://github.com/Nathan-Barnard/tai-public-finance-ramsey-pde",
            "public_container_commit": "b287168c8593a5110ca52eb8bc19890f76fbb85b",
            "screen_implementation_commit": "8815c82e980b87a892bbb30860e9bb83acdf87ed",
            "run_recorded_commit": "2713208",
            "provenance_warning": (
                "The run record names an older commit than the final frozen screen "
                "implementation, so the run is not accepted evidence."
            ),
            "run_id": summary["run_id"],
            "specification": {
                "id": summary["spec_id"],
                "version": summary["spec_version"],
                "status": "draft",
            },
            "artifacts": {
                "summary.json": {
                    "path": "outputs/cs004-block1-primitive-domain-screen/summary.json",
                    "sha256": sha256(summary_path),
                },
                "configuration": {
                    "path": "configs/cs004/broad_pde_feasibility_v1.json",
                    "sha256": sha256(config_path),
                },
            },
        },
        "design_summary": summary["design_summary"],
        "nonfinite_point_count": summary["nonfinite_point_count"],
        "sign_violations": summary["sign_violations"],
        "margin_violations": summary["margin_violations"],
        "sampled_minima": {
            "central_specialisation_automation": checks[
                "central_min_specialisation_margin_automation_composite"
            ],
            "central_specialisation_new_task": checks[
                "central_min_specialisation_margin_new_task_composite"
            ],
            "buffer_specialisation_automation": checks[
                "buffer_min_specialisation_margin_automation_composite"
            ],
            "buffer_specialisation_new_task": checks[
                "buffer_min_specialisation_margin_new_task_composite"
            ],
            "buffer_beta_I_dense_min": checks["buffer_beta_I_min (dense 1-D x-scan)"],
            "buffer_beta_I_dense_max": checks["buffer_beta_I_max (dense 1-D x-scan)"],
        },
        "reference_floor": {
            "formula": summary["reference_floor"]["formula"],
            "eta_sol": 0.01,
            "central_fraction_meeting": summary["reference_floor"][
                "eta_sol_sensitivity"
            ]["0.01"]["central_fraction_meeting"],
            "caveat": summary["reference_floor"]["caveat"],
        },
        "classification": summary["classification"],
        "environment": summary["environment"],
    }
    write_json("cs004_presolve_snapshot.json", payload)


def build_poisson_export(root: Path) -> None:
    report_path = root / "outputs" / "cs005-w5-strict-viability" / "report.json"
    tail_path = root / "outputs" / "cs005-pm08-tail-certificate" / "report.json"
    run_path = root / "runs" / "RUN-20260902T220418Z-CS005-5a264b83-01.yaml"
    require_hash(
        report_path,
        "bcccd8046cd30c6801a4d6ad0055cb3f48c7853ed57bcc7f24f916acece74980",
    )
    require_hash(
        tail_path,
        "95bb8de362114521b3b873c20ac8e5307fbdd05d18365b1c193e55144353d034",
    )
    require_hash(
        run_path,
        "40c717b2e39ca79958ea2d40f594e151f8494c652596489d2abd36079347f0f0",
    )
    report = json.loads(report_path.read_text(encoding="utf-8"))
    candidates = report["candidates"]
    payload = {
        "schema_version": 1,
        "result_use_status": "exploratory_diagnostic",
        "disposition": "quarantine_affected",
        "scope": (
            "Reduced-coverage marked-Poisson candidate diagnostics. Candidate counts "
            "are shown only to explain why no quantitative policy result is reported."
        ),
        "source": {
            "repository": "https://github.com/Nathan-Barnard/tai-public-finance-poisson",
            "public_commit": "74c736f8753e65f444eb30443a16adbb62f9c35c",
            "run_implementation_commit": "5a264b836ecdfd8e22c868b38680ec8435545fc4",
            "run_id": report["run_id"],
            "specification": {"id": "CS005", "status": "draft"},
            "artifacts": {
                "w5_report": {
                    "path": "outputs/cs005-w5-strict-viability/report.json",
                    "sha256": sha256(report_path),
                },
                "pm08_report": {
                    "path": "outputs/cs005-pm08-tail-certificate/report.json",
                    "sha256": sha256(tail_path),
                },
                "run_record": {
                    "path": "runs/RUN-20260902T220418Z-CS005-5a264b83-01.yaml",
                    "sha256": sha256(run_path),
                },
            },
        },
        "candidate_atlas": {
            "candidate_count": len(candidates),
            "fully_admissible_count": sum(bool(item.get("admissible")) for item in candidates),
            "pre_w5_admissible_count": sum(
                bool(item.get("admissible_ex_w5")) for item in candidates
            ),
            "matched_inherited_state_count": 0,
            "strict_viability_label_counts": report["strict_viability_label_counts"],
        },
        "pm08_tail_tolerance": 1e-8,
        "pm08_tail_certificate_pass": report["pm08_cs005_tolerance_pass"],
        "missing_gates": [
            "full root coverage",
            "W2 payoff-rank diagnostics",
            "W3 tax-span cone",
            "W4 fixed-mark diagnostic",
            "closed W5 fiscal frontier",
            "date-zero inherited-state solution",
            "bound and fingerprinted CS005 specification",
        ],
    }
    write_json("cs005_poisson_status_snapshot.json", payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--brownian-root", type=Path, required=True)
    parser.add_argument("--pde-root", type=Path, required=True)
    parser.add_argument("--poisson-root", type=Path, required=True)
    args = parser.parse_args()
    build_lq_export(args.brownian_root.resolve())
    build_pde_export(args.pde_root.resolve())
    build_poisson_export(args.poisson_root.resolve())


if __name__ == "__main__":
    main()
