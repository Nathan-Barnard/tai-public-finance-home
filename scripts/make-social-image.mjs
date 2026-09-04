// Renders the social image (1200×630) and the touch icon (180×180) with
// headless Chrome, using the site's own fonts and palette. Run `npm run og`;
// the results are committed in public/.
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
  body { margin: 0; background: #f8f6f1; color: #23262b; font-family: Inter, sans-serif; }
`;

const social = `<!doctype html><html><head><meta charset="utf-8"><style>${shared}
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; padding: 72px 80px; display: flex; flex-direction: column; }
  .name { font-family: Fraunces, serif; font-size: 27px; font-weight: 500; letter-spacing: -0.01em; }
  .rule { height: 1px; background: #ddd8cd; margin: 26px 0 40px; }
  h1 { margin: 0; font-family: Fraunces, serif; font-weight: 400; font-size: 66px; line-height: 1.12; letter-spacing: -0.02em; max-width: 15.5em; }
  .sub { margin-top: 30px; font-size: 25px; line-height: 1.5; color: #4a5058; max-width: 30em; }
  .foot { margin-top: auto; display: flex; gap: 30px; align-items: baseline; font-size: 19px; color: #646b74; }
  .tag { display: inline-flex; align-items: center; gap: 9px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .worker { background: #2a6f8e; }
  .capital { background: #a8631f; }
</style></head><body>
  <p class="name">AI, Growth, and Who Gains</p>
  <div class="rule"></div>
  <h1>How might AI change who gains from economic growth, and how could we shape it?</h1>
  <p class="sub">Historical evidence and economic models on ownership, taxes and public investment.</p>
  <div class="foot">
    <span class="tag"><span class="dot worker"></span>Worker outcomes</span>
    <span class="tag"><span class="dot capital"></span>Capital-side outcomes</span>
    <span style="margin-left:auto">nathan-barnard.github.io/tai-public-finance-home</span>
  </div>
</body></html>`;

const icon = `<!doctype html><html><head><meta charset="utf-8"><style>${shared}
  body { width: 180px; height: 180px; background: #23262b; }
</style></head><body>
  <svg width="180" height="180" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#23262b"/>
    <path d="M12 44 C 22 42, 30 38, 52 18" fill="none" stroke="#a8631f" stroke-width="6" stroke-linecap="round"/>
    <path d="M12 46 C 22 45, 32 44, 52 40" fill="none" stroke="#7fc0dc" stroke-width="6" stroke-linecap="round"/>
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
