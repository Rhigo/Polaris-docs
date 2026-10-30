# Developer API

Create a key from your account menu → **Developer access**. External scripts can discover models, read a minimal profile, manage [versioned text workflows](./workflows), and create, inspect or cancel bounded [saved Pal text tasks](./pal-tasks). A separate worker makes one text model request using the supplied information. Streaming chat, files, tools, general workflow graphs and OpenAI-compatible request formats remain separate, unfinished capabilities. The machine-readable OpenAPI 3.1 contract is served by your installation at `/api/v1/openapi`.

## Create and manage a key

Choose a name, only the permissions your integration needs, and an expiry. Copy the secret into your secret manager when it appears: it is shown once. The server stores a SHA-256 hash of a random 256-bit secret; it cannot recover the plaintext. The application keeps the displayed secret only in component memory, not local storage.

| Permission | Endpoint | Response |
| --- | --- | --- |
| `models:read` | `GET /api/v1/models` | `data` array with each model's `id`, `provider` and `name`, filtered by the owner's current model access |
| `profile:read` | `GET /api/v1/me` | `data.id` and `data.name`; no email, credentials or settings |
| `tasks:create` | `POST /api/v1/tasks` | 202 and `data`, the new or identical retained task summary |
| `tasks:read` | `GET /api/v1/tasks` | This key's latest 30 task summaries, `limit: 30` and fixed `limits` |
| `tasks:read` | `GET /api/v1/tasks/{id}` | Saved status, events, partial/result text and reported token usage |
| `tasks:cancel` | `POST /api/v1/tasks/{id}/cancel` | Current task summary; no request body |

The three task permissions are separate opt-ins. Existing keys gain no new scopes, and new-key forms select only `models:read` by default. For a complete script workflow, explicitly select `models:read`, `tasks:create`, `tasks:read` and `tasks:cancel` on the **same key**. A create-only key can submit work but cannot inspect or cancel it through the API.

Rotation invalidates the old key and returns a replacement once, preserving its scopes, rate and original expiry. Revocation is permanent for that key. Requests that already passed authorization can finish; new requests are rejected. Disabling or deleting the owner also invalidates their keys. API keys cannot administer accounts, manage other keys or substitute for a browser session.

If a create/rotate response is interrupted, refresh the list and revoke the new record whose secret you did not receive before retrying. Do not automatically retry key issuance. Use HTTPS for deployments and keep secrets out of URLs, source control, screenshots and client-side application bundles.

## Versioned text workflows

The [workflow API and executable client](./workflows) use six additional, explicit opt-in scopes: `workflows:read`, `workflows:write`, `workflow-runs:create`, `workflow-runs:read`, `workflow-runs:cancel` and `workflow-runs:delete`. Existing keys gain no rights. API-created definitions and runs are bound to their originating key; a rotated replacement cannot take them over. Signed-in owners retain access and cancellation through the application.

Definitions contain one to four sequential OpenAI text steps with explicit input references. Immutable revisions, bounded output, persisted progress and no automatic replay are part of this contract. It is native Polaris JSON, not an OpenWebUI Python plugin or a general graph runtime. The separate Pal worker must run the matching release and migration 0013. Its token/time limits are not dollar spend caps.

## Limits and responses

- Default: 60 requests per key per fixed UTC minute. Issuance accepts 1–120; the UI uses the default.
- At most 10 active keys and 20 newly issued keys per owner in a rolling 24 hours. Rotation counts as an issuance and can replace an occupied active slot atomically.
- Expiry is required: 1–365 days. The UI offers common durations; server time is authoritative, including after waiting for a database lock.
- Successful data reads return `X-Request-Id`, `X-RateLimit-Limit` and `X-RateLimit-Remaining`. Rate-limit responses include `Retry-After: 60`. Data and key-management responses use `Cache-Control: no-store`.
- Errors contain `error.code`, `error.message` and `error.requestId`: 401 for invalid credentials, 403 for a missing scope, 429 for a limit, and 500 for a sanitized unexpected failure. Invalid key-management input can return 400, 413 or 415.

