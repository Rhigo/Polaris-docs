# Microsoft 365 Inbox pilot

Polaris can link one Microsoft Inbox per signed-in owner, keep a bounded cache of message headers, display explicitly opened messages as transient plain text, and deliver optional **New in Inbox** notices inside Pal. Initial synchronization, reset and notice catchup are quiet. Opening or marking a Polaris notice read does not change Outlook's read state.

This is a fixture-verified pilot, with a separate real-tenant acceptance gate. It does not send mail, fetch attachments, render HTML, load remote images, ingest mail into models, or expose mail through Developer API keys or tools. The existing Pal worker must run for polling; a web server alone cannot deliver new notices.

## Supported connection

The first contract is Microsoft Graph **v1.0**, global cloud, one operator-configured Entra workforce tenant and the connected user's accessible Exchange Online Inbox. It does not support personal Microsoft accounts, a `common` authority, multiple configured tenants, sovereign clouds, shared/delegated mailboxes or on-premises-only mail. A guest identity must have an accessible mailbox in the selected tenant; membership alone is not mailbox access. [Account validation](https://learn.microsoft.com/en-us/entra/identity-platform/supported-accounts-validation), [folder access](https://learn.microsoft.com/en-us/graph/api/mailfolder-get?view=graph-rest-1.0).

