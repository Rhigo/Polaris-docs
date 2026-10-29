# Operations and releases

## Deployment status

The Compose stack includes the application, PostgreSQL, Redis, sandbox and proxy, with optional local-model/search services. A dedicated `db-init` image applies the ordered Drizzle journal and seeds the initial administrator before the standalone application starts. `pnpm db:init` performs the same initialization for source-based development.

Initialization takes a transaction-level advisory lock and commits migrations plus seed atomically. Concurrent starts serialize; connection loss rolls back the transaction. Re-running initialization preserves existing accounts, password hashes and configured settings. The initial administrator is created only in an empty users table; deleting, demoting or disabling that account is not undone by the next deployment. If an existing installation has no active administrator, readiness stays unavailable until an authorized operator repairs access. Corrupt or unsupported migration history fails closed. Do not use `db:push` to bypass an upgrade failure.

`/api/health` is process liveness. `/api/ready` returns 503 until the database, journal, required columns and an active administrator are ready. The installer checks both application readiness and proxy health before reporting success, and preserves existing environment/TLS files. PostgreSQL and Redis retain loopback-only host ports for local development.

The CI deployment check exercises PostgreSQL 16, initialization reruns and HTTPS through Nginx. Record a successful run for the release's exact commit; local Mac verification alone does not prove the Docker image works. After deploying, verify login and an authenticated operation as well as readiness.

The sandbox has bounded output, artifacts, time and process resources, but still shares an execution identity and filesystem. Keep untrusted multi-user execution behind `SEC-04` until each run has its own container or VM. The [Pal plan](./pal) describes the intended computer boundary.

## Release discipline

Every release records its exact commit, supported Node/PostgreSQL versions, changed environment variables, migrations, feature flags and provider changes. Additive migrations precede code that needs new fields; destructive cleanup requires an explicit later release and a verified backup. Reverting application code may not revert a data migration.

Before an upgrade, back up PostgreSQL, uploaded/generated files and the encrypted-configuration key material using the deployment's secure backup process. Rehearse restoration into a disposable environment. Never commit credentials or production backups. Check that restored provider settings can be decrypted and that file references resolve.

Monitor database readiness, queue age once workers exist, request/provider errors, tool timeouts, storage growth and actual usage. Unknown costs must not appear as free usage. Apply per-user and per-run resource limits before enabling expensive cloud jobs.

## Documentation publication

The [public handbook](https://rhigo.github.io/Polaris-docs/) and [wiki index](https://github.com/Rhigo/Polaris-docs/wiki) are published from the [Polaris-docs repository](https://github.com/Rhigo/Polaris-docs). The application repository remains private during development. Canonical documentation stays in the application repository's `docs/handbook`; the public export contains only reviewed documentation, screenshots, site tooling and a source manifest.

For a release, run the public repository's `scripts/sync-handbook.mjs` with this checkout's absolute path and the reviewed source commit. Review the exported diff and `source-manifest.json`, then run its documentation checks/build and open a focused PR. Its CI verifies rendered links/assets, public edit destinations and exported hashes; approved main changes deploy through GitHub Actions. Confirm the successful deployment and live site before announcing an update.

Leave the application's optional `PAGES_ENABLED` variable unset. The public repository handles deployment without that gate. Canonical previews use `/Polaris/`; public-repository previews and deployment use `/Polaris-docs/`. Test desktop/mobile navigation and search.

The separate GitHub wiki has collaborator-only editing. Publish the maintained `Home.md` and `_Sidebar.md` index files after handbook updates; repository commits do not automatically update the wiki. Preserve custom pages. Never export environment files, chat logs, credentials, private review notes, backups or application Git history.

## Restore rehearsal

Use the [backup and recovery guide](./recovery) to capture a protected checkpoint and rehearse a restore into new targets. A schema match does not approve an application downgrade, and the tooling never switches traffic.