Counters and issuance use database transactions, including concurrent requests. Lifecycle records contain owner/key IDs, action and time; request logs contain a request ID, key ID and status, without bearer secrets or task text. Per-user request/spend budgets remain unfinished. Model/profile discovery does not call a provider; the saved-task worker can incur provider charges.

## Saved-task contract

Use `GET /api/v1/models?purpose=saved_text` to discover eligible base text models. The unfiltered model endpoint also includes virtual models, which this task workflow does not accept. Creation and the worker independently recheck current provider/model/account access; discovery is not a durable authorization grant.

Persist a caller-generated UUID and the full JSON payload before submitting:

```json
{
  "requestId": "3d1d7733-a85a-4e30-83b7-e11d8d53cc69",
  "task": "Summarize these supplied notes: the draft is complete; review is on Friday.",
  "provider": "ollama",
  "model": "replace-with-an-eligible-model-id"
}
```

Generate your own UUID for each intended task; the example UUID is illustrative. Send `Content-Type: application/json`. Unknown fields are rejected, including owner/key IDs, files, tools, project IDs, streaming flags and custom execution limits. Request identity is scoped to the account and bound to the original key. Repeating an identical retained request returns the same task with 202, including after completion; it does not redispatch. Different text/model or a different key using that account's same request UUID returns 409. Whitespace around text/model is normalized before comparison.

| Bound | Current contract |
| --- | --- |
| Creation body | 65,536 bytes; strict JSON object |
| Task text | 1–12,000 UTF-16 code units after trimming, at most 32,000 UTF-8 bytes; no NUL |
| Model ID | 1–200 UTF-16 code units after trimming; no NUL |
| Execution | One model request, at most 2 minutes, 2,048 output tokens and 16,000 stored text code units; model capabilities can reduce the token ceiling |
| Queue | Shared with browser tasks: 3 pending per user, 100 globally; 1 active claim per user, 2 globally |
| Queue lifetime | 24 hours, reconciled by an available worker |
| Inspection | Latest 30 for this key; direct ID reads retain older records; up to 512 persisted events per detail response |

Task endpoints accept no query parameters, pagination, event cursor or SSE stream. The list is a recent view, **not a complete archive**; save returned task IDs. Poll a single detail every two seconds within the key's aggregate request limit. `queued` means saved and waiting, `running` means claimed, and `cancel_requested` means cancellation is awaiting worker acknowledgement. Terminal states are `succeeded`, `failed`, `cancelled` and `interrupted`. Result text can be partial; nullable usage means unreported, not free. Token/time limits are not dollar budgets.

Cancellation immediately terminates queued work and requests best-effort stop for active work. Repeating cancellation returns the current state; terminal work is unchanged. Cancellation does not prove that a provider stopped computation or billing. A crashed or uncertain dispatch is never automatically replayed; review it before deliberately creating a new task.

Task validation returns 400, oversized input or any cancellation body returns 413, and an unsupported media type returns 415. Unavailable model access returns 403, ownership/key mismatches return 404, conflicting request UUIDs return 409, and key-rate or shared-queue limits return 429. Error bodies remain sanitized. After an uncertain creation response, explicitly retry only the identical saved payload and request UUID; do not generate a new UUID automatically.

## Key ownership, expiry and rotation

API inspection and cancellation require both the current account and the **same originating key**. A second key belonging to the same person does not inherit the first key's tasks. Browser-created tasks are also excluded from key-based reads. The signed-in account owner can inspect or cancel their own tasks in Pal, including an older task at `/pal?run=TASK_UUID`.

Before provider dispatch, the worker checks the original key's owner, active account, `tasks:create` scope, revocation and expiry. Owner/key locks coordinate this check with rotation and revocation; a fresh database-clock check occurs after lock waits. Missing originating keys fail closed. The original UUID is retained without a foreign key that could turn it into an unscoped browser task on deletion.

The transaction recording dispatch authorization is the boundary: work authorized beyond that checkpoint may still start or finish after the key expires or is revoked. Account/model controls and an explicit task cancellation still apply during the run. Key revocation is not an active-task cancellation mechanism.

Rotation produces a new key ID. The replacement cannot inspect/cancel the old key's tasks, and replaying the old request UUID with it returns 409. Undispatched old-key tasks fail with `originating_key_unavailable`; an already authorized task may finish. Use the browser owner's Pal view for recovery. Never silently translate an old task to the replacement credential.

