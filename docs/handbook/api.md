# Developer API

Create a key from your account menu → **Developer access**. This first API supports model discovery and a minimal profile read. Streaming chat, files, tools, pipelines and OpenAI-compatible request formats are separate, unfinished capabilities. The machine-readable contract is served by your installation at `/api/v1/openapi`.

## Create and manage a key

Choose a name, only the permissions your integration needs, and an expiry. Copy the secret into your secret manager when it appears: it is shown once. The server stores a SHA-256 hash of a random 256-bit secret; it cannot recover the plaintext. The application keeps the displayed secret only in component memory, not local storage.

| Permission | Endpoint | Response |
| --- | --- | --- |
| `models:read` | `GET /api/v1/models` | `data` array with each model's `id`, `provider` and `name`, filtered by the owner's current model access |
| `profile:read` | `GET /api/v1/me` | `data.id` and `data.name`; no email, credentials or settings |

Rotation invalidates the old key and returns a replacement once, preserving its scopes, rate and original expiry. Revocation is permanent for that key. Requests that already passed authorization can finish; new requests are rejected. Disabling or deleting the owner also invalidates their keys. API keys cannot administer accounts, manage other keys or substitute for a browser session.

If a create/rotate response is interrupted, refresh the list and revoke the new record whose secret you did not receive before retrying. Do not automatically retry key issuance. Use HTTPS for deployments and keep secrets out of URLs, source control, screenshots and client-side application bundles.

## Limits and responses

- Default: 60 requests per key per fixed UTC minute. Issuance accepts 1–120; the UI uses the default.
- At most 10 active keys and 20 newly issued keys per owner in a rolling 24 hours. Rotation counts as an issuance and can replace an occupied active slot atomically.
- Expiry is required: 1–365 days. The UI offers common durations; server time is authoritative, including after waiting for a database lock.
- Successful data reads return `X-Request-Id`, `X-RateLimit-Limit` and `X-RateLimit-Remaining`. Rate-limit responses include `Retry-After: 60`. Data and key-management responses use `Cache-Control: no-store`.
- Errors contain `error.code`, `error.message` and `error.requestId`: 401 for invalid credentials, 403 for a missing scope, 429 for a limit, and 500 for a sanitized unexpected failure. Invalid key-management input can return 400, 413 or 415.

Counters and issuance use database transactions, including concurrent requests. Lifecycle records contain owner/key IDs, action and time; request logs contain a request ID, key ID and status, without bearer secrets or message bodies. Per-user request/spend budgets and a usage dashboard remain unfinished. These read-only endpoints do not call a model provider.

## Request examples

Supply `POLARIS_BASE_URL` and `POLARIS_API_KEY` through your local environment or secret manager. The base URL is your installation's origin, for example `https://polaris.example`.

```sh
printf 'Authorization: Bearer %s\n' "$POLARIS_API_KEY" | \
  curl --fail-with-body --header @- "$POLARIS_BASE_URL/api/v1/models"
```

Python uses only the standard library:

```python
import json
import os
import urllib.request

url = os.environ["POLARIS_BASE_URL"].rstrip("/") + "/api/v1/models"
request = urllib.request.Request(url, headers={
    "Authorization": "Bearer " + os.environ["POLARIS_API_KEY"]
})
with urllib.request.urlopen(request, timeout=10) as response:
    print(json.load(response)["data"])
```

Node 22/24 or TypeScript:

```ts
const response = await fetch(new URL("/api/v1/models", process.env.POLARIS_BASE_URL), {
  headers: { Authorization: `Bearer ${process.env.POLARIS_API_KEY}` },
  signal: AbortSignal.timeout(10_000),
});
const body = await response.json();
if (!response.ok) throw new Error(`${body.error.code}: ${body.error.requestId}`);
console.log(body.data);
```

All three examples were executed against the private production fixture and their temporary credential was revoked afterward. These examples demonstrate the published read contract; they are not a full SDK or streaming-chat compatibility claim. Handle errors without logging the Authorization header. Browser CORS access is not enabled; use your backend or a local script.

## Operation and recovery

Migration `0007_user_api_keys` adds key hashes, rate buckets and lifecycle events. Run `pnpm db:init` through the supported upgrade process after a verified backup. Keep the database private and include it in the [recovery procedure](./recovery). Restoring an older backup can restore an older revocation state: before exposing the recovered API, reconcile revocations made after capture or revoke all restored keys. A database restore never grants approval to resume external traffic automatically.

The HTTP suite uses a unique disposable PostgreSQL database and a private standalone server. After building, run `pnpm test:integration:api-keys` with an explicit local `DATABASE_URL`. Fourteen test records cover disclosure, ownership, scopes, current account state, expiry, Origin enforcement, rate/issuance races, rotation rollback and secret-free diagnostics. Desktop and 390px Chrome checks cover navigation, scope validation, expiry selection, rotation, cancel/revoke, reload and keyboard focus. Screenshot accounts and keys are synthetic; the captured keys were revoked after testing. Clipboard copying was not exercised against the user's system clipboard.
