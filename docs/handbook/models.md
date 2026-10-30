# Models and provider contracts

Polaris develops OpenAI support first and keeps the provider boundary explicit. The current OpenAI integration pins SDK **7.45.1** and records reviewed capabilities with a source, review date and registry revision. It uses Responses for conversation streaming.

## Choosing a model

The current seed adds GPT-6.1 Sol, GPT-6.1 Terra, GPT-6 Astra, GPT-6 Sol and GPT-6 Luna. Existing administrator names, disabled state, permissions and metadata survive re-seeding. A model's documented capabilities do not establish that a particular provider account can access it.

**Model default** leaves reasoning selection to the documented provider contract. Explicit **none** is offered only when supported. Unsupported reasoning, sampling, tool, structured-output and output-limit combinations fail before provider work. Known retired aliases are unavailable. These rules are versioned facts, not guesses from name prefixes. [Current OpenAI model guide](https://developers.openai.com/api/docs/guides/latest-model), [model catalogue](https://developers.openai.com/api/docs/models).

Unknown model IDs need an explicit administrator capability record bound to that exact provider and ID. The model administration dialog exposes the record and its provenance. Do not copy another model's contract merely because its name looks similar; verify its own documentation and a bounded test. Official known records take precedence over conflicting custom metadata.

If a saved local-model choice disappears, Polaris keeps that choice unavailable until the user selects a replacement. It does not silently choose a cloud model. Non-OpenAI conversations also skip the OpenAI-only title and memory helpers. This is not a universal offline guarantee: tools and separately configured features need their own network policy.

## Streaming behavior

The adapter normalizes text, refusals, reasoning summaries, authoritative function arguments, hosted-tool events, image results, citations and cached-token usage. Duplicate function completion is deduplicated. Incomplete, failed, aborted and truncated responses produce an error rather than successful completion. Unknown additive events are tolerated while a recognized terminal event remains required. [Responses streaming](https://developers.openai.com/api/docs/guides/streaming-responses).

The adapter accepts cancellation; cancellation across every application tool and external effect is still separate work. Ordinary saved OpenAI chat retains the Responses `store:true` policy. Temporary OpenAI chat uses `store:false` with stateless context; auxiliary title/memory requests also use `store:false`. These settings do not promise zero provider retention, and independent files/tools have separate lifetimes. See [temporary chat and privacy](./privacy).

## Evidence and remaining work

Earlier provider/interface validation passed a production build and 67 unit tests, with two opt-in HTTP suites skipped; later release results are recorded in the [work log](./worklog). Disposable database tests verify current catalogue creation, administrator customization preservation and repeat/upgrade behavior. Synthetic fixtures are typed against the pinned SDK; they contain no customer data.

Three bounded live GPT-6 Luna probes exercised the actual adapter: text streaming, strict JSON and function-call arguments. They used 106 input and 41 output tokens in total. No external function was executed. These checks do not prove every model, native tool, voice endpoint or account permission.

Claude and Ollama retain their legacy adapters plus explicit unsupported-option guards; complete versioned contracts for them remain planned. Usage records distinguish verified token estimates from unknown costs. Complete fee accounting and enforced spend budgets remain unfinished; see [token accounting](./token-accounting).

## Model identity on replies

New text replies show the model resolved by the server for that reply. Selecting another model later, or renaming a catalogue entry, does not rewrite earlier reply labels. The label description keeps the requested selection, resolved provider/model and any provider-reported model identifier distinct; the display label itself does not calculate cost. Accounting uses the provider-reported model when available and leaves unreviewed identities unpriced under the [token-estimate policy](./token-accounting).

Older replies and voice transcripts without a recorded identity show “Assistant · model not recorded”. Polaris does not infer their model from the conversation’s current selection. Partial stopped replies keep the resolved identity received before the interruption. Temporary-chat identities stay in the current tab; their history and expiry rules are unchanged.

Imported archives retain visible history but discard provider continuation identifiers and unverified reply identities. Legacy replies without recorded server provenance use owned local history for the next request; later voice text is included as well. Fresh server-authored replies can still use hosted continuation. These are application trust decisions built on the documented [Responses conversation-state options](https://developers.openai.com/api/docs/guides/conversation-state).
