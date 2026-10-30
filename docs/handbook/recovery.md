# Recovery and release checkpoints

Polaris recovery restores a verified backup into a **new database and new file locations**. It does not overwrite a running installation, switch traffic, start an application, or run down migrations. Keep the current deployment available until the recovered environment has passed its checks.

The tooling is `scripts/recovery.mjs`, using Node 22 or 24 and PostgreSQL clients matching the server's major version. It can use an explicit local client directory or the PostgreSQL service of an explicit Compose project. Database credentials come from a named environment variable; URLs, passwords, configuration values and raw PostgreSQL error output are not printed.

## What a recovery set contains

| Component | Captured evidence | Restore behavior |
| --- | --- | --- |
| Release checkpoint | Commit, dirty flag, package versions, Node version, lockfile hash, migration names/timestamps/hashes, environment variable names and release notes | Retained in the backup manifest; never treated as automatic application-downgrade approval |
| PostgreSQL | Custom-format dump, server/client versions, applied migration journal, table counts and canonical file ownership/reference metadata | Restored in one transaction into an explicitly named, newly created database |
| Uploaded and generated files | Complete regular-file inventory, relative paths, sizes and SHA-256 hashes | Copied to new directories; hashes checked; symlinks, special files and hard links refused |
| Runtime configuration | Exact supplied dotenv file, key fingerprint and variable names | Original retained in the bundle; restored copy preserves `ENCRYPTION_KEY`, applies declared storage roots and deliberately disables `DATABASE_URL` until configured |

Backup directories use mode `0700`; files use `0600`. The supplied secret config must already exclude group/other access. A bundle contains sensitive database content **and the encryption key**: put it in access-controlled encrypted backup storage, separate from the running machine. Hashes detect corruption; they do not authenticate a maliciously replaced bundle.

Capture the actual `ENCRYPTION_KEY` used by this deployment. A new random key cannot decrypt existing provider or SSO configuration. Include `NEXTAUTH_SECRET`, required OAuth/provider/environment secrets and deployment-specific settings in the protected recovery config. Secret-manager references are not a substitute for a recoverable key. The command checks the key's format and presence, not access to your secret manager.

This is a single-database application backup. Preserve release source/container images, Compose/proxy configuration, TLS material and external object stores separately. PostgreSQL cluster roles, grants and tablespaces are outside the dump policy; restored objects belong to the restoring role. Assign the intended application role before cutover. Saved Pal tasks and their events live in PostgreSQL; Redis is not their recovery source. Keep their worker stopped until the restored queue has been reconciled as described below. External provider file IDs and arbitrary paths embedded in document content are not recreated or rewritten.

