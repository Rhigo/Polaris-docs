# Polaris documentation

The public handbook, screenshots and roadmap for Polaris.

- **Documentation:** https://rhigo.github.io/Polaris-docs/
- **Wiki:** https://github.com/Rhigo/Polaris-docs/wiki
- **Status:** [What is implemented and verified](docs/handbook/status.md)
- **Source record:** [Reviewed upstream revision and file hashes](source-manifest.json)

Polaris is in active development. The application repository currently remains private; this repository contains only the reviewed documentation export and the tooling needed to build it. Capability status distinguishes implemented source, tested integrations and deployed features.

## Build locally

Use Node 22 or newer and pnpm 10.33.0:

```sh
pnpm install --frozen-lockfile
pnpm docs:check
pnpm docs:build
pnpm docs:preview
```

Open the preview at `/Polaris-docs/`. Main-branch changes deploy through GitHub Actions after the documentation checks and build pass. Pull requests build without publishing.

## Update the handbook

The canonical handbook is maintained with the application code. Maintainers export a reviewed commit with:

```sh
pnpm docs:sync /absolute/path/to/Polaris REVIEWED_COMMIT
pnpm docs:check
pnpm docs:build
```

Review the diff, screenshots and source manifest before merging. The exporter copies only tracked handbook/wiki sources, the documentation checker and license; it does not copy application code, runtime configuration, private review notes or repository history. The public site base and documentation links are adjusted for this repository.

Documentation suggestions are welcome as issues or pull requests here. Accepted edits should be backported to the canonical handbook before the next export. Update wiki navigation from `docs/wiki` when the information architecture changes. Keep operating-status claims tied to the recorded source revision.

The existing project license is preserved in [LICENSE](LICENSE).

## Synthetic browser acceptance pages

`fixtures/pal-public-research-v1/` contains a fictional lantern catalogue, an explicitly untrusted instruction example and a human-only takeover page. These are public test assets maintained independently of the application-derived handbook. They have no accounts, purchases, external resources or submission handler. Never enter real credentials. The human-only page deliberately places synthetic input in its title so tests can prove that an agent cannot observe it during takeover; only fixed markers are stored locally. It is excluded from automatic agent navigation.

`fixtures/manifest.json` pins all seven source files. The build verifies source hashes, copies only those files plus the manifest, and checks the final output again. HTML has noindex/nofollow, no-referrer and a CSP blocking network connections and form submission; inline fixture scripts and the deliberate click-handler marker remain enabled. Future changes require review and new hashes. These fixtures do not certify the unfinished browser agent or private-login return control.
