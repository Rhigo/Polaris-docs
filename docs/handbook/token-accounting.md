# Model token estimates

For a plain-language explanation of who pays, unknown amounts and excluded charges, start with [costs and data](./costs). Administrators can inspect recorded usage under **Admin panel → Analytics**.

Reviewed **2026-10-29**. Polaris reports estimates for recorded model tokens, not an invoice. Unknown prices and missing usage are stored as null. A period containing unpriced requests has a null total, a separate known subtotal, and an unpriced-request count. An empty period is zero; a tiny positive amount displays as `<$0.0001` instead of zero.

## Reviewed OpenAI rates

Standard global API USD per million tokens, for prompts up to 272,000 input tokens:

| Exact model ID | Ordinary input | Cache read | 30m cache write | 12h cache write | Output |
|---|---:|---:|---:|---:|---:|
| `gpt-6-astra` | 10 | 1 | 12.50 | 25 | 50 |
| `gpt-6.1-sol` | 2 | 0.10 | 2.50 | 5 | 10 |
| `gpt-6.1-terra` | 1 | 0.05 | 1.25 | 2.50 | 5 |
| `gpt-6-luna` | 0.10 | 0.01 | 0.125 | 0.25 | 0.50 |

Source: [OpenAI pricing](https://developers.openai.com/api/docs/pricing), checked on the review date. The returned model ID takes precedence when available. No prefix matching or inferred snapshot aliases. Other hosted models, including unreviewed Claude and Realtime models, remain unpriced.

The model pages specify a full-request adjustment above 272K input tokens: input and cache rates double; output rates multiply by 1.5. Each provider call is priced separately before a tool loop is summed. Several short calls do not become one long-context request. Sources: [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra), [Luna](https://developers.openai.com/api/docs/models/gpt-6-luna).

The actual returned service tier selects Standard (1x), Flex (0.5x), Fast/priority (2x), or supported Ultrafast (6x, Astra/Sol). Missing, `auto`, and unreviewed tiers remain unknown. Regional/FedRAMP endpoints and custom gateways are not priced using global rates. The adapter only marks the exact global `https://api.openai.com/v1` endpoint as reviewed. [Processing prices](https://developers.openai.com/api/docs/pricing).

## Usage semantics

OpenAI input totals include cache reads and writes. Ordinary input is `input - cacheRead - cacheWrite`; cache categories are charged once at their respective rates. The adapter retains the 30m/12h split when reported. Without a split, it can use the documented 30m default only because this adapter sends no cache-retention overrides. Missing write counts or an inconsistent split make the estimate unknown. [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

Reasoning tokens are already included in output tokens. They are retained as detail and never added to the output bill again. [OpenAI reasoning usage](https://developers.openai.com/api/docs/guides/reasoning).

Anthropic reports ordinary input separately. Its normalized input total is `input_tokens + cache_read_input_tokens + cache_creation_input_tokens`. Output deltas are cumulative, so subsequent counters replace earlier counters. Current Claude prices have not been reviewed in this slice; their costs are null. [Anthropic cache accounting](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [streaming usage](https://platform.claude.com/docs/en/build-with-claude/streaming).

Missing provider usage remains null. Counters outside PostgreSQL int32 or costs outside numeric(14,8) remain unpriced; unrepresentable counter totals are discarded instead of breaking persistence. The existing non-null database token columns contain only reported counters (zero contributes no reported tokens when usage is absent); those zeros do not establish a free request. A tool loop with any unpriced call has an unknown aggregate cost.

## Local Ollama boundary

Zero means **no provider token fee**, excluding hosting and electricity. It requires complete reported usage and all of:

- The configured HTTP endpoint is `localhost`, `127.0.0.1`, `[::1]`, or the bundled Compose service `ollama`, on port 11434 at `/`, without URL credentials, query or fragment.
- The existing model inspection reports local GGUF metadata.
- Neither the requested/resolved model nor any observed stream metadata identifies a cloud/upstream model. Explicit cloud tags and `remote_host` / `remote_model` invalidate local classification, including copied aliases.

Other remote/self-hosted hosts, proxies, unsupported metadata, and missing usage remain unknown until their deployment boundary is reviewed. The policy assumes the configured local service reports its runtime metadata truthfully. Ollama’s protocol alone does not establish that execution is local. [Ollama cloud models](https://ollama.com/blog/cloud-models), [official response fields](https://github.com/ollama/ollama/blob/main/api/types.go).

## Persistence and callers

Migration `0009_usage_cost_basis` follows Pal migration `0008`. It adds nullable `usage_records.cost_basis` and removes the old zero-cost default. It does not rewrite historical amounts or guess provenance. Rows without a recognized, provider-matching basis are unpriced in analytics, including legacy positive estimates and Ollama zeros. Raw historical amounts remain in the database.

`estimateCostUsd(provider, model, usage)` returns `number | null`. For persistence use `estimateUsageCost(...)`, which returns `{ costUsd, costBasis }`; record both. Tool loops use `estimateUsageCallsCost(...)`. `recordUsage` accepts nullable cost plus its required nullable basis. A transactional caller such as the Pal runner can insert those same fields atomically with its own state transition.

The initial reviewed bases are `openai-global-model-tokens:2026-10-29` and `ollama-self-hosted-model-tokens:2026-10-29`. Retain the reviewed historical basis definitions when adding a new rate version. Never reprice old rows from the current catalog. Missing or unrecognized bases are not silently accepted as verified.

There is no persisted administrator pricing override in this schema. The earlier PATCH fields `inputCostPer1m` and `outputCostPer1m` did not map to catalog columns; they now return HTTP 400 with an explicit message. Rename, enable/disable and existing model configuration forms remain supported. No administrator configuration is overwritten.

## Limits and verification

The estimate excludes voice/audio APIs, image-generation charges, native tool fees/storage, auxiliary title/memory calls, hosting, taxes and account discounts. Failed, cancelled or disconnected calls without a recorded completion may not appear. The known subtotal covers wholly priced recorded requests; it is not a complete account bill or spend limit. Reconcile actual charges with provider billing before using these figures for financial decisions.

No paid calls are used in tests. SDK fixtures check normalization and endpoint/tier provenance; arithmetic tests cover mixed cache lifetimes, inclusive reasoning, threshold boundaries, tiers, unknown IDs, malformed counters, local versus cloud endpoints, and partial loops. The live integration uses an isolated standalone server and disposable PostgreSQL database to test migration preservation/defaults, real admin authorization, grouped totals, recorded provenance, and unchanged model forms.

Build the application, then run the opt-in harness from the repository root:

```sh
pnpm build
POLARIS_PRICING_INTEGRATION=1 pnpm test:integration:pricing
```

On Linux or macOS, supply `DATABASE_URL` for a loopback test cluster with database-creation permission. The harness creates a unique `polaris_pricing_review_<uuid>` database, initializes it, relocates the built standalone server outside the checkout and starts it on a private ephemeral loopback port, runs the migration and authenticated HTTP assertions, then removes only its own databases/process groups. A forced timeout regression verifies descendant cleanup and removal of the related orphan migration database. It uses generated fixture secrets and no provider credentials. Without the opt-in flag it skips before database initialization. CI runs this suite and the Pal database suite on Node 22/24 with PostgreSQL 16.

The underlying `token-accounting.test.ts` remains available for targeted fixture debugging with `POLARIS_PRICING_TESTS=1`, a fresh matching database name and `POLARIS_TEST_BASE_URL`; the isolated harness is the normal entry point. Never point these fixtures at a demo or production database.
