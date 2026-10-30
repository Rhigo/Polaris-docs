# Administrator setup

This path starts with an **approved application checkout** and a fresh Linux deployment. Application source access is currently private; obtain the checkout and the approved release revision from the maintainer. The public Polaris-docs repository is only the handbook. Existing users should follow [Start here](./start-here) instead.

The commands below describe the current installer and configuration. They were checked against source; this documentation change has not yet been followed end to end by a new administrator. Existing automated installation/restore evidence is listed in [operations](./operations) and [recovery](./recovery). A fresh walkthrough remains a release gate.

## Before starting

- Use Linux with a running Docker Engine, the Docker Compose plugin, Bash and OpenSSL. Git is needed if obtaining a Git checkout. The current user must be allowed to use Docker. Follow your operating system's supported installation process; the Polaris installer does not install these prerequisites.
- Choose the server address users will open and arrange DNS/routing to the host. The default proxy publishes ports **80 and 443**; those ports must be available. This is not a recipe for exposing an unreviewed development machine to the internet.
- Use a trusted HTTPS certificate before offering the server to users. The installer creates a self-signed certificate when none is present; that is a development convenience and may not support microphone/app installation reliably. Do not train users to bypass unexpected certificate warnings. Existing `nginx/certs/cert.pem` and `key.pem` are preserved; configure their trusted replacement through your normal certificate process.
- Choose an administrator email, a private place to save the generated password, and protected backup storage. Keep the source release, configuration and encryption key recoverable together. Resource sizing depends on users and workloads; this guide does not claim a tested minimum hardware specification.

## Start a fresh web installation

In a terminal, change to the approved application checkout containing `docker-compose.yml` and `scripts/install.sh`. Replace the example hostname and email with your own values, then run:

```sh
POLARIS_HOST=polaris.example.com \
POLARIS_URL=https://polaris.example.com \
POLARIS_ADMIN_EMAIL=admin@example.com \
bash scripts/install.sh
```

`POLARIS_HOST` is a hostname or IPv4 address without a scheme/path. `POLARIS_URL` is the full address users will open. For a local-only test these can be `localhost` and `https://localhost`; a different device's localhost is not this server.

The installer generates a protected `.env`, database/authentication/encryption secrets and an initial password when no `.env` exists. It builds the Compose stack, applies the active migration journal and waits for web/proxy health. On a fresh successful install it prints **Polaris is ready**, the `/login` URL, administrator email and generated password. Save the password privately; this output and `.env` are sensitive. Do not paste them into an issue or screenshot.

If `.env` already exists, the installer preserves it and existing data. The first account is created only when the users table is empty. Re-running the installer or changing `INITIAL_ADMIN_PASSWORD` does not reset an existing account. Use the [release/restore procedure](./recovery) for an upgrade, not an unplanned fresh-install reset.

## Verify the first login

1. Open the printed `/login` URL through the intended trusted HTTPS address.
2. Sign in with the initial administrator account. Confirm **Admin panel** is available in the account menu.
3. Complete [provider and model setup](./providers). Saving a credential is not proof that a model request will succeed.
4. After agreeing a small test with the provider account owner, send one harmless message through chat and confirm the reply/error is shown. This may incur provider charges. Do not use real secrets or personal files for the test.
5. Configure intended users/model assignments and verify one ordinary user can sign in and access only their own conversations and files before wider use.

The installer starts the web/data stack. It does **not** automatically start the separate source worker, provision model credentials, deploy an isolated browser/execution host or enable every tool. Empty model lists and disconnected optional tools are expected until their setup is complete.

## If startup or sign-in fails

| Symptom | Check next |
| --- | --- |
| Docker/Compose prerequisite error | Confirm Docker is running and accessible to this user; fix the prerequisite before repeating installation |
| Startup does not become ready | Run `docker compose ps`, then inspect `docker compose logs db-init web nginx` privately. `/api/health` is only liveness; `/api/ready` checks the database/schema/active administrator |
| Browser cannot reach the address | Check the intended hostname, DNS/routing, published ports and certificate; keep the public URL consistent with `.env` |
| Password from a prior run does not work | The installer preserves existing accounts. Ask the authorised operator to repair access; do not delete the database or regenerate encryption keys |
| A page loads but no model is available | Complete [provider/model setup](./providers), including provider enablement, model enablement and user/group access |

Logs can contain sensitive details; review/redact them before sharing. Do not use `db:push`, delete volumes or erase `.env` to work around a readiness failure.

## Add optional services deliberately

- **Saved tasks, workflows and reminders:** run the matching [Pal worker](./pal-tasks#run-the-local-worker), with the same database and configuration-encryption key. Apply the complete migration journal from the approved release first. The web-only standalone image does not package this source CLI. Keep the worker host awake and use a process supervisor for unattended use.
- **Local models:** configure a reachable Ollama runtime following [provider setup](./providers#local-models-with-ollama). Local model storage/hardware and model downloads are separate from the web installation.
- **Code execution:** deploy and verify the separate [execution service](./execution-isolation) before setting its private broker URL/key. No host-shell fallback exists.
- **Manual Pal desktop:** separately provision and verify the fixed Debian/Xfce adapter, assign its policy to the intended owner and match the app/proxy/viewer origins. The [operator handoff](./desktop-operator-handoff) covers new empty identity, binding and retained state. It is not started or allocated by application Compose.
- **Browser workspace:** deploy and verify its separate [browser service](./computer-workspace). A host's loopback address is not automatically reachable from a web container; use the documented private network arrangement.

Before upgrades, stop the relevant writers/workers, take a protected backup and rehearse restoration into a separate target. A complete backup includes the database, uploads/generated files and the actual keys/configuration needed to read them. Follow [backup and recovery](./recovery); chat export alone is insufficient.
