# Provider credential expiry

Connecting a provider for the first time? Follow [provider and model setup](./providers) first. The expiry control described here is optional and does not create a provider account or spending limit.

An administrator can set an optional UTC cutoff for an OpenAI or Anthropic API key in **Admin → Providers**. Polaris refuses new provider dispatches at or after that time. Existing configurations without a cutoff keep their previous behavior. This feature needs no database migration; the timestamp is stored in the provider configuration JSON.

## Set or remove a cutoff

Enter the key through the existing password field, choose **Stop new provider requests at (UTC)**, and save. The picker explicitly uses UTC, including seconds. The saved timestamp and its active/expired status appear below it. A past cutoff blocks new requests immediately. An invalid stored timestamp also blocks requests until corrected.

Saving another setting leaves the existing key and expiry intact. An expiry-only save also omits untouched enable/disable state and the hidden hosted-provider endpoint, preserving a concurrent administrator’s changes. An empty key field in the UI preserves the saved key. To remove the cutoff, choose **Remove expiry on save**, then save. Replacing the key does not automatically remove its previous cutoff. Save the intended expiry explicitly when rotating a temporary key.

The existing administrative API accepts:

```json
{
  "provider": "openai",
  "credentialExpiresAt": "2030-10-29T18:00:00Z"
}
```

Send this JSON to `POST /api/admin/providers` with an authenticated administrator session. Omit `apiKey` to preserve the existing secret; omit `credentialExpiresAt` to preserve the cutoff, or send `null` to explicitly remove it. Timestamps require `Z` or a numeric offset and are normalized to UTC. The generic `settings` object cannot override the dedicated expiry/base-URL fields. Updates merge unrelated stored settings atomically. GET returns `credentialExpiresAt` and `credentialExpiryStatus`; the key stays redacted.

Ollama has no hosted provider-key cutoff control. Any OpenAI-backed search it invokes uses the OpenAI credential boundary.

## What is checked

Configured hosted clients retain the identity of the saved key, provider, endpoint, organization and configuration. Every HTTP transport reads the current database policy, checks its binding, and checks the clock again immediately before dispatch. Caching an adapter does not cache permission to send. A retained client fails if its configuration changes; it never silently adopts a rotated key or retries an uncertain operation. Fresh operations can obtain a new client after an explicit configuration update.

Configured clients use the saved endpoint/organization or official endpoint defaults. They do not inherit SDK environment credentials, alternate endpoints, organization/project overrides or debug logging. `OPENAI_CUSTOM_HEADERS` is rejected because it could override the bound authorization header; migrate those settings to the reviewed provider configuration.

The boundary covers chat and image Responses requests, token counting, custom OpenAI functions, title/memory/suggestion helpers, file/vector-store operations, OpenAI-backed search, transcription, read-aloud HTTP/WebSocket setup and new Realtime calls. SDK Decisions requests use the same guarded transport; this does not introduce a Decisions product workflow or endpoint in Polaris. Administrative connection/model probes can test a disabled provider, but cannot bypass its expiry.

Pal tasks and each workflow step recheck current model/account/provider access. A queued task cannot begin a provider request after expiry. A later workflow step cannot dispatch when the cutoff has passed. Failed or interrupted work is not automatically replayed after a key is renewed. Existing account, ownership, origin-key and lease checks still apply.

## Important limits

This is an application dispatch cutoff, not a provider-side key expiration, spending cap or remote-session revocation. A request already sent may continue to consume tokens; existing worker controls may cancel local processing without proving that remote computation stopped. An established WebRTC voice call can continue after the cutoff because its media/session connection no longer passes through this server's HTTP dispatch guard. End that call explicitly. Expiry does not delete provider-side files, vector stores or stored responses; cleanup still requires valid authorization. OpenAI documents a separate [Realtime call hangup operation](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup); Polaris does not currently maintain a durable timed hangup service.

Keep web and worker clocks synchronized. Database unavailability fails closed for new guarded dispatches. This control cannot constrain someone using the same key outside Polaris. Use the provider's own revocation and account controls when that is required. No fixed dollar limit or automatic purchase is implemented.

## Verification

`POLARIS_PROVIDER_EXPIRY_TESTS=1 pnpm test:integration:provider-expiry` requires a disposable loopback PostgreSQL cluster and a production build. It creates and removes its own UUID database, relocates the standalone bundle and runs a synthetic local provider plus the actual Pal worker. It verifies admin preservation/validation, concurrent settings updates, natural expiry after a real database lock wait, retained clients, chat/images/audio, queued tasks and a cutoff at the durable first-step workflow commit. No real provider credential or paid call is used.

Unit checks additionally exercise final-clock races, SDK retry suppression, key/config rotation and WebSocket factory rejection. The separate audio fixture verifies the real SDK WebSocket transport with synthetic audio. These tests establish the application boundary; they do not establish provider-side session termination or billing limits.