PostgreSQL documents both the consistent single-database snapshot provided by `pg_dump` and the separate handling needed for cluster-wide objects. Its snapshot does not include application files. [PostgreSQL dump documentation](https://www.postgresql.org/docs/16/app-pgdump.html), [SQL dump recovery](https://www.postgresql.org/docs/16/backup-dump.html).

## Record the release checkpoint

Run from a clean, reviewed source checkout. Keep checkpoint and backup output outside the repository and outside uploaded/generated-file directories. All paths below are examples to replace with explicit paths for the installation; destination parents must already exist.

Prepare a release-notes file describing:

- The exact source/image digests and successful checks, including the restore rehearsal.
- Environment, migration, provider/model and feature-flag changes.
- Which earlier application build remains compatible with the schema, authorization and tool contracts.
- The stop/cutover procedure, data-loss window of the backup and treatment of writes after it.

```sh
node /srv/polaris/source/scripts/recovery.mjs checkpoint \
  --repo /srv/polaris/source \
  --output /secure/releases/release-checkpoint.json \
  --release candidate-2026-10-29 \
  --notes-file /secure/releases/release-notes.md
```

A dirty checkout is rejected. `--allow-dirty-source` exists for development rehearsals and records `dirty: true`; it is not a substitute for an immutable release build. Existing checkpoint files are never replaced.

## Back up a consistent stopped-writer state

Stop the application's writers, file generators and any background workers before capturing the database and files. Keep PostgreSQL running. For the current Compose stack, enter a maintenance window and stop `web` in the intended project; account for any separately deployed writers too. Do not perform a concurrent initialization, migration or deployment.

`--quiesced` acknowledges that operational step. The command checks migration history, file inventories and database metadata before/after capture, but those checks cannot prove that every external writer was stopped. A completed `pg_dump` by itself does not establish database/file consistency.

The physical directories supplied to the tool and the paths stored in `files.storage_path` can differ. Declare both. In Compose, the application normally records `/app/uploads/...` and `/app/generated/...`, even when the operator reads their volumes from different host mountpoints. With local default settings, runtime roots are `uploads` and `generated`. Use the values actually used by the deployment; missing or out-of-root database references fail the backup.

Place `POLARIS_BACKUP_DATABASE_URL` in a protected `/secure/source-db.env`, or supply it from the operator's secret mechanism. This connection must point to the intended source database and be able to read its contents. The runtime config file below is a separate recovery artifact, not an implicit source of database credentials.

```sh
node --env-file=/secure/source-db.env \
  /srv/polaris/source/scripts/recovery.mjs backup \
  --checkpoint /secure/releases/release-checkpoint.json \
  --output /secure/backups/pre-upgrade-2026-10-29 \
  --uploads /mnt/polaris-uploads \
  --generated /mnt/polaris-generated \
  --uploads-runtime-path /app/uploads \
  --generated-runtime-path /app/generated \
  --config /secure/runtime-recovery.env \
  --database-url-env POLARIS_BACKUP_DATABASE_URL \
  --pg-bin /usr/lib/postgresql/16/bin \
  --quiesced
```

The operator must expose the actual upload/generated volumes at the chosen physical paths. The command does not infer Docker volume mountpoints or copy from a running application behind the operator's back. Avoid putting the backup inside either source tree.

If client tools are supplied by the existing Compose PostgreSQL service, replace `--pg-bin` with:

```sh
  --compose-file /srv/polaris/source/docker-compose.yml \
  --compose-project polaris-ai \
  --compose-service postgres
```

The connection host, port and TLS-file paths must be reachable **inside that service**. Only environment-variable names are passed in Docker's command arguments. The tool uses the selected running service; it does not start, rebuild, stop or replace containers. Local client and Compose modes are mutually exclusive.

A successful capture writes `manifest.json` last, then verifies the bundle. Failure leaves a partial directory for inspection without a successful manifest; choose fresh paths for the next attempt. Do not promote an incomplete capture. Archive the verified bundle and checkpoint in the protected backup system, then resume the source deployment if the maintenance plan requires it.

## Verify and rehearse restoration

```sh
node /srv/polaris/source/scripts/recovery.mjs verify \
  --bundle /secure/backups/pre-upgrade-2026-10-29
```

Verification checks file inventory, permissions, hashes, key fingerprint, file references and migration evidence. It does not replace an actual restore. Only restore a trusted archive: PostgreSQL restore executes SQL supplied by the source database, and archive selection does not make untrusted SQL safe. [PostgreSQL restore documentation](https://www.postgresql.org/docs/16/app-pgrestore.html).

Use an administrative connection with `CREATE DATABASE` permission, supplied separately as `POLARIS_RESTORE_ADMIN_URL`. The new database name must be explicit and must not already exist. The tool refuses system database names and never passes `--clean` or `--create` to `pg_restore`.

```sh
node --env-file=/secure/restore-db.env \
  /srv/polaris/source/scripts/recovery.mjs restore \
  --bundle /secure/backups/pre-upgrade-2026-10-29 \
  --new-database polaris_restore_20261029 \
  --uploads-target /srv/recovery/20261029/uploads \
  --generated-target /srv/recovery/20261029/generated \
  --config-target /secure/restored-runtime.env \
  --database-url-env POLARIS_RESTORE_ADMIN_URL \
  --pg-bin /usr/lib/postgresql/16/bin \
  --trusted-source
```

Destination parents must exist, but all three destination paths must be new and separate from the bundle and each other. A failed restore leaves only newly created targets for explicit inspection; it never automatically deletes a database or user files. SIGINT/SIGTERM abort active local subprocesses, and the database restore transaction rolls back if its connection ends. Treat an interrupted Docker execution as incomplete and inspect its new database before proceeding.

By default, file records retain their original runtime roots. For Compose, mount the restored host directories at those original application paths. To change the application's runtime roots intentionally, add:

```sh
  --rebase-uploads-path /srv/recovery/20261029/uploads \
  --rebase-generated-path /srv/recovery/20261029/generated
```

Rebasing updates only canonical `files.storage_path` values in the new database, checks ownership/reference metadata again, and writes the chosen roots to the new config. It does not change the source database or arbitrary text/URLs. Restored files initially belong to the operator. If the application runs under another OS identity, explicitly supply `--files-uid` and `--files-gid` while running with the necessary ownership-changing permission; no UID/GID is guessed. Keep the config file private to its intended reader.

The restored config intentionally contains an unusable `DATABASE_URL`. Replace that value with the **new database's application-role connection**, keeping the restored encryption key. Check credentials, filesystem mounts/ownership and external-write controls before starting a separate validation instance. Do not start it with the source connection or expose it to normal traffic. Verify login, both-user isolation, disabled accounts, a generated-file download, a saved encrypted setting and readiness. Exercise external integrations only through separately authorized test accounts.

## Application rollback boundary

```sh
node /srv/polaris/source/scripts/recovery.mjs assess \
  --bundle /secure/backups/pre-upgrade-2026-10-29 \
  --checkpoint /secure/releases/candidate-checkpoint.json
```

`assess` rejects a checkpoint older than the backup's journal, an unapplied forward migration or a diverging history. A match returns `applicationRollbackApproved: false`: schema compatibility is one release gate, not authority to deploy an older application.

Migration `0006_security_and_realtime_guards` adds `users.is_active`, `messages.realtime_event_id` and its per-conversation unique index. Legacy column lists still work: new users default active, and ordinary messages can retain null realtime IDs. **An application predating the security changes can still ignore disabling or replay protections.** Do not approve that downgrade merely because its SQL succeeds. The current initializer also rejects a database journal newer than its expected history.

Prefer a patched application release that retains the security behavior against the current schema. If recovery requires an older data checkpoint, restore it into another environment and rehearse the necessary forward migration with the supported application. Never delete migration journal rows, drop the additive columns/index, or run `db:push` as a rollback mechanism. Reconcile writes after the checkpoint before any deliberate cutover; this tooling does not perform that reconciliation or traffic switch.

## Automated rehearsal and observed coverage

The network-free safety checks run from the repository root:

```sh
node --test scripts/recovery.test.mjs
```

The database test is opt-in. From `apps/web`, with an explicit disposable local PostgreSQL service and matching clients:

```sh
node --env-file=/secure/recovery-test.env \
  --import=tsx --test tests/integration/recovery.integration.ts
```

The protected environment file supplies `POLARIS_RECOVERY_TEST_ADMIN_URL` and `POLARIS_RECOVERY_TEST_PG_BIN`. For a Compose rehearsal, replace the client path with `POLARIS_RECOVERY_TEST_COMPOSE_FILE` (absolute) and `POLARIS_RECOVERY_TEST_COMPOSE_PROJECT`; the same synthetic roundtrip then uses tools inside that running PostgreSQL service. Set `REQUIRE_POSTGRES_16=true` for the supported Compose/CI major. The test skips without the URL, creates unique `polaris_recovery_*` databases, and never migrates or seeds the database named by the administrative connection. It uses synthetic users, files and credentials; it calls no provider API.

The rehearsal verifies:

- Users, roles, disabled status, projects, transcripts, event identities and file joins survive.
- Uploaded/generated contents match their original hashes and retain application ownership associations.
- The restored key decrypts a synthetic provider configuration; a wrong key fails.
- Source changes after capture remain at source while the new environment recovers the checkpoint state.
- Existing targets are refused, schema downgrade is blocked, and legacy-column SQL does not remove migration 0006 protections.
- Only the test's own directories and databases are cleaned, using unique names and provenance checks.

On 29 October 2026, eight safety tests, the real restore rehearsal and TypeScript checking passed locally with Node 24 and matching PostgreSQL 18.4 clients/server. PostgreSQL 16 and the Compose transport require their own run before claiming that release gate; previous install CI coverage does not stand in for this new recovery test. The local client build lived entirely in scratch tooling and had no TLS support, so it was used only for the authorized loopback fixture.

## API-key recovery boundary

Migration 0007 adds key hashes, revocation/expiry state, rate buckets and lifecycle events. The recovery rehearsal preserves those rows as well as user ownership. An older backup can resurrect a key revoked after capture: reconcile later revocations or revoke restored keys before exposing the recovered API. Never treat restoring a backup as permission to resume traffic.

## Saved Pal task recovery boundary

Stop both the web process and the separate `pnpm pal:worker` process before capturing a consistent backup. Migrations 0008 and 0009 add the task/event ledger and pricing provenance. The restore command does not start either process or replay tasks.

Keep the worker stopped while inspecting a restored environment. A task that was queued at the checkpoint may have executed on the source after capture. Compare the source's later run events and dispatch records, then review or cancel duplicate restored requests before enabling the worker. Do not rewrite lease fields or delete migration journal rows to force a task to resume.

The worker fences claims and does not automatically replay interrupted dispatches. An expired lease can still represent provider work that completed after the connection was lost; interruption is not proof that nothing ran or that no charge occurred. Restoring older state cannot undo that external work. See [saved task operations](./pal-tasks.md) for worker lifecycle and cancellation limits.

## Reminder recovery boundary

Migration `0010_pal_one_off_reminders` stores pending reminders, delivered inbox entries, read state and cancellation state in PostgreSQL. The same Pal worker services reminders and saved text tasks. Stop both worker loops before backup and keep them stopped during restore validation.

An older backup can restore a reminder that was subsequently cancelled or removed, or make an entry unread again. A restored pending reminder whose due time has passed becomes eligible for delivery when the worker starts. Compare changes made after capture and reconcile those entries before enabling delivery; restoring the database is not permission to resume the queue. Delivery changes only the owned inbox row and does not send an email or contact message. See [reminder operations](./reminders.md) for delivery, retention and downgrade limits.

## Origin-key and history upgrade boundary

Migration `0011_pal_api_task_origin` binds API-created tasks to their originating key. Stop every older web and worker before applying it: an older worker can ignore the new origin-key dispatch policy even when its SQL still succeeds. Preserve later key revocations during restore reconciliation. Migration `0012_conversation_history_search` adds bounded search support without rewriting message content. Neither migration is a reason to remove journal rows or resume an older worker.

The combined 30 October upgrade was rehearsed in a restored database with the worker stopped, then applied to a fresh stopped-writer backup of the local demo. Both stages preserved the original columns and rows across all 29 pre-existing tables. Broker acceptance used synthetic sessions/files that were cleaned afterward. The matching worker resumed only after live login, readiness, history and workspace checks passed.
