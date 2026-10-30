import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../docs/handbook/', import.meta.url));
const backlog = JSON.parse(await readFile(path.join(root, 'backlog.json'), 'utf8'));
const items = backlog.items;
const ids = new Set(items.map(item => item.id));
assert.equal(ids.size, items.length, 'Duplicate backlog ID');
const statuses = new Set(['planned', 'in_progress', 'blocked', 'done']);
for (const item of items) {
  assert.match(item.id, /^[A-Z]+-\d{2}$/);
  assert.match(item.milestone, /^M[0-8]$/);
  assert.ok(['P1', 'P2', 'P3'].includes(item.priority), `Invalid priority: ${item.id}`);
  assert.ok(statuses.has(item.status), `Invalid status: ${item.id}`);
  assert.ok(item.title && item.acceptance?.length > 30, `Missing acceptance check: ${item.id}`);
  for (const dependency of item.dependsOn) assert.ok(ids.has(dependency), `Unknown dependency: ${dependency}`);
}
const visiting = new Set();
const visited = new Set();
function visit(id) {
  assert.ok(!visiting.has(id), `Dependency cycle at ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  items.find(item => item.id === id).dependsOn.forEach(visit);
  visiting.delete(id);
  visited.add(id);
}
items.forEach(item => visit(item.id));
const lines = [
  '# Feature backlog', '',
  `Updated ${backlog.updated}. ${items.length} work items. Generated from \`backlog.json\`; run \`pnpm roadmap:generate\` after editing the source.`, '',
  'P1 is required for the relevant release gate; P2 extends the product after its dependencies are proven. Planned features are not advertised as shipped. See [milestones](./roadmap) and [execution protocol](./execution).', '',
];
for (const milestone of [...new Set(items.map(item => item.milestone))]) {
  lines.push(`## ${milestone}`, '');
  for (const item of items.filter(item => item.milestone === milestone)) {
    lines.push(`### ${item.id} · ${item.title}`, '',
      `**${item.priority} · ${item.status.replaceAll('_', ' ')}** · Depends on: ${item.dependsOn.join(', ') || '—'}`, '',
      `Acceptance: ${item.acceptance}`, '');
  }
}
const generated = lines.join('\n');
if (process.argv.includes('--write')) await writeFile(path.join(root, 'backlog.md'), generated);
else assert.equal(await readFile(path.join(root, 'backlog.md'), 'utf8'), generated, 'Run pnpm roadmap:generate');

// An explicit source allowlist prevents new private notes from silently joining the public site.
const pages = new Set(['index', 'status', 'guide', 'screenshots', 'development', 'architecture',
  'extensions', 'operations', 'roadmap', 'backlog', 'research', 'connections', 'execution', 'worklog', 'pal', 'pal-runtime', 'dots-parity', 'models', 'recovery', 'api', 'artifacts-security', 'voice', 'privacy', 'token-accounting', 'pal-tasks', 'reminders', 'execution-isolation', 'attachments', 'images', 'rich-data', 'conversation-history', 'computer-workspace']);
const publicFiles = new Set(['mark.svg', ...["pal-desktop", "chat-refresh-desktop", "chat-refresh-mobile", "settings-mobile", "admin-mobile", "projects-refresh-desktop", "pal-dark-desktop", "api-keys-desktop", "api-keys-mobile", "temporary-two-turns-desktop", "temporary-two-turns-mobile", "reminders-desktop-inbox", "reminders-mobile-inbox", "rich-data-desktop", "rich-data-mobile", "history-search-mobile", "computer-workspace-desktop"].map(name => `screenshots/${name}.jpg`), ...['chat-desktop', 'chat-mobile', 'projects-desktop', 'admin-desktop', 'login-desktop'].map(name => `screenshots/${name}.png`)]);
async function walk(dir, prefix = '') {
  for (const name of await readdir(dir)) {
    const rel = prefix + name;
    const full = path.join(dir, name);
    const stat = await lstat(full);
    assert.ok(!stat.isSymbolicLink(), `Symlinks are not permitted in published source: ${rel}`);
    if (rel === '.vitepress') continue; // Build tooling; VitePress does not publish it as documents.
    if (stat.isDirectory()) { await walk(full, rel + '/'); continue; }
    if (rel.startsWith('public/')) assert.ok(publicFiles.has(rel.slice(7)), `Unreviewed public asset: ${rel}`);
    else if (rel === 'backlog.json') continue;
    else {
      assert.ok(rel.endsWith('.md') && pages.has(rel.slice(0, -3)), `Unreviewed public document: ${rel}`);
      const source = await readFile(full, 'utf8');
      assert.ok(!/\]\(\.\.\//.test(source), `Do not link outside the public docs root: ${rel}`);
      assert.ok(!/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(source), `Private key marker in ${rel}`);
    }
  }
}
await walk(root);
console.log(`Documentation checks passed: ${items.length} items, acyclic dependencies, generated backlog and public-source allowlist.`);
