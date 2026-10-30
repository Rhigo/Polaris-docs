# Saved text tasks

Pal can save a bounded drafting, summarising or planning task, run it in a separate local worker, and show its saved activity and result after a reload. This first workflow makes one text model request using the information you supply. Browser control, terminal commands, file access, connected apps, notifications and schedules are not enabled by starting a saved text task. [One-off reminders](./reminders) have their own explicit date/time form and inbox, serviced by an independent loop in the same worker.

## Use it

1. Open **Pal**, enter the text task and choose an enabled model you can access.
2. Select **Start saved task**. The saved task first says **Waiting for worker**. It becomes **Working** only after a worker claims it.
3. Open the task to follow saved activity and partial text. Close the tab if needed; return through the recent task list or its `/pal?run=…` URL. Reloading does not start another request.
4. Use **Cancel task** to cancel queued work immediately or request that active work stop. Active cancellation is acknowledged by the worker. A lost worker remains visibly unconfirmed until lease reconciliation.

Cancellation stops further local task work and aborts the provider request where supported. It does not prove that remote computation or billing has stopped. A completed response is saved as plain text. The current view lists the latest 30 tasks; older task URLs still open their saved results.

External scripts can submit the same bounded workflow through the [Developer API](./api), with explicit task scopes. API tasks are visible to their signed-in owner in Pal. They retain an originating-key identity: expiry, revocation or rotation before dispatch prevents them from starting; a replacement key cannot inspect or cancel them through the API. The owner can still use the task's Pal URL.

## Limits and access

| Limit | Current value |
| --- | --- |
| Task input | 12,000 characters and 32,000 UTF-8 bytes; HTTP body at most 64,000 bytes |
| Model instructions from administration | 8,000 UTF-8 bytes |
| Local run deadline | 2 minutes per claim; provider cancellation is best effort |
| Output | At most 2,048 model output tokens and 16,000 text characters |
| Queued/active tasks | At most 3 per user and 100 across the installation |
| Active worker claims | At most 1 per user and 2 across workers |
| Queue lifetime | 24 hours; an available worker expires older queued work |
| Worker contact | Heartbeat every 2 seconds; claim lease 15 seconds |

Configured model limits can reduce the output allowance. A worker process handles one task at a time; two worker processes can use the global capacity. SQL admission locks and fenced claims enforce the limits across processes. Account activation, provider availability and model assignment are checked before dispatch, during the stream, and before success. Account deletion removes its saved tasks through the ownership foreign key.

Native tools and function tools are absent from the provider request. Unexpected action events fail the task; there is no tool dispatch path. These token/time limits are not a dollar budget. Unknown usage or unverified pricing remains unknown rather than becoming a zero-cost claim. See [token usage estimates](./token-accounting) for the reviewed rates, provenance and excluded charges.

## Run the local worker

Use an approved source checkout with its locked dependencies installed and the same database and configuration-encryption key as the web application. Apply the complete migration journal shipped with the approved release using the [release and recovery procedure](./recovery), including the saved-task, pricing, reminder, API-origin and workflow migrations, before starting the worker. Stop all older workers during upgrade and use matching web/worker code; older workers do not enforce the originating-key policy.

From the repository root:

```sh
pnpm pal:worker
```

The command loads `apps/web/.env.local` when present; existing environment variables take precedence. Keep that file private. The worker needs `DATABASE_URL` and `ENCRYPTION_KEY` to use an already configured provider. Do not place API keys in task text, command arguments or logs. It reads provider configuration from the database and does not require Redis.

For a single claim/reconciliation pass:

```sh
pnpm --filter web pal:worker --once
```

`SIGINT` or `SIGTERM` requests a clean stop. A configured process supervisor may restart the worker process; an interrupted task is never automatically replayed. The web server does not start this worker, and the web-only standalone image does not supply this source-checkout CLI. Worker deployment and monitoring must therefore be explicit.

The host must remain awake and connected for unattended work. Sleeping the computer, losing the database, or killing the worker can interrupt an active request. Queued work can start when a worker becomes available. Cloud execution and schedules require separate implementations.

## Persistence and recovery behavior

A run and its first event commit together. An owner-scoped request UUID makes an unchanged submission retry recover the same run; reusing that UUID with different text/model is rejected. Claims have a unique fencing token and a single attempt. A dispatch checkpoint is saved before calling the provider. Partial text is saved at least every two seconds while the worker can reach the database, or in larger chunks as they arrive.

An expired claim becomes **Interrupted** when an available worker reconciles it. Its saved text remains visible. Neither a crash before dispatch nor an uncertain response after dispatch causes automatic re-execution. Start a new task explicitly after reviewing the saved result. No action ledger, side-effect retry or exactly-once external execution is claimed by this text-only slice.

Terminal events and usage accounting share one transaction. A stale worker cannot append text or finish a run after its claim is replaced or reconciled. If final persistence fails, the claim is left for reconciliation instead of reporting success. A response that reached the provider but lost its usage event may still incur charges; saved usage remains unknown.

For an application rollback, stop the worker before changing releases and follow the recovery checkpoint procedure. Keep the additive run tables and their history; do not automatically drop them or run an older migration initializer against a newer journal. A release without the Pal worker cannot service its queue. Returning to a compatible release reconciles expired claims without replaying them.

## Data and provider policy

Task input, output, usage and events are saved in the application database and included in database backups. They are not temporary chats. This slice has no individual task deletion/retention UI; account deletion cascades to its task records. Operators must include these tables in their retention and recovery policies.

The worker explicitly requests the adapter's `responseStorage: "stateless"` policy. For OpenAI this sends `store: false` and excludes response-ID chaining. Anthropic omits explicit prompt-cache hints. This does not promise zero data retention, a particular region, or deletion from all provider systems. The configured provider/account terms and endpoint still apply. Only the selected task text and configured model instructions are sent; conversation memory and uploaded files are not attached.

## Verification

`pnpm --filter web test` covers request ownership/validation and synthetic streaming, cancellation, revoked access, limits, missing usage and no automatic retry. No provider credentials are used.

For the real database suite, supply `DATABASE_URL` for a **loopback disposable test cluster** and explicitly opt in:

```sh
POLARIS_PAL_INTEGRATION=1 pnpm test:integration:pal
```

The suite creates a unique `polaris_pal_<uuid>` database, migrates it, uses synthetic users/models and injected provider events, then drops only that database. It proves concurrent admission, ownership and idempotency, cancellation, expired/replaced claim fencing, current account/model access, result reconstruction, and atomic terminal/accounting rollback. It skips before initialization unless the opt-in flag is set. It does not test live provider quality, provider-side cancellation, or browser/terminal execution.

The same worker also runs [versioned text workflows](./workflows), a separate bounded sequence of one to four OpenAI text steps. Apply the matching release through 0013 before enabling that worker version. Saved tasks keep the single-request behavior described here.

This is a first slice of RUN-01, RUN-03 and RUN-04. General multi-step agents, action outcomes, schedules, approvals, computer control and the broader [Pal journey](./pal) remain separate acceptance work.
