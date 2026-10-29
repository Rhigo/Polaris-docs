import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/handbook/.vitepress/dist');
const base = '/Polaris-docs/';
const manifest = JSON.parse(await fs.readFile('source-manifest.json', 'utf8'));
for (const entry of manifest.files) {
  const bytes = await fs.readFile(entry.path);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.exportedSha256, `Export provenance mismatch: ${entry.path}`);
}
let pages = 0;
let editLinks = 0;
async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { await visit(filename); continue; }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const html = await fs.readFile(filename, 'utf8');
    const pageUrl = new URL(base + path.relative(root, filename), 'https://handbook.invalid');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;', '&');
      if (value.includes('/edit/main/docs/handbook/')) {
        assert(value.startsWith('https://github.com/Rhigo/Polaris-docs/edit/main/docs/handbook/'), `Incorrect edit link in ${filename}`);
        editLinks++;
      }
      if (!value || value.startsWith('#')) continue;
      const url = new URL(value, pageUrl);
      if (url.origin !== pageUrl.origin) continue;
      assert(url.pathname.startsWith(base), `Link escapes the Pages base: ${value}`);
      const relative = decodeURIComponent(url.pathname.slice(base.length));
      const target = path.resolve(root, relative || 'index.html');
      assert(target.startsWith(root + path.sep), `Link escapes the build directory: ${value}`);
      const stat = await fs.stat(target);
      if (stat.isDirectory()) await fs.access(path.join(target, 'index.html'));
    }
  }
}
await visit(root);
assert(pages > 10 && editLinks > 10, 'Expected a complete rendered handbook');
console.log(`Verified ${pages} rendered pages, ${editLinks} public edit links and ${manifest.files.length} export hashes.`);
