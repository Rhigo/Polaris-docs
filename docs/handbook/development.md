# Development setup

Use a disposable development database and local uploads directory. Preserve any existing `.env` and database before changing configuration.

## Requirements

- Node.js 22 or 24, matching the CI matrix; local verification uses24.19.0.
- pnpm **10.33.0**, matching `packageManager` and the lockfile.
- PostgreSQL 16 for deployment parity. The isolated Mac review used PostgreSQL 18; this is not a substitute for the production-version test.
- Docker/Compose for application deployment checks; an explicitly disposable Linux execution VM or CI runner for real sandbox checks.

Install dependencies from the repository root:

```sh
corepack enable
pnpm install --frozen-lockfile
```

If Corepack is unavailable, install the pinned pnpm release using your normal Node toolchain. Do not regenerate the lockfile with an unrelated pnpm major version.

## Configure the web app

Create `apps/web/.env.local` with local-only values. Generate fresh secrets; the root `.env.example` describes deployment settings, while local development also needs a direct database connection string.

```dotenv
DATABASE_URL=postgresql://YOUR_DEV_USER:YOUR_DEV_PASSWORD@127.0.0.1:5432/YOUR_DEV_DATABASE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=GENERATE_A_RANDOM_SECRET
ENCRYPTION_KEY=GENERATE_64_HEX_CHARACTERS
# Optional: configure both only after deploying the dedicated execution broker.
SANDBOX_SERVICE_URL=
SANDBOX_SECRET=
INITIAL_ADMIN_EMAIL=admin@example.test
INITIAL_ADMIN_PASSWORD=CHOOSE_A_UNIQUE_PASSWORD_OF_AT_LEAST_12_CHARACTERS
UPLOAD_DIR=/absolute/path/to/disposable/uploads
```

Never commit the real file. Do not use these placeholders as credentials. Python and shell execution stay disabled until a separate broker is configured; follow the [execution isolation guide](./execution-isolation). Keep provider-native tools within their separate provider policy.

Apply the migration journal and seed the initial account:

```sh
pnpm db:init
pnpm dev
```

Initialization uses the tested `--import=tsx` loader. `db:init` applies the active migration journal and seed in one serialized transaction; separate `db:migrate` and `db:seed` commands remain available. The bootstrap administrator is created only when the users table is empty. Existing accounts, passwords, roles, disabled state and provider settings are preserved.

Use the migration journal, not every SQL filename in alphabetical order: the repository contains an extra historical SQL file outside the active journal. Do not run `db:push` against production as a shortcut for reviewed migrations.

## Verify changes

```sh
pnpm test
pnpm typecheck
pnpm build
pnpm docs:check
pnpm docs:build
```

The unit suite is supplemented by opt-in real-database and authenticated HTTP checks. `pnpm test:integration:database` creates and removes uniquely named disposable databases using the configured PostgreSQL credentials. Against a local running test server, set `POLARIS_TEST_BASE_URL` and run `pnpm test:integration:auth` and `pnpm test:integration:realtime`; those suites create and clean their own synthetic users. Keep these tests away from production. Run the [real isolation suite](./execution-isolation) only on an explicitly disposable Linux execution host; do not run it on a developer host carrying user data or execute generated code directly on a laptop.

## Work on documentation

```sh
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

The site source is **only** `docs/handbook`. The preview uses `/Polaris/`, matching the intended project Pages URL. VitePress is pinned to stable 1.6.4. [Deployment reference](https://vuejs.github.io/vitepress/v1/guide/deploy).

Update `docs/handbook/backlog.json`, then run `pnpm roadmap:generate`. CI checks IDs, dependency cycles, valid statuses, acceptance criteria and whether the generated Markdown is current.
