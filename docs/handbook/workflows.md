# Versioned text workflows

A text workflow saves a sequence of one to four OpenAI model steps. Each step receives your original input, selected earlier results, or both. Definitions have immutable revisions; a run keeps the revision it started with, its input, progress and results across reloads.

Open **Pal → Build a saved text workflow**. Edit the JSON or import a definition, save it, choose a revision and supply the original input. Publish a new revision to change future work. Export returns the selected revision as importable JSON. This runner performs text generation only; it does not execute tools, Python, browser actions, file operations or connected-app actions.

## Try the two-step example

1. Open **Pal → Build a saved text workflow**, then **New workflow**.
2. Expand **Available OpenAI models** and choose an exact ID available to you. Copy the example below into **Definition JSON** and replace both model IDs if needed. Change the name or prompt to make it your own; keep the JSON structure and step references intact.
3. Wait for **Valid version 1 definition**, then select **Save workflow**. If validation fails, check quotes, commas, model IDs and the displayed error. This is a JSON editor, not a visual drag-and-drop builder.
4. Select the intended **Saved revision**, enter harmless text under **Original input**, then choose **Run saved workflow**. Each step can incur provider charges. The separate worker must be running.
5. Follow **Run progress** and each step’s result. Reloading does not queue another run. **Cancel run** requests cancellation; inspect the saved state before intentionally starting a replacement.

Editing a saved definition requires **Publish new revision** before future runs use the change. **Export JSON** downloads that definition, not all run history. These control labels were checked against source; provider-account availability and a new-user walkthrough are separate validation gates.

## Definition contract

```json
{
  "schemaVersion": 1,
  "name": "Draft and review",
  "steps": [
    {
      "id": "draft",
      "model": "gpt-6-luna",
      "prompt": "Write a concise draft from the supplied input.",
      "inputs": ["input"]
    },
    {
      "id": "review",
      "model": "gpt-6-luna",
      "prompt": "Review the draft for clarity and return a polished version.",
      "inputs": ["draft"]
    }
  ],
  "output": "review"
}
```

Choose model IDs available to your account. A definition uses OpenAI base text models; it cannot select virtual models or a different provider. Models and account access are checked when saving/queueing and again before and during actual requests.

Step IDs are unique lowercase names, starting with a letter, up to 32 characters. `input`, `constructor`, `prototype` and `__proto__` are reserved. Inputs must be distinct references to the original `input` or earlier step IDs, in the order you want them supplied. Forward/self references, branching, cycles, expressions and unknown fields are rejected. `output` must name the final step. Prompt text is literal; `${input}` and `{{draft}}` are not template expressions.

| Boundary | Limit |
| --- | --- |
| Steps | 1–4 sequential model requests |
| Definition | 32,768 UTF-8 bytes after canonical JSON serialization |
| Imported JSON file | 65,536 raw UTF-8 bytes, including formatting |
| Step prompt | 8,000 UTF-16 code units and 8,000 UTF-8 bytes |
| Original input | 16,000 UTF-16 code units and 16,000 UTF-8 bytes |
| Step output | 1,024 model output tokens and 16,000 saved UTF-8 bytes |
| Time | 120 seconds per step; five minutes per run |
| Run output/events | 64,000 saved UTF-8 bytes; 512 ordered events |
| Retained definitions/revisions | 100 definitions per owner; 50 revisions per definition |
| Retained runs | 1,000 per owner |
| Pending runs | 3 per owner; 50 globally |
| Active workflows | 1 globally across worker processes |
| Queued lifetime | 24 hours, reconciled by an available worker |

The workflow capacity is separate from existing [saved text tasks](./pal-tasks), which retain their two-active-task global limit. Together the worker services can dispatch at most three model requests concurrently across an installation. Token/time limits are not dollar budgets.

## Progress, cancellation and deletion

Select a saved run to see each step's persisted status and partial output. The list shows the latest 30 runs for the selected workflow. The API can inspect older records by saved run ID. Reloading or polling never creates another run.

**Cancel run** immediately cancels queued work or records a cancellation request for active work. The worker stops later steps and aborts the active transport best-effort. Its acknowledgement does not prove that provider computation or billing was reversed. An already dispatched step may finish after originating-key revocation; every later dispatch must pass a new authorization check.

A lost lease, crash or shutdown ends the run as **Interrupted** when reconciliation occurs. Completed steps and saved partial text remain. The worker never resumes an interrupted step or automatically starts a replacement run, even if a crash happened before the provider request. Review the saved state and explicitly start a new run when appropriate.

Remove terminal runs to free the 1,000-record capacity. Pending runs must be cancelled and acknowledged first. Remove all referencing runs before deleting a definition and its revisions. These operations require an explicit user action; there is no automatic retention job. Deleting a record removes its retained request-ID protection, so idempotency is not a permanent exactly-once guarantee. Existing usage totals remain after a run is removed.

## Developer API

The [OpenAPI contract](/api) is served at `/api/v1/openapi`. These are Polaris polling endpoints, not an OpenAI chat-completions or streaming-agent API.

| Operation | Required opt-in scope |
| --- | --- |
| List/read/export definitions | `workflows:read` |
| Create/import, publish revisions, delete unused definitions | `workflows:write` |
| Start a run from a pinned revision | `workflow-runs:create` |
| List/read saved runs | `workflow-runs:read` |
| Request cancellation | `workflow-runs:cancel` |
| Delete terminal runs | `workflow-runs:delete` |

