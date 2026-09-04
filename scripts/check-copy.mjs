// Scans the rendered public pages for language the site must not use:
// banned phrases, internal research identifiers, and numbered chapter
// ornaments. Runs after the production build.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BANNED_PHRASES = [
  'the basic mechanism',
  'public saving moves resources across dates',
  'evidence and limits',
  'frozen content',
  'this is an early research website',
  'it reports no calibrated policy or welfare numbers',
  'the diagram shows what must be measured',
  'this section explores',
  'at its core',
  "in today's rapidly changing landscape",
  'in today’s rapidly changing landscape',
  'unlock',
  'navigate the complexities',
  'powerful tool',
  'policy toolkit',
  'stakeholder',
  'the ecosystem',
  'the landscape',
  'insurance',
  'insure',
  'hedge',
];

// Internal research identifiers that must stay out of public copy.
const IDENTIFIER_PATTERNS = [
  /\bR\d{2}\b/g,
  /\bCS\d{3}\b/g,
  /\bCP\d{3}\b/g,
  /\bRUN-\d{8}T/g,
  /\bS[0-4]_[a-z]+/g,
  /\bA\d{2}\b(?!\s*(?:pt|px))/g,
];

// Numbered ornaments such as "01" or "07" beside headings or navigation.
const ORNAMENT_PATTERN = /(?:^|[\s>(])0[1-9](?=[\s<)./]|$)/g;

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
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ')
    .replace(/\s+/g, ' ');
}

const dist = path.join(process.cwd(), 'dist');
let failures = 0;

for await (const file of walk(dist)) {
  const html = await readFile(file, 'utf8');
  const text = visibleText(html);
  const lower = text.toLowerCase();
  const rel = path.relative(process.cwd(), file);

  for (const phrase of BANNED_PHRASES) {
    const index = lower.indexOf(phrase);
    if (index !== -1) {
      failures += 1;
      console.error(
        `✗ ${rel}: banned phrase "${phrase}" near "…${text.slice(Math.max(0, index - 40), index + phrase.length + 40)}…"`,
      );
    }
  }
  for (const pattern of IDENTIFIER_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      failures += 1;
      console.error(
        `✗ ${rel}: internal identifier "${match[0]}" near "…${text.slice(Math.max(0, match.index - 40), match.index + 40)}…"`,
      );
    }
  }
  for (const match of text.matchAll(ORNAMENT_PATTERN)) {
    failures += 1;
    console.error(
      `✗ ${rel}: numbered ornament "${match[0].trim()}" near "…${text.slice(Math.max(0, match.index - 40), match.index + 40)}…"`,
    );
  }
  if (!failures) console.log(`✓ ${rel}`);
}

if (failures) {
  console.error(`\n${failures} copy problem(s) found.`);
  process.exit(1);
}
console.log('\nPublic copy is clean.');
