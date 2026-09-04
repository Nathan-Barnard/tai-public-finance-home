// Exact vector geometry for the payoff diagrams. Every figure on the site
// that shows what a public position can and cannot reach is computed from
// these functions rather than hand-placed. The numbers describe only the
// geometry drawn on screen; they are never estimates for any economy.

export type Vec2 = readonly [number, number];

export const ZERO: Vec2 = [0, 0];

export function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function scale(a: Vec2, k: number): Vec2 {
  return [a[0] * k, a[1] * k];
}

export function norm(a: Vec2): number {
  return Math.hypot(a[0], a[1]);
}

export function normalize(a: Vec2): Vec2 {
  const n = norm(a);
  return n === 0 ? ZERO : [a[0] / n, a[1] / n];
}

export function fromAngle(degrees: number, length = 1): Vec2 {
  const r = (degrees * Math.PI) / 180;
  return [Math.cos(r) * length, Math.sin(r) * length];
}

export function angleDeg(a: Vec2): number {
  return (Math.atan2(a[1], a[0]) * 180) / Math.PI;
}

export type Projection = {
  /** The part of the exposure that the available payoffs reach. */
  projection: Vec2;
  /** The part of the exposure that lies outside the payoff menu. */
  residual: Vec2;
  /** Position in each payoff that produces the projection. */
  coefficients: number[];
  /** Number of genuinely different payoff directions. */
  rank: 0 | 1 | 2;
  /** False when a supplied payoff only repeats an existing direction. */
  independent: boolean;
};

/**
 * Orthogonal projection of an exposure onto the span of the available
 * payoffs.
 *
 * One payoff `a`:      projection = a · dot(e, a) / dot(a, a)
 * Several payoffs `A`: projection = A · inverse(AᵀA) · Aᵀ e
 *
 * Collinear or nearly singular payoff sets are handled by falling back to
 * the single strongest direction, and the result says so through
 * `independent` and `rank`.
 */
export function projectOntoSpan(
  exposure: Vec2,
  payoffs: readonly Vec2[],
  tolerance = 1e-9,
): Projection {
  const nonZero = payoffs.filter((p) => dot(p, p) > tolerance);

  if (nonZero.length === 0) {
    return {
      projection: ZERO,
      residual: exposure,
      coefficients: payoffs.map(() => 0),
      rank: 0,
      independent: payoffs.length === 0,
    };
  }

  if (nonZero.length === 1) {
    const a = nonZero[0];
    const coefficient = dot(exposure, a) / dot(a, a);
    const projection = scale(a, coefficient);
    return {
      projection,
      residual: sub(exposure, projection),
      coefficients: payoffs.map((p) => (p === a ? coefficient : 0)),
      rank: 1,
      independent: payoffs.length === 1,
    };
  }

  const [a, b] = nonZero;
  const aa = dot(a, a);
  const bb = dot(b, b);
  const ab = dot(a, b);
  const determinant = aa * bb - ab * ab;

  // sin²(angle between a and b) below tolerance means the second payoff
  // adds size but not a new direction.
  if (determinant <= tolerance * aa * bb) {
    const strongest = aa >= bb ? a : b;
    const single = projectOntoSpan(exposure, [strongest], tolerance);
    return {
      ...single,
      coefficients: payoffs.map((p) =>
        p === strongest ? single.coefficients[0] : 0,
      ),
      independent: false,
    };
  }

  // Closed-form solution of the 2×2 normal equations (AᵀA) c = Aᵀ e.
  const ea = dot(exposure, a);
  const eb = dot(exposure, b);
  const ca = (bb * ea - ab * eb) / determinant;
  const cb = (aa * eb - ab * ea) / determinant;
  const projection = add(scale(a, ca), scale(b, cb));

  return {
    projection,
    residual: sub(exposure, projection),
    coefficients: payoffs.map((p) => (p === a ? ca : p === b ? cb : 0)),
    rank: 2,
    independent: true,
  };
}

/** Squared length of the residual, as a share of the exposure. */
export function unreachedShare(p: Projection, exposure: Vec2): number {
  const total = dot(exposure, exposure);
  return total === 0 ? 0 : dot(p.residual, p.residual) / total;
}
