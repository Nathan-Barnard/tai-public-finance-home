import assert from 'node:assert/strict';
import { test } from 'node:test';

import { defaultLabState, evaluateLab, matrixCell } from './lab-model.ts';

void test('the default scenario reaches the worker shortfall', () => {
  const r = evaluateLab(defaultLabState);
  assert.equal(r.relative, 'behind');
  assert.equal(r.reach.phrase, 'Reaches this state');
  assert.ok(r.reachShare > 0.99);
});

void test('a flat asset misses the state and more of it does not help', () => {
  const r = evaluateLab({ ...defaultLabState, asset: 'flat' });
  assert.equal(r.reach.phrase, 'Misses this state');
  assert.ok(r.reachShare < 1e-9);
  assert.match(
    r.reach.sentence,
    /Increasing the position does not change that/,
  );
});

void test('a second distinct payoff adds a new direction', () => {
  const r = evaluateLab({ ...defaultLabState, asset: 'flat', menu: 'two' });
  assert.equal(r.reach.phrase, 'Adds a new payoff direction');
  assert.equal(r.projection.rank, 2);
});

void test('no risky payoff leaves the exposure outside the asset menu', () => {
  const r = evaluateLab({ ...defaultLabState, menu: 'none' });
  assert.equal(r.reach.phrase, 'Still outside the asset menu');
  assert.equal(r.margins.find((m) => m.id === 'state')?.active, false);
});

void test('workers gaining less than capital still count as behind', () => {
  const r = evaluateLab({
    ...defaultLabState,
    workers: 'rises-less',
    capital: 'falls',
  });
  assert.equal(r.relative, 'behind');
  assert.equal(r.capitalAdjusted, true);
  assert.equal(r.capital, 'rises');
});

void test('workers ahead means no shortfall to reach', () => {
  const r = evaluateLab({
    ...defaultLabState,
    workers: 'rises',
    capital: 'falls',
  });
  assert.equal(r.relative, 'ahead');
  assert.equal(r.reach.phrase, 'No shortfall in this state');
  assert.equal(r.dollar.level, 'less');
});

void test('tax adjustment activates the transition margin only', () => {
  const r = evaluateLab({ ...defaultLabState, tax: 'adjusts' });
  assert.equal(r.margins.find((m) => m.id === 'transition')?.active, true);
  assert.match(r.tax, /does not create an inherited payoff/);
});

void test('every matrix cell exists and carries no numbers', () => {
  for (const tax of ['inherited', 'adjusts'] as const) {
    for (const menu of ['none', 'one', 'two'] as const) {
      const cell = matrixCell(tax, menu);
      assert.ok(cell.text.length > 20);
      assert.doesNotMatch(cell.text, /\d/);
    }
  }
});
