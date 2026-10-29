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

The public handbook is exported from a reviewed Polaris source revision into [Polaris-docs](https://github.com/Rhigo/Polaris-docs). The application repository remains private during development. This export contains documentation, reviewed screenshots, site tooling and a source manifest; it contains no application environment or private repository history.

The Pages workflow checks and builds the site on pull requests, then deploys approved main-branch changes. The site address is `https://rhigo.github.io/Polaris-docs/`; the Actions deployment result confirms publication. Preview the `/Polaris-docs/` base path when testing this public repository.

## Restore rehearsal

Use the [backup and recovery guide](./recovery) to capture a protected checkpoint and rehearse a restore into new targets. A schema match does not approve an application downgrade, and the tooling never switches traffic.
