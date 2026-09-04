// Renders each route to static HTML after the client and SSR builds so the
// published pages read fully before any JavaScript runs. The client bundle
// then hydrates the same markup.
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const entry = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href;
const { pages, render } = await import(entry);

for (const page of pages) {
  const file = path.join(dist, page.file);
  const html = await readFile(file, 'utf8');
  const marker = `<div id="root" data-page="${page.id}"></div>`;
  if (!html.includes(marker)) {
    throw new Error(`Root marker for "${page.id}" not found in ${page.file}`);
  }
  const body = render(page.id);
  const output = html.replace(
    marker,
    `<div id="root" data-page="${page.id}">${body}</div>`,
  );
  await writeFile(file, output);
  console.log(
    `prerendered ${page.file} (${(body.length / 1024).toFixed(1)} kB)`,
  );
}

await rm(ssrDir, { recursive: true, force: true });
