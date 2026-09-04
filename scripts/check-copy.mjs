// Scans the rendered public pages for language this site must not use:
// removed sentences, paper terminology, excluded model numbers, internal
// research identifiers, American spellings and numbered chapter ornaments.
// Runs after the production build.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/** Sentences and labels the redesign removed outright. */
const REMOVED = [
  'automation pays the people who own it',
  'the public balance sheet and automation',
  'the central comparison',
  'one pays. one misses.',
  'if workers cannot buy a stake in the future',
  'public balance sheet lab',
  'three public tools',
];

/** Paper terminology that must not reach a general audience. */
const TECHNICAL = [
  'orthogonal',
  'stochastic discount factor',
  'pricing kernel',
  'state-contingent',
  'welfare-equivalent',
  'fiscal hedge',
  'capital-tax-backed',
  'transformative successor',
  'payoff span',
  'public balance sheet',
  'public portfolio intermediation',
  'marginal utility state',
];

/** Words banned with a boundary so ordinary words are not caught. */
const BANNED_WORDS = [
  /\bshocks?\b/gi,
  /\bspan(s|ning|ned)?\b/gi,
  /\bprojections?\b/gi,
];

/** Numbers excluded by the evidence decision. */
const EXCLUDED_NUMBERS = [/\b96%/g, /0\.0094/g, /99\.84/g];

/** Internal research identifiers. */
const IDENTIFIERS = [
  /\bR\d{2}\b/g,
  /\bC[SP]\d{3}\b/g,
  /\bEMP\d{3}\b/g,
  /\bHYP\d{3}\b/g,
  /\bRUN-\d{8}T/g,
  /\bS[0-4]_[a-z]+/g,
];

/** American spellings. The Dauth paper's real title is exempt. */
// Official institution names and dataset titles are quoted as published.
const SPELLING_EXEMPTIONS = [
  'Labor Markets',
  'Bureau of Labor Statistics',
  'Labor Share for All Workers',
];
const AMERICANISMS = [
  /\blabor\b/gi,
  /\bbehavior(s|al)?\b/gi,
  /\bcolor(s|ed)?\b/gi,
  /\bcenter(s|ed)?\b/gi,
  /\bdefense\b/gi,
  /\borganization(s|al)?\b/gi,
  /\bfavor(s|ed|able)?\b/gi,
  /\bneighbor(s|hood)?\b/gi,
];

/** "calibrated" is allowed only inside this specified denial. */
const CALIBRATION_EXEMPTION =
  'does not report a calibrated fund size, a policy forecast or an estimated welfare gain';

/** Numbered chapter ornaments such as a bare "01" beside a heading. */
const ORNAMENT = /(?:^|[\s>(])0[1-9](?=[\s<)]|$)/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');
}

const dist = path.join(process.cwd(), 'dist');
let failures = 0;
const near = (text, index, length = 0) =>
  `…${text.slice(Math.max(0, index - 45), index + length + 45).trim()}…`;

for await (const file of walk(dist)) {
  const raw = await readFile(file, 'utf8');
  const text = visibleText(raw);
  const lower = text.toLowerCase();
  const rel = path.relative(process.cwd(), file);
  const before = failures;

  const flag = (what, index, length) => {
    failures += 1;
    console.error(`✗ ${rel}: ${what} — ${near(text, index, length)}`);
  };

  for (const phrase of [...REMOVED, ...TECHNICAL]) {
    const index = lower.indexOf(phrase);
    if (index !== -1) flag(`banned phrase "${phrase}"`, index, phrase.length);
  }
  for (const pattern of BANNED_WORDS) {
    for (const match of text.matchAll(pattern)) {
      flag(`banned word "${match[0]}"`, match.index, match[0].length);
    }
  }
  for (const pattern of [...EXCLUDED_NUMBERS, ...IDENTIFIERS]) {
    for (const match of text.matchAll(pattern)) {
      flag(`excluded value or identifier "${match[0]}"`, match.index);
    }
  }
  let spellingText = text;
  for (const allowed of SPELLING_EXEMPTIONS) {
    spellingText = spellingText.split(allowed).join(' ');
  }
  for (const pattern of AMERICANISMS) {
    for (const match of spellingText.matchAll(pattern)) {
      flag(`American spelling "${match[0]}"`, match.index, match[0].length);
    }
  }
  const calibrated = lower.indexOf('calibrat');
  if (calibrated !== -1 && !lower.includes(CALIBRATION_EXEMPTION)) {
    flag('"calibrated" outside the one specified sentence', calibrated);
  }
  for (const match of text.matchAll(ORNAMENT)) {
    flag(`numbered ornament "${match[0].trim()}"`, match.index);
  }

  if (failures === before) console.log(`✓ ${rel}`);
}

if (failures) {
  console.error(`\n${failures} copy problem(s) found.`);
  process.exit(1);
}
console.log('\nPublic copy follows the writing rules.');
