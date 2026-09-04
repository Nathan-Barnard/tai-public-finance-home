import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  dot,
  fromAngle,
  projectOntoSpan,
  unreachedShare,
  type Vec2,
} from './geometry.ts';

const close = (a: number, b: number, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) < eps, `expected ${a} ≈ ${b}`);

void test('one payoff reaches only its own direction', () => {
  const exposure: Vec2 = [3, 4];
  const p = projectOntoSpan(exposure, [[1, 0]]);
  assert.deepEqual(p.projection, [3, 0]);
  assert.deepEqual(p.residual, [0, 4]);
  assert.equal(p.rank, 1);
  assert.equal(p.independent, true);
  close(p.coefficients[0], 3);
});

void test('a bigger position moves along the same line and never turns it', () => {
  const a: Vec2 = [2, 1];
  const small = projectOntoSpan([1, 3], [a]);
  const large = projectOntoSpan([4, 12], [a]);
  // Both projections lie on the line through a: cross product is zero.
  close(small.projection[0] * a[1] - small.projection[1] * a[0], 0);
  close(large.projection[0] * a[1] - large.projection[1] * a[0], 0);
  close(large.coefficients[0], 4 * small.coefficients[0]);
});

void test('an orthogonal payoff misses the whole exposure', () => {
  const p = projectOntoSpan([0, 5], [[1, 0]]);
  assert.deepEqual(p.projection, [0, 0]);
  assert.deepEqual(p.residual, [0, 5]);
  close(unreachedShare(p, [0, 5]), 1);
});

void test('two independent payoffs reach everything in the plane', () => {
  const e: Vec2 = [-2.5, 7.25];
  const p = projectOntoSpan(e, [fromAngle(20), fromAngle(115)]);
  close(p.projection[0], e[0]);
  close(p.projection[1], e[1]);
  close(dot(p.residual, p.residual), 0);
  assert.equal(p.rank, 2);
  assert.equal(p.independent, true);
});

void test('a collinear second payoff adds size but not direction', () => {
  const a: Vec2 = [1, 0.5];
  const p = projectOntoSpan([1, 3], [a, [-2, -1]]);
  assert.equal(p.rank, 1);
  assert.equal(p.independent, false);
  const single = projectOntoSpan([1, 3], [a]);
  close(p.projection[0], single.projection[0]);
  close(p.projection[1], single.projection[1]);
});

void test('an empty or zero payoff menu reaches nothing', () => {
  const none = projectOntoSpan([1, 1], []);
  assert.equal(none.rank, 0);
  assert.deepEqual(none.residual, [1, 1]);
  const zero = projectOntoSpan([1, 1], [[0, 0]]);
  assert.equal(zero.rank, 0);
  assert.equal(zero.independent, false);
});
