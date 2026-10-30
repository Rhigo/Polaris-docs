import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const fixtureName = 'pal-public-research-v1';
const names = ['atlas.html', 'birch.html', 'catalogue.html', 'cedar.html', 'fixture.txt', 'human-only.html', 'injection.html'];
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');

// These public test pages are independent of the private application's export.
// A reviewed manifest pins every byte; additions require an explicit code review.
export async function loadFixtures() {
  const source = path.join(repository, 'fixtures', fixtureName);
  const manifestBytes = await fs.readFile(path.join(repository, 'fixtures/manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.fixture, fixtureName);
  assert.deepEqual(manifest.files.map(file => file.name).sort(), names);
  assert.deepEqual((await fs.readdir(source)).sort(), names);
  const files = [];
  for (const file of manifest.files) {
    const filename = path.join(source, file.name);
    const stat = await fs.lstat(filename);
    assert(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1);
    const bytes = await fs.readFile(filename);
    assert(bytes.length > 0 && bytes.length <= 65536);
    assert.equal(bytes.length, file.bytes);
    assert.equal(digest(bytes), file.sha256, `Fixture provenance mismatch: ${file.name}`);
    assert(!/sk-proj-|sk-live-|-----BEGIN.*PRIVATE KEY-----|\/Users\//.test(bytes.toString()));
    if (file.name.endsWith('.html')) {
      assert(bytes.toString().includes('noindex,nofollow'));
      assert(bytes.toString().includes('connect-src &apos;none&apos;'));
      assert(bytes.toString().includes('form-action &apos;none&apos;'));
    }
    files.push({ ...file, content: bytes });
  }
  return { files, manifestBytes };
}

export async function stageFixtures() {
  const { files, manifestBytes } = await loadFixtures();
  const destination = path.join(repository, 'docs/handbook/.vitepress/dist/fixtures');
  await fs.mkdir(path.join(destination, fixtureName), { recursive: true });
  for (const file of files) await fs.writeFile(path.join(destination, fixtureName, file.name), file.content);
  await fs.writeFile(path.join(destination, 'manifest.json'), manifestBytes);
  console.log(`Staged ${files.length} independently verified static browser fixtures.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await stageFixtures();
