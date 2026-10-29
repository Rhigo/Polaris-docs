import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Export only the reviewed handbook boundary, never the application tree or history.
const target = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
assert(source && path.isAbsolute(source), 'Supply the absolute canonical Polaris checkout path');
const reference = process.argv[3] ?? 'main';
const git = (...args) => execFileSync('git', ['-C', source, ...args]);
const revision = git('rev-parse', '--verify', `${reference}^{commit}`).toString().trim();
const tooling = new Set(['docs/handbook/.vitepress/config.mts', 'docs/handbook/.vitepress/theme/index.ts', 'docs/handbook/.vitepress/theme/style.css']);
const paths = git('ls-tree', '-r', '--name-only', revision, '--', 'docs/handbook', 'docs/wiki', 'scripts/docs-check.mjs', 'LICENSE').toString().trim().split('\n');
const manifest = [];
for (const name of paths) {
  assert(!name.includes('..') && !name.includes('node_modules') && !name.endsWith('.env'), 'Unexpected export path');
  if (name.startsWith('docs/handbook/.vitepress/') && !tooling.has(name)) throw new Error(`Unreviewed build tool: ${name}`);
  if (name.startsWith('docs/wiki/') && !['docs/wiki/Home.md', 'docs/wiki/_Sidebar.md', 'docs/wiki/README.md'].includes(name)) throw new Error('Unreviewed wiki source');
  const original = git('show', `${revision}:${name}`);
  let exported = original;
  if (/\.(md|mjs|mts|ts|css|json|svg)$/.test(name)) {
    let value = original.toString('utf8');
    assert(!/sk-proj-|sk-live-|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|\/Users\//.test(value), `Private content marker in ${name}`);
    if (name === 'docs/handbook/.vitepress/config.mts') value = value.replaceAll('/Polaris/', '/Polaris-docs/').replaceAll('https://github.com/Rhigo/Polaris', 'https://github.com/Rhigo/Polaris-docs');
    if (name.startsWith('docs/wiki/')) value = value.replaceAll('https://github.com/Rhigo/Polaris/blob/main/docs/handbook/', 'https://github.com/Rhigo/Polaris-docs/blob/main/docs/handbook/');
    if (name === 'docs/wiki/Home.md') value = value.replace('# Polaris developer hub\n', '# Polaris developer hub\n\n[Read the illustrated handbook](https://rhigo.github.io/Polaris-docs/) · [Documentation source and revision](https://github.com/Rhigo/Polaris-docs/blob/main/source-manifest.json)\n');
    if (name === 'docs/wiki/_Sidebar.md') value = value.replace('- [Wiki home](Home)', '- [Wiki home](Home)\n- [Illustrated handbook](https://rhigo.github.io/Polaris-docs/)');
    if (name === 'docs/wiki/README.md') value = '# Publishing the wiki index\n\nThe public Polaris-docs repository has Wiki enabled with editing restricted to collaborators. Publish `Home.md` and `_Sidebar.md` through its wiki editor; preserve any custom pages. This directory contains the version-controlled sources, and changes here do not automatically update the separate GitHub wiki.\n\nThe wiki links to the maintained handbook instead of duplicating its instructions. GitHub Pages uses the Actions workflow in this repository and requires no `PAGES_ENABLED` variable. Verify the successful deployment and live site after merging documentation updates.\n\nThe application remains private. Never copy environment files, private review notes, chat logs, credentials or production exports into either publication surface.\n';
    if (name === 'docs/handbook/operations.md') {
      const begin = value.indexOf('## Documentation deployment');
      const next = value.indexOf('\n## ', begin + 4);
      if (begin >= 0) value = value.slice(0, begin) + '## Documentation publication\n\nThe public handbook is exported from a reviewed Polaris source revision into [Polaris-docs](https://github.com/Rhigo/Polaris-docs). The application repository remains private during development. This export contains documentation, reviewed screenshots, site tooling and a source manifest; it contains no application environment or private repository history.\n\nThe Pages workflow checks and builds the site on pull requests, then deploys approved main-branch changes. The site address is `https://rhigo.github.io/Polaris-docs/`; the Actions deployment result confirms publication. Preview the `/Polaris-docs/` base path when testing this public repository.\n' + (next >= 0 ? value.slice(next) : '');
      else value = value.replaceAll('https://rhigo.github.io/Polaris/', 'https://rhigo.github.io/Polaris-docs/');
    }
    exported = Buffer.from(value);
  }
  await fs.mkdir(path.dirname(path.join(target, name)), { recursive: true });
  await fs.writeFile(path.join(target, name), exported);
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  manifest.push({ path: name, sourceSha256: hash(original), exportedSha256: hash(exported) });
}
execFileSync(process.execPath, [path.join(target, 'scripts/docs-check.mjs')], { cwd: target, stdio: 'inherit' });
await fs.writeFile(path.join(target, 'source-manifest.json'), JSON.stringify({ sourceRepository: 'Rhigo/Polaris', sourceRevision: revision, sourceCommitDate: git('show', '-s', '--format=%cI', revision).toString().trim(), exportVersion: 1, files: manifest }, null, 2) + '\n');
console.log(`Exported ${manifest.length} reviewed files from ${revision}`);