The delegated scopes are `openid profile offline_access https://graph.microsoft.com/Mail.Read`. **Mail.Read grants mailbox-wide access; Inbox-only reading is Polaris policy.** Before enabling the pilot, the tenant administrator must approve the app and consent arrangement under the tenant's current policy. The permission catalog's admin-consent flag does not establish what a particular tenant permits. Polaris does not create registrations or grant consent. [Permission reference](https://learn.microsoft.com/en-us/graph/permissions-reference#mailread), [consent policies](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-app-consent-policies).

## Operator setup

Create a dedicated confidential **Web** application registration for this pilot, separate from Polaris SSO. Configure one exact callback, `https://YOUR-POLARIS-HOST/api/connectors/microsoft/callback`, and a tenant UUID, client UUID and client secret value. Match the callback's origin to `NEXTAUTH_URL`/`AUTH_URL`. HTTP is accepted only for literal `localhost` or `127.0.0.1` development; confirm the chosen URI can actually be registered before a real test. Microsoft registration, redirect matching, tenant consent, Conditional Access and Exchange licensing remain external requirements. [Authorization-code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow), [redirect URI requirements](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url).

Set these private environment values for both web and worker processes:

| Variable | Meaning |
| --- | --- |
| `M365_CONNECTOR_ENABLED` | Defaults to `false`; enable only after the operator gate |
| `M365_TENANT_ID`, `M365_CLIENT_ID` | Fixed workforce tenant and dedicated registration UUIDs |
| `M365_CLIENT_SECRET` | Registration secret value, never the secret identifier |
| `M365_REDIRECT_URI` | Exact registered callback |
| `CONNECTOR_TOKEN_KEYS` | JSON object containing at most three key IDs and independent 32-byte base64url keys |
| `CONNECTOR_TOKEN_ACTIVE_KEY_ID` | Key ID used for new encrypted records |

The Compose web service forwards these fields. Supply the same private configuration to the separately run worker; Compose does not create that worker. Restart all writers together when changing connector configuration. Changing the tenant, client, secret or callback requires reconnecting existing connections; it does not silently adopt old grants.

Generate a new keyring file without printing its contents or overwriting an existing file:

```sh
node --input-type=module - <<'NODE'
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const keys = JSON.stringify({ first: randomBytes(32).toString('base64url') });
writeFileSync('.m365-secrets.env', `CONNECTOR_TOKEN_KEYS='${keys}'\nCONNECTOR_TOKEN_ACTIVE_KEY_ID=first\n`, { flag: 'wx', mode: 0o600 });
NODE
```

Merge those fields into the private deployment environment. Back up all referenced connector keys separately from database backups. They are independent of the existing `ENCRYPTION_KEY`. Changing the active key affects new writes; there is no bulk re-encryption job. Keep old keys while records still reference them. Losing a referenced key locks that data; disconnect can explicitly clear local records.

Run the existing worker normally, or select only this service:

```sh
pnpm --filter web pal:worker --inbox-only
```

Do not log callback query strings, token exchanges, cache contents, mail text or opaque Graph cursor URLs. The bundled Nginx configuration suppresses callback access/error logs and applies `no-referrer`; the app records only a fixed failure category. External reverse proxies, load balancers, tracing/APM and browser recording tools need equivalent redaction.

## Linking and reading

Open **Connections → Microsoft Inbox**. A legacy Polaris session must sign in again before linking; ordinary browsing and an existing connection remain available. Successful server sign-in creates an opaque login binding. JWT refresh preserves it, and client session updates cannot assign it. Each link attempt also binds the exact owner, configuration, browser cookie, state, PKCE verifier and nonce for ten minutes. Changing accounts or replaying a callback does not transfer the grant.

The worker first builds an Inbox baseline without notices. Enable notices to perform a quiet catchup before arming delivery. New arrivals and messages moved into Inbox can then create local notices. Deleting a notice retains its deduplication marker. Disabling notices takes effect at the next local commit; no browser permission prompt or outbound notification is used.

Headers survive reload. A body is fetched only after an explicit open action, using the stored owned item and folder IDs. It is displayed as plain text without HTML, Markdown, links or remote images, and is not saved in PostgreSQL or browser storage. Close, navigation, hidden-tab handling and connection changes clear the transient viewer. Attachments are indicated but not downloaded. [Message GET and text preference](https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0).

Disconnect removes local cache, cursors, items, notices and pending attempt secrets, and fences late writes. It does not revoke Microsoft consent. Already dispatched reads or token exchanges cannot be recalled. Account disable stops new local dispatches; account deletion waits while a live connector operation lease exists so its admission evidence is not lost.

## Bounds and recovery

| Boundary | Limit |
| --- | --- |
| Active header cache / retained item identities / notices | 5,000 / 20,000 / 1,000 per connection |
| One page / response | Request 100; reject above 200 items or 512 KiB |
| One worker turn | Five pages or 15 seconds; absolute monotonic checks supplement timers |
| One network request / interactive operation | 20 seconds / 60 seconds |
| Admission / lease | Four durable operations globally; one per connection; 90-second leases |
| Poll / manual sync or notice enable | Five minutes plus up to 30 seconds jitter / once per minute |
| One delta round | 200 pages or 20,000 observations |
| Opened text body | 256 KiB UTF-8 within the bounded response |

Synchronization uses unfiltered folder delta, immutable case-sensitive item IDs and opaque continuation links restricted to the configured user's Inbox collection. It does not use a filtered-delta shortcut that could imply a complete baseline. Page changes, notices and the next cursor commit in one transaction. [Message delta](https://learn.microsoft.com/en-us/graph/api/message-delta?view=graph-rest-1.0), [delta behavior](https://learn.microsoft.com/en-us/graph/delta-query-messages), [immutable IDs](https://learn.microsoft.com/en-us/graph/outlook-immutable-id).

A full cache or notice inbox pauses without advancing the blocked page. Read/clear local notices, reduce Inbox content externally and explicitly sync or rebuild as appropriate. Rebuild clears stale cached headers and quietly refreshes them while retaining deduplication identities. Disconnect is the explicit way to clear the retained-identity cap. No automatic retention deletion is performed.

An expired/invalid delta state triggers one quiet rebuild; another reset during recovery pauses for explicit action. There is no promised Outlook delta-token lifetime. Throttling/backoff is bounded and persisted. A lost authorization-code or refresh-token result requires reconnecting, with no automatic replay. Safe Graph reads can run again later under a fresh claim. [Delta overview](https://learn.microsoft.com/en-us/graph/delta-query-overview), [throttling](https://learn.microsoft.com/en-us/graph/throttling).

## Storage and verification

Tokens stay in a per-operation MSAL cache until identity validation and a fresh owned lease authorize persistence. The implementation pins MSAL Node 7.1.2 and independently verifies initial ID-token signatures, issuer, audience, tenant, nonce and time with JOSE. Silent refresh retains the verified account and validates newly returned identity claims; Graph access tokens remain opaque. [MSAL caching](https://learn.microsoft.com/en-us/entra/msal/javascript/node/caching), [ID tokens](https://learn.microsoft.com/en-us/entra/identity-platform/id-tokens), [refresh response contract](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokenResponse).

The version 1 AES-256-GCM envelope contains key ID, a 12-byte IV and ciphertext/tag. Authenticated data binds purpose, owner, connection, revocation generation, record ID/version, provider, client, tenant and verified object ID. Cache, cursor and subject/sender/provider-ID metadata are encrypted. Operational status, owner IDs, counts, timestamps used for ordering and nonreversible per-connection item digests remain visible to the database operator. This protects stored content, not a trusted application host that holds decryption keys.

Migration 0015 follows immutable browser migration 0014. The opt-in fixture suites create and drop only their unique loopback test databases and relocate the built app outside the checkout:

```sh
POLARIS_M365_DB=1 POLARIS_M365_HTTP=1 pnpm test:integration:microsoft-inbox
```

They exercise the published SDK with signed synthetic tokens, real PostgreSQL locks, actual HTTP routes and the actual worker, without Microsoft network traffic. Before claiming real-tenant interoperability, separately authorize a test registration/mailbox and verify consent, Conditional Access, expiry/refresh, folder delta reset, disconnect and external log redaction. No such real-account acceptance is included in this pilot's fixture evidence. Official contracts checked 30 October 2026.

The separate recovery rehearsal uses matching PostgreSQL clients and two disposable databases on an explicitly supplied loopback test server. From `apps/web`, with the test `DATABASE_URL` already supplied:

```sh
POLARIS_M365_RECOVERY=1 POLARIS_M365_RECOVERY_PG_BIN=/absolute/path/to/matching/postgres/bin \
  node --import=tsx --test tests/integration/microsoft-inbox-recovery.integration.ts
```

It backs up and restores synthetic encrypted cache/cursor/metadata, local notices, operation leases and a disconnect tombstone alongside the connector keyring and an owned upload. Restored unknown token outcomes still require reconnecting, and an older schema checkpoint remains rejected. It neither starts a worker nor exchanges tokens. Operator recovery must stop writers, preserve every referenced connector key, restore into explicit new targets and inspect retained operation state before enabling polling; restoring a database does not revoke remote grants or approve an application downgrade. See [recovery tooling](./recovery).
