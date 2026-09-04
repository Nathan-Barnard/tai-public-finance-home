# Frozen notebook exports

These compact JSON files are the public, portable inputs used by the reader notebooks.
They contain only the fields needed for the displayed explanation. Each file records
the upstream repository, exact commit or run identity, source-artifact SHA-256 hashes,
the transformation applied, and the result-use ceiling.

The exports do not promote their source calculations. In particular:

- the CS001 local-quadratic calculation is exploratory local evidence;
- the CS004 export is a pre-solve sampled-domain diagnostic, not a nonlinear HJB
  solution; and
- the CS005 export is quarantine-affected candidate diagnostic evidence, not a solved
  marked-Poisson policy problem.

Maintainers with local upstream checkouts can rebuild the three exports with:

```bash
python3 scripts/refresh_frozen_exports.py \
  --brownian-root /path/to/tai-public-finance \
  --pde-root /path/to/tai-public-finance-ramsey-pde \
  --poisson-root /path/to/tai-public-finance-poisson
```

The script refuses to proceed if a pinned source artifact's content hash differs. A
changed hash requires a fresh evidence review before the pinned value is updated.