Existing keys do not gain these scopes. Every API operation is restricted to the authenticated owner and the exact key that created the definition or run. A rotated key has a new identity and cannot inspect, cancel or silently reauthorize old-key work. The signed-in owner can still manage it through the application.

- `POST /api/v1/workflows`: `{requestId, definition}`. Import uses this same endpoint.
- `GET /api/v1/workflows/{id}`: definition summary and immutable revisions.
- `POST /api/v1/workflows/{id}/revisions`: `{requestId, definition}`.
- `GET /api/v1/workflows/{id}/export?revisionId=…`: the definition JSON itself.
- `POST /api/v1/workflows/{id}/runs`: `{requestId, revisionId, input}`.
- `GET /api/v1/workflow-runs?workflowId=…`: latest 30, optionally filtered.
- `GET /api/v1/workflow-runs/{id}`: saved steps, outputs, usage and events.
- `POST /api/v1/workflow-runs/{id}/cancel`: no body.
- `DELETE /api/v1/workflow-runs/{id}`: terminal runs only.
- `DELETE /api/v1/workflows/{id}`: only after its runs are removed.

Mutations accept at most 65,536 bytes of JSON. Cancellation/deletion accept no body. Unknown fields/query parameters are rejected. Existing per-key minute rate limits apply. Poll a single run roughly every two seconds within your key's limit.

Persist a request UUID before each create/publish/start operation. Reuse the same payload and UUID after an uncertain HTTP response; a retained identical request returns the same resource, while changed content or originating credentials conflict. No automatic retry is performed by the worker. Publishing a revision never changes an existing run.

The executable [Node client and examples](https://github.com/Rhigo/Polaris/tree/main/examples/workflows) include an explicit receipt file for request IDs. Its `submit` command can recover an uncertain submission with the original input, definition and key; `inspect`, `cancel` and `export` use the saved IDs. It sends no credentials in URLs or command arguments and stores no key/input text in the receipt. A framework can import `createWorkflowClient` or emit the same version 1 JSON directly.

## Worker and storage

Apply the matching release through migration `0013_text_workflows`, after unchanged migrations 0011 and 0012, before starting the new worker. Stop older worker processes during upgrade. The ordinary command runs independent saved-task, reminder and workflow loops:

```sh
pnpm pal:worker
```

For a workflow-only single pass:

```sh
pnpm --filter web pal:worker --workflows-only --once
```

Use the approved source checkout, locked dependencies, database and configuration-encryption key. The web server and web-only standalone bundle do not start or package this source CLI. The host must remain awake; use an explicit supervisor for unattended service. `--reminders-only` continues to exclude all model work.

Each dispatch is recorded under an owner/key/run lock order and a fenced claim. Account, key scope/revocation/expiry and lease checks use current database state after row-lock waits. Definition revisions and run snapshots are immutable through the API. A completed step, its result and its usage record commit together. A stale worker cannot append or complete after lease loss. An uncertain provider outcome becomes interrupted/failed with unknown usage when necessary; no external exactly-once claim is made.

Definitions, inputs, outputs and events are saved in the application database and included in backups. They are not temporary chats. OpenAI requests explicitly use `responseStorage: "stateless"`, sending `store: false` without response-ID chaining. This does not promise provider-wide zero retention, residency or deletion. Conversation memory, attachments and tools are not included. Provider keys remain in the existing encrypted configuration; definitions have no credential fields.

Unknown pricing stays unknown. Each dispatched step records usage once when it reaches a terminal checkpoint; a lost provider usage report cannot establish the full bill. See [usage estimates](./token-accounting).

For downgrade, stop the worker, retain additive 0013 tables and use the [release/recovery procedure](./recovery). An older release cannot process workflow runs. Returning to compatible code reconciles interrupted claims; it never replays them automatically. Do not drop tables as an automatic rollback.

## Compatibility boundaries

This is a native declarative JSON format. It does not import or run Open WebUI Python Functions, implement the separate Pipelines service contract, or provide an MCP client.

Open WebUI [Functions](https://docs.openwebui.com/features/extensibility/plugin/functions/) execute within that application's Python/plugin contracts. The separate [Pipelines repository](https://github.com/open-webui/pipelines) distinguishes OpenAI-style pipe integrations from filter integrations requiring client support. A generic HTTP hook does not supply those lifecycle, storage or execution contracts.

MCP 2026-07-28 uses per-request metadata and discovery; the 2025-11-25 lifecycle uses initialization and different session/transport behavior. The TypeScript SDK v2 documents separate modern/legacy modes and a legacy default. A future connector must pin and test its chosen contract, credential boundaries and approval policy. [Current changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [legacy lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle), [SDK v2 modes](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions). These distinctions were checked on 30 October 2026; no MCP or Python compatibility is claimed by this slice. Broader EXT-02/EXT-03 acceptance work remains open.

## Verification

Unit tests use injected streams. The opt-in suites create only unique loopback disposable databases and use a synthetic OpenAI HTTP server:

```sh
pnpm --filter web test
pnpm --filter web build
POLARIS_WORKFLOW_DB=1 POLARIS_WORKFLOW_HTTP=1 pnpm test:integration:workflows
```

Supply `DATABASE_URL` for a disposable-capable local PostgreSQL role. The HTTP suite relocates the production bundle outside the checkout and launches the actual worker CLI. It checks ownership/scopes, immutable export, stateless calls, persistence, cancellation, origin-key revocation and process cleanup. Database checks cover migration preservation, concurrent claims, post-lock expiry, atomic step accounting and terminal deletion. No paid provider calls are required.
