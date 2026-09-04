// Renders the social image (1200×630) and the touch icon (180×180) with
// headless Chrome from small HTML templates that use the site's own fonts
// and palette. Run with `npm run og`; the results are committed in public/.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const fonts = pathToFileURL(path.join(root, 'public/fonts/')).href;
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shared = `
  @font-face { font-family: Fraunces; src: url(${fonts}fraunces-latin-full-normal.woff2) format('woff2-variations'); font-weight: 100 900; }
  @font-face { font-family: Inter; src: url(${fonts}inter-latin-wght-normal.woff2) format('woff2-variations'); font-weight: 100 900; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f5f0e6; color: #101d1b; font-family: Inter, sans-serif; }
`;

const social = `<!doctype html><html><head><meta charset="utf-8"><style>${shared}
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; }
  .eyebrow { position: absolute; left: 64px; top: 56px; font-size: 20px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #5a6a66; }
  h1 { position: absolute; left: 64px; top: 96px; width: 700px; margin: 0; font-family: Fraunces, serif; font-weight: 360; font-size: 84px; line-height: 0.96; letter-spacing: -0.035em; font-variation-settings: 'opsz' 144, 'SOFT' 40, 'WONK' 1; }
  .site { position: absolute; left: 64px; bottom: 52px; font-size: 22px; color: #3f4f4b; }
  svg { position: absolute; right: 0; top: 0; }
</style></head><body>
  <p class="eyebrow">The public balance sheet and automation</p>
  <h1>Automation affects capitalists and workers differently.</h1>
  <p class="site">nathan-barnard.github.io/tai-public-finance-home</p>
  <svg width="560" height="630" viewBox="0 0 560 630">
    <line x1="150" y1="40" x2="150" y2="600" stroke="#101d1b" stroke-width="2" stroke-dasharray="6 10"/>
    <path d="M20 380 C 70 372, 110 360, 150 348" fill="none" stroke="#101d1b" stroke-width="10" stroke-linecap="round"/>
    <path d="M150 348 C 250 320, 340 200, 520 90" fill="none" stroke="#0f7a6b" stroke-width="13" stroke-linecap="round"/>
    <path d="M150 348 C 260 350, 380 400, 520 430" fill="none" stroke="#d4562a" stroke-width="11" stroke-linecap="round"/>
    <path d="M150 348 C 250 320, 340 200, 520 90 L520 430 C 380 400, 260 350, 150 348 Z" fill="#2a55c9" opacity="0.12"/>
    <text x="520" y="70" text-anchor="end" font-family="Fraunces" font-size="26" fill="#0b6b5e" font-weight="600">Capital income</text>
    <text x="520" y="472" text-anchor="end" font-family="Fraunces" font-size="26" fill="#a63a13" font-weight="600">Worker income</text>
    <text x="164" y="60" font-family="Fraunces" font-size="20" fill="#101d1b">the shock arrives</text>
  </svg>
</body></html>`;

const icon = `<!doctype html><html><head><meta charset="utf-8"><style>${shared}
  body { width: 180px; height: 180px; background: #101d1b; }
</style></head><body>
  <svg width="180" height="180" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#101d1b"/>
    <path d="M10 40 C 20 38, 26 36, 32 34" fill="none" stroke="#f5f0e6" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 34 C 40 30, 48 20, 56 12" fill="none" stroke="#5ee0c8" stroke-width="6" stroke-linecap="round"/>
    <path d="M32 34 C 40 38, 48 44, 56 48" fill="none" stroke="#f5975f" stroke-width="5" stroke-linecap="round"/>
  </svg>
</body></html>`;

const dir = mkdtempSync(path.join(tmpdir(), 'tai-social-'));
const jobs = [
  { html: social, size: '1200,630', out: 'public/og.png' },
  { html: icon, size: '180,180', out: 'public/apple-touch-icon.png' },
];
for (const [index, job] of jobs.entries()) {
  const file = path.join(dir, `page-${index}.html`);
  writeFileSync(file, job.html);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--screenshot=${path.join(root, job.out)}`,
      `--window-size=${job.size}`,
      '--virtual-time-budget=3000',
      pathToFileURL(file).href,
    ],
    { stdio: 'ignore' },
  );
  console.log(`wrote ${job.out}`);
}