Recovery uses a known task ID or the owner's recent list. There is currently no paginated archive or lookup by creation request UUID. If an uncertain submission's task ID was lost before rotation and it is outside the recent list, operator review of the retained records is needed; do not invent a new UUID to assume the original never ran.

## Request examples

Supply `POLARIS_BASE_URL` and `POLARIS_API_KEY` through your local environment or secret manager. The base URL is your installation's origin, for example `https://polaris.example`.

The repository includes executable clients: `examples/pal-tasks.mjs` (Node 22/24), `examples/pal-tasks.py` (Python 3 standard library), and `examples/pal-tasks.sh` (curl 8.4+ transport with the Python validator). They share the same commands:

```sh
node examples/pal-tasks.mjs models
node examples/pal-tasks.mjs create task.json
python3 examples/pal-tasks.py get TASK_UUID
python3 examples/pal-tasks.py wait TASK_UUID
sh examples/pal-tasks.sh cancel TASK_UUID
```

`task.json` contains your persisted payload. Replace `TASK_UUID` with the returned `data.id`; the creation request UUID and task ID are distinct. `list` shows the latest 30 records. `wait` polls for at most three minutes, then stops polling without cancelling the durable task. Keys are read from the environment, never command arguments. The curl wrapper supplies its bearer header on stdin and uses a private temporary request file that it removes afterward.

All clients require HTTPS or loopback HTTP, refuse redirects, bound requests/responses and do not retry mutations. Successful JSON can contain private task text and results; handle stdout accordingly. Error output omits bearer headers and server bodies. Browser CORS access is not enabled; use a backend or local script. These examples are not a full SDK or a streaming-chat compatibility claim.

## Operation and recovery

Migration `0007_user_api_keys` adds key hashes, rate buckets and lifecycle events. Run `pnpm db:init` through the supported upgrade process after a verified backup. Keep the database private and include it in the [recovery procedure](./recovery). Restoring an older backup can restore an older revocation state: before exposing the recovered API, reconcile revocations made after capture or revoke all restored keys. A database restore never grants approval to resume external traffic automatically.

Migration `0011_pal_api_task_origin` follows the unchanged 0008–0010 migrations and adds the nullable originating key UUID. Existing browser tasks retain NULL. Stop **every older worker** before the upgrade, migrate using the approved release, and start web and worker code from that same release before enabling task scopes. Older workers do not enforce this origin contract; mixed-version workers and application downgrade while API-origin tasks exist are unsupported. Do not delete origin IDs or journal entries to make old code run.

The web server does not launch the worker. Start `pnpm pal:worker` explicitly from the approved source checkout with its locked dependencies, private database URL and configuration-encryption key. Without it, API submissions remain queued; accepting a task is not evidence of execution. See [worker operation](./pal-tasks) and [restore reconciliation](./recovery) before enabling a restored queue.

The HTTP suite uses a unique disposable PostgreSQL database and a private standalone server. After building, run `pnpm test:integration:api-keys` with an explicit local `DATABASE_URL`. Fourteen test records cover disclosure, ownership, scopes, current account state, expiry, Origin enforcement, rate/issuance races, rotation rollback and secret-free diagnostics. Desktop and 390px Chrome checks cover navigation, scope validation, expiry selection, rotation, cancel/revoke, reload and keyboard focus. Screenshot accounts and keys are synthetic; the captured keys were revoked after testing. Clipboard copying was not exercised against the user's system clipboard.

For the task contract, build first and use a loopback test cluster with CREATE DATABASE permission:

```sh
POLARIS_API_TASK_DB=1 POLARIS_API_TASK_HTTP=1 pnpm test:integration:api-tasks
```

These suites create and remove only uniquely named disposable databases. They exercise expiry/revocation lock barriers, absent origin keys, scope changes, same-key ownership, UUID conflicts, shared admission, rotation recovery, real CLI worker progress/cancellation, current model access and all three clients. The HTTP server runs from a relocated standalone bundle outside the checkout. Model events come from a synthetic loopback fixture; no paid provider calls, outbound messages or browser notifications are used. With neither opt-in flag set, both wrappers skip before creating fixtures.
