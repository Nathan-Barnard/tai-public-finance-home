import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
  EQUITY_GROUPS,
  LONG_RUN_TAX,
  RESEARCH_BOUNDARY_SENTENCE,
  TAX_COMPONENTS,
  TAX_TOTAL,
  WORKER_CASES,
} from '../content/figures.ts';

// The figures below are the ones checked against the canonical descriptive
// evidence record. If a number here changes, it must be re-verified there
// first, so these tests are deliberately exact.

void test('worker outcomes match the published figures', () => {
  assert.deepEqual(
    WORKER_CASES.map((c) => [c.place, c.period, c.labourShare, c.compensation]),
    [
      ['United States', '1990–2007', -0.07, 1.3],
      ['Germany', '2004–07', -0.97, -1.51],
    ],
  );
});

void test('German tax components and total match the published figures', () => {
  assert.deepEqual(
    TAX_COMPONENTS.map((c) => [c.label, c.value]),
    [
      ['Personal income tax', -0.78],
      ['Employee social contributions', -0.37],
      ['Employer social contributions', -0.54],
      ['Corporate income tax', 0.75],
    ],
  );
  assert.equal(TAX_TOTAL.value, -0.34);
});

void test('the four tax components do not sum to the total', () => {
  // The exhibit must never be drawn as a complete decomposition: other taxes
  // moved too. This guards the design decision as well as the numbers.
  const sum = TAX_COMPONENTS.reduce((total, c) => total + c.value, 0);
  assert.ok(
    Math.abs(sum - TAX_TOTAL.value) > 0.5,
    `components sum to ${sum}, total is ${TAX_TOTAL.value}`,
  );
});

void test('long-run tax revenue matches the published endpoints', () => {
  assert.deepEqual(
    LONG_RUN_TAX.map((c) => [c.place, c.start, c.end]),
    [
      ['Germany', 31.7, 38.0],
      ['United Kingdom', 30.1, 34.4],
      ['United States', 23.6, 25.6],
    ],
  );
  for (const country of LONG_RUN_TAX) {
    assert.ok(
      country.end > country.start,
      `${country.place} should be higher in 2024`,
    );
  }
});

void test('equity groups match the published figures and keep their sample sizes', () => {
  assert.deepEqual(
    EQUITY_GROUPS.map((g) => [
      g.place,
      g.state,
      g.domestic,
      g.restOfWorld,
      g.observations,
    ]),
    [
      ['United States', 'strong', 15.3, 15.7, 9],
      ['United States', 'pressure', 1.9, -1.7, 6],
      ['United Kingdom', 'strong', 19.0, 13.8, 9],
      ['United Kingdom', 'pressure', 6.2, -1.2, 5],
    ],
  );
});

void test('equity returns are lower in every worker-under-pressure group', () => {
  for (const place of ['United States', 'United Kingdom']) {
    const strong = EQUITY_GROUPS.find(
      (g) => g.place === place && g.state === 'strong',
    );
    const pressure = EQUITY_GROUPS.find(
      (g) => g.place === place && g.state === 'pressure',
    );
    assert.ok(strong && pressure);
    assert.ok(pressure.domestic < strong.domestic);
    assert.ok(pressure.restOfWorld < strong.restOfWorld);
  }
});

void test('the Research page carries the required boundary sentence', async () => {
  const source = await readFile(
    new URL('../content/research.ts', import.meta.url),
    'utf8',
  );
  assert.ok(
    source.includes(RESEARCH_BOUNDARY_SENTENCE),
    'the exact boundary sentence must appear in the Research page content',
  );
});

void test('excluded model numbers appear nowhere in the content', async () => {
  const files = [
    'evidence.ts',
    'home.ts',
    'explore.ts',
    'research.ts',
    'figures.ts',
    'site.ts',
  ];
  const excluded = ['96%', '0.0094', '99.84', 'one-half tax'];
  for (const file of files) {
    const source = await readFile(
      new URL(`../content/${file}`, import.meta.url),
      'utf8',
    );
    for (const term of excluded) {
      assert.ok(
        !source.includes(term),
        `${file} must not contain the excluded model number "${term}"`,
      );
    }
  }
});

void test('the Explore outcomes stay qualitative', async () => {
  const source = await readFile(
    new URL('../content/explore.ts', import.meta.url),
    'utf8',
  );
  const strings = [...source.matchAll(/'([^'\\]{12,})'/g)].map((m) => m[1]);
  const prose = strings.filter((s) => !s.includes('/') && !s.includes('@'));
  for (const line of prose) {
    assert.ok(
      !/\d/.test(line),
      `Explore copy must contain no numbers, found: "${line}"`,
    );
  }
});
